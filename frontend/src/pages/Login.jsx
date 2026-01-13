import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthState } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/profile");
    dispatch(login(formData));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-[#006d5b] to-[#a8f0c2] flex flex-col px-4 sm:px-8 py-6">
        <Navbar />

        <div className="flex flex-1 items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-10">

            {/* Left side: form */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Welcome Back!
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="px-4 py-2 rounded-md outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password" className="text-white mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="px-4 py-2 rounded-md outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 bg-[#006d5b] text-white font-semibold rounded-md disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {error && (
                  <p className="text-red-300 text-sm text-center mt-2">
                    {error}
                  </p>
                )}

                {success && user && (
                  <p className="text-green-300 text-sm text-center mt-2">
                    Welcome {user.name} 🎉
                  </p>
                )}

                <p className="text-sm text-white text-center mt-3">
                  Don't have an account?{" "}
                  <p onClick={() => navigate("/signup")} className="cursor-pointer text-yellow-400 font-semibold">
                    Signup
                  </p>
                </p>
              </form>
            </div>

            {/* Right side: image + text */}
            <div className="hidden md:flex flex-col justify-center items-center text-center space-y-4">
              <img
                src="https://static.vecteezy.com/system/resources/previews/011/315/482/non_2x/illustration-of-data-analysis-concepts-working-women-work-with-laptops-free-png.png"
                alt="Login illustration"
                className="w-72 object-contain"
              />
              <p className="text-white text-lg font-medium">
                Your next opportunity starts with a simple Login
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}