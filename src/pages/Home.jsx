import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";

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
      <Hero
        onShop={() => navigate("/products")}
        onSell={() => navigate("/register")}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Shop by Category</h2>
          <div className="row g-3 justify-content-center">
            {categories.map((cat) => (
              <div className="col-6 col-md-4 col-lg-2" key={cat.name}>
                <div
                  className="card text-center shadow-sm border-0 p-4 h-100 hover-lift"
                  onClick={() => navigate("/products")}
                >
                  <div className="fs-1 mb-3">{cat.icon}</div>
                  <p className="fw-semibold mb-0 small">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose MarketZone?</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "640px" }}>
            A professional marketplace experience built for buyers and sellers.
            Discover the easiest way to manage products, cart, and orders.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100 feature-card">
              <div className="fs-1 mb-3">🚚</div>
              <h5 className="fw-bold">Fast Delivery</h5>
              <p className="text-muted">Reliable shipping from top vendors.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100 feature-card">
              <div className="fs-1 mb-3">🔒</div>
              <h5 className="fw-bold">Secure Payments</h5>
              <p className="text-muted">Modern payment flows with safety built in.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100 feature-card">
              <div className="fs-1 mb-3">↩️</div>
              <h5 className="fw-bold">Easy Returns</h5>
              <p className="text-muted">Streamlined refunds and order support.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm p-4 h-100 feature-card">
              <div className="fs-1 mb-3">💡</div>
              <h5 className="fw-bold">Smart Insights</h5>
              <p className="text-muted">Track products and orders with confidence.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
