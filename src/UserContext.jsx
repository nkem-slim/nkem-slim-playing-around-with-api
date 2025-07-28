import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const [plateNumbers, setPlateNumbers] = useState([]);
  const [exitCount, setExitCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveToLocalStorage = (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    };

    const removeFromLocalStorage = (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Failed to remove from localStorage", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        saveToLocalStorage("currentUser", { uid: user.uid });

        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
          saveToLocalStorage("userData", userData);
        }

        // Fetch plate numbers associated with the user
        const q = query(
          collection(db, "phoneNumbers"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const plateNumbersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlateNumbers(plateNumbersData);
        // Update exit count
        const exitedCount = plateNumbersData.filter(
          (plate) => plate.exitedAt
        ).length;
        setExitCount(exitedCount);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setPlateNumbers([]);
        setExitCount(0);
        removeFromLocalStorage("currentUser");
        removeFromLocalStorage("userData");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshPlateNumbers = async () => {
    if (currentUser) {
      const q = query(
        collection(db, "phoneNumbers"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const plateNumbersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlateNumbers(plateNumbersData);

      // Update exit count
      const exitedCount = plateNumbersData.filter(
        (plate) => plate.exitedAt
      ).length;
      setExitCount(exitedCount);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        userData,
        setUserData,
        plateNumbers,
        loading,
        refreshPlateNumbers,
        exitCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
