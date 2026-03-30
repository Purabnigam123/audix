import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <section className="surface-panel rounded-2xl p-8 text-center">
        <h1 className="section-title text-3xl text-white">Wishlist is Empty</h1>
        <Link
          to="/products"
          className="btn-primary mt-5 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          Discover Products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="section-title text-3xl text-white">Wishlist</h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <article
            key={item._id}
            className="surface-panel rounded-2xl p-4 !shadow-none"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full rounded-lg object-cover"
            />
            <h2 className="mt-4 text-lg font-semibold text-white">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              ₹{item.price.toFixed(2)}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => addToCart(item)}
                disabled={item.stock === 0}
                className="btn-primary flex-1 rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => removeFromWishlist(item._id)}
                className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-300"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WishlistPage;
