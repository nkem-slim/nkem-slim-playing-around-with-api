import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Fields must not be empty!");
      toast.error("fields must not be empty!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError(error.message.slice(10, -1));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-2">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="churchmail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              // required
            />
          </div>
          <div>
            <label
              className="block text-sm md:text-base font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center justify-between relative w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm active:outline-none active:ring focus:border-blue-300 text-sm md:text-base">
              <input
                type={showPwd ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-none outline-none w-full"
                // required
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <Link
              to={`/forgot-password/${email || "enter-registered-email"}`}
              className="font-medium text-sm my-2 underline underline-offset-2 text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Forgot password ?
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 flex justify-center items-center transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? <FiLoader className="animate-spin w-6 h-6" /> : "Login"}
          </button>
        </form>

        <p className="flex flex-col items-center text-sm mt-3">
          <span>Don't have an account?</span>
          <Link
            className="underline underline-offset-1 text-blue-500"
            to={"/register"}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
