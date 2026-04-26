# 🌤 Weather App – Proyecto Microservicios

Proyecto académico desarrollado en React + Vite que consume dos microservicios
externos de **Open-Meteo** (API gratuita, sin API key).

---

## Arquitectura de microservicios

```
Usuario
  │
  ▼
App.jsx (orquestador)
  │
  ├─── Microservicio 1: Geocoding API
  │    URL: https://geocoding-api.open-meteo.com/v1/search
  │    Entrada: nombre de ciudad
  │    Salida: latitud, longitud, país
  │
  └─── Microservicio 2: Forecast API
       URL: https://api.open-meteo.com/v1/forecast
       Entrada: latitud, longitud
       Salida: temperatura, humedad, viento, pronóstico 7 días
```

---

## Estructura del proyecto

```
weather-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Punto de entrada
    ├── App.jsx               # Componente raíz / orquestador
    ├── index.css             # Estilos globales
    ├── constants/
    │   └── wmo.js            # Códigos WMO → descripción e ícono
    ├── services/
    │   └── weatherService.js # Capa de acceso a los microservicios
    └── components/
        ├── SearchBar.jsx     # Barra de búsqueda
        ├── MetricCards.jsx   # Tarjetas de métricas actuales
        ├── TempChart.jsx     # Gráfica de temperatura (Recharts)
        └── ForecastRow.jsx   # Pronóstico de 7 días
```

---

## Instalación y ejecución

### Requisitos
- Node.js 18 o superior
- npm 9 o superior

### Pasos

```bash
# 1. Entrar a la carpeta del proyecto
cd weather-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

Abre `http://localhost:5173` en el navegador.

### Build de producción

```bash
npm run build
npm run preview
```

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 18 | UI y manejo de estado |
| Vite 5 | Bundler y servidor de desarrollo |
| Recharts | Gráfica de temperatura |
| Open-Meteo Geocoding API | Microservicio de geocodificación |
| Open-Meteo Forecast API | Microservicio de clima |

---

## APIs utilizadas (microservicios)

### Geocoding API
- **URL:** `https://geocoding-api.open-meteo.com/v1/search`
- **Método:** GET
- **Parámetros:** `name`, `count`, `language`
- **Documentación:** https://open-meteo.com/en/docs/geocoding-api

### Forecast API
- **URL:** `https://api.open-meteo.com/v1/forecast`
- **Método:** GET
- **Parámetros:** `latitude`, `longitude`, `current`, `hourly`, `daily`, `timezone`
- **Documentación:** https://open-meteo.com/en/docs

---

Desarrollado como proyecto académico en UniPutumayo.
