import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import "./Authentication.css";

function Signup() {
  const navigate = useNavigate();

  const [signupInfo, setSignupInfo] = useState({
    email: "",
    password: "",
    username: "",
    role: "",
    phone: "",
  });

  useGSAP(() => {
    gsap.from(".Container", {
      y: 300,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
    });

    gsap.from(".Signup-img", {
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
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, username, password, role, phone } = signupInfo;
    if (!username || !email || !password || !role || !phone) {
      return handleError(
        "username,email,password,role and phoneNo. are required"
      );
    }

    try {
      const url = "http://localhost:4000/auth/signup";
      const response = await fetch(url, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="Authentication">
      <div className="Container" style={{ marginBottom: "20px" }}>
        <div className="Signup-img">
          <img
            src="https://plus.unsplash.com/premium_vector-1683140971142-78df716a87c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI3fHx8ZW58MHx8fHx8"
            alt="SignupImage"
          />
        </div>
        <div className="form-container">
          <h2>Signup Account</h2>
          <form onSubmit={handleSignup}>
            <div>
              <label htmlFor="email">Email</label> <br />
              <input
                type="email"
                name="email"
                placeholder="Enter your Email-id"
                value={signupInfo.email}
                onChange={handleOnchange}
              />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <br />
              <input
                type="text"
                name="username"
                placeholder="Enter your Username"
                value={signupInfo.username}
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
                value={signupInfo.password}
                onChange={handleOnchange}
              />
            </div>

            <div>
              <label htmlFor="phone">Phone No.</label>
              <br />
              <input
                type="text"
                name="phone"
                placeholder="Enter your Phone No."
                value={signupInfo.phone}
                onChange={handleOnchange}
              />
            </div>

            <div>
              <label>Select Role:</label>
              <select
                name="role"
                value={signupInfo.role}
                onChange={handleOnchange}
                className="select"
              >
                <option value="">-- Select --</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="Auth-btn">
              <button type="submit">Submit</button>
              <span>
                Already have an account?{" "}
                <Link to={"/login"} className="link">
                  Login
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

export default Signup;
