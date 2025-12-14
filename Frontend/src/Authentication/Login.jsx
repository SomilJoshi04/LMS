import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "./Authentication.css";
import Video from "../BackgroundVideos/Video";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

function Login({ setUserData, setIsAuthenticated }) {
  const navigate = useNavigate();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    role: "",
  });

  useGSAP(() => {
    gsap.from(".Container", {
      y: -300,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
    });

    gsap.from(".login-img", {
      x: -200,
      opacity: 0,
      duration: 0.8,
      delay: 0.9,
    });

    gsap.from(
      ".form-container , .form-container h2 , .form-container div, .form-container span",

      {
        x: 200,
        opacity: 0,
        duration: 0.8,
        delay: 0.9,
        stagger: 0.06,
      }
    );
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, role } = loginInfo;
    if (!email || !password || !role) {
      return handleError("Email, password and role are required");
    }
    try {
      const url = "https://lms-5-7p4k.onrender.com/auth/login";
    // const url = "http://localhost:4000/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, user } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("userId", user._id);

        setUserData(user);

        setTimeout(() => {
          setIsAuthenticated(true);
          navigate("/");
        }, 1000);
      } else {
        handleError("Login failed");
      }
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="Authentication">
      <div className="Container">
        <div className="login-img">
          <img
            src="/media/loginImg.avif"
            alt="loginImage"
          />
        </div>
        <div className="form-container">
          <h2>Login Account</h2>

          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email</label> <br />
              <input
                type="email"
                name="email"
                placeholder="Enter your Email-id"
                value={loginInfo.email}
                onChange={handleOnchange}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleOnchange}
              />
            </div>

            <div>
              <label>Select Role:</label>
              <select
                name="role"
                value={loginInfo.role}
                onChange={handleOnchange}
                className="select"
              >
                <option value="">-- Select --</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="Auth-btn">
              <button
                type="submit"
                // disabled={
                //   !loginInfo.email || !loginInfo.password || !loginInfo.role
                // }
              >
                Submit
              </button>

              <span>
                Don't have an account?{" "}
                <Link to={"/signup"} className="link">
                  Signup
                </Link>
              </span>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Login;
