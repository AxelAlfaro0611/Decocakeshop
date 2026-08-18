import Header from './components/Header'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import About from './components/About'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import WhatsAppFloat from './components/WhatsAppFloat'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <div className="app-shell">
        <Header />
        <main>
          <Hero />
          <ProductGrid />
          <About />
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </div>
    </CartProvider>
  )
}
