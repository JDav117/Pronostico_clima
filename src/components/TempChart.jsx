import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

/**
 * TempChart – gráfica de temperatura próximas 24h
 */
export default function TempChart({ hourly }) {
  const now = new Date()
  const data = hourly.time
    .map((t, i) => ({
      hora: new Date(t).getHours() + 'h',
      temp: Math.round(hourly.temperature_2m[i]),
      ts: new Date(t),
    }))
    .filter((d) => d.ts >= now)
    .slice(0, 24)

  return (
    <div className="glass-section">
      <p className="section-title">Temperatura próximas 24 horas</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#7ad7ff" stopOpacity={0.55} />
              <stop offset="60%" stopColor="#7ad7ff" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#7ad7ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="hora"
            tick={{ fontSize: 11, fill: 'rgba(245,247,250,0.55)' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'rgba(245,247,250,0.55)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip
            formatter={(v) => [`${v} °C`, 'Temperatura']}
            contentStyle={{
              background: 'rgba(20, 25, 45, 0.92)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#f5f7fa',
              backdropFilter: 'blur(10px)',
            }}
            labelStyle={{ color: 'rgba(245,247,250,0.7)' }}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#7ad7ff"
            strokeWidth={2.5}
            fill="url(#tempGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#7ad7ff', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
