import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
    placeOrder,
  } = useCart();
  const [paymentMode, setPaymentMode] = useState("Cash on Delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");

  const handlePlaceOrder = async () => {
    setOrderMessage("");
    setOrderError("");
    setIsPlacingOrder(true);

    try {
      await placeOrder(paymentMode);
      setOrderMessage("Order placed successfully.");
    } catch (error) {
      setOrderError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to place order",
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="surface-panel rounded-2xl p-6 text-center shadow-[0_6px_16px_-14px_rgba(37,99,235,0.18)] sm:p-8">
        <h1 className="section-title text-3xl text-white">
          Your Cart is Empty
        </h1>
        <Link
          to="/products"
          className="btn-primary mt-5 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="section-title text-3xl text-white">Shopping Cart</h1>

      <div className="mt-6 space-y-4">
        {cartItems.map((item) => {
          const reachedStock = item.quantity >= item.product.stock;

          return (
            <article
              key={item.product._id}
              className="surface-panel grid gap-4 rounded-2xl p-4 !shadow-none md:grid-cols-[120px_1fr_auto] md:items-center"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-28 rounded-lg object-cover"
              />

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {item.product.name}
                </h2>
                <p className="text-sm text-slate-400">
                  ₹{item.product.price.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => decreaseQuantity(item.product._id)}
                  className="btn-secondary h-9 w-9 rounded-lg text-lg"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => increaseQuantity(item.product._id)}
                  disabled={reachedStock}
                  className="btn-secondary h-9 w-9 rounded-lg text-lg disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product._id)}
                  className="rounded-lg bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300"
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="surface-panel mt-6 rounded-xl p-5">
        <p className="text-lg font-semibold text-white">
          Total: ₹{totalPrice.toFixed(2)}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <select
            value={paymentMode}
            onChange={(event) => setPaymentMode(event.target.value)}
            className="field text-sm"
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="btn-primary w-full rounded-lg px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isPlacingOrder ? "Placing..." : "Place Order"}
            </button>
          ) : (
            <Link
              to="/login"
              className="btn-primary inline-flex justify-center rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              Login to Place Order
            </Link>
          )}
        </div>

        {orderMessage && (
          <p className="mt-3 text-sm text-emerald-300">{orderMessage}</p>
        )}
        {orderError && (
          <p className="mt-3 text-sm text-rose-300">{orderError}</p>
        )}
      </div>
    </section>
  );
};

export default CartPage;
