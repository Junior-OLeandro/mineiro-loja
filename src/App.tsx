import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import Admin from "./pages/Admin/Admin";
import AdminLogin from "./pages/Admin/AdminLogin";
import Print from "./pages/Print/Print";
import Store from "./pages/Store/Store";
import Orders from "./pages/Admin/Orders";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/admin/pedidos" element={<Orders />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/print" element={<Print />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;