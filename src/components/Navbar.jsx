import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow px-4 py-3">
      <div className="container-fluid">

        {/* Left Side */}
        <div className="d-flex align-items-center gap-4">
          <Link className="navbar-brand fw-bold fs-2 text-info m-0" to="/">
            MarketZone
          </Link>
          <Link className="nav-link text-light fw-semibold" to="/">
            Home
          </Link>
          {token && (
            <Link className="nav-link text-light fw-semibold" to="/products">
              Products
            </Link>
          )}
          {role === "SELLER" && (
            <Link className="nav-link text-light fw-semibold" to="/seller/dashboard">
              Dashboard
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <form className="d-flex w-25">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
          />
          <button className="btn btn-info">Search</button>
        </form>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {token ? (
            <>
              <span className="text-light fw-semibold fs-6">
                Hi, {name}!
              </span>

              {role === "CUSTOMER" && (
                <Link
                  className="btn btn-outline-light position-relative"
                  to="/cart"
                >
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {role === "CUSTOMER" && (
                <Link className="btn btn-outline-info" to="/orders">
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
              <Link
                className="btn btn-info text-dark fw-semibold"
                to="/register"
              >
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