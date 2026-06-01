import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://marketzone-backend-production.up.railway.app/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
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
    <>
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ width: "400px" }}>

          <h2 className="text-center mb-4">Register</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="mb-3">
              <label className="form-label">Register as</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
              </select>
            </div>

            <button className="btn btn-info w-100">Register</button>

          </form>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-info">Login</a>
          </p>

        </div>
      </div>
    </>
  );
}

export default Register;