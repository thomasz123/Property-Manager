import React, { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";

const PORT = import.meta.env.VITE_PORT;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsRateLimited(false);

    // try {
    //   const res = await axios.post(`http://localhost:${PORT}/api/auth/login`, {
    //     email,
    //     password,
    //   });

    //   toast.success("Logged in successfully!");
    //   // Do your post-login logic here (e.g., redirect)
    // } catch (error) {
    //   console.error(error);
    //   if (error.response?.status === 429) {
    //     setIsRateLimited(true);
    //     toast.error("Too many login attempts. Please try again later.");
    //   } else {
    //     toast.error("Login failed. Check your credentials.");
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="max-w-md w-full">
          {isRateLimited && <RateLimitedUI />}

          {!isRateLimited && (
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Login</h2>
                <form onSubmit={handleLogin}>
                  {/* Email */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email..."
                      className="input input-bordered"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password..."
                      className="input input-bordered"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="card-actions justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="divider my-4">or</div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span>Don't have an account? </span>
                  <Link to="/signup" className="text-primary font-semibold">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
