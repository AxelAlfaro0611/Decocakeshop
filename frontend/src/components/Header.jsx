import logo from '../assets/logo.png'
import { useCart } from '../context/CartContext'
import SocialLinks from './SocialLinks'
import './Header.css'
import './SocialLinks.css'

export default function Header() {
  const { count, toggleCart } = useCart()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#inicio" aria-label="Deco Cake Shop inicio">
          <img
            className="brand__logo"
            src={logo}
            alt="Deco Cake Shop"
            width={160}
            height={160}
          />
        </a>

        <nav className="site-nav" aria-label="Principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#nosotros">Nosotros</a>
        </nav>

        <div className="site-header__actions">
          <SocialLinks variant="header" showLabels={false} />
          <button type="button" className="cart-trigger" onClick={toggleCart}>
            <span>Selección</span>
            <span className="cart-trigger__count" aria-live="polite">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
