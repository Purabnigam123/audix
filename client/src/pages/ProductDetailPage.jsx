import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { createReview, getProductById, getReviewsByProduct } from "../api/api";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const getProductId = (productOrId) => {
  if (!productOrId) return null;
  if (typeof productOrId === "string") return productOrId;
  return productOrId._id || productOrId.id || null;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, cartItems, increaseQuantity, decreaseQuantity } =
    useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    username: "",
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, reviewData] = await Promise.all([
          getProductById(id),
          getReviewsByProduct(id),
        ]);
        setProduct(productData);
        setReviews(reviewData);
      } catch (error) {
        setProduct(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!isImagePreviewOpen) {
      return;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsImagePreviewOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isImagePreviewOpen]);

  const cartItem = cartItems.find((item) => getProductId(item.product) === id);
  const canAddToCart = useMemo(() => {
    if (!product || product.stock === 0) return false;
    if (!cartItem) return true;
    return cartItem.quantity < product.stock;
  }, [product, cartItem]);
  const reachedStock =
    Boolean(cartItem) && product && cartItem.quantity >= product.stock;

  const inWishlist = isInWishlist(id);
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "No ratings yet";

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0,
    );
    return `${(total / reviews.length).toFixed(1)} / 5`;
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    if (showAllReviews) {
      return reviews;
    }

    return reviews.slice(0, 4);
  }, [reviews, showAllReviews]);

  const submitReview = async (event) => {
    event.preventDefault();

    if (Number(reviewForm.rating) < 1) {
      setRatingError("Please select a star rating.");
      return;
    }

    try {
      const newReview = await createReview(id, {
        username: reviewForm.username,
        comment: reviewForm.comment,
        rating: Number(reviewForm.rating),
      });
      setReviews((prev) => [newReview, ...prev]);
      setReviewForm({ username: "", comment: "", rating: 0 });
      setRatingError("");
    } catch (error) {
      // No-op fallback for compact demo flow.
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-rose-300">Product not found.</p>;
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-300/20 bg-gradient-to-br from-slate-900/80 via-slate-950/92 to-black/95 p-4 sm:p-6 md:p-8">
        <div className="pointer-events-none absolute -left-20 top-6 h-52 w-52 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-cyan-500/12 blur-3xl" />

        <div className="relative grid items-start gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          <button
            type="button"
            onClick={() => setIsImagePreviewOpen(true)}
            className="block overflow-hidden rounded-2xl border border-white/10 bg-black/75 text-left"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full min-h-[300px] w-full object-cover"
            />
          </button>

          <div>
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
              Premium Audio Gear
            </p>
            <h1 className="section-title mt-4 text-3xl text-white sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-slate-300/95">{product.description}</p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-200">
                {product.stock === 0
                  ? "Out of Stock"
                  : `${product.stock} in stock`}
              </span>
              <span className="rounded-full border border-violet-300/30 bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-200">
                {averageRating}
              </span>
              <span className="rounded-full border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-200">
                {reviews.length} reviews
              </span>
            </div>

            <p className="mt-6 text-3xl font-extrabold text-cyan-200">
              ₹{product.price.toFixed(2)}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {!cartItem ? (
                <button
                  type="button"
                  disabled={!canAddToCart}
                  onClick={() => addToCart(product)}
                  className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-slate-600/80 bg-slate-900/70 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(getProductId(product))}
                    className="btn-secondary h-9 w-9 rounded-md text-lg"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">
                    {cartItem.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(getProductId(product))}
                    disabled={reachedStock}
                    className="btn-secondary h-9 w-9 rounded-md text-lg disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() =>
                  inWishlist ? removeFromWishlist(id) : addToWishlist(product)
                }
                className="btn-secondary rounded-lg px-6 py-2.5 text-sm font-semibold"
              >
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {isImagePreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <button
            type="button"
            aria-label="Close image preview"
            className="absolute right-4 top-4 rounded-md border border-white/20 bg-black/60 px-3 py-1.5 text-sm font-semibold text-white"
            onClick={() => setIsImagePreviewOpen(false)}
          >
            Close
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[90vh] w-auto max-w-[92vw] rounded-xl border border-white/15 object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <section className="grid items-start gap-6 lg:grid-cols-2">
        <div className="surface-panel relative overflow-hidden rounded-3xl border border-indigo-300/25 bg-gradient-to-br from-slate-900/88 via-slate-950/92 to-black/95 p-5 !shadow-none md:p-6">
          <div className="pointer-events-none absolute -left-14 -top-14 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title text-2xl text-white">Reviews</h2>
              <span className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                {reviews.length} total
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {reviews.length === 0 && (
                <p className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-slate-400">
                  No reviews yet. Be the first to review this product.
                </p>
              )}
              {visibleReviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-xl border border-white/10 bg-black/45 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">
                      {review.username}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          viewBox="0 0 24 24"
                          className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-700 text-slate-700"}`}
                          aria-hidden="true"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {review.comment}
                  </p>
                </article>
              ))}
              {reviews.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllReviews((prev) => !prev)}
                  className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  {showAllReviews ? "Show less" : "See all reviews"}
                </button>
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={submitReview}
          className="surface-panel relative self-start overflow-hidden rounded-3xl border border-indigo-300/25 bg-gradient-to-br from-slate-900/88 via-slate-950/92 to-black/95 p-5 !shadow-none md:p-6"
        >
          <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-indigo-500/12 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative">
            <h2 className="section-title text-2xl text-white">Add Review</h2>
            <p className="mt-1 text-sm text-slate-400">
              Share your experience to help other buyers.
            </p>

            <div className="mt-5 space-y-4">
              <input
                required
                value={reviewForm.username}
                onChange={(event) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
                type="text"
                placeholder="Username"
                className="field text-sm"
              />
              <textarea
                required
                value={reviewForm.comment}
                onChange={(event) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: event.target.value,
                  }))
                }
                placeholder="Comment"
                rows={4}
                className="field text-sm"
              />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-400">
                  Rating
                </p>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      onClick={() => {
                        setReviewForm((prev) => ({ ...prev, rating: star }));
                        setRatingError("");
                      }}
                      className="rounded-sm p-0.5"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-7 w-7 ${star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-slate-500"}`}
                        aria-hidden="true"
                      >
                        <path
                          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                {ratingError && (
                  <p className="text-xs font-medium text-amber-300">
                    {ratingError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold"
              >
                Submit Review
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProductDetailPage;
