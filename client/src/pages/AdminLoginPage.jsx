import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/api";

const ADMIN_TOKEN_KEY = "adminToken";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await loginAdmin({ username, password });
      localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
      navigate("/admin/dashboard");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Invalid admin credentials");
    }
  };

  return (
    <section className="surface-panel mx-auto max-w-md rounded-2xl p-6">
      <h1 className="section-title text-3xl text-white">Admin Login</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          className="field text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="field text-sm"
        />

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          Login
        </button>
      </form>
    </section>
  );
};

export default AdminLoginPage;
