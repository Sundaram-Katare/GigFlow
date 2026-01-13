import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/auth/authSlice";
import { hireBidAction } from "../features/bid/bidSlice";
import Navbar from "../components/Navbar";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, profile, loading } = useSelector((state) => state.auth);
  const { loading: bidLoading } = useSelector((state) => state.bid);
  const [expandedGigId, setExpandedGigId] = useState(null);

  useEffect(() => {
    if (user && !profile) {
      dispatch(fetchProfile());
    }
  }, [user, profile, dispatch]);

  const handleHire = (bidId) => {
    dispatch(hireBidAction(bidId)).then(() => {
      dispatch(fetchProfile()); // Refetch profile after hiring
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex items-center justify-center">
        <p className="text-white text-xl">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex flex-col px-4 sm:px-8 py-6">
        <Navbar />

        <div className="flex-1 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* User Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <p className="text-lg">{profile?.name || user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <p className="text-lg">{profile?.email || user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <p className="text-lg capitalize">{profile?.role || user.role}</p>
                </div>
              </div>
            </div>

            {/* Gigs Created */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Gigs Created ({profile?.gigs?.length || 0})</h2>
              {profile?.gigs?.length > 0 ? (
                <div className="space-y-4">
                  {profile.gigs.map((gig) => (
                    <div key={gig._id} className="bg-white/20 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{gig.title}</h3>
                          <p className="text-white/80 mt-1">{gig.description}</p>
                          <p className="text-yellow-300 font-medium mt-2">Budget: ${gig.budget}</p>
                          <p className={`text-sm font-medium mt-1 ${gig.status === 'open' ? 'text-green-300' : 'text-red-300'}`}>
                            Status: {gig.status}
                          </p>
                        </div>
                        {gig.status === 'open' && gig.bids?.length > 0 && (
                          <button
                            onClick={() => setExpandedGigId(expandedGigId === gig._id ? null : gig._id)}
                            className="mt-2 md:mt-0 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                          >
                            {expandedGigId === gig._id ? 'Hide Bids' : 'View Bids'}
                          </button>
                        )}
                      </div>
                      {expandedGigId === gig._id && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-white mb-2">Bids ({gig.bids.length})</h4>
                          <div className="space-y-2">
                            {gig.bids.map((bid) => (
                              <div key={bid._id} className="bg-white/10 rounded p-3 flex flex-col md:flex-row md:justify-between md:items-center">
                                <div className="flex-1">
                                  <p className="text-white font-medium">{bid.userId?.name || 'Unknown'}</p>
                                  <p className="text-white/80 text-sm">{bid.message}</p>
                                  <p className="text-yellow-300 font-medium">Price: ${bid.price}</p>
                                  <p className={`text-xs ${bid.status === 'pending' ? 'text-blue-300' : bid.status === 'hired' ? 'text-green-300' : 'text-red-300'}`}>
                                    Status: {bid.status}
                                  </p>
                                </div>
                                {bid.status === 'pending' && (
                                  <button
                                    onClick={() => handleHire(bid._id)}
                                    disabled={bidLoading}
                                    className="mt-2 md:mt-0 px-4 py-2 bg-[#006d5b] text-white rounded-md hover:bg-[#005a4a] disabled:opacity-50"
                                  >
                                    {bidLoading ? 'Hiring...' : 'Hire'}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/80">No gigs created yet.</p>
              )}
            </div>

            {/* Bids Made */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Bids Made ({profile?.bids?.length || 0})</h2>
              {profile?.bids?.length > 0 ? (
                <div className="space-y-4">
                  {profile.bids.map((bid) => (
                    <div key={bid._id} className="bg-white/20 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{bid.gigId?.title || 'Gig Title'}</h3>
                          <p className="text-white/80 mt-1">{bid.gigId?.description || 'Gig Description'}</p>
                          <p className="text-yellow-300 font-medium mt-2">Gig Budget: ${bid.gigId?.budget || 'N/A'}</p>
                          <p className="text-white/80 mt-1">Your Message: {bid.message}</p>
                          <p className="text-yellow-300 font-medium">Your Price: ${bid.price}</p>
                          <p className={`text-sm font-medium mt-1 ${bid.status === 'pending' ? 'text-blue-300' : bid.status === 'hired' ? 'text-green-300' : 'text-red-300'}`}>
                            Status: {bid.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/80">No bids made yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}