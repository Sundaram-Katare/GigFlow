import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGigs, addGig } from "../features/gig/gigSlice.js";
import { fetchProfile } from "../features/auth/authSlice.js";
import { createBidAction } from "../features/bid/bidSlice.js";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import BidModal from "../components/BidModal";
import AddGigModal from "../components/AddGigModal";
import toast, { Toaster } from "react-hot-toast";

export default function Jobs() {
  const dispatch = useDispatch();
  const { gigs, loading, error } = useSelector((state) => state.gig);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [showAddGigModal, setShowAddGigModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllGigs());
    dispatch(fetchProfile());
  }, [dispatch]);

  const filteredGigs = gigs?.filter((gig) =>
    gig.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleBidSubmit = async (bidData) => {
    try {
      await dispatch(createBidAction({ gigId: selectedGig._id, ...bidData }));
      toast.success("Bid placed successfully!");
      dispatch(fetchAllGigs());
    } catch (error) {
      toast.error("Failed to place bid.");
    }
  };

  const handleAddGigSubmit = async (gigData) => {
    try {
      await dispatch(addGig(gigData));
      toast.success("Gig posted successfully!");
      dispatch(fetchAllGigs());
    } catch (error) {
      toast.error("Failed to post gig.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex flex-col px-4 sm:px-8 py-6">
        <Navbar />
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-6">
            <h1 className="text-white font-bold text-3xl sm:text-4xl">Open Gigs Feed</h1>
            <div className="bg-white rounded-full px-6 py-2 text-sm font-medium text-[#006d5b] shadow-md w-fit">
              {filteredGigs.length} Active Jobs
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search gigs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => setShowAddGigModal(true)}
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition"
            >
              Add Gig
            </button>
          </div>
          {loading && <p className="text-white text-center">Loading gigs...</p>}
          {error && <p className="text-red-300 text-center">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-16">
            {filteredGigs.map((gig) => {
              const hasBid = user?.bids?.some((bid) => bid.gig === gig._id);
              return (
                <JobCard
                  key={gig._id}
                  title={gig.title}
                  description={gig.description}
                  budget={gig.budget}
                  status={gig.status || "open"}
                  hasBid={hasBid}
                  onBidClick={() => {
                    setSelectedGig(gig);
                    setShowBidModal(true);
                  }}
                />
              );
            })}
          </div>
        </div>
        <BidModal
          isOpen={showBidModal}
          onClose={() => setShowBidModal(false)}
          onSubmit={handleBidSubmit}
          gig={selectedGig}
        />
        <AddGigModal
          isOpen={showAddGigModal}
          onClose={() => setShowAddGigModal(false)}
          onSubmit={handleAddGigSubmit}
        />
        <Toaster position="top-right" />
      </div>
    </>
  );
}