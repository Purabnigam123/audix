import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CustomerSignupPage from "./pages/CustomerSignupPage";
import ProfilePage from "./pages/ProfilePage";

const ADMIN_TOKEN_KEY = "adminToken";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/signup" element={<CustomerSignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrdersPage />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
