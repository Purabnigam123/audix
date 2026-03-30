import { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="section-title text-3xl text-white sm:text-4xl">
          All Headphones
        </h1>
        <p className="mt-2 text-slate-400">
          Explore the full Audix lineup built for studio monitoring, travel, and
          daily listening.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            Wireless
          </span>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            Noise Cancelling
          </span>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            Studio Grade
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading products...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductListPage;
