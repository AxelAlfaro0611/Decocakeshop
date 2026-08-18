import { useState } from 'react'
import logo from '../assets/logo.png'
import { useCart } from '../context/CartContext'
import SocialLinks from './SocialLinks'
import MobileNav from './MobileNav'
import './Header.css'
import './SocialLinks.css'
import './MobileNav.css'

export default function Header() {
  const { count, toggleCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__lead">
          <button
            type="button"
            className="menu-toggle"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
          </button>
          <a className="brand" href="#inicio" aria-label="Deco Cake Shop inicio">
            <img
              className="brand__logo"
              src={logo}
              alt="Deco Cake Shop"
              width={160}
              height={160}
            />
          </a>
        </div>

        <nav className="site-nav" aria-label="Principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#nosotros">Nosotros</a>
        </nav>

        <div className="site-header__actions">
          <SocialLinks variant="header" showLabels={false} />
          <button
            type="button"
            className="cart-trigger"
            onClick={toggleCart}
            aria-label={`Carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
          >
            <svg className="cart-trigger__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.8 4.2h2.1l.55 1.3 2.2 9.1h10.7l2.05-6.9H7.05M9.2 19.3a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Zm8.35 0a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z"
              />
            </svg>
            <span className="cart-trigger__count" aria-live="polite">
              {count}
            </span>
          </button>
        </div>
      </div>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
