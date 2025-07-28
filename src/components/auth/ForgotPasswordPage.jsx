import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // The email passed as params
  const { email } = useParams();

  useEffect(() => {
    setResetEmail(email ?? "");
  }, [email]);

  useEffect(() => {
    setError("");
    setMessage("");
  }, [resetEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setError("Email field can't be empty!");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError("Failed to send password reset email. Please try again.");
      console.error("Error sending password reset email: ", error);
    }

    setLoading(false);
  };

  return (
    <div className="w-full md:max-w-md flex h-screen justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="yourregistered@gmail.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring               focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 flex justify-center items-center transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? <FiLoader className="animate-spin w-6 h-6" /> : "Reset"}
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-700">
          Follow the link that will be sent to your email to reset your password
          safely.
        </p>
        <div className="flex flex-col items-center text-sm mt-2">
          <p>Remembered your password?</p>
          <Link
            to={"/login"}
            className="text-blue-500 hover:text-blue-600 underline underline-offset-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
