import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaArrowLeft, FaCheckDouble } from "react-icons/fa6";
import toast from "react-hot-toast";

const PlateNumberDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "phoneNumbers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching vehicle data: ", error);
        toast.error("Error fetching vehicle data.");
      }
      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  const handleCheckExit = async (isExited) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      const exitTime = isExited ? null : new Date();
      const vehicleRef = doc(db, "phoneNumbers", id);
      const historyRef = doc(db, "history", id);

      await updateDoc(vehicleRef, {
        exitedAt: exitTime,
      });

      await updateDoc(historyRef, {
        exitedAt: exitTime,
      });

      setVehicle((prev) => ({
        ...prev,
        exitedAt: exitTime,
      }));

      toast.success(`Vehicle marked as ${isExited ? "not exited" : "exited"}.`);
    } catch (error) {
      console.error("Error updating vehicle status: ", error);
      toast.error("Error updating vehicle status.");
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-6 px-2 h-screen">
      {vehicle ? (
        <div className="flex flex-col w-full md:w-[60%] shadow-md rounded divide-y mt-12">
          <div className="flex items-center justify-between mb-2 p-2 border-b">
            <p
              className="p-2 bg-blue-50 rounded-md cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </p>
            <h2 className="font-medium">Vehicle Details</h2>
          </div>
          <div className="grid grid-cols-1">
            <p className="grid grid-cols-4 items-center text-center w-full bg-blue-50 px-4 divide-x font-medium">
              <span className="py-2">Entry at</span>
              <span className="py-2">Exit at</span>
              <span className="py-2 col-span-2">Actions</span>
            </p>
            <p className="grid grid-cols-4 items-center text-center w-full px-4 divide-x border-b text-sm">
              <span className="py-2">
                {new Date(
                  vehicle.createdAt.seconds * 1000
                ).toLocaleTimeString()}
              </span>
              <span className="py-2">
                {vehicle.exitedAt
                  ? new Date(
                      vehicle.exitedAt.seconds * 1000
                    ).toLocaleTimeString()
                  : "-"}
              </span>
              <span className="flex col-span-2 justify-center">
                <span
                  className={`${
                    vehicle.exitedAt
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-rose-400 text-white shadow-md"
                  } text-nowrap rounded-md m-1 py-2 px-2 cursor-pointer flex items-center`}
                  onClick={() => handleCheckExit(!!vehicle.exitedAt)}
                >
                  {loadingIds.includes(id) ? (
                    <div className="loader small-loader"></div>
                  ) : vehicle.exitedAt ? (
                    "Uncheck as exited"
                  ) : (
                    "Check as exited"
                  )}
                </span>
              </span>
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2 p-2 border-b">
            <p
              className="p-2 bg-blue-50 rounded-md cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </p>
            <h2 className="font-medium">Vehicle Details</h2>
          </div>
          <p className="flex justify-center w-full">No vehicle data found.</p>
        </>
      )}
    </div>
  );
};

export default PlateNumberDetails;
