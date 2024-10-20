import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header>
      <nav className="shadow navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <h1 className="font-bold m-0">
            <Link to="/" className="text-dark text-decoration-none">
              Electron Investment App
            </Link>
          </h1>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto">
              <Link to="/" className="nav-link active">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
