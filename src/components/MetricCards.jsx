/**
 * MetricCards – tarjetas individuales de métricas actuales
 */
export default function MetricCards({ current }) {
  const metrics = [
    { label: 'Temperatura',  value: Math.round(current.temperature_2m),          unit: '°C' },
    { label: 'Sensación',    value: Math.round(current.apparent_temperature),    unit: '°C' },
    { label: 'Humedad',      value: current.relative_humidity_2m,                unit: '%' },
    { label: 'Viento',       value: Math.round(current.wind_speed_10m),          unit: 'km/h' },
    { label: 'Precipit.',    value: current.precipitation?.toFixed(1) ?? '0.0',  unit: 'mm' },
  ]

  return (
    <>
      {metrics.map((m) => (
        <div key={m.label} className="metric-card">
          <span className="metric-label">{m.label}</span>
          <span className="metric-value">{m.value}</span>
          <span className="metric-unit">{m.unit}</span>
        </div>
      ))}
    </>
  )
}
