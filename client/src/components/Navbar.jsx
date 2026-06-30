import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";

const ADMIN_TOKEN_KEY = "adminToken";

const desktopLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide transition-all duration-300 border ${
    isActive
      ? "bg-gradient-to-r from-indigo-500/15 to-blue-500/15 text-white shadow-[0_0_12px_-2px_rgba(99,102,241,0.25)] border-indigo-500/35"
      : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border-transparent"
  }`;

const iconLinkClass = ({ isActive }) =>
  `relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 border ${
    isActive
      ? "bg-gradient-to-r from-indigo-500/15 to-blue-500/15 text-white shadow-[0_0_12px_-2px_rgba(99,102,241,0.25)] border-indigo-500/35"
      : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border-transparent hover:scale-105"
  }`;

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
    <path
      d="M12 21.2l-1.3-1.2C5.2 15 2 12.1 2 8.6 2 5.8 4.2 3.6 7 3.6c1.6 0 3.2.7 4.2 1.9 1-1.2 2.6-1.9 4.2-1.9 2.8 0 5 2.2 5 5 0 3.5-3.2 6.4-8.7 11.4L12 21.2z"
      fill="currentColor"
    />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
    <path
      d="M3 4h2l1.5 9.2a2 2 0 0 0 2 1.7h8.3a2 2 0 0 0 2-1.6L20 7H7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="19" r="1.6" fill="currentColor" />
    <circle cx="17" cy="19" r="1.6" fill="currentColor" />
  </svg>
);

const MenuIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    {open ? (
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLoggedIn = Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsMobileMenuOpen(false);
    navigate("/admin/login");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 pointer-events-none md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between relative rounded-2xl border border-slate-800/80 bg-black/60 backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] pointer-events-auto">
        <Link
          to={isAdminLoggedIn ? "/admin/dashboard" : "/"}
          className="bg-gradient-to-r from-indigo-100 to-blue-200 bg-clip-text text-xl font-black tracking-[0.2em] text-transparent transition-transform duration-300 hover:scale-102"
        >
          AUDIX
        </Link>

        {isAdminRoute && isAdminLoggedIn ? (
          <>
            <nav className="hidden items-center gap-3 md:flex">
              <NavLink to="/admin/orders" className={desktopLinkClass}>
                Orders
              </NavLink>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                Logout
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800/70 md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <MenuIcon open={isMobileMenuOpen} />
            </button>

            {isMobileMenuOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-2xl border border-slate-800 bg-black/95 backdrop-blur-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] md:hidden">
                <nav className="flex flex-col gap-2">
                  <NavLink to="/admin/orders" className={desktopLinkClass}>
                    Orders
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="btn-secondary rounded-lg px-3 py-2 text-sm font-semibold"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <nav className="hidden items-center gap-6 md:flex">
              <NavLink to="/" className={desktopLinkClass}>
                Home
              </NavLink>
              <NavLink to="/products" className={desktopLinkClass}>
                Products
              </NavLink>
              <NavLink
                to="/wishlist"
                className={iconLinkClass}
                aria-label="Wishlist"
              >
                <HeartIcon />
                <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-100">
                  {wishlistItems.length}
                </span>
              </NavLink>
              <NavLink to="/cart" className={iconLinkClass} aria-label="Cart">
                <CartIcon />
                <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-100">
                  {cartCount}
                </span>
              </NavLink>

              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    className="btn-secondary rounded-full px-4 py-1.5 text-xs font-semibold"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="btn-primary rounded-full px-4 py-1.5 text-xs font-semibold"
                  >
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <div className="flex items-center">
                  <NavLink
                    to="/profile"
                    className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200/90 transition hover:bg-cyan-400/10 hover:text-cyan-100"
                  >
                    Hi, {user?.name}
                  </NavLink>
                </div>
              )}
            </nav>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800/70 md:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <MenuIcon open={isMobileMenuOpen} />
            </button>

            {isMobileMenuOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-2xl border border-slate-800 bg-black/95 backdrop-blur-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] md:hidden">
                <nav className="flex flex-col gap-2">
                  <NavLink to="/" className={desktopLinkClass}>
                    Home
                  </NavLink>
                  <NavLink to="/products" className={desktopLinkClass}>
                    Products
                  </NavLink>
                  <NavLink to="/wishlist" className={desktopLinkClass}>
                    Wishlist ({wishlistItems.length})
                  </NavLink>
                  <NavLink to="/cart" className={desktopLinkClass}>
                    Cart ({cartCount})
                  </NavLink>

                  {!isAuthenticated ? (
                    <>
                      <NavLink
                        to="/login"
                        className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/signup"
                        className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
                      >
                        Sign Up
                      </NavLink>
                    </>
                  ) : (
                    <NavLink
                      to="/profile"
                      className="rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide text-cyan-200/90 transition hover:bg-cyan-400/10 hover:text-cyan-100"
                    >
                      Hi, {user?.name}
                    </NavLink>
                  )}
                </nav>
              </div>
            ) : null}
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
