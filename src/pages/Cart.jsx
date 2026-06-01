import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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

  // Increase quantity
  const increaseQty = (productId) => {
    const updated = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Decrease quantity
  const decreaseQty = (productId) => {
    const updated = cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Remove item
  const removeItem = (productId) => {
    const updated = cart.filter((item) => item.productId !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) {
      setError("Cart is empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        setError("Failed to place order!");
        return;
      }

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);
      setMessage("Order placed successfully! 🎉");
      setTimeout(() => navigate("/orders"), 2000);

    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">🛒 My Cart</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">Your cart is empty!</h4>
            <button
              className="btn btn-info mt-3"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="card shadow">
              <div className="card-body">
                <table className="table table-borderless align-middle">
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
                        <td>${item.price}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => decreaseQty(item.productId)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => increaseQty(item.productId)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold text-info">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeItem(item.productId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total and Place Order */}
            <div className="card shadow mt-4 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold">
                  Total: <span className="text-info">${total.toFixed(2)}</span>
                </h4>
                <button
                  className="btn btn-info btn-lg fw-bold px-5"
                  onClick={placeOrder}
                >
                  Place Order 🎉
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;