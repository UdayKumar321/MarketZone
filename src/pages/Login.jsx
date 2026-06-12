import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      if (data.role === "SELLER") {
        navigate("/seller/dashboard");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <section className="auth-page d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-sm p-4 auth-card">
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-info w-100 mb-3">Login</button>
        </form>

        <p className="text-center text-muted mb-0">
          Don&apos;t have an account? <Link to="/register" className="text-info">Register</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
