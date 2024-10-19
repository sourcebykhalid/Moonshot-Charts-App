import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Input from "@mui/joy/Input";
import { Button } from "@mui/joy";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Loader } from "../Components/Loader/Loader";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, setToken } = useAuth();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const { state } = location;

  const handleLogin = async () => {
    setLoading(true);
    const { email, password } = loginDetails;

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("userToken", response.data.token);
        setToken(response.data.token);
        const redirectURL = state?.from ? `/${state.from.search}` : "/";
        navigate(redirectURL);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="bg-gradient-to-r from-neutral-400 to-neutral-600 h-screen flex items-center justify-center">
      {loading && <Loader />}
      <Box className="bg-neutral-300 p-6 rounded-xl shadow-2xl w-full max-w-md">
        <Box className="flex flex-col items-center mb-6">
          <h3 className="text-3xl font-extrabold text-center text-gray-700 cursor-pointer">
            Roc8 Data Visualization
          </h3>
          <Typography className="text-center text-lg text-gray-600">
            Sign In
          </Typography>
        </Box>

        <Box className="flex flex-col gap-5">
          {/* Email Input */}
          <Box className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">
              Email:
            </label>
            <Input
              placeholder="username or email"
              size="md"
              variant="outlined"
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
              className="mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </Box>

          {/* Password Input */}
          <Box className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <Input
              placeholder="*********"
              size="md"
              variant="outlined"
              type="password"
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails({
                  ...loginDetails,
                  password: e.target.value,
                })
              }
              className="mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </Box>

          {/* Sign In Buttons */}
          <Button
            size="lg"
            variant="solid"
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-pink-400 hover:to-purple-400 transition-transform transform hover:scale-105"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Box>

        {/* Signup Link */}
        <Typography
          className="text-center text-sm mt-6 text-gray-600 hover:text-pink-500 cursor-pointer transition duration-200"
          onClick={() => navigate("/signup", { state })}
        >
          Don't have an account? Sign up
        </Typography>
      </Box>
    </div>
  );
};

export default Login;
