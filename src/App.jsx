import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import PlateRecognition from "./components/PlateRecognition";
import WelcomePage from "./components/WelcomePage";
import Nav from "./components/Nav";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { Toaster } from "react-hot-toast";
import AllVehicles from "./components/AllVehicles";
import History from "./components/History";
import PlateNumberDetails from "./components/PlateNumberDetails";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import Settings from "./components/Settings";

function App() {
  const location = useLocation();

  // Regular expression to match dynamic paths like /plate-number/:id
  const hideHeaderRegex = /^\/plate-number\/[^/]+$/;

  const hideForPwdReset = /^\/forgot-password\/[^/]+$/;

  // Define the paths where the Header should be hidden
  const hideHeaderPaths = ["/login", "/register"];
  // Check if the current path matches any of the hideHeaderPaths or the regex
  const shouldHideHeader =
    hideHeaderPaths.includes(location.pathname) ||
    hideHeaderRegex.test(location.pathname) ||
    hideForPwdReset.test(location.pathname);

  return (
    <div className="App">
      <Toaster />
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password/:email"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-new"
          element={
            <ProtectedRoute>
              <PlateRecognition />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-vehicles"
          element={
            <ProtectedRoute>
              <AllVehicles />
            </ProtectedRoute>
          }
        />
        <Route path="/plate-number/:id" element={<PlateNumberDetails />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
