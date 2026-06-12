import { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { formatCurrency } from "../utils/formatCurrency";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const getStatusColor = (status) => {
    if (status === "PENDING") return "warning";
    if (status === "SHIPPED") return "info";
    if (status === "DELIVERED") return "success";
    return "secondary";
  };

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">My Orders</h2>
        <p className="text-muted">Track your purchase history and order status.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No orders found.</h4>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div className="card shadow-sm" key={order.id}>
              <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                <h5 className="mb-0">Order #{order.id}</h5>
                <span className={`badge bg-${getStatusColor(order.status)} fs-6`}>{order.status}</span>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-borderless mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product ID</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td>Product #{item.productId}</td>
                          <td>{item.quantity}</td>
                          <td className="text-info fw-bold">{formatCurrency(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                <span className="text-muted">Total Items: {order.items.length}</span>
                <span className="fw-bold fs-5">Total: <span className="text-info">{formatCurrency(order.totalPrice)}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;
