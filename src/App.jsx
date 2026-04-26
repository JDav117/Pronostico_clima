import { useState, useCallback, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import MetricCards from './components/MetricCards'
import TempChart from './components/TempChart'
import ForecastRow from './components/ForecastRow'
import WeatherScene from './components/WeatherScene'
import Highlights from './components/Highlights'
import { geocodeCity, fetchWeather } from './services/weatherService'
import { WMO_DESC, WMO_ICON } from './constants/wmo'
import { getSceneType, SCENE_BG } from './constants/sceneType'

// Auto-refresh cada 5 minutos (Open-Meteo es gratuito y tolera de sobra esta frecuencia)
const REFRESH_MS = 5 * 60 * 1000

export default function App() {
  const [loading, setLoading]   = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError]       = useState(null)
  const [location, setLocation] = useState(null)
  const [weather, setWeather]   = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [now, setNow] = useState(new Date())

  const refreshTimerRef = useRef(null)

  // Reloj en vivo (no consume API, sólo actualiza el componente)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Búsqueda inicial
  const handleSearch = useCallback(async (city) => {
    setLoading(true)
    setError(null)
    setWeather(null)
    setLocation(null)

    try {
      const loc = await geocodeCity(city)
      setLocation(loc)
      const w = await fetchWeather(loc.latitude, loc.longitude)
      setWeather(w)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh silencioso
  useEffect(() => {
    if (!location) return
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)

    refreshTimerRef.current = setInterval(async () => {
      try {
        setRefreshing(true)
        const w = await fetchWeather(location.latitude, location.longitude)
        setWeather(w)
        setLastUpdate(new Date())
      } catch {
        /* silencioso: no rompemos la UI por un fallo puntual */
      } finally {
        setRefreshing(false)
      }
    }, REFRESH_MS)

    return () => clearInterval(refreshTimerRef.current)
  }, [location])

  // Determinar tipo de escena (clima + día/noche)
  const code  = weather?.current?.weather_code ?? 0
  const isDay = weather?.current?.is_day ?? 1
  const sceneType = weather ? getSceneType(code, isDay) : 'clear-night'
  const skyBg = SCENE_BG[sceneType]

  // Hora local de la ciudad
  const cityTime = (() => {
    if (!weather?.timezone) return null
    try {
      return new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: weather.timezone,
      }).format(now)
    } catch {
      return null
    }
  })()

  const lastUpdateLabel = lastUpdate
    ? new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' }).format(lastUpdate)
    : null

  return (
    <>
      {/* Fondo dinámico de toda la página */}
      <div className="sky-backdrop" style={{ background: skyBg }} />

      <div className="app-wrapper">
        <header className="app-header">
          <div className="brand">
            <span className="brand-icon" aria-hidden="true">
              <span className="brand-sun" />
              <span className="brand-cloud" />
            </span>
            <h1 className="app-title">Pronóstico del Clima</h1>
          </div>
          <p className="app-subtitle">
            Clima en tiempo real impulsado por Open-Meteo
          </p>
          <div className="app-tags">
            <span className="app-tag">⚡ Geocoding API</span>
            <span className="app-tag">🌍 Forecast API</span>
            <span className="app-tag">🔄 Auto-refresh 5 min</span>
          </div>
        </header>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <p className="status-msg">
            <span className="loader" />
            Verificando pronóstico …
          </p>
        )}

        {error && <p className="status-msg error">⚠ {error}</p>}

        {weather && location && (
          <section>
            {/* HERO con escena animada */}
            <div className="hero">
              <WeatherScene type={sceneType} />
              <div className="hero-info">
                <h2 className="city-name">
                  {location.name}
                  {location.admin1 ? `, ${location.admin1}` : ''}
                </h2>
                <p className="city-sub">
                  {location.country} · {location.latitude.toFixed(2)}°,{' '}
                  {location.longitude.toFixed(2)}°
                  {cityTime ? ` · 🕒 ${cityTime}` : ''}
                </p>

                <div className="hero-temp">
                  <span className="hero-temp-value">
                    {Math.round(weather.current.temperature_2m)}°
                  </span>
                  <div>
                    <div className="hero-cond">
                      <span className="hero-cond-icon">{WMO_ICON[code] ?? '—'}</span>
                      {WMO_DESC[code] ?? 'Sin datos'}
                    </div>
                    <div className="hero-meta">
                      Sensación {Math.round(weather.current.apparent_temperature)}°
                      {' · '}
                      Máx {Math.round(weather.daily.temperature_2m_max[0])}°
                      {' · '}
                      Mín {Math.round(weather.daily.temperature_2m_min[0])}°
                    </div>
                    <div className="hero-meta">
                      💧 Humedad {weather.current.relative_humidity_2m}%
                      {' · '}
                      💨 Viento {Math.round(weather.current.wind_speed_10m)} km/h
                    </div>
                  </div>
                </div>

                <div className="live-row">
                  <span className="live-badge">
                    <span className="live-dot" />
                    {refreshing ? 'Actualizando' : 'En vivo'}
                  </span>
                  {lastUpdateLabel && (
                    <span className="hero-meta">
                      Última actualización: {lastUpdateLabel} · refresca cada 5 min
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Métricas */}
            <div className="cards-grid">
              <MetricCards current={weather.current} />
            </div>

            {/* Detalles enriquecidos */}
            <Highlights
              current={weather.current}
              daily={weather.daily}
              timezone={weather.timezone}
              now={now}
            />

            {/* Gráfica */}
            <TempChart hourly={weather.hourly} />

            {/* Pronóstico semanal */}
            <ForecastRow daily={weather.daily} />
          </section>
        )}

        {!weather && !loading && !error && (
          <p className="status-msg">
            Escribe el nombre de una ciudad y presiona Buscar.
          </p>
        )}

        <footer className="app-footer">
          <div className="footer-top">
            <span className="footer-pill">
              <span className="live-dot" /> Datos en tiempo real
            </span>
            <span className="footer-pill">
              🌐 Powered by{' '}
              <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
                Open-Meteo
              </a>
            </span>
          </div>
          <p className="footer-credit">
            Diseñado y desarrollado como {' '}
            <strong>Proyecto académico · UniPutumayo</strong>
          </p>
          <p className="footer-meta">© {new Date().getFullYear()} · Todos los derechos reservados</p>
        </footer>
      </div>
    </>
  )
}
