import Navbar from "../components/Navbar";

export default function LandingPage() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex flex-col px-4 sm:px-8 py-6">
                <Navbar />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 flex-1 items-center">
                    <div className="flex flex-col justify-center space-y-6">
                        <h1 className="font-bold text-white text-3xl sm:text-4xl lg:text-5xl">
                            Smart Hiring Starts Here <span className="text-yellow-400">!!</span>
                        </h1>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                            Verified <span className="text-yellow-500">Freelancers</span>
                        </h2>

                        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <button className="px-6 py-3 bg-white text-[#006d5b] font-semibold rounded-md">
                                Get Started
                            </button>
                            <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-md">
                                Contact Us
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <img
                            src="https://png.pngtree.com/png-clipart/20250103/original/pngtree-young-girl-with-laptop-png-image_19496399.png"
                            alt=""
                            className="w-64 sm:w-[480px] lg:w-full"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
