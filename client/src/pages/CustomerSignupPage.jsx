import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    {open ? (
      <>
        <path
          d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="2.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </>
    ) : (
      <>
        <path
          d="M3 3l18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M2 12s3.5-6 10-6c2.44 0 4.45.84 6.04 1.94M21.98 11.4C20.85 13.06 17.52 18 12 18c-6.5 0-10-6-10-6a20.8 20.8 0 0 1 4.18-4.79"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </svg>
);

const CustomerSignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    pincode: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="surface-panel mx-auto max-w-lg rounded-2xl p-6"
      style={{ boxShadow: "none" }}
    >
      <h1 className="section-title text-3xl text-white">Create Account</h1>
      <p className="mt-2 text-sm text-slate-400">
        Save your wishlist and cart across devices.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Full Name"
          className="field text-sm"
        />

        <textarea
          required
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder="Address"
          rows={3}
          className="field text-sm"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="Phone Number"
            className="field text-sm"
          />

          <input
            required
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={onChange}
            placeholder="Pincode"
            className="field text-sm"
          />
        </div>

        <div className="relative">
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Set Password"
            className="field pr-10 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-lg px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-200 hover:text-indigo-100"
        >
          Login
        </Link>
      </p>
    </section>
  );
};

export default CustomerSignupPage;
