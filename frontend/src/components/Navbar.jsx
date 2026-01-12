
export default function Navbar() {
    return (
        <>
            <nav className="bg-transparent flex justify-between px-4 py-2 mx-2 text-black">
                <div className="flex jsutify-center items-center">
                    <h1 className="text-4xl font-semibold text-white">GigFlow</h1>
                </div>

                <div className="flex justify-center items-center">
                    <h2 className="text-white font-regular text-3xl">Jobs</h2>
                </div>

                <div className="flex justify-center items-center">
                    <button className="px-2 py-1 rounded-lg text-center text-white bg-green-800">
                        Signin
                    </button>
                </div>
            </nav>
        </>
    )
}