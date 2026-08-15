import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { CartItem, CartItemExtra, Product } from '../types'
import { trackEvent } from '../lib/analytics'

interface CartContextData {
  items: CartItem[]
  totalItems: number
  subtotal: number

  addToCart: (
    product: Product,
    unitPrice?: number,
    extras?: CartItemExtra[],
    variant?: CartItem["variant"],
    observation?: string,
    meat?: CartItem["meat"],
    meatPoint?: CartItem["meatPoint"],
  ) => void

  updateCartItem: (
  itemId: string,
  unitPrice: number,
  extras: CartItemExtra[],
  variant?: CartItem["variant"],
  observation?: string,
  meat?: CartItem["meat"],
  meatPoint?: CartItem["meatPoint"],
) => void

  removeFromCart: (itemId: string) => void
  increaseQuantity: (itemId: string) => void
  decreaseQuantity: (itemId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextData | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = useCallback(
    (
      product: Product,
      unitPrice?: number,
      extras: CartItemExtra[] = [],
      variant?: CartItem["variant"],
      observation?: string,
      meat?: CartItem["meat"],
      meatPoint?: CartItem["meatPoint"],
    ) => {
      const price = unitPrice ?? product.price ?? 0

      trackEvent('add_to_cart', {
        currency: 'BRL',
        value: price + extras.reduce((total, extra) => total + extra.price, 0),
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_variant: variant,
            price: price + extras.reduce((total, extra) => total + extra.price, 0),
            quantity: 1,
          },
        ],
      })

      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => {
          if (item.productId !== product.id) return false
          if (item.meat !== meat) return false
          if (item.meatPoint !== meatPoint) return false
          if (item.variant !== variant) return false
          if (item.observation !== observation) return false

          if (item.extras.length !== extras.length) return false

          const itemExtraIds = item.extras
            .map((extra) => extra.id)
            .sort()

          const newExtraIds = extras
            .map((extra) => extra.id)
            .sort()

          return itemExtraIds.every(
            (id, index) => id === newExtraIds[index],
          )
        })

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === existingItem.id
              ? {
                ...item,
                quantity: item.quantity + 1,
              }
              : item,
          )
        }

        const newItem: CartItem = {
          id: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          unitPrice: price,
          quantity: 1,
          extras,
          meat,
          meatPoint,
          observation,
          variant,
        }

        return [...currentItems, newItem]
      })
    },
    [],
  )

  const updateCartItem = useCallback(
  (
    itemId: string,
    unitPrice: number,
    extras: CartItemExtra[],
    variant?: CartItem["variant"],
    observation?: string,
    meat?: CartItem["meat"],
    meatPoint?: CartItem["meatPoint"],
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              unitPrice,
              extras,
              variant,
              observation,
              meat,
              meatPoint,
            }
          : item,
      ),
    )
  },
  [],
)

  const removeFromCart = useCallback((itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    )
  }, [])

  const increaseQuantity = useCallback((itemId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item,
      ),
    )
  }, [])

  const decreaseQuantity = useCallback((itemId: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId
            ? {
              ...item,
              quantity: item.quantity - 1,
            }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [items],
  )

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const extrasTotal = item.extras.reduce(
          (extrasSum, extra) => extrasSum + extra.price,
          0,
        )

        return (
          total +
          (item.unitPrice + extrasTotal) * item.quantity
        )
      }, 0),
    [items],
  )

  const value = useMemo(
  () => ({
    items,
    totalItems,
    subtotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }),
  [
    items,
    totalItems,
    subtotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  ],
)

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCartContext deve ser usado dentro de um CartProvider',
    )
  }

  return context
}
