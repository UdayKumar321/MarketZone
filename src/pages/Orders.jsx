import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://marketzone-backend-production-a801.up.railway.app/orders/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    if (status === "PENDING") return "warning";
    if (status === "SHIPPED") return "info";
    if (status === "DELIVERED") return "success";
    return "secondary";
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">My Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">No orders yet!</h4>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => (
              <div className="card shadow" key={order.id}>
                <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                  <h5 className="mb-0">Order #{order.id}</h5>
                  <span className={`badge bg-${getStatusColor(order.status)} fs-6`}>
                    {order.status}
                  </span>
                </div>
                <div className="card-body">
                  <table className="table table-borderless">
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
                          <td className="text-info fw-bold">
                            ${item.price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <span className="text-muted">
                    Total Items: {order.items.length}
                  </span>
                  <span className="fw-bold fs-5">
                    Total: <span className="text-info">${order.totalPrice.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;