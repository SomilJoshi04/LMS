import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar({ setUserData, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);


  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");

    toast.success("User Logout successfully!");
    setUserData(null);
    setIsAuthenticated(false);

    navigate("/login");
  };

  useGSAP(() => {
    gsap.from(".navbardiv , .nav-logo , .navlink , .logout-btn", {
      y: -40,
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      stagger: 0.21,
    });
  });

  return (
    <nav className="navbar">
      <div className="navbardiv">
        <div className="nav-logo">
          <Link to="/">LMS</Link>
        </div>

        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`nav-items ${isOpen ? "open" : ""}`}>
          <Link
            className="navlink"
            to="/profile"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-regular fa-user"></i> Profile
          </Link>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <ToastContainer />
      </div>
    </nav>
  );
}
