const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '51999999999').replace(
  /\D/g,
  '',
)

export function formatPrice(value) {
  const amount = Number(value)
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount)
}

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function productInquiryMessage(product) {
  return [
    '¡Hola DecoCakeShop!',
    '',
    'Quiero consultar por este producto:',
    `• ${product.name} — ${formatPrice(product.price)}`,
    '',
    '¿Me confirmas disponibilidad y forma de entrega?',
  ].join('\n')
}

export function cartCheckoutMessage(items) {
  const lines = items.map(
    (item) =>
      `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
  )
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  return [
    '¡Hola DecoCakeShop!',
    '',
    'Quiero concluir esta compra:',
    ...lines,
    '',
    `Total estimado: ${formatPrice(total)}`,
    '',
    'Quedo atento/a para coordinar el pedido.',
  ].join('\n')
}
