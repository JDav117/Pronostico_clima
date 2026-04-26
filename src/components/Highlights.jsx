/**
 * Highlights – tarjetas adicionales para enriquecer la vista.
 * Toda la info viene del MISMO request de fetchWeather (no hay llamadas extra).
 */

function fmtTime(iso, timezone) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    }).format(new Date(iso))
  } catch {
    return iso.slice(11, 16)
  }
}

function uvLabel(v) {
  if (v == null) return ''
  if (v < 3)  return 'Bajo'
  if (v < 6)  return 'Moderado'
  if (v < 8)  return 'Alto'
  if (v < 11) return 'Muy alto'
  return 'Extremo'
}

function uvColor(v) {
  if (v == null) return 'var(--accent)'
  if (v < 3)  return '#4ade80'
  if (v < 6)  return '#facc15'
  if (v < 8)  return '#fb923c'
  if (v < 11) return '#ef4444'
  return '#a855f7'
}

function windDirLabel(deg) {
  if (deg == null) return ''
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}

export default function Highlights({ current, daily, timezone, now }) {
  const sunrise = daily.sunrise?.[0]
  const sunset  = daily.sunset?.[0]
  const uv      = daily.uv_index_max?.[0]
  const pop     = daily.precipitation_probability_max?.[0]
  const windMax = daily.wind_speed_10m_max?.[0]

  // Progreso del sol (0–1) entre amanecer y atardecer
  let sunProgress = 0
  let isDaylight = false
  if (sunrise && sunset && now) {
    const sr = new Date(sunrise).getTime()
    const ss = new Date(sunset).getTime()
    const t = now.getTime()
    if (t >= sr && t <= ss) {
      sunProgress = (t - sr) / (ss - sr)
      isDaylight = true
    } else {
      sunProgress = t < sr ? 0 : 1
    }
  }

  return (
    <div className="glass-section">
      <p className="section-title">Detalles del día</p>
      <div className="highlights-grid">

        {/* Sol: amanecer / atardecer con arco */}
        <div className="highlight-card highlight-sun">
          <div className="highlight-head">
            <span className="highlight-label">Sol</span>
            <span className="highlight-icon">☀️</span>
          </div>
          <div className="sun-arc">
            <svg viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"  stopColor="#ffb74d" />
                  <stop offset="50%" stopColor="#ffd54f" />
                  <stop offset="100%" stopColor="#ff8a65" />
                </linearGradient>
              </defs>
              <path
                d="M 10 80 Q 100 -20 190 80"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              {/* posición del sol en el arco */}
              {(() => {
                const t = sunProgress
                // Bezier cuadrático: (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
                const x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 100 + t * t * 190
                const y = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * -20 + t * t * 80
                return (
                  <circle
                    cx={x}
                    cy={y}
                    r="7"
                    fill={isDaylight ? '#ffd54f' : '#888'}
                    style={{ filter: isDaylight ? 'drop-shadow(0 0 6px #ffd54f)' : 'none' }}
                  />
                )
              })()}
              <line x1="10" y1="80" x2="190" y2="80" stroke="rgba(255,255,255,0.15)" />
            </svg>
          </div>
          <div className="sun-times">
            <div>
              <span className="sun-times-label">Amanecer</span>
              <strong>{fmtTime(sunrise, timezone)}</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="sun-times-label">Atardecer</span>
              <strong>{fmtTime(sunset, timezone)}</strong>
            </div>
          </div>
        </div>

        {/* UV */}
        <div className="highlight-card">
          <div className="highlight-head">
            <span className="highlight-label">Índice UV</span>
            <span className="highlight-icon">🔆</span>
          </div>
          <div className="highlight-value" style={{ color: uvColor(uv) }}>
            {uv != null ? Math.round(uv) : '—'}
          </div>
          <div className="highlight-sub">{uvLabel(uv)}</div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${Math.min(100, ((uv ?? 0) / 11) * 100)}%`,
                background: uvColor(uv),
              }}
            />
          </div>
        </div>

        {/* Probabilidad de lluvia */}
        <div className="highlight-card">
          <div className="highlight-head">
            <span className="highlight-label">Prob. lluvia</span>
            <span className="highlight-icon">🌧️</span>
          </div>
          <div className="highlight-value">{pop ?? 0}<span className="highlight-unit">%</span></div>
          <div className="highlight-sub">Máx. para hoy</div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${pop ?? 0}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Viento */}
        <div className="highlight-card">
          <div className="highlight-head">
            <span className="highlight-label">Viento</span>
            <span className="highlight-icon">💨</span>
          </div>
          <div className="highlight-value">
            {Math.round(current.wind_speed_10m)}
            <span className="highlight-unit"> km/h</span>
          </div>
          <div className="highlight-sub">
            Dirección {windDirLabel(current.wind_direction_10m)}
            {windMax != null ? ` · máx ${Math.round(windMax)} km/h` : ''}
          </div>
          <div className="compass" aria-hidden="true">
            <div className="compass-ring" />
            <div
              className="compass-arrow"
              style={{ transform: `rotate(${current.wind_direction_10m ?? 0}deg)` }}
            />
            <span className="compass-n">N</span>
          </div>
        </div>

        {/* Presión */}
        <div className="highlight-card">
          <div className="highlight-head">
            <span className="highlight-label">Presión</span>
            <span className="highlight-icon">🌡️</span>
          </div>
          <div className="highlight-value">
            {current.pressure_msl != null ? Math.round(current.pressure_msl) : '—'}
            <span className="highlight-unit"> hPa</span>
          </div>
          <div className="highlight-sub">Nivel del mar</div>
        </div>

        {/* Nubosidad */}
        <div className="highlight-card">
          <div className="highlight-head">
            <span className="highlight-label">Nubosidad</span>
            <span className="highlight-icon">☁️</span>
          </div>
          <div className="highlight-value">
            {current.cloud_cover ?? 0}<span className="highlight-unit">%</span>
          </div>
          <div className="highlight-sub">Cielo cubierto</div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${current.cloud_cover ?? 0}%`,
                background: 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
              }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
