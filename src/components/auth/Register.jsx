import React, { useEffect, useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [churchName, setChurchName] = useState("");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      return;
    }

    if (!email.trim() || !password.trim() || !churchName.trim()) {
      setError("Fields must not be empty!");
      toast.error("fields must not be empty!");
      return;
    }

    const passwordValidate = (pwd) => {
      let re = {
        capital: /[A-Z]/,
        digit: /[0-9]/,
        small: /aeiou/,
        full: /^[@#][A-Za-z0-9]{7,15}$/,
      };

      return (
        re.capital.test(pwd) &&
        re.digit.test(pwd) &&
        !re.small.test(pwd) &&
        re.full.test(pwd)
      );
    };

    if (!passwordValidate(password)) {
      setError(
        "Password must include at least: \n - 1 Capital letter \n - 1 small letter \n - 1 special character (@ or #) \n - It should be alphanumeric \n - length must be between 8 and 15"
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add user data to Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        churchName: churchName,
      });

      setLoading(false);
      navigate("/"); // Navigate to home or welcome page
    } catch (error) {
      setError(error.message.slice(10, -1));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              className="block text-sm md:text-base font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              placeholder="churchmail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
              // required
            />
          </div>
          <div>
            <label
              className="block text-sm md:text-base font-medium mb-1"
              htmlFor="churchName"
            >
              Church Name
            </label>
            <input
              type="text"
              id="churchName"
              placeholder="Eg: CE Asese"
              value={churchName}
              onChange={(e) => setChurchName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
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
            <div className="flex items-center justify-between relative w              full border border-gray-300 px-3 py-2 rounded-lg shadow-sm active:outline-none active:ring focus:border-blue-300 text-sm md:text-base">
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
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 flex justify-center items-center transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <FiLoader className="animate-spin w-6 h-6" />
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="flex flex-col items-center text-sm mt-3">
          <span>Already have an account?</span>
          <Link
            className="underline underline-offset-1 text-blue-500"
            to={"/login"}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
