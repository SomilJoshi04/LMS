import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Authentication.css";

function LoginRemainder() {
  const navigate = useNavigate();
  const [showRemainder, setShowRemainder] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      if (!token && !showRemainder) {
        setShowRemainder(true);
        toast.info(
          <div>
            <p>You are not logged in! Click to Login</p>

            <div className="loginRemainder-btn">
              <button
                className="btn-1"
                onClick={() => {
                  toast.dismiss();
                  navigate("/login");
                }}
              >
                Login
              </button>

              <button
                className="btn-2"
                onClick={() => {
                  toast.dismiss();
                  setShowRemainder(false);
                }}
              >
                Cancle
              </button>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: false, // stays until user acts
            closeOnClick: false,
            draggable: false,
          }
        );
      }
    };

    // Show first reminder after 10s
    const firstTimer = setTimeout(checkLogin, 10000);

    // Keep reminding every 60s if not logged in
    const interval = setInterval(() => {
      checkLogin();
    }, 60000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [navigate, showRemainder]);

  return null;
}

export default LoginRemainder;
