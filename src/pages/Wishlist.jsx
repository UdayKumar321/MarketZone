import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import { formatCurrency } from "../utils/formatCurrency";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchWishlist();
  }, []);

  const fetchWishlist = () => {
    setLoading(true);
    fetch(`${API_BASE}/wishlist/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setWishlist(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const removeFromWishlist = (productId, productName) => {
    fetch(`${API_BASE}/wishlist/remove/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
        setMessage(`${productName} removed from wishlist`);
        setTimeout(() => setMessage(""), 2000);
      })
      .catch((err) => console.error(err));
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((c) => c.productId === item.productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: item.productId,
        name: item.productName,
        price: item.productPrice,
        quantity: 1,
        imageUrl: item.productImage,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setMessage(`${item.productName} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  const getDiscount = (id) => {
    const discounts = [5, 10, 15, 20, 25, 30, 35, 40];
    return discounts[id % discounts.length];
  };

  const getOriginalPrice = (price, discount) =>
    Math.round(price / (1 - discount / 100));

  return (
    <section className="container py-5">
      <h4 className="fw-bold mb-1">❤️ My Wishlist</h4>
      <p className="text-muted mb-4">
        {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
      </p>

      {message && (
        <div className="alert alert-success fade show mb-4">✅ {message}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
          <p className="mt-3 text-muted">Loading wishlist...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-5">
          <p style={{ fontSize: "4rem" }}>💔</p>
          <h5 className="fw-bold mb-2">Your wishlist is empty</h5>
          <p className="text-muted mb-4">Save items you love and buy them later</p>
          <button className="btn btn-info px-4" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map((item) => {
            const discount = getDiscount(item.productId);
            const originalPrice = getOriginalPrice(item.productPrice, discount);
            return (
              <div className="col-sm-6 col-xl-3" key={item.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="position-relative">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="card-img-top"
                        style={{ height: "220px", objectFit: "cover", cursor: "pointer" }}
                        onClick={() => navigate(`/products/${item.productId}`)}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "220px", cursor: "pointer" }}
                        onClick={() => navigate(`/products/${item.productId}`)}
                      >
                        <span className="fs-1">🛍️</span>
                      </div>
                    )}
                    <span className="position-absolute top-0 start-0 badge bg-success m-2">
                      {discount}% off
                    </span>
                    <button
                      className="position-absolute top-0 end-0 btn btn-light m-2 rounded-circle p-1 lh-1"
                      style={{ width: "32px", height: "32px" }}
                      onClick={() => removeFromWishlist(item.productId, item.productName)}
                      title="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="card-body p-3">
                    <h6
                      className="fw-bold mb-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.productName}
                    </h6>
                    {item.productCategory && (
                      <span className="badge bg-light text-muted border small mb-2">
                        {item.productCategory}
                      </span>
                    )}
                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <span className="fw-bold fs-5">{formatCurrency(item.productPrice)}</span>
                      <span className="text-muted text-decoration-line-through small">
                        {formatCurrency(originalPrice)}
                      </span>
                    </div>
                    <button
                      className="btn btn-info w-100 fw-semibold"
                      onClick={() => addToCart(item)}
                    >
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

export default Wishlist;