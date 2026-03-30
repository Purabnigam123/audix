import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import SmoothScroll from "./components/SmoothScroll";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SmoothScroll />
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
