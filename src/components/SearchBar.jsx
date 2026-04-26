import { useState } from 'react'

/**
 * SearchBar – barra de búsqueda de ciudades
 */
export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form className="search-row" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Buscar ciudad (ej: Mocoa, Bogotá, Madrid…)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Ciudad"
        autoComplete="off"
      />
      <button className="search-btn" type="submit" disabled={loading}>
        {loading ? 'Cargando…' : 'Buscar'}
      </button>
    </form>
  )
}
