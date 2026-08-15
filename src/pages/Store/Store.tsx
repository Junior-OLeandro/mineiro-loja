import { useEffect, useState } from "react";
import "./Store.css";
import promotionImage from "../../assets/images/lanches/promocaobatata.webp";

import Menu from "../../components/Menu/Menu";
import Cart from "../../components/Cart/Cart";
import { useCart } from "../../hooks/useCart";
import { toAnalyticsItems, trackEvent } from "../../lib/analytics";

function Store() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const { totalItems, items, subtotal } = useCart();

  function handleOpenCart() {
    trackEvent("view_cart", {
      currency: "BRL",
      value: subtotal,
      items: toAnalyticsItems(items),
    });
    setIsCartOpen(true);
  }

  useEffect(() => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const part = (type: string) =>
      parts.find((current) => current.type === type)?.value;
    const isWednesday = part("weekday") === "Wed";
    const currentDate = `${part("year")}-${part("month")}-${part("day")}`;

    if (
      isWednesday &&
      localStorage.getItem("mineiro-promotion-last-seen") !== currentDate
    ) {
      setIsPromotionOpen(true);
    }
  }, []);

  function closePromotion() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const part = (type: string) =>
      parts.find((current) => current.type === type)?.value;

    localStorage.setItem(
      "mineiro-promotion-last-seen",
      `${part("year")}-${part("month")}-${part("day")}`,
    );
    setIsPromotionOpen(false);
  }

  function startOrderingFromPromotion() {
    closePromotion();
    document.getElementById("combos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
      {isPromotionOpen && (
        <div className="promotion-modal" role="dialog" aria-modal="true" aria-labelledby="promotion-title">
          <div className="promotion-modal__content">
            <button
              type="button"
              className="promotion-modal__close"
              onClick={closePromotion}
              aria-label="Fechar promoção"
            >
              ×
            </button>
            <h2 id="promotion-title">🔥 Imperdível hoje! 🔥</h2>
            <img src={promotionImage} alt="Porção de batata frita grátis na promoção" />
            <p>
              Na compra de qualquer lanche, leve 1 porção de Batata Frita GRÁTIS!
            </p>
            <button type="button" onClick={startOrderingFromPromotion}>
              Começar a pedir!
            </button>
            <small>A promoção não é válida para combos.</small>
          </div>
        </div>
      )}
    </main>
  );
}

export default Store;
