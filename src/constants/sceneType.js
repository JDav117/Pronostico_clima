// Mapea weather_code (WMO) + is_day a un "tipo de escena" visual
// Tipos: clear, partly, cloudy, fog, rain, storm, snow
export function getSceneType(code, isDay = 1) {
  if (code === 0 || code === 1) return isDay ? 'clear-day' : 'clear-night'
  if (code === 2) return isDay ? 'partly-day' : 'partly-night'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([95, 96, 99].includes(code)) return 'storm'
  return isDay ? 'clear-day' : 'clear-night'
}

// Gradiente de cielo para cada escena
export const SCENE_BG = {
  'clear-day':    'linear-gradient(180deg, #2196f3 0%, #64b5f6 50%, #ffd54f 100%)',
  'clear-night':  'linear-gradient(180deg, #0a0e27 0%, #1a1f4e 60%, #3a2855 100%)',
  'partly-day':   'linear-gradient(180deg, #4a90e2 0%, #7eb6ec 60%, #c2e0f7 100%)',
  'partly-night': 'linear-gradient(180deg, #0d1230 0%, #232b5c 70%, #3d3a6e 100%)',
  'cloudy':       'linear-gradient(180deg, #4a5568 0%, #718096 60%, #a0aec0 100%)',
  'fog':          'linear-gradient(180deg, #6b7785 0%, #9aa5b1 60%, #cbd5e0 100%)',
  'rain':         'linear-gradient(180deg, #2c3e50 0%, #34495e 60%, #5d6d7e 100%)',
  'storm':        'linear-gradient(180deg, #0f1419 0%, #1c2530 60%, #2c3e50 100%)',
  'snow':         'linear-gradient(180deg, #5a6d8c 0%, #8da4c4 60%, #d6e3f0 100%)',
}
