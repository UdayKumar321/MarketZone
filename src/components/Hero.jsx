function Hero({ onShop, onSell }) {
  return (
    <section className="hero-section py-5 text-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <p className="text-info fw-semibold mb-3 text-uppercase">MarketZone Marketplace</p>
            <h1 className="display-4 fw-bold mb-4">
              Build your store. Grow your sales. Simplify every order.
            </h1>
            <p className="lead text-white-70 mb-4">
              A premium shopping experience for buyers and sellers with clean design,
              powerful product tools, and seamless order management.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button className="btn btn-info btn-lg text-dark fw-semibold" onClick={onShop}>
                Start Shopping
              </button>
              <button className="btn btn-outline-light btn-lg" onClick={onSell}>
                Become a Seller
              </button>
            </div>
          </div>
          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="hero-image shadow-lg rounded-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
                alt="Marketplace overview"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
