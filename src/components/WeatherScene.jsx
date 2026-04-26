import { useMemo } from 'react'

/**
 * WeatherScene – Escena animada en CSS según el tipo de clima.
 * Props:
 *   type: 'clear-day' | 'clear-night' | 'partly-day' | 'partly-night'
 *       | 'cloudy' | 'fog' | 'rain' | 'storm' | 'snow'
 */
export default function WeatherScene({ type = 'clear-day' }) {
  // Generamos partículas (gotas / copos) sólo cuando aplica
  const particles = useMemo(() => {
    if (type === 'rain' || type === 'storm') {
      return Array.from({ length: 60 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.6,
      }))
    }
    if (type === 'snow') {
      return Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 6,
        size: 4 + Math.random() * 6,
      }))
    }
    return []
  }, [type])

  const stars = useMemo(() => {
    if (type === 'clear-night' || type === 'partly-night') {
      return Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 60,
        delay: Math.random() * 3,
        size: 1 + Math.random() * 2,
      }))
    }
    return []
  }, [type])

  const isDay = type.endsWith('day') || type === 'cloudy' || type === 'fog' || type === 'rain' || type === 'snow'
  const showSun = type === 'clear-day' || type === 'partly-day'
  const showMoon = type === 'clear-night' || type === 'partly-night'
  const showClouds = ['partly-day', 'partly-night', 'cloudy', 'rain', 'storm', 'snow', 'fog'].includes(type)
  const isStorm = type === 'storm'
  const isFog = type === 'fog'

  return (
    <div className={`weather-scene scene-${type}`}>
      {/* Estrellas */}
      {stars.map((s, i) => (
        <span
          key={'s' + i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Sol */}
      {showSun && (
        <div className="sun">
          <div className="sun-core" />
          <div className="sun-glow" />
          <div className="sun-rays" />
        </div>
      )}

      {/* Luna */}
      {showMoon && (
        <div className="moon">
          <div className="moon-core" />
          <div className="moon-crater c1" />
          <div className="moon-crater c2" />
          <div className="moon-crater c3" />
          <div className="moon-glow" />
        </div>
      )}

      {/* Nubes */}
      {showClouds && (
        <>
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          {(type === 'cloudy' || type === 'rain' || type === 'storm' || type === 'snow') && (
            <div className="cloud cloud-3" />
          )}
        </>
      )}

      {/* Niebla */}
      {isFog && (
        <>
          <div className="fog-layer fog-1" />
          <div className="fog-layer fog-2" />
        </>
      )}

      {/* Lluvia / nieve */}
      {(type === 'rain' || type === 'storm') &&
        particles.map((p, i) => (
          <span
            key={'p' + i}
            className="raindrop"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

      {type === 'snow' &&
        particles.map((p, i) => (
          <span
            key={'p' + i}
            className="snowflake"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

      {/* Tormenta: rayos */}
      {isStorm && (
        <>
          <div className="lightning" />
          <div className="lightning lightning-2" />
        </>
      )}
    </div>
  )
}
