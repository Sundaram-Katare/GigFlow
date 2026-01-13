export default function JobCard({ title, description, budget, status, hasBid, onBidClick }) {
  return (
    <>
      <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between gap-6 hover:shadow-xl transition">
        <div className="flex flex-col gap-2">
          <h1 className="text-black text-lg sm:text-xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-600 max-w-md">{description}</p>
          <div className="mt-2 inline-flex items-center">
            <span className="text-xs uppercase tracking-wide text-gray-500 mr-2">Budget</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              ${budget}
            </span>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4">
          <span
            className={`${
              status === "open" ? "bg-orange-500" : "bg-red-600"
            } text-white px-4 py-1 rounded-full text-sm capitalize font-medium`}
          >
            {status}
          </span>
          <button
            onClick={onBidClick}
            disabled={hasBid}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              hasBid
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-700 text-white hover:scale-105"
            }`}
          >
            {hasBid ? "Already Bid" : "Bid"}
          </button>
        </div>
      </div>
    </>
  );
}