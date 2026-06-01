import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const categories = [
    { name: "Mobiles", icon: "📱" },
    { name: "Laptops", icon: "💻" },
    { name: "Electronics", icon: "🔌" },
    { name: "Fashion", icon: "👗" },
    { name: "Groceries", icon: "🛒" },
    { name: "Appliances", icon: "🏠" },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          minHeight: "500px",
        }}
        className="d-flex align-items-center"
      >
        <div className="container">
          <div className="row align-items-center">

            {/* Left Side */}
            <div className="col-lg-6 text-white">
              <p className="text-info fw-semibold fs-5 mb-2">
                🛍️ Welcome to MarketZone
              </p>
              <h1 className="display-3 fw-bold mb-3">
                Shop Smart,
                <br />
                <span className="text-info">Save More!</span>
              </h1>
              <p className="lead text-secondary mb-4">
                Discover thousands of products from trusted sellers.
                Best prices guaranteed!
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-info btn-lg fw-bold px-5"
                  onClick={() => navigate("/products")}
                >
                  Shop Now
                </button>
                <button
                  className="btn btn-outline-light btn-lg px-5"
                  onClick={() => navigate("/register")}
                >
                  Sell Now
                </button>
              </div>

              {/* Stats */}
              <div className="d-flex gap-5 mt-5">
                <div>
                  <h3 className="text-info fw-bold mb-0">10K+</h3>
                  <p className="text-secondary mb-0">Products</p>
                </div>
                <div>
                  <h3 className="text-info fw-bold mb-0">5K+</h3>
                  <p className="text-secondary mb-0">Sellers</p>
                </div>
                <div>
                  <h3 className="text-info fw-bold mb-0">50K+</h3>
                  <p className="text-secondary mb-0">Customers</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                alt="shopping"
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Shop by Category</h2>
          <div className="row g-3 justify-content-center">
            {categories.map((cat) => (
              <div className="col-4 col-md-2" key={cat.name}>
                <div
                  className="card text-center shadow-sm border-0 p-3 h-100"
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                  onClick={() => navigate("/products")}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div className="fs-1 mb-2">{cat.icon}</div>
                  <p className="fw-semibold mb-0 small">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="fw-bold text-center mb-5">Why Choose MarketZone?</h2>
        <div className="row g-4 text-center">

          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100">
              <div className="fs-1 mb-3">🚚</div>
              <h5 className="fw-bold">Fast Delivery</h5>
              <p className="text-muted">Get your orders delivered quickly to your doorstep</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100">
              <div className="fs-1 mb-3">🔒</div>
              <h5 className="fw-bold">Secure Payment</h5>
              <p className="text-muted">100% secure transactions with encrypted payments</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100">
              <div className="fs-1 mb-3">↩️</div>
              <h5 className="fw-bold">Easy Returns</h5>
              <p className="text-muted">Hassle-free returns within 30 days of purchase</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100">
              <div className="fs-1 mb-3">💰</div>
              <h5 className="fw-bold">Best Prices</h5>
              <p className="text-muted">Guaranteed best prices on all products</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0 text-secondary">
            © 2026 MarketZone. All rights reserved.
          </p>
        </div>
      </footer>

    </>
  );
}

export default Home;