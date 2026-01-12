import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

const jobs = [
    {
        title: "Logo Design for Startup",
        description: "Create a modern logo for a tech startup.",
        budget: 150
    },
    {
        title: "React Landing Page",
        description: "Develop a responsive landing page using React and Tailwind.",
        budget: 300
    },
    {
        title: "Social Media Content Pack",
        description: "Design 10 Instagram posts with engaging visuals.",
        budget: 120
    },
    {
        title: "E-commerce Backend API",
        description: "Build secure REST APIs for product and order management.",
        budget: 500
    },
    {
        title: "SEO Blog Writing",
        description: "Write 5 keyword-optimized blog posts for marketing.",
        budget: 200
    },
    {
        title: "Mobile App UI Mockups",
        description: "Design clean UI mockups for a food delivery app.",
        budget: 250
    },
    {
        title: "Data Scraping Script",
        description: "Create a Node.js scraper for product listings.",
        budget: 180
    },
    {
        title: "Video Editing Project",
        description: "Edit a 5-minute promotional video with transitions.",
        budget: 220
    }
];

export default function Jobs() {
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
                            {jobs.length} Active Jobs
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-16">
                        {jobs.map((job, index) => (
                            <JobCard
                                key={index}
                                title={job.title}
                                description={job.description}
                                budget={`$${job.budget}`}
                                status="open"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
