import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "../Components/Loader/Loader";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [signupCredentials, setSignupCredentials] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  const signupHandler = async () => {
    setLoading((prev) => !prev);
    const email = signupCredentials.email;
    const firstname = signupCredentials.firstname;
    const lastname = signupCredentials.lastname;
    const password = signupCredentials.password;
    // const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.post(
        `https://moonshot-chartsapp.onrender.com/users/signup`,
        {
          email,
          firstname,
          lastname,
          password,
        }
      );
      if (response.status === 200 || response.status === 201) {
        setLoading((prev) => !prev);
        navigate("/login", { state });
      }

      return response.data;
    } catch (error) {
      console.error("in error", error);
      if (axios.isAxiosError(error)) {
        console.log("Thsi is axios error");
      }
      return error;
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100">
        <div className="bg-white shadow-xl rounded-xl w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-6 border-t-4 border-pink-500">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-center text-gray-700 cursor-pointer">
              Welcome to Roc8 Data Visualization
            </h2>
            <p className="mt-2 text-center text-pink-500 text-lg">Sign Up</p>
          </div>

          <div className="mt-6 space-y-4">
            {/* Email Input */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-1">Email:</label>
              <input
                type="email"
                placeholder="email"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                value={signupCredentials.email}
                onChange={(e) =>
                  setSignupCredentials({
                    ...signupCredentials,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-1">
                First Name:
              </label>
              <input
                type="text"
                placeholder="firstname"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                value={signupCredentials.firstname}
                onChange={(e) => {
                  setSignupCredentials({
                    ...signupCredentials,
                    firstname: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-1">
                Last Name:
              </label>
              <input
                type="text"
                placeholder="lastname"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                value={signupCredentials.lastname}
                onChange={(e) => {
                  setSignupCredentials({
                    ...signupCredentials,
                    lastname: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-1">
                Password:
              </label>
              <input
                type="password"
                placeholder="*********"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                value={signupCredentials.password}
                onChange={(e) => {
                  setSignupCredentials({
                    ...signupCredentials,
                    password: e.target.value,
                  });
                }}
              />
            </div>

            <button
              className="w-full py-3 mt-4 bg-pink-500 hover:bg-pink-400 text-white rounded-md shadow-lg transition duration-200"
              onClick={signupHandler}
            >
              Sign Up
            </button>
          </div>

          <p
            className="mt-6 text-center text-gray-500 cursor-pointer hover:text-pink-500 transition duration-150"
            onClick={() => navigate("/login", { state })}
          >
            Already have an account? Sign in
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
