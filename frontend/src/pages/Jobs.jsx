import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGigs } from "../features/gig/gigSlice";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

export default function Jobs() {
  const dispatch = useDispatch();
  const { gigs, loading, error } = useSelector((state) => state.gig);

  useEffect(() => {
    dispatch(fetchAllGigs());
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex flex-col px-4 sm:px-8 py-6">
        <Navbar />

        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-6">
            <h1 className="text-white font-bold text-3xl sm:text-4xl">
              Open Gigs Feed
            </h1>

            <div className="bg-white rounded-full px-6 py-2 text-sm font-medium text-[#006d5b] shadow-md w-fit">
              {gigs?.length || 0} Active Jobs
            </div>
          </div>

          {loading && (
            <p className="text-white text-center">Loading gigs...</p>
          )}

          {error && (
            <p className="text-red-300 text-center">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-16">
            {gigs &&
              gigs.map((job) => (
                <JobCard
                  key={job._id}
                  title={job.title}
                  description={job.description}
                  budget={`$${job.budget}`}
                  status={job.status || "open"}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}