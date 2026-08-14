import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Cart from "./components/Cart/Cart";
import App from "./App.tsx";
import { CartProvider } from "./context/CartContext";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>

  </StrictMode>,
);
