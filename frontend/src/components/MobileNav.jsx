import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { fetchCategories, fetchProducts } from '../api/client'
import './MobileNav.css'

export default function MobileNav({ open, onClose }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [openSlug, setOpenSlug] = useState('')

  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
    fetchProducts({ pageSize: 100 })
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  const grouped = useMemo(() => {
    const map = new Map()
    categories.forEach((cat) => map.set(cat.slug, []))
    products.forEach((product) => {
      const slug = product.category?.slug
      if (slug && map.has(slug)) {
        map.get(slug).push(product)
      } else if (slug) {
        map.set(slug, [product])
      }
    })
    return map
  }, [categories, products])

  function goToProduct(product) {
    onClose()
    window.dispatchEvent(
      new CustomEvent('catalog:focus', {
        detail: {
          category: product.category?.slug || '',
          slug: product.slug,
        },
      }),
    )
  }

  function toggleCategory(slug) {
    setOpenSlug((current) => (current === slug ? '' : slug))
  }

  const menu = (
    <>
      <div
        className={`mobile-nav-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`mobile-nav ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Menú de navegación"
      >
        <div className="mobile-nav__head">
          <h2>Menú de navegación</h2>
          <button type="button" className="mobile-nav__close" onClick={onClose} aria-label="Cerrar menú">
            ×
          </button>
        </div>

        <div className="mobile-nav__cats">
          {categories.map((cat) => {
            const items = grouped.get(cat.slug) || []
            const expanded = openSlug === cat.slug
            return (
              <div key={cat.id} className="mobile-nav__group">
                <button
                  type="button"
                  className={`mobile-nav__cat ${expanded ? 'is-open' : ''}`}
                  aria-expanded={expanded}
                  onClick={() => toggleCategory(cat.slug)}
                >
                  <span>{cat.name}</span>
                  <span className="mobile-nav__caret" aria-hidden="true">
                    ▾
                  </span>
                </button>
                {expanded ? (
                  <ul className="mobile-nav__products">
                    {items.length === 0 ? (
                      <li className="mobile-nav__empty">Sin productos</li>
                    ) : (
                      items.map((product) => (
                        <li key={product.id}>
                          <button type="button" onClick={() => goToProduct(product)}>
                            - {product.name}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </div>
      </aside>
    </>
  )

  return createPortal(menu, document.body)
}
