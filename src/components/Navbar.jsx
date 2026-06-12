import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  const [searchText, setSearchText] = useState("");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm py-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-4">
          <Link className="navbar-brand fw-bold fs-2 text-info" to="/">
            MarketZone
          </Link>
          <Link className="nav-link text-light fw-semibold" to="/">
            Home
          </Link>
          <Link className="nav-link text-light fw-semibold" to="/products">
            Products
          </Link>
          {role === "SELLER" && (
            <Link className="nav-link text-light fw-semibold" to="/seller/dashboard">
              Dashboard
            </Link>
          )}
        </div>

        <form className="d-flex align-items-center gap-2 flex-fill mx-4" onSubmit={handleSearch}>
          <input
            className="form-control rounded-pill px-3"
            type="search"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="btn btn-info rounded-pill px-4" type="submit">
            Search
          </button>
        </form>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {token ? (
            <>
              <span className="text-light fw-semibold ms-2">Hi, {name}!</span>
              {role === "CUSTOMER" && (
                <Link className="btn btn-outline-light position-relative" to="/cart">
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              {role === "CUSTOMER" && (
                <Link className="btn btn-outline-info text-light" to="/orders">
                  My Orders
                </Link>
              )}
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light" to="/login">
                Login
              </Link>
              <Link className="btn btn-info text-dark fw-semibold" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
