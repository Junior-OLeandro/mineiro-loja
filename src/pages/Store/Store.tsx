import { useState } from "react";

import Menu from "../../components/Menu/Menu";
import Cart from "../../components/Cart/Cart";

function Store() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main>
      <Menu />

      <button
        type="button"
        className="floating-cart"
        onClick={() => setIsCartOpen(true)}
      >
        🛒 Carrinho
      </button>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </main>
  );
}

export default Store;