import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import {
  FaAngleRight,
  FaCheckDouble,
  FaClock,
  FaIdCard,
} from "react-icons/fa6";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

const AllVehicles = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);
  const [dateFilter, setDateFilter] = useState("Today");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "phoneNumbers"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const vehicleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicle data: ", error);
        toast.error("Error fetching vehicle data.");
      }
      setLoading(false);
    };

    if (currentUser) {
      fetchVehicles();
    }
  }, [currentUser]);

  const handleCheckExit = async (id, isExited) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      const vehicleRef = doc(db, "phoneNumbers", id);
      await updateDoc(vehicleRef, {
        exitedAt: isExited ? null : new Date(),
      });
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === id
            ? { ...vehicle, exitedAt: isExited ? null : new Date() }
            : vehicle
        )
      );
      toast.success(`Vehicle marked as ${isExited ? "not exited" : "exited"}.`);
    } catch (error) {
      console.error("Error updating vehicle status: ", error);
      toast.error("Error updating vehicle status.");
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  const filterVehicles = () => {
    if (dateFilter === "Today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return vehicles.filter(
        (vehicle) => new Date(vehicle.createdAt.seconds * 1000) >= today
      );
    }
    return vehicles;
  };

  const filteredVehicles = filterVehicles();

  return (
    <div className="w-full bg-white py-6 px-2 h-screen">
      <h2 className="mb-2 font-medium">All Vehicles</h2>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <FiLoader className="w-24 h-24 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2 md:w-[60%]">
            <p className="text-sm">
              List of entries:{" "}
              <span className="text-[#0000f1] font-semibold">
                {filteredVehicles.length}
              </span>
            </p>
            <select
              className="border border-gray-300 rounded-md p-1 outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
            </select>
          </div>
          <p className="text-xs">
            Click on any <b>Car ID</b> for quick actions.
          </p>
          <div className="flex flex-col w-full md:w-[60%] shadow-md rounded divide-y">
            <div className="grid grid-cols-3 items-center text-center w-full bg-gray-200 px-4 divide-x divide-black/30 font-medium">
              <span className="py-2 text-start text-sm px-2 flex items-center gap-3">
                Car ID <FaIdCard />
              </span>
              <span className="py-2 text-start text-sm px-2 flex items-center gap-3">
                Entry at <FaClock />
              </span>
              <span className="py-2 text-start text-sm px-2 flex items-center gap-3">
                Exit at <FaClock />
              </span>
            </div>

            {filteredVehicles.length > 0 ? (
              filteredVehicles
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="grid grid-cols-3 items-center text-center w-full px-4 divide-x border-b text-sm"
                  >
                    {/* <span className=""> */}
                    <span
                      className="text-nowrap rounded-md py-2 cursor-pointer flex items-center gap-2 col-span-1 justify-between pr-2 md:pr-5"
                      onClick={() => navigate(`/plate-number/${vehicle.id}`)}
                    >
                      {vehicle.phoneNumber} <FaAngleRight />
                    </span>
                    {/* </span> */}
                    <span className="py-2 flex items-center justify-start px-1">
                      {new Date(
                        vehicle.createdAt.seconds * 1000
                      ).toLocaleTimeString()}
                    </span>
                    <span className="py-2 flex items-center justify-start px-1">
                      {vehicle.exitedAt
                        ? new Date(
                            vehicle.exitedAt.seconds * 1000
                          ).toLocaleTimeString()
                        : "-"}
                    </span>
                  </div>
                ))
            ) : (
              <span
                colSpan="2"
                className="py-2 px-4 border-b text-center text-sm"
              >
                No entries for today.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllVehicles;
