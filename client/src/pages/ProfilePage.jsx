import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getMyOrders, updateCustomerProfile } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";

const ProfilePage = () => {
  const { user, isAuthenticated, authLoading, updateUser, logout } = useAuth();
  const { wishlistItems } = useWishlist();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    pincode: "",
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      try {
        const data = await getMyOrders();
        setOrders(data.orders || []);
      } catch (apiError) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updateCustomerProfile(form);
      updateUser(response.user);
      setMessage("Profile updated successfully.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-indigo-300/20 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-black/95 p-5 shadow-[0_10px_24px_-20px_rgba(37,99,235,0.24)] sm:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-200/90">
                Account Settings
              </p>
              <h1 className="section-title mt-4 text-3xl text-white sm:text-4xl">
                My Profile
              </h1>
            </div>
            <button
              type="button"
              onClick={logout}
              className="btn-secondary rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide"
            >
              Logout
            </button>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-slate-300/85 sm:text-base">
            Keep your account details updated for smoother checkout and easier
            order tracking.
          </p>

          <form onSubmit={onSave} className="mt-7 grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-400">
                  Full Name
                </span>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Name"
                  className="field text-sm"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-400">
                  Phone Number
                </span>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Phone Number"
                  className="field text-sm"
                />
              </label>
            </div>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-400">
                Address
              </span>
              <textarea
                required
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Address"
                rows={3}
                className="field resize-none text-sm"
              />
            </label>

            <label className="max-w-xs space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-400">
                Pincode
              </span>
              <input
                required
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={onChange}
                placeholder="Pincode"
                className="field text-sm"
              />
            </label>

            {message && (
              <p className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {message}
              </p>
            )}
            {error && (
              <p className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full rounded-lg px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="surface-panel rounded-2xl p-6 !shadow-none">
          <h2 className="section-title text-2xl text-white">My Wishlist</h2>
          <div className="mt-4 space-y-3">
            {wishlistItems.length === 0 ? (
              <p className="text-sm text-slate-400">
                No items in wishlist yet.
              </p>
            ) : (
              wishlistItems.map((item) => (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/35 p-3 transition hover:border-indigo-300/35"
                >
                  <span className="text-sm font-semibold text-slate-100">
                    {item.name}
                  </span>
                  <span className="text-sm text-slate-300">
                    ₹{item.price.toFixed(2)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </article>

        <article className="surface-panel rounded-2xl p-6 !shadow-none">
          <h2 className="section-title text-2xl text-white">My Orders</h2>
          <div className="mt-4 space-y-3">
            {loadingOrders ? (
              <p className="text-sm text-slate-400">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-slate-400">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-white/10 bg-black/35 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-100">
                      Order #{order.id.slice(-6)}
                    </p>
                    <span className="text-xs font-semibold text-cyan-200">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()} • ₹
                    {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default ProfilePage;
