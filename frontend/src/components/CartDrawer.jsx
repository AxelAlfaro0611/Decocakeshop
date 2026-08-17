import { useCart } from '../context/CartContext'
import {
  buildWhatsAppUrl,
  cartCheckoutMessage,
  formatPrice,
} from '../utils/whatsapp'
import './CartDrawer.css'

export default function CartDrawer() {
  const {
    items,
    open,
    total,
    closeCart,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart()

  const checkoutUrl = buildWhatsAppUrl(cartCheckoutMessage(items))

  return (
    <>
      <div
        className={`cart-backdrop ${open ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden={!open}
      />

      <aside
        className={`cart-drawer ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Selección de productos"
      >
        <div className="cart-drawer__head">
          <h2>Tu selección</h2>
          <button type="button" className="cart-drawer__close" onClick={closeCart}>
            Cerrar
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-drawer__empty">
            Aún no agregaste productos. Explora el catálogo y arma tu pedido.
          </p>
        ) : (
          <ul className="cart-drawer__list">
            {items.map((item) => (
              <li key={item.id} className="cart-line">
                <div>
                  <p className="cart-line__name">{item.name}</p>
                  <p className="cart-line__price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-line__controls">
                  <label>
                    <span className="sr-only">Cantidad</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        setQuantity(item.id, Number(e.target.value) || 1)
                      }
                    />
                  </label>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-drawer__footer">
          <div className="cart-drawer__total">
            <span>Total estimado</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <a
            className={`btn btn--whatsapp btn--block ${items.length === 0 ? 'is-disabled' : ''}`}
            href={items.length ? checkoutUrl : undefined}
            aria-disabled={items.length === 0}
            onClick={(e) => {
              if (!items.length) e.preventDefault()
            }}
            target="_blank"
            rel="noreferrer"
          >
            Enviar pedido por WhatsApp
          </a>
          <p className="cart-drawer__hint">
            Al tocar este botón se abre WhatsApp para confirmar tu compra.
          </p>

          {items.length > 0 ? (
            <button type="button" className="btn btn--ghost-dark" onClick={clearCart}>
              Vaciar selección
            </button>
          ) : null}
        </div>
      </aside>
    </>
  )
}
