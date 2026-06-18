import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import { formatCurrency } from "../utils/formatCurrency";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (token) checkWishlist(data.id);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const checkWishlist = (productId) => {
    fetch(`${API_BASE}/wishlist/check/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setInWishlist(data))
      .catch(() => {});
  };

  const toggleWishlist = () => {
    if (!token) { navigate("/login"); return; }
    setWishlistLoading(true);

    if (inWishlist) {
      fetch(`${API_BASE}/wishlist/remove/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          setInWishlist(false);
          setMessage("Removed from wishlist");
          setTimeout(() => setMessage(""), 2000);
        })
        .finally(() => setWishlistLoading(false));
    } else {
      fetch(`${API_BASE}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.imageUrl,
          productCategory: product.category,
        }),
      })
        .then(() => {
          setInWishlist(true);
          setMessage("Added to wishlist! ❤️");
          setTimeout(() => setMessage(""), 2000);
        })
        .finally(() => setWishlistLoading(false));
    }
  };

  const getRating = (id) => {
    const ratings = [3.5, 3.8, 4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.8, 5.0];
    return ratings[id % ratings.length];
  };

  const getDiscount = (id) => {
    const discounts = [5, 10, 15, 20, 25, 30, 35, 40];
    return discounts[id % discounts.length];
  };

  const getOriginalPrice = (price, discount) =>
    Math.round(price / (1 - discount / 100));

  const addToCart = () => {
    if (!token) { navigate("/login"); return; }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setMessage("Added to cart!");
    setTimeout(() => setMessage(""), 2500);
  };

  const buyNow = () => {
    addToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status"></div>
        <p className="mt-3 text-muted">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <p className="fs-1">😕</p>
        <p className="text-muted fs-5">Product not found.</p>
        <button className="btn btn-info" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  const discount = getDiscount(product.id);
  const originalPrice = getOriginalPrice(product.price, discount);
  const rating = getRating(product.id);
  const reviewCount = ((product.id * 137) % 900) + 100;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating;
      return (
        <span key={i} style={{ color: half || filled ? "#f9a825" : "#ccc", fontSize: "1.1rem" }}>
          {filled ? "★" : half ? "★" : "☆"}
        </span>
      );
    });
  };

  return (
    <section className="container py-5">
      <button
        className="btn btn-link text-muted p-0 mb-4 d-flex align-items-center gap-1"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      {message && (
        <div className="alert alert-success fade show mb-4">✅ {message}</div>
      )}

      <div className="row g-5">
        {/* Left — Image */}
        <div className="col-md-5">
          <div
            className="rounded-4 overflow-hidden border shadow-sm d-flex align-items-center justify-content-center bg-light"
            style={{ minHeight: "380px" }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-100"
                style={{ maxHeight: "420px", objectFit: "contain", padding: "1rem" }}
              />
            ) : (
              <span style={{ fontSize: "6rem" }}>🛍️</span>
            )}
          </div>
          <div className="mt-3 d-flex gap-2">
            <span className="badge bg-success fs-6 px-3 py-2">{discount}% OFF</span>
            <span className="badge bg-info text-dark fs-6 px-3 py-2">In Stock</span>
          </div>
        </div>

        {/* Right — Info */}
        <div className="col-md-7">
          {product.category && (
            <span className="badge bg-light text-muted border mb-2">{product.category}</span>
          )}

          <div className="d-flex justify-content-between align-items-start">
            <h2 className="fw-bold mb-2 flex-grow-1">{product.name}</h2>
            <button
              className="btn border-0 p-1 ms-2"
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              style={{ fontSize: "1.8rem", lineHeight: 1 }}
            >
              {inWishlist ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-success px-2 py-1">⭐ {rating}</span>
            <span className="text-muted small">{reviewCount} ratings & reviews</span>
            <span className="text-muted">|</span>
            <span className="text-success small fw-semibold">Verified Purchase</span>
          </div>

          <div className="mb-3">
            <span className="fw-bold fs-2 text-dark">{formatCurrency(product.price)}</span>
            <span className="text-muted text-decoration-line-through ms-3 fs-5">
              {formatCurrency(originalPrice)}
            </span>
            <span className="text-success fw-semibold ms-2">
              You save {formatCurrency(originalPrice - product.price)}
            </span>
          </div>

          <hr />

          {product.sellerName && (
            <p className="text-muted small mb-3">
              Sold by: <span className="fw-semibold text-dark">{product.sellerName}</span>
            </p>
          )}

          <div className="d-flex align-items-center gap-3 mb-4">
            <label className="fw-semibold">Quantity:</label>
            <div className="d-flex align-items-center border rounded-pill overflow-hidden">
              <button
                className="btn btn-light px-3 py-1 border-0"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >−</button>
              <span className="px-3 fw-bold">{quantity}</span>
              <button
                className="btn btn-light px-3 py-1 border-0"
                onClick={() => setQuantity((q) => q + 1)}
              >+</button>
            </div>
          </div>

          <div className="d-flex gap-3 flex-wrap mb-4">
            <button
              className="btn btn-warning fw-bold px-4 py-2 flex-grow-1"
              onClick={buyNow}
            >
              🛒 Buy Now
            </button>
            <button
              className="btn btn-info fw-bold px-4 py-2 flex-grow-1"
              onClick={addToCart}
            >
              + Add to Cart
            </button>
          </div>

          <div className="bg-light rounded-3 p-3 mb-4">
            <div className="d-flex gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <span>🚚</span>
                <div>
                  <div className="fw-semibold small">Free Delivery</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>On orders above ₹500</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span>🔄</span>
                <div>
                  <div className="fw-semibold small">7 Day Returns</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Easy return policy</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span>🔒</span>
                <div>
                  <div className="fw-semibold small">Secure Payment</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>100% safe checkout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5">
        <ul className="nav nav-tabs">
          {["description", "specs", "reviews"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active fw-semibold" : "text-muted"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="border border-top-0 rounded-bottom p-4">
          {activeTab === "description" && (
            <p className="text-muted mb-0" style={{ lineHeight: 1.8 }}>
              {product.description || "No description available."}
            </p>
          )}
          {activeTab === "specs" && (
            <table className="table table-bordered mb-0">
              <tbody>
                <tr><td className="fw-semibold bg-light" style={{ width: "35%" }}>Category</td><td>{product.category || "—"}</td></tr>
                <tr><td className="fw-semibold bg-light">Price</td><td>{formatCurrency(product.price)}</td></tr>
                <tr><td className="fw-semibold bg-light">Availability</td><td><span className="text-success">In Stock</span></td></tr>
                <tr><td className="fw-semibold bg-light">Rating</td><td>⭐ {rating} / 5</td></tr>
                <tr><td className="fw-semibold bg-light">Sold By</td><td>{product.sellerName || "MarketZone Seller"}</td></tr>
              </tbody>
            </table>
          )}
          {activeTab === "reviews" && (
            <div>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="text-center">
                  <div className="display-4 fw-bold">{rating}</div>
                  <div>{renderStars(rating)}</div>
                  <div className="text-muted small">{reviewCount} reviews</div>
                </div>
                <div className="flex-grow-1 ms-4">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 45 : star === 4 ? 30 : star === 3 ? 15 : star === 2 ? 6 : 4;
                    return (
                      <div className="d-flex align-items-center gap-2 mb-1" key={star}>
                        <span className="small" style={{ width: "30px" }}>{star} ★</span>
                        <div className="progress flex-grow-1" style={{ height: "8px" }}>
                          <div className="progress-bar bg-success" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="small text-muted" style={{ width: "35px" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-muted text-center">Be the first to write a detailed review!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;