import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  getAdminMe,
  getProducts,
  updateProduct,
} from "../api/api";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  image: "",
  stock: "",
};

const ADMIN_TOKEN_KEY = "adminToken";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageLabel, setImageLabel] = useState("No file selected");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

      if (!adminToken) {
        setAuthChecked(true);
        navigate("/admin/login");
        return;
      }

      try {
        await getAdminMe(adminToken);
        const productData = await getProducts();
        setProducts(productData);
      } catch (error) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setProducts([]);
        navigate("/admin/login");
      } finally {
        setAuthChecked(true);
      }
    };

    loadProducts();
  }, [navigate]);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!form.image) {
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image: form.image,
      stock: Number(form.stock),
    };

    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    try {
      const created = await createProduct(payload, adminToken);
      setProducts((prev) => [created, ...prev]);
      setForm(emptyForm);
      setImageLabel("No file selected");
    } catch (error) {
      // No-op fallback for compact demo flow.
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result || "") }));
      setImageLabel(file.name);
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
    });
    setImageLabel(
      product.image?.startsWith("data:image")
        ? "Current uploaded image"
        : product.image,
    );
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingId) return;

    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    try {
      const updated = await updateProduct(editingId, {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image,
        stock: Number(form.stock),
      }, adminToken);

      setProducts((prev) =>
        prev.map((item) => (item._id === editingId ? updated : item)),
      );
      setEditingId(null);
      setForm(emptyForm);
      setImageLabel("No file selected");
    } catch (error) {
      // No-op fallback for compact demo flow.
    }
  };

  const handleDelete = async (id) => {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    try {
      await deleteProduct(id, adminToken);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      // No-op fallback for compact demo flow.
    }
  };

  if (!authChecked) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="section-title text-3xl text-white">Admin Dashboard</h1>
      </div>

      <section className="surface-panel rounded-2xl p-6 !shadow-none">
        <h2 className="section-title text-2xl text-white">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
          className="mt-5 grid gap-3 md:grid-cols-2"
        >
          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Name"
            className="field text-sm"
          />
          <input
            required
            type="number"
            value={form.price}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, price: event.target.value }))
            }
            placeholder="Price"
            className="field text-sm"
          />
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-400">
              Product Image
            </label>
            <input
              required={!editingId}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="field w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-500/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-indigo-200"
            />
            <p className="text-xs text-slate-400">{imageLabel}</p>
            {form.image && (
              <img
                src={form.image}
                alt="Selected product"
                className="h-20 w-20 rounded-lg border border-white/10 object-cover"
              />
            )}
          </div>
          <input
            required
            type="number"
            value={form.stock}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, stock: event.target.value }))
            }
            placeholder="Stock"
            className="field text-sm"
          />
          <textarea
            required
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Description"
            rows={4}
            className="field md:col-span-2 text-sm"
          />

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              {editingId ? "Save Changes" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setImageLabel("No file selected");
                }}
                className="btn-secondary rounded-lg px-5 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="surface-panel rounded-2xl p-6 !shadow-none">
        <h2 className="section-title text-2xl text-white">All Products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="pb-3">Name</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Image</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-white/10 text-slate-200"
                >
                  <td className="py-3">{product.name}</td>
                  <td className="py-3">₹{product.price.toFixed(2)}</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md border border-white/10 object-cover"
                      />
                      <span className="max-w-[220px] truncate text-xs text-slate-400">
                        {product.image?.startsWith("data:image")
                          ? "Uploaded image"
                          : product.image}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="btn-secondary rounded-md px-3 py-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="rounded-md bg-rose-500/20 px-3 py-1 text-xs text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
