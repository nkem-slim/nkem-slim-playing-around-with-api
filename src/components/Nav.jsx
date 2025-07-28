import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import ConfirmLogout from "./ConfirmLogout";
import { signOut } from "firebase/auth";

const Nav = ({ isOpen, toggleNav }) => {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      setShowLogoutModal(false);
    } catch (error) {
      toast.error("Error signing out");
      console.error("Error signing out: ", error);
    }
  };

  const navVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Vehicle", path: "/all-vehicles" },
    { name: "History", path: "/history" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <motion.div
      className={`fixed top-0 left-0 h-full w-full bg-black/30 md:bg-transparent`}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={navVariants}
    >
      <motion.nav
        className="h-full w-64 bg-blue-800 text-white pt-12 z-40 shadow-md"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={navVariants}
      >
        <div
          className="absolute top-4 left-4 z-50 cursor-pointer text-2xl text-slate-200"
          onClick={toggleNav}
        >
          <FaTimes />
        </div>
        <ul className="py-4 space-y-1 border-y">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className={`p-4 ${
                location.pathname === link.path ? "bg-blue-900" : "bg-blue-800"
              } hover:bg-blue-900 transition-all duration-300`}
            >
              <Link
                to={link.path}
                className="block text-white"
                onClick={toggleNav}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={toggleLogoutModal}
          className="bg-red-500 text-white py-2 px-3 rounded my-4 mx-4"
        >
          Logout
        </button>
      </motion.nav>
      {showLogoutModal && (
        <ConfirmLogout
          toggleLogoutModal={toggleLogoutModal}
          handleLogout={handleLogout}
        />
      )}
    </motion.div>
  );
};

export default Nav;
