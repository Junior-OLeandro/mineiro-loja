import { useState } from "react";
import "./Store.css";

import Menu from "../../components/Menu/Menu";
import Cart from "../../components/Cart/Cart";
import { useCart } from "../../hooks/useCart";

function Store() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <main>
      <Menu />
      <button type="button" className="floating-cart" onClick={() => setIsCartOpen(true)}>
        Carrinho <span className="floating-cart__count" aria-label={`${totalItems} itens no carrinho`}>{totalItems}</span>
      </button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}

export default Store;
