import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((item) => item.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
          open: true,
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
        open: true,
      }
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      }
    case 'SET_QTY': {
      const quantity = Math.max(1, action.quantity)
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity } : item,
        ),
      }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false }
    case 'TOGGLE':
      return { ...state, open: !state.open }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false })

  const value = useMemo(() => {
    const count = state.items.reduce((sum, item) => sum + item.quantity, 0)
    const total = state.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    )

    return {
      items: state.items,
      open: state.open,
      count,
      total,
      addItem: (product) => dispatch({ type: 'ADD', product }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
      toggleCart: () => dispatch({ type: 'TOGGLE' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
