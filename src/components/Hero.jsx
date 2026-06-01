function Hero() {
  return (

    <div className="container py-5">

      <div className="row align-items-center">

        {/* Left Side */}

        <div className="col-lg-6">

          <h1 className="display-3 fw-bold">
            Build Your Dream Store Online
          </h1>

          <p className="lead text-secondary mt-4">
            welcom to our web clone
          </p>

          <div className="mt-4 d-flex gap-3">

            <button className="btn btn-info btn-lg fw-bold px-4">
              Get Started
            </button>

            <button className="btn btn-outline-light btn-lg px-4">
              Explore
            </button>

          </div>

        </div>

        {/* Right Side */}

        <div className="col-lg-6 text-center mt-5 mt-lg-0">

          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="hero"
            className="img-fluid rounded-4 shadow-lg"
          />

        </div>

      </div>

    </div>

  );
}

export default Hero;