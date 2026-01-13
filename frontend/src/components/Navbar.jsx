import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, fetchProfile } from "../features/auth/authSlice";

export default function Navbar() {
  const { user, profile, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    if (!profile && user) {
      dispatch(fetchProfile());
    }
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <nav className="bg-transparent flex justify-between px-4 py-2 mx-2 text-black relative">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-semibold text-white">GigFlow</h1>
        </div>

        <div className="flex justify-center items-center">
          <h2 className="text-white font-regular text-3xl">Jobs</h2>
        </div>

        <div className="flex justify-center items-center relative">
          {user ? (
            <button
              onClick={handleProfileClick}
              className="px-2 py-1 rounded-lg text-center text-white bg-green-800"
            >
              Profile
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-2 py-1 rounded-lg text-center text-white bg-green-800"
            >
              Signin
            </button>
          )}

          {dropdownOpen && profile && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-md shadow-lg p-4 z-10">
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Gigs Created:</strong> {profile.gigs?.length || 0}</p>
              {profile.gigs?.length > 0 && (
                <ul className="list-disc list-inside mb-2">
                  {profile.gigs.map((gig) => (
                    <li key={gig._id}>{gig.title || 'Gig Title'}</li>
                  ))}
                </ul>
              )}
              <p><strong>Bids Made:</strong> {profile.bids?.length || 0}</p>
              {profile.bids?.length > 0 && (
                <ul className="list-disc list-inside mb-2">
                  {profile.bids.map((bid) => (
                    <li key={bid._id}>{bid.price ? `$${bid.price}` : 'Bid price'}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={handleLogout}
                className="w-full mt-4 py-2 bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          )}
          {dropdownOpen && loading && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-md shadow-lg p-4 z-10">
              Loading...
            </div>
          )}
        </div>
      </nav>
    </>
  );
}