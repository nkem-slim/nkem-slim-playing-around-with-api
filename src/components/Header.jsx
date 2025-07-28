import React, { useState, useEffect, useCallback, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Nav from "./Nav";
import { useAuth } from "../UserContext";
import { db } from "../firebase";
import { FaSearch, FaTimes } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { FaAngleRight, FaSpinner } from "react-icons/fa6";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [termLoading, setTermLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    search && searchRef.current.focus();
  }, [search]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return (
      <p className="grid grid-cols-6 items-center text-nowrap justify-center text-center">
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>{" "}
        <span>{ampm}</span>
      </p>
    );
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const performSearch = async (term) => {
    if (term.trim() === "") {
      setTermLoading(false);
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    try {
      setTermLoading(true);
      const q = query(
        collection(db, "phoneNumbers"),
        where("userId", "==", currentUser.uid)
        // where("phoneNumber", ">=", term),
        // where("phoneNumber", "<=", term + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredResults = results.filter((result) =>
        result.phoneNumber.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(filteredResults);
      setTermLoading(false);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error searching documents: ", error);
      setTermLoading(false);
      setSearchPerformed(true);
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => performSearch(term), 500),
    []
  );

  useEffect(() => {
    setTermLoading(true);
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="h-[50px] md:h-[50px] px-2 shadow-md w-full flex justify-between items-center gap-2 sticky top-0 z-[999] bg-white">
      {!search && (
        <div className="flex items-center gap-2">
          <GiHamburgerMenu
            className="w-8 h-8 cursor-pointer col-span-1"
            onClick={toggleNav}
          />

          <p
            className="flex items-center gap-2 border py-2 px-4 md:py-2 rounded-full col-span-1 cursor-pointer"
            onClick={() => setSearch(true)}
          >
            <span className="text-sm">Search</span>
            <FaSearch className="opacity-75" />
          </p>
        </div>
      )}
      {search && (
        <div className="flex items-center border rounded-full w-full justify-between text-sm overflow-hidden">
          <div className="flex items-center w-[90%]">
            {termLoading && (
              <FaSpinner className="animate-spin ml-2 text-gray-500" />
            )}
            <input
              type="text"
              ref={searchRef}
              className="py-2 px-2 outline-none w-full"
              placeholder="Eg: KUJ-345UK"
              value={searchTerm.toLocaleLowerCase()}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p
            className="px-2 py-3 w-[10%] flex items-center justify-center bg-rose-50 text-rose-500 cursor-pointer"
            onClick={() => {
              setSearch(false);
              setSearchTerm("");
              setSearchResults([]);
              setSearchPerformed(false);
            }}
          >
            <FaTimes />
          </p>
        </div>
      )}

      <Nav isOpen={isOpen} toggleNav={toggleNav} />

      {!search && (
        <div className="grid grid-cols-5 items-center gap-2">
          <div className="flex items-center text-slate-600 gap-2 text-nowrap col-span-5">
            <p className="text-sm hidden md:flex">{formatDate(currentTime)}</p>
            <div className="text-sm">{formatTime(currentTime)}</div>
          </div>
        </div>
      )}

      {search &&
        searchPerformed &&
        !termLoading &&
        searchResults.length === 0 && (
          <div className="absolute h-screen bg-black/30 top-[50px] left-0 w-full p-2">
            <div className="w-full bg-white shadow-md border rounded p-4">
              <p className="text-center">No Plate Number found</p>
            </div>
          </div>
        )}

      {search && searchResults.length > 0 && (
        <div className="absolute h-screen bg-black/30 top-[50px] left-0 w-full p-2">
          <div className="w-full bg-white shadow-md border rounded">
            <ul>
              {searchResults.map((result) => (
                <Link to={`/plate-number/${result.id}`} key={result.id}>
                  <li
                    key={result.id}
                    className="p-2 border-b flex items-center justify-between"
                  >
                    {result.phoneNumber}
                    <FaAngleRight />
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
