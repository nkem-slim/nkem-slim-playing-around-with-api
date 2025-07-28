import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h3 className="font-medium mb-4 bg-rose-50 py-2 px-6">
          Confirm Deletion
        </h3>
        <p className="mb-4 px-6 border-b pb-2">
          Are you sure you want to delete this entry?
        </p>
        <div className="flex justify-end gap-4 px-6 pb-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
