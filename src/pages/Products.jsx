import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config";
import { formatCurrency } from "../utils/formatCurrency";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/products/all`)
      .then((res) => res.json())
      .then((data) => setProducts(data || []))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "" || product.category === category;
    return matchSearch && matchCategory;
  });

  const categories = [...new Set(products.map((product) => product.category))];

  const getRating = (id) => {
    const ratings = [3.5, 3.8, 4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.8, 5.0];
    return ratings[id % ratings.length];
  };

  const getDiscount = (id) => {
    const discounts = [5, 10, 15, 20, 25, 30, 35, 40];
    return discounts[id % discounts.length];
  };

  const getOriginalPrice = (price, discount) => {
    return Math.round(price / (1 - discount / 100));
  };

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🛍️ All Products</h4>
          <p className="text-muted mb-0">Discover curated products from verified sellers.</p>
        </div>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          ✅ {message}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="input-group shadow-sm rounded-pill overflow-hidden border border-1 border-secondary">
            <span className="input-group-text bg-white border-0">🔍</span>
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <select
            className="form-select shadow-sm border-0"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-1">😕</p>
          <p className="text-muted fs-5">No products match your search.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => {
            const discount = getDiscount(product.id);
            const originalPrice = getOriginalPrice(product.price, discount);
            const rating = getRating(product.id);

            return (
              <div className="col-sm-6 col-xl-3" key={product.id}>
                <div className="card h-100 border-0 shadow-sm product-card">
                  <div className="position-relative">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: "220px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "220px" }}>
                        <span className="fs-1">🛍️</span>
                      </div>
                    )}
                    <span className="position-absolute top-0 start-0 badge bg-success m-2 fs-6">
                      {discount}% off
                    </span>
                  </div>
                  <div className="card-body p-3">
                    <h6 className="fw-bold mb-1">{product.name}</h6>
                    <p className="text-muted small mb-2 text-truncate">{product.description}</p>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-success">⭐ {rating}</span>
                      <span className="text-muted small">{Math.floor(Math.random() * 900) + 100} reviews</span>
                    </div>
                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <span className="fw-bold fs-5 text-dark">{formatCurrency(product.price)}</span>
                      <span className="text-muted text-decoration-line-through">{formatCurrency(originalPrice)}</span>
                    </div>
                    <button className="btn btn-info w-100 fw-semibold" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Products;
