import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../UserContext";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // Get the current user

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          // Query to fetch history data for the current user
          const q = query(
            collection(db, "history"),
            where("userId", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHistoryData(data);
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
      setLoading(false);
    };

    fetchHistoryData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <FiLoader className="w-24 h-24 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-6 px-2 w-full h-screen">
      <h2 className="mb-2 font-medium">History</h2>
      {historyData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full md:w-[60%] bg-white md:border rounded">
            <thead>
              <tr className="bg-gray-200 text-sm rounded-t divide-x divide-black/30 text-nowrap">
                <th className="py-2 px-4 text-start">Car ID</th>
                <th className="py-2 px-4 text-start">Entry Time</th>
                <th className="py-2 px-4 text-start">Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry, i) => (
                <tr
                  key={entry.id}
                  className={`divide-x divide-black/30 ${
                    i % 2 !== 0 && "bg-slate-100"
                  }`}
                >
                  <td className="py-2 px-4 text-sm">{entry.phoneNumber}</td>
                  <td className="py-2 px-4 text-sm">
                    {new Date(
                      entry?.createdAt?.seconds * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-sm">
                    {entry.exitedAt
                      ? new Date(entry.exitedAt.seconds * 1000).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No historical data available.</p>
      )}
    </div>
  );
};

export default History;
