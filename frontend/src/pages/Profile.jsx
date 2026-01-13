import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/auth/authSlice";
import { hireBidAction } from "../features/bid/bidSlice";
import Navbar from "../components/Navbar";
import {
  User,
  Mail,
  Shield,
  Briefcase,
  Gavel,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import socket from "../socket";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, profile, loading } = useSelector((state) => state.auth);
  const { loading: bidLoading } = useSelector((state) => state.bid);
  const [expandedGigId, setExpandedGigId] = useState(null);

  useEffect(() => {
    if (user && !profile) dispatch(fetchProfile());
  }, [user, profile, dispatch]);

  useEffect(() => {
  if (user) {
    socket.emit('join', user.id);
  }
}, [user]);

  const handleHire = (bidId) => {
    dispatch(hireBidAction(bidId)).then(() => {
      toast.success("Hired successfully!");
      dispatch(fetchProfile());
    });
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex items-center justify-center">
        <p className="text-white text-xl">{loading ? "Loading..." : "Please log in to view your profile."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] px-4 sm:px-8 py-6">
      <Navbar />

      <div className="max-w-6xl mx-auto py-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#006d5b] flex items-center gap-2 mb-6">
            <User /> Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <User className="text-[#006d5b]" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold">{profile?.name || user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-[#006d5b]" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold">{profile?.email || user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="text-[#006d5b]" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold capitalize">{profile?.role || user.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#006d5b] flex items-center gap-2 mb-6">
            <Briefcase /> Gigs Created ({profile?.gigs?.length || 0})
          </h2>

          {profile?.gigs?.length ? (
            <div className="space-y-4">
              {profile.gigs.map((gig) => (
                <div key={gig._id} className="border rounded-xl p-5 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{gig.title}</h3>
                      <p className="text-gray-600">{gig.description}</p>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <DollarSign className="w-4 h-4" /> {gig.budget}
                        </span>

                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${gig.status === "open" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                          {gig.status}
                        </span>
                      </div>
                    </div>

                    {gig.status === "open" && gig.bids?.length > 0 && (
                      <button
                        onClick={() => setExpandedGigId(expandedGigId === gig._id ? null : gig._id)}
                        className="flex items-center gap-2 bg-[#006d5b] text-white px-4 py-2 rounded-lg"
                      >
                        {expandedGigId === gig._id ? <>Hide Bids <ChevronUp /></> : <>View Bids <ChevronDown /></>}
                      </button>
                    )}
                  </div>

                  {expandedGigId === gig._id && (
                    <div className="mt-6 space-y-3">
                      {gig.bids.map((bid) => (
                        <div key={bid._id} className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:justify-between gap-4">
                          <div>
                            <p className="font-semibold">{bid.userId?.name}</p>
                            <p className="text-gray-600 text-sm">{bid.message}</p>
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                              ${bid.price}
                            </span>
                          </div>

                          {bid.status === "pending" && (
                            <button
                              onClick={() => handleHire(bid._id)}
                              disabled={bidLoading}
                              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {bidLoading ? "Hiring..." : "Hire"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No gigs created yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#006d5b] flex items-center gap-2 mb-6">
            <Gavel /> Bids Made ({profile?.bids?.length || 0})
          </h2>

          {profile?.bids?.length ? (
            <div className="space-y-4">
              {profile.bids.map((bid) => (
                <div key={bid._id} className="border rounded-xl p-5 bg-gray-50">
                  <h3 className="text-xl font-semibold">{bid.gigId?.title}</h3>
                  <p className="text-gray-600">{bid.gigId?.description}</p>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Gig ${bid.gigId?.budget}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Your ${bid.price}
                    </span>
                    <span className="text-sm text-gray-600">{bid.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bids made yet.</p>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}