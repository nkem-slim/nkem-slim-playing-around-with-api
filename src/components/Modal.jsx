import React from "react";
import { FiLoader } from "react-icons/fi";

const Modal = ({ show, onClose, onSubmit, children, loading, text, hide }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-lg p-6 w-full md:w-1/3 shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
        <div className="mt-4 flex justify-end">
          <button
            disabled={loading}
            onClick={onSubmit}
            className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 ${
              hide && "hidden"
            } ${loading && "opacity-70"}`}
          >
            {loading ? (
              <FiLoader className="animate-spin w-6 h-6" />
            ) : (
              <span>{text}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
