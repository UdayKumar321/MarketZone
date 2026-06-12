import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import { formatCurrency } from "../utils/formatCurrency";

function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const increaseQty = (productId) => {
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decreaseQty = (productId) => {
    const updated = cart
      .map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (productId) => {
    const updated = cart.filter((item) => item.productId !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) {
      setError("Cart is empty!");
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      if (!response.ok) {
        setError("Failed to place order!");
        return;
      }

      localStorage.removeItem("cart");
      setCart([]);
      setMessage("Order placed successfully! 🎉");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-column flex-md-row">
        <div>
          <h2 className="fw-bold mb-1">🛒 My Cart</h2>
          <p className="text-muted">Review cart items and place your order securely.</p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Your cart is empty.</h4>
          <button className="btn btn-info mt-3" onClick={() => navigate("/products")}>Browse Products</button>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.productId}>
                        <td className="fw-semibold">{item.name}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => decreaseQty(item.productId)}>-</button>
                            <span>{item.quantity}</span>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => increaseQty(item.productId)}>+</button>
                          </div>
                        </td>
                        <td className="fw-bold text-info">{formatCurrency(item.price * item.quantity)}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.productId)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4 p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <h4 className="mb-0">
                Total: <span className="text-info">{formatCurrency(total)}</span>
              </h4>
              <button className="btn btn-info btn-lg fw-bold px-5" onClick={placeOrder}>Place Order 🎉</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
