import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/authContexts";
import { doSignOut } from "../firebase/auth";

const Navbar = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Link
            to="/"
            className="btn btn-ghost text-2xl rounded-full text-blue-800"
          >
            cribs
          </Link>
        </div>

        <div className="navbar-end">
          {!userLoggedIn ? (
            <Link to="/login" className="btn btn-ghost rounded-full">
              <span>Login</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                doSignOut().then(() => {
                  navigate("/login");
                });
              }}
              className="text-sm text-blue-600 underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
