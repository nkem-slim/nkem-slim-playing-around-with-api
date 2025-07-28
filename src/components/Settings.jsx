import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../UserContext";
import { updatePassword } from "firebase/auth";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import { db } from "../firebase";

const Settings = () => {
  const { currentUser, userData, setUserData } = useAuth(); // assuming setUserData is available in the context to update the user data
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedChurchName, setEditedChurchName] = useState(
    userData?.churchName || ""
  );
  const [editedEmail, setEditedEmail] = useState(userData?.email || "");

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast.error("Password cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(currentUser, newPassword);
      toast.success("Password updated successfully!");
      setShowModal(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating password: ", error);
      toast.error(
        "Error updating password.\nLogout and Login again then retry."
      );
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      await updateDoc(userDocRef, {
        churchName: editedChurchName,
        email: editedEmail,
      });

      toast.success("Profile updated successfully!");

      // Update the user data in context/state
      setUserData((prevData) => ({
        ...prevData,
        churchName: editedChurchName,
        email: editedEmail,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedChurchName(userData?.churchName || "");
    setEditedEmail(userData?.email || "");
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Delete the user document from Firestore
      const userDocRef = doc(db, "Users", currentUser.uid);
      await deleteDoc(userDocRef);

      // Delete the user account from Firebase Authentication
      await currentUser.delete();

      toast.success("Account deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting account: ", error);
      toast.error("Error deleting account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {userData ? (
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg">
            {/* Profile Section */}
            <div className="flex flex-col items-center">
              <img
                src={
                  userData?.profilePicture ||
                  "https://images.pexels.com/photos/3025593/pexels-photo-3025593.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt="Profile"
                className="rounded-full h-24 w-24 mb-4 border-4"
              />
              {isEditing ? (
                <div className="flex flex-col items-center justify-center w-full">
                  <input
                    type="text"
                    ref={inputRef}
                    value={editedChurchName}
                    onChange={(e) => setEditedChurchName(e.target.value)}
                    className="border w-[250px] border-gray-300 rounded-lg px-1 py-1 mb-1 outline-none focus:border-blue-300 text-lg font-semibold text-[#0000f1] focus:border-2 transition-all duration-300"
                  />
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="border w-[175px] border-gray-300 rounded-lg px-2 py-1 outline-none focus:border-blue-300 text-sm  transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center text-center">
                  <h2 className="text-lg font-semibold text-[#0000f1] border-2 mb-1 p-1 border-transparent">
                    {userData?.churchName || "Church Name"}
                  </h2>
                  <p className="text-gray-600 text-sm border p-1 border-transparent">
                    {userData?.email || "user@example.com"}
                  </p>
                </div>
              )}
            </div>

            {/* Edit and Save Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 mt-2 border-t pt-2 text-sm">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? <FiLoader className="animate-spin" /> : "Save"}
                </button>
              </div>
            )}

            {/* Settings Sections */}
            <div className="mt-6 space-y-6">
              {/* Account Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-sm">Account Settings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Change Password</span>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setShowModal(true)}
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Two-Factor Authentication</span>
                    <button className="text-blue-500 hover:underline">
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-sm">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Email Notifications</span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>SMS Notifications</span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-sm">Privacy</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Profile Visibility</span>
                    <select className="border border-gray-300 rounded-md outline-none">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Search Visibility</span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-red-500 text-sm">
                  Danger Zone
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Delete Account</span>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Start editing button */}
            {!isEditing && (
              <div className="flex justify-end mt-2 border-t">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white mt-2 py-2 px-4 rounded hover:bg-blue-700 text-xs"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Modal for changing password */}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handlePasswordChange}
            loading={loading}
            text={"Submit"}
            hide={false}
          >
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-300 focus:border-2 transition-all duration-300"
              />
            </div>
          </Modal>

          {/* Modal for deleting account */}
          <Modal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSubmit={handleDeleteAccount}
            loading={loading}
            text="Delete"
            hide={true}
          >
            <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                disabled={loading}
              >
                {loading ? <FiLoader className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </Modal>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <FiLoader className="w-24 h-24 animate-spin" />
        </div>
      )}
    </>
  );
};

export default Settings;
