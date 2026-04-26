import { WMO_DESC, WMO_ICON } from '../constants/wmo'

/**
 * ForecastRow – pronóstico de 7 días
 */
export default function ForecastRow({ daily }) {
  function dayLabel(dateStr, i) {
    if (i === 0) return 'Hoy'
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('es-CO', { weekday: 'short' })
  }

  return (
    <div className="glass-section">
      <p className="section-title">Pronóstico 7 días</p>
      <div className="forecast-row">
        {daily.time.map((date, i) => {
          const code = daily.weather_code[i]
          return (
            <div
              key={date}
              className="forecast-card"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="forecast-day">{dayLabel(date, i)}</div>
              <div className="forecast-icon">{WMO_ICON[code] ?? '—'}</div>
              <div className="forecast-temps">
                {Math.round(daily.temperature_2m_max[i])}°{' '}
                <span className="forecast-temp-min">
                  / {Math.round(daily.temperature_2m_min[i])}°
                </span>
              </div>
              <div className="forecast-desc">{WMO_DESC[code] ?? ''}</div>
              {daily.precipitation_sum[i] > 0 && (
                <div className="forecast-rain">
                  💧 {daily.precipitation_sum[i].toFixed(1)} mm
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
