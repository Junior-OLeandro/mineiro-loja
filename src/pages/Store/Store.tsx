import { useState } from "react";
import "./Store.css";

import Menu from "../../components/Menu/Menu";
import Cart from "../../components/Cart/Cart";
import { useCart } from "../../hooks/useCart";
import { toAnalyticsItems, trackEvent } from "../../lib/analytics";

function Store() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, items, subtotal } = useCart();

  function handleOpenCart() {
    trackEvent("view_cart", {
      currency: "BRL",
      value: subtotal,
      items: toAnalyticsItems(items),
    });
    setIsCartOpen(true);
  }

  return (
    <main>
      <Menu />
      <button
  type="button"
  className="floating-cart"
  onClick={handleOpenCart}
  aria-label={`Abrir carrinho com ${totalItems} itens`}
>
  <span className="floating-cart__icon-wrapper">
    <svg
      className="floating-cart__icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 4H5L7.2 14.4C7.4 15.3 8.2 16 9.2 16H17.8C18.7 16 19.5 15.4 19.8 14.5L21 8H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="9"
        cy="20"
        r="1.5"
        fill="currentColor"
      />

      <circle
        cx="18"
        cy="20"
        r="1.5"
        fill="currentColor"
      />
    </svg>

    {totalItems > 0 && (
      <span className="floating-cart__count">
        {totalItems > 99 ? "99+" : totalItems}
      </span>
    )}
  </span>

  <span className="floating-cart__label">
    Carrinho
  </span>
</button>
      <footer className="store-footer">
        <div className="store-footer__social">
          <a href="https://wa.me/5532984550411" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="https://www.instagram.com/mineiro.bq/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <a className="store-footer__credit" href="https://www.instagram.com/junior.oleandro/" target="_blank" rel="noreferrer">
          Desenvolvido por: Junior O Leandro
        </a>
      </footer>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}

export default Store;
