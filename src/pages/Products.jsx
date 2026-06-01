import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/products/all")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "" || p.category === category;
    return matchSearch && matchCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  // Generate random rating between 3.5 and 5
  const getRating = (id) => {
    const ratings = [3.5, 3.8, 4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.8, 5.0];
    return ratings[id % ratings.length];
  };

  // Generate random discount between 5% and 40%
  const getDiscount = (id) => {
    const discounts = [5, 10, 15, 20, 25, 30, 35, 40];
    return discounts[id % discounts.length];
  };

  // Calculate original price
  const getOriginalPrice = (price, discount) => {
    return Math.round(price / (1 - discount / 100));
  };

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-dark text-white py-3">
        <div className="container">
          <h4 className="mb-0 fw-bold">🛍️ All Products</h4>
        </div>
      </div>

      <div className="container py-4">

        {message && (
          <div className="alert alert-success alert-dismissible">
            ✅ {message}
          </div>
        )}

        {/* Search and Filter */}
        <div className="row mb-4 g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-info border-0">🔍</span>
              <input
                type="text"
                className="form-control border-0 shadow-sm"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select shadow-sm border-0"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status"></div>
            <p className="mt-2 text-muted">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <p className="fs-1">😕</p>
            <p className="text-muted fs-5">No products found!</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => {
              const discount = getDiscount(product.id);
              const originalPrice = getOriginalPrice(product.price, discount);
              const rating = getRating(product.id);

              return (
                <div className="col-md-3" key={product.id}>
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{ borderRadius: "12px", overflow: "hidden" }}
                  >
                    {/* Discount Badge */}
                    <div className="position-relative">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="card-img-top"
                          style={{ height: "220px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bg-light d-flex align-items-center justify-content-center"
                          style={{ height: "220px" }}
                        >
                          <span className="fs-1">🛍️</span>
                        </div>
                      )}
                      <span
                        className="position-absolute top-0 start-0 badge bg-success m-2 fs-6"
                      >
                        {discount}% off
                      </span>
                    </div>

                    <div className="card-body p-3">
                      <h6 className="fw-bold mb-1">{product.name}</h6>
                      <p
                        className="text-muted small mb-2"
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="d-flex align-items-center gap-1 mb-2">
                        <span className="badge bg-success">
                          ⭐ {rating}
                        </span>
                        <span className="text-muted small">
                          ({Math.floor(Math.random() * 900) + 100} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold fs-5 text-dark">
                          ₹{product.price}
                        </span>
                        <span className="text-muted text-decoration-line-through small">
                          ₹{originalPrice}
                        </span>
                      </div>

                      <span className="badge bg-secondary mt-1">
                        {product.category}
                      </span>
                    </div>

                    <div className="card-footer border-0 bg-white p-3">
                      <button
                        className="btn btn-info w-100 fw-semibold"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        style={{ borderRadius: "8px" }}
                      >
                        {product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
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

export default Products;