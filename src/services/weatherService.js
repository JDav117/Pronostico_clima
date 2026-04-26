// ─────────────────────────────────────────────
//  weatherService.js
//  Capa de acceso a los microservicios externos
// ─────────────────────────────────────────────

const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1'
const WEATHER_BASE = 'https://api.open-meteo.com/v1'

/**
 * Microservicio 1 – Geocoding
 * Convierte el nombre de una ciudad a coordenadas (lat/lon).
 * @param {string} city
 * @returns {Promise<{name, country, admin1, latitude, longitude}>}
 */
export async function geocodeCity(city) {
  const url = `${GEO_BASE}/search?name=${encodeURIComponent(city)}&count=1&language=es`
  const res = await fetch(url)

  if (!res.ok) throw new Error(`Error en geocoding: ${res.status}`)

  const data = await res.json()
  if (!data.results?.length) throw new Error('Ciudad no encontrada. Intenta con otro nombre.')

  return data.results[0]
}

/**
 * Microservicio 2 – Clima actual + pronóstico
 * Retorna temperatura, humedad, viento, pronóstico horario y semanal.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'weather_code',
      'precipitation',
      'is_day',
      'pressure_msl',
      'cloud_cover',
    ].join(','),
    hourly: 'temperature_2m',
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
      'uv_index_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: 7,
  })

  const url = `${WEATHER_BASE}/forecast?${params}`
  const res = await fetch(url)

  if (!res.ok) throw new Error(`Error al obtener clima: ${res.status}`)

  return res.json()
}
