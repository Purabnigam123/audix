import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const getProductId = (productOrId) => {
  if (!productOrId) return null;
  if (typeof productOrId === "string") return productOrId;
  return productOrId._id || productOrId.id || null;
};

const ProductCard = ({ product }) => {
  const { addToCart, cartItems, increaseQuantity, decreaseQuantity } =
    useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);
  const productId = getProductId(product);
  const cartItem = cartItems.find(
    (item) => getProductId(item.product) === productId,
  );
  const reachedStock = Boolean(cartItem) && cartItem.quantity >= product.stock;

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.28 });

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group flex h-full flex-col rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 transition duration-300 hover:border-slate-500/70"
    >
      <Link to={`/products/${product._id}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 210, damping: 22 }}
          className="overflow-hidden rounded-lg border border-slate-700/70 bg-black"
        >
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="h-56 w-full object-cover"
          />
        </motion.div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <Link
          to={`/products/${product._id}`}
          className="text-xl font-semibold leading-tight text-slate-100 transition hover:text-white"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-base font-semibold text-slate-200">
          ₹{product.price.toFixed(2)}
        </p>

        {product.stock === 0 ? (
          <span className="mt-3 inline-flex w-fit items-center rounded-full border border-rose-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-300">
            Out of Stock
          </span>
        ) : (
          <span className="mt-3 inline-flex w-fit items-center rounded-full border border-slate-500/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">
            In Stock ({product.stock})
          </span>
        )}

        <div className="mt-5 flex gap-2">
          {!cartItem ? (
            <button
              type="button"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="btn-primary flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-600/80 bg-slate-900/70 px-2 py-1.5">
              <button
                type="button"
                onClick={() => decreaseQuantity(productId)}
                className="btn-secondary h-9 w-9 rounded-lg text-lg"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-semibold text-white">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => increaseQuantity(productId)}
                disabled={reachedStock}
                className="btn-secondary h-9 w-9 rounded-lg text-lg disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
          <motion.button
            type="button"
            onClick={() =>
              inWishlist
                ? removeFromWishlist(product._id)
                : addToWishlist(product)
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary flex items-center justify-center rounded-xl px-3 py-2.5 transition-colors"
          >
            <svg
              className={`h-6 w-6 transition-colors duration-300 ${
                inWishlist
                  ? "fill-red-500 text-red-500"
                  : "fill-slate-400 text-slate-400 group-hover:text-indigo-400"
              }`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
