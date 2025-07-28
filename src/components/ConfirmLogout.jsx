import React from "react";

const ConfirmLogout = ({ handleLogout, toggleLogoutModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50 z-[999]">
      <div className="border bg-white text-black p-6 rounded-md shadow-md">
        <h2 className="text-lg font-medium mb-4">Confirm Logout</h2>
        <p className="mb-4">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={toggleLogoutModal}
            className="bg-gray-500 text-white py-1 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-1 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;
