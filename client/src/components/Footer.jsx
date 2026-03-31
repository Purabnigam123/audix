import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-16 border-t border-slate-800/80 bg-gradient-to-b from-slate-950/70 to-black/95">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 md:min-h-[240px] md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-sm font-semibold tracking-[0.22em] text-slate-200">
            AUDIX
          </p>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Premium headphones engineered for immersive sound and all-day
            comfort.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-300 md:justify-end">
          <Link
            to="/"
            className="border-b border-transparent pb-1 transition hover:border-slate-500 hover:text-slate-100"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="border-b border-transparent pb-1 transition hover:border-slate-500 hover:text-slate-100"
          >
            Products
          </Link>
          <Link
            to="/wishlist"
            className="border-b border-transparent pb-1 transition hover:border-slate-500 hover:text-slate-100"
          >
            Wishlist
          </Link>
          <Link
            to="/cart"
            className="border-b border-transparent pb-1 transition hover:border-slate-500 hover:text-slate-100"
          >
            Cart
          </Link>
          <Link
            to="/admin/login"
            className="border-b border-transparent pb-1 transition hover:border-slate-500 hover:text-slate-100"
          >
            Admin
          </Link>
        </nav>
      </div>

      <div className="border-t border-slate-800/70 px-4 py-5 text-center text-xs tracking-wide text-slate-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Audix. Crafted for better listening.
      </div>
    </footer>
  );
};

export default Footer;
