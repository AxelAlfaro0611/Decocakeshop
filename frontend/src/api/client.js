const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(
  /\/$/,
  '',
)

async function request(path) {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Error al cargar datos (${response.status})`)
  }
  return response.json()
}

export async function fetchProducts({ category, search, pageSize, featured } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (search) params.set('search', search)
  if (pageSize) params.set('page_size', String(pageSize))
  if (featured) params.set('featured', 'true')
  const query = params.toString()
  const data = await request(`/products/${query ? `?${query}` : ''}`)
  return Array.isArray(data) ? data : data.results || []
}

export async function fetchCategories() {
  const data = await request('/categories/')
  return Array.isArray(data) ? data : data.results || []
}

export { API_URL }
