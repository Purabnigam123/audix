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
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-md p-5 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/60 hover:shadow-[0_20px_48px_rgba(99,102,241,0.08)]"
    >
      <Link to={`/products/${product._id}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 210, damping: 22 }}
          className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-black"
        >
          {/* Sweeping glass reflection sheen */}
          <div className="absolute top-0 -left-[100%] z-20 block h-full w-1/2 -skew-x-25 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-all duration-1000 ease-out group-hover:left-[150%]" />

          {/* Glowing halo behind products */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.16),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="h-56 w-full object-cover relative z-10"
          />
        </motion.div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        {/* Premium accent label */}
        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-500 mb-1">
          Audix Reference
        </p>

        <Link
          to={`/products/${product._id}`}
          className="text-lg font-extrabold leading-snug tracking-tight text-slate-200 transition hover:text-white"
        >
          {product.name}
        </Link>
        
        <p className="mt-1.5 text-xl font-black bg-gradient-to-r from-cyan-400 via-indigo-200 to-white bg-clip-text text-transparent w-fit">
          ₹{product.price.toFixed(2)}
        </p>

        {product.stock === 0 ? (
          <div className="mt-3.5 flex items-center gap-2">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400/90">
              Out of Stock
            </span>
          </div>
        ) : (
          <div className="mt-3.5 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/90">
              In Stock ({product.stock})
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2.5 sm:flex-nowrap">
          {!cartItem ? (
            <button
              type="button"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="btn-primary flex-1 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:scale-100 disabled:border-slate-800 disabled:bg-slate-800/80 disabled:text-slate-500 disabled:shadow-none"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-between rounded-full border border-slate-700/80 bg-slate-950/70 px-2 py-1">
              <button
                type="button"
                onClick={() => decreaseQuantity(productId)}
                className="btn-secondary h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-transform active:scale-90"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold text-white">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => increaseQuantity(productId)}
                disabled={reachedStock}
                className="btn-secondary h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
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
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="btn-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`h-4.5 w-4.5 transition-colors duration-300 ${
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
