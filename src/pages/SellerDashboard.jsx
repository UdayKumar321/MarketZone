import { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { formatCurrency } from "../utils/formatCurrency";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/products/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data || []))
      .catch((err) => console.error(err));

    fetch(`${API_BASE}/orders/seller`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data || []))
      .catch((err) => console.error(err));
  }, [token]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category);
    setImageUrl(product.imageUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("");
    setImageUrl("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = editingProduct
        ? `${API_BASE}/products/update/${editingProduct.id}`
        : `${API_BASE}/products/add`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price,
          stock,
          category,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save product");
        return;
      }

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === data.id ? data : p)));
        setSuccess("Product updated successfully!");
      } else {
        setProducts([...products, data]);
        setSuccess("Product added successfully!");
      }

      handleCancelEdit();
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/products/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
      setSuccess("Product deleted!");
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await fetch(`${API_BASE}/orders/status/${orderId}?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
      setSuccess("Order status updated!");
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    if (status === "PENDING") return "warning";
    if (status === "SHIPPED") return "info";
    if (status === "DELIVERED") return "success";
    return "secondary";
  };

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Seller Dashboard</h2>
        <p className="text-muted">Manage products and order status from one dashboard.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm p-4 mb-5">
        <h4 className="fw-bold mb-3">{editingProduct ? "✏️ Edit Product" : "Add New Product"}</h4>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="col-md-12">
              <textarea
                className="form-control"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            {imageUrl && (
              <div className="col-md-12">
                <img
                  src={imageUrl}
                  alt="preview"
                  className="img-fluid rounded"
                  style={{ height: "150px", objectFit: "cover" }}
                />
              </div>
            )}
            <div className="col-md-12 d-flex gap-3 flex-column flex-md-row">
              <button className="btn btn-info w-100 fw-bold">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                <button type="button" className="btn btn-secondary w-100 fw-bold" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="mb-4">
        <h4 className="fw-bold">My Products</h4>
      </div>
      <div className="row g-4 mb-5">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card shadow-sm h-100">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
              ) : (
                <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                  <span className="text-white fs-1">🛍️</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="fw-bold">{product.name}</h5>
                <p className="text-secondary">{product.description}</p>
                <p className="text-info fw-bold">{formatCurrency(product.price)}</p>
                <p className="text-muted">Stock: {product.stock}</p>
                <span className="badge bg-secondary">{product.category}</span>
              </div>
              <div className="card-footer d-flex gap-2">
                <button className="btn btn-warning w-100" onClick={() => handleEdit(product)}>✏️ Edit</button>
                <button className="btn btn-danger w-100" onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="fw-bold">Orders for My Products</h4>
      </div>
      <div className="d-flex flex-column gap-4">
        {orders.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          orders.map((order) => (
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
              <div className="card-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <span className="fw-bold">Total: <span className="text-info">{formatCurrency(order.totalPrice)}</span></span>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-sm btn-warning" onClick={() => updateStatus(order.id, "PENDING")}>PENDING</button>
                  <button className="btn btn-sm btn-info" onClick={() => updateStatus(order.id, "SHIPPED")}>SHIPPED</button>
                  <button className="btn btn-sm btn-success" onClick={() => updateStatus(order.id, "DELIVERED")}>DELIVERED</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default SellerDashboard;
