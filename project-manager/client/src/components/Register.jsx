import React, { useState } from "react";
import { Link, Navigate } from "react-router";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import { useAuth } from "../contexts/authContexts";

const Register = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRateLimited(false);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!isSigningUp) {
      setIsSigningUp(true);
      await doCreateUserWithEmailAndPassword(email, password)
        .then(() => {
          toast.success("Account created successfully!");
        })
        .catch((err) => {
          toast.error(err.message || "Sign up failed.");
          setIsSigningUp(false);
        });
    }
  };

  const onGoogleSignUp = (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      doSignInWithGoogle().catch((err) => {
        toast.error(err.message || "Google sign up failed.");
        setIsSigningUp(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="max-w-md w-full">
          {isRateLimited && <RateLimitedUI />}

          {!isRateLimited && (
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Register</h2>
                <form onSubmit={handleRegister}>
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
                  <div className="form-control mb-4">
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

                  {/* Confirm Password */}
                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter your password..."
                      className="input input-bordered"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="card-actions justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? "Registering..." : "Register"}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="divider my-4">or</div>

                {/* Login Link */}
                <div className="text-center">
                  <span>Already have an account? </span>
                  <Link to="/login" className="text-primary font-semibold">
                    Login
                  </Link>
                </div>

                {/* Google Sign Up */}
                <button
                  disabled={isSigningUp}
                  onClick={(e) => onGoogleSignUp(e)}
                  className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${
                    isSigningUp
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-100 transition duration-300 active:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_17_40)">
                      <path
                        d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                        fill="#34A853"
                      />
                      <path
                        d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_17_40">
                        <rect width="48" height="48" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {isSigningUp ? "Signing Up..." : "Continue with Google"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
