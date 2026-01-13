import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, fetchProfile } from "../features/auth/authSlice";
import socket from "../socket";
import NotificationCenter from "./NotificationCenter";

export default function Navbar() {
  const { user, profile, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    dispatch(logout());
    socket.disconnect();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-transparent flex justify-between px-4 py-2 mx-2 text-black relative">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-semibold text-white">GigFlow</h1>
        </div>

        <div className="flex justify-center items-center">
          <h2 className="text-white font-regular cursor-pointer text-3xl"
              onClick={() => navigate("/jobs")}
          >Jobs</h2>
        </div>

        <div className="flex justify-center items-center gap-4">
          {user && <NotificationCenter />}
          {user ? (
            <>
              <button
                onClick={handleProfileClick}
                className="px-2 py-1 rounded-lg text-center text-white bg-green-800"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-2 py-1 rounded-lg text-center text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-2 py-1 rounded-lg text-center text-white bg-green-800"
            >
              Signin
            </button>
          )}
        </div>
      </nav>
    </>
  );
}