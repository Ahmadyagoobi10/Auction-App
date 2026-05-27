import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../Utils/Auth";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav className="navbar">

    
      <div className="logo">
        <span>Aybilar</span>
      </div>

      
      <div className="nav-links">

        <Link to="/">Hem</Link>
        <Link to="/auctions">Auktioner</Link>
        <Link to="/about">Om oss</Link>
        <Link to="/contact">Kontakt</Link>

      </div>

      
      <button className="logout-btn" onClick={handleLogout}>
        Logga ut
      </button>

    </nav>
  );
}