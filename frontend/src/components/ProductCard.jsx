import { useCart } from '../context/CartContext'
import {
  buildWhatsAppUrl,
  formatPrice,
  productInquiryMessage,
} from '../utils/whatsapp'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const image = product.image_url || product.image

  return (
    <article className="product">
      <div className="product__media">
        {image ? (
          <img src={image} alt={product.name} loading="lazy" />
        ) : (
          <div className="product__placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="product__body">
        {product.category?.name ? (
          <p className="product__category">{product.category.name}</p>
        ) : null}
        <h3 className="product__name">{product.name}</h3>
        <p className="product__desc">{product.description}</p>
        <p className="product__price">{formatPrice(product.price)}</p>

        <div className="product__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => addItem(product)}
          >
            Agregar a mi lista
          </button>
          <a
            className="btn btn--whatsapp"
            href={buildWhatsAppUrl(productInquiryMessage(product))}
            target="_blank"
            rel="noreferrer"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
