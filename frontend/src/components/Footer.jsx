import logo from '../assets/logo.png'
import SocialLinks from './SocialLinks'
import './Footer.css'
import './SocialLinks.css'

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://127.0.0.1:8000/admin/'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <img
          className="site-footer__logo"
          src={logo}
          alt="Deco Cake Shop"
          width={200}
          height={200}
        />
        <p>Accesorios de repostería · Importación profesional</p>
        <SocialLinks variant="footer" />
        <p className="site-footer__admin">
          Gestión:{' '}
          <a href={ADMIN_URL} target="_blank" rel="noreferrer">
            Panel admin
          </a>
        </p>
      </div>
    </footer>
  )
}
