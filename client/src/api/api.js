import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const withAdminToken = (adminToken) => ({
  headers: {
    Authorization: `Bearer ${adminToken}`,
  },
});

export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (payload, adminToken) => {
  const { data } = await api.post("/products", payload, withAdminToken(adminToken));
  return data;
};

export const updateProduct = async (id, payload, adminToken) => {
  const { data } = await api.put(`/products/${id}`, payload, withAdminToken(adminToken));
  return data;
};

export const deleteProduct = async (id, adminToken) => {
  const { data } = await api.delete(`/products/${id}`, withAdminToken(adminToken));
  return data;
};

export const getReviewsByProduct = async (productId) => {
  const { data } = await api.get(`/reviews/${productId}`);
  return data;
};

export const createReview = async (productId, payload) => {
  const { data } = await api.post(`/reviews/${productId}`, payload);
  return data;
};

export const signupCustomer = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};

export const loginCustomer = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const loginAdmin = async (payload) => {
  const { data } = await api.post("/auth/admin/login", payload);
  return data;
};

export const getAdminMe = async (adminToken) => {
  const { data } = await api.get("/auth/admin/me", withAdminToken(adminToken));
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const getUserData = async () => {
  const { data } = await api.get("/users/me/data");
  return data;
};

export const updateCustomerProfile = async (payload) => {
  const { data } = await api.patch("/users/me", payload);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/users/me/orders");
  return data;
};

export const placeOrderForUser = async (paymentMode) => {
  const { data } = await api.post("/users/me/orders", { paymentMode });
  return data;
};

export const getAdminOrders = async (adminToken) => {
  const { data } = await api.get("/users/admin/orders", withAdminToken(adminToken));
  return data;
};

export const addCartItemForUser = async (productId) => {
  const { data } = await api.post("/users/me/cart", { productId });
  return data;
};

export const updateCartItemQuantityForUser = async (productId, quantity) => {
  const { data } = await api.patch(`/users/me/cart/${productId}`, { quantity });
  return data;
};

export const removeCartItemForUser = async (productId) => {
  const { data } = await api.delete(`/users/me/cart/${productId}`);
  return data;
};

export const toggleWishlistForUser = async (productId) => {
  const { data } = await api.post("/users/me/wishlist", { productId });
  return data;
};

export default api;
