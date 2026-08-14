import "./cart.css";

import { useCart } from "../../hooks/useCart";
import { useState } from "react";
import type { CartItem } from "../../types";
import { products } from "../../data/product";
import ProductModal from "../ProductModal/ProductModal";
import Checkout from "../Checkout/Checkout";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, totalItems, subtotal, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [editingItem, setEditingItem] =
    useState<CartItem | null>(null);

  if (!isOpen) return null;

  if (isCheckoutOpen) {
  return (
    <Checkout
      onClose={() => setIsCheckoutOpen(false)}
    />
  );
}

  return (
    <div className="cart__overlay" onClick={onClose}>
      <aside
        className="cart"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="cart__header">
          <div>
            <h2>Seu carrinho</h2>

            <span>
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "itens"}
            </span>
          </div>

          <button
            type="button"
            className="cart__close"
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart__empty">
            <p>Seu carrinho está vazio.</p>

            <button
              type="button"
              onClick={onClose}
            >
              Escolher produtos
            </button>
          </div>
        ) : (
          <>
            <div className="cart__items">
              {items.map((item) => {
                const extrasTotal = item.extras.reduce(
                  (total, extra) => total + extra.price,
                  0,
                );

                const itemTotal =
                  (item.unitPrice + extrasTotal) *
                  item.quantity;

                return (
                  <article
                    key={item.id}
                    className="cart-item"
                  >
                    <div className="cart-item__content">
                      <h3>{item.name}</h3>

                      {item.variant && (
                        <p>
                          <strong>Tipo:</strong>{" "}
                          {item.variant}
                        </p>
                      )}

                      {item.meat && (
                        <p>
                          <strong>Carne:</strong>{" "}
                          {item.meat === "boi"
                            ? "Boi"
                            : "Frango"}
                        </p>
                      )}

                      {item.meatPoint && (
                        <p>
                          <strong>Ponto:</strong>{" "}
                          {item.meatPoint}
                        </p>
                      )}

                      {item.extras.length > 0 && (
                        <div className="cart-item__extras">
                          <strong>Adicionais:</strong>

                          {item.extras.map(
                            (extra) => (
                              <span key={extra.id}>
                                {extra.name}
                              </span>
                            ),
                          )}
                        </div>
                      )}

                      {item.observation && (
                        <p className="cart-item__observation">
                          <strong>Obs:</strong>{" "}
                          {item.observation}
                        </p>
                      )}

                      <strong className="cart-item__price">
                        {itemTotal.toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          },
                        )}
                      </strong>
                    </div>

                    <div className="cart-item__actions">
                      <div className="cart-item__quantity">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-item__edit"
                        onClick={() =>
                          setEditingItem(item)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        Remover
                      </button>
                    </div>
                    
                    {editingItem && (
                      (() => {
                        const product = products.find(
                          (item) =>
                            item.id === editingItem.productId,
                        );

                        if (!product) return null;

                        return (
                          <ProductModal
                            product={product}
                            initialItem={editingItem}
                            onClose={() =>
                              setEditingItem(null)
                            }
                          />
                        );
                      })()
                    )}
                  </article>
                );
              })}
            </div>

            <footer className="cart__footer">
              <div className="cart__subtotal">
                <span>Subtotal</span>

                <strong>
                  {subtotal.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </strong>
              </div>

              <button
  type="button"
  className="cart__checkout"
  onClick={() => setIsCheckoutOpen(true)}
>
  Finalizar pedido
</button>

              <button
                type="button"
                className="cart__clear"
                onClick={clearCart}
              >
                Limpar carrinho
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export default Cart;
