import { useEffect, useState } from 'react'
import { fetchCategories, fetchProducts } from '../api/client'
import ProductCard from './ProductCard'
import './ProductGrid.css'

export default function ProductGrid() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    fetchProducts({ category: category || undefined, search: query || undefined })
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'No se pudo cargar el catálogo')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category, query])

  function handleSearch(event) {
    event.preventDefault()
    setQuery(search.trim())
  }

  return (
    <section className="catalog" id="catalogo">
      <div className="catalog__intro">
        <h2>Catálogo</h2>
        <p>Explora herramientas, moldes y suministros listos para tu obrador.</p>
      </div>

      <div className="catalog__controls">
        <form className="catalog__search" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="search">
            Buscar productos
          </label>
          <input
            id="search"
            type="search"
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn--secondary">
            Buscar
          </button>
        </form>

        <div className="catalog__filters" role="tablist" aria-label="Categorías">
          <button
            type="button"
            className={!category ? 'is-active' : ''}
            onClick={() => setCategory('')}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={category === cat.slug ? 'is-active' : ''}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className="catalog__status">Cargando productos…</p> : null}
      {error ? <p className="catalog__status catalog__status--error">{error}</p> : null}

      {!loading && !error && products.length === 0 ? (
        <p className="catalog__status">No hay productos en esta selección.</p>
      ) : null}

      <div className="catalog__grid">
        {products.map((product, index) => (
          <div key={product.id} style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
