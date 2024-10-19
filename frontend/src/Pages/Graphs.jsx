import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BarChart from "../Components/BarChart"; // You can customize this component as needed
import LineChart from "../Components/LineChart"; // You can customize this component as needed
import { useAuth } from "../Context/AuthContext";
import { useFilter } from "../CustomHooks/useFilter";
import { useData } from "../Context/DataContext";
import { Loader } from "../Components/Loader/Loader";

const Graphs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locstate } = location;
  const { token, setToken } = useAuth();
  const { state, dispatch } = useData();
  const { filteredData } = useFilter();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loader, setLoader] = useState(true);

  // Function to generate URL with query parameters
  const generateURL = () => {
    const queryParams = new URLSearchParams();
    if (state.gender) queryParams.set("gender", state.gender);
    if (state.age) queryParams.set("age", state.age);
    if (state.dateFrom) queryParams.set("dateFrom", state.dateFrom);
    if (state.dateTo) queryParams.set("dateTo", state.dateTo);
    return `${window.location.pathname}${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
  };

  const handleFilterChange = (type, value) => {
    dispatch({
      type: type,
      payload: { [type.toLowerCase()]: value },
    });
    setCookie(type.toLowerCase(), value, 30);
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
    clearCookies();
  };

  const logoutHandler = () => {
    localStorage.removeItem("userToken");
    navigate("/login", { state: locstate });
    setToken(null);
  };

  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const clearCookies = () => {
    document.cookie = "gender=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "age=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "datefrom=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "dateto=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // Fetch initial data
  useEffect(() => {
    axios.get("http://localhost:5000/api/data").then((response) => {
      dispatch({
        type: "INITIAL_DATA_FETCH",
        payload: { data: response.data },
      });
      setLoader(false);
    });

    const queryParams = new URLSearchParams(location.search);
    const savedGender = queryParams.get("gender");
    const savedAge = queryParams.get("age");
    const savedDateFrom = queryParams.get("dateFrom");
    const savedDateTo = queryParams.get("dateTo");

    if (savedGender) {
      dispatch({ type: "GENDER", payload: { gender: savedGender } });
    }
    if (savedAge) {
      dispatch({ type: "AGE", payload: { age: savedAge } });
    }
    if (savedDateFrom) {
      dispatch({ type: "DATEFROM", payload: { datefrom: savedDateFrom } });
    }
    if (savedDateTo) {
      dispatch({ type: "DATETO", payload: { dateto: savedDateTo } });
    }
  }, [location.search]);

  useEffect(() => {
    const chartURL = generateURL();
    window.history.replaceState(null, null, chartURL);
  }, [state]);

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 min-h-screen flex flex-col items-center pt-4 text-gray-200">
      <div className="flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent border-b-2 border-r-4 border-fuchsia-600 px-2 rounded-md">
          Moonshot Chart
        </h1>
        {filteredData.length > 0 && (
          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white rounded-md px-6 md:px-12 py-2 mb-4 hover:bg-neutral-600 font-bold transition duration-200 md:absolute right-10"
          >
            Logout
          </button>
        )}
      </div>
      {loader && <Loader message="Loading data..." />}

      {filteredData.length > 0 && (
        <div className="bg-gray-800 p-8  shadow-2xl w-full max-w-3xl mb-8 flex flex-col justify-center items-center border-b-4 border-fuchsia-500 border-r-4 rounded-md">
          <div className="text-xl font-semibold mb-6 text-fuchsia-400 tracking-wide">
            Filter by gender, age, and date range:
          </div>

          <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center space-y-6 md:space-y-0 md:space-x-6">
            {/* Gender Filter */}
            <div className="w-full md:w-1/3">
              <div className="text-base font-medium mb-3 text-gray-300">
                Gender
              </div>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer transition-transform transform hover:scale-105">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={state.gender === "Male"}
                    onChange={() => handleFilterChange("GENDER", "Male")}
                    className="mr-2 accent-fuchsia-500 focus:ring-fuchsia-500"
                  />
                  <span className="text-gray-200">Male</span>
                </label>
                <label className="flex items-center cursor-pointer transition-transform transform hover:scale-105">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={state.gender === "Female"}
                    onChange={() => handleFilterChange("GENDER", "Female")}
                    className="mr-2 accent-fuchsia-500 focus:ring-fuchsia-500"
                  />
                  <span className="text-gray-200">Female</span>
                </label>
              </div>
            </div>

            {/* Age Filter */}
            <div className="w-full md:w-1/3">
              <div className="text-base font-medium mb-3 text-gray-300">
                Age
              </div>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer transition-transform transform hover:scale-105">
                  <input
                    type="radio"
                    name="age"
                    value="15-25"
                    checked={state.age === "15-25"}
                    onChange={() => handleFilterChange("AGE", "15-25")}
                    className="mr-2 accent-fuchsia-500 focus:ring-fuchsia-500"
                  />
                  <span className="text-gray-200">Age 15-25</span>
                </label>
                <label className="flex items-center cursor-pointer transition-transform transform hover:scale-105">
                  <input
                    type="radio"
                    name="age"
                    value=">25"
                    checked={state.age === ">25"}
                    onChange={() => handleFilterChange("AGE", ">25")}
                    className="mr-2 accent-fuchsia-500 focus:ring-fuchsia-500"
                  />
                  <span className="text-gray-200">Age {`>25`}</span>
                </label>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="w-full md:w-1/3">
              <div className="text-base font-medium mb-3 text-gray-300">
                Date Range
              </div>
              <div className="flex flex-col space-y-4">
                <label className="flex items-center text-gray-400">
                  From:
                  <input
                    type="date"
                    value={state.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("DATEFROM", e.target.value)
                    }
                    className="ml-2 bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-fuchsia-500 text-gray-200"
                  />
                </label>
                <label className="flex items-center text-gray-400">
                  To:
                  <input
                    type="date"
                    value={state.dateTo}
                    onChange={(e) =>
                      handleFilterChange("DATETO", e.target.value)
                    }
                    className="ml-2 bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-fuchsia-500 text-gray-200"
                  />
                </label>
                <div className="text-sm text-gray-500 text-center">
                  (Only from 01-10-2022 to 31-10-2022)
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="mt-8 bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white rounded-lg px-6 py-3 font-semibold text-lg transition-transform transform hover:scale-110 hover:shadow-lg"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Bar Chart Section */}
      {filteredData.length > 0 && (
        <div className="w-full max-w-2xl mb-6 mx-auto p-4 bg-white shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Bar Chart
          </h2>
          <BarChart
            onSelectFeature={setSelectedFeature}
            completeData={filteredData}
          />
        </div>
      )}

      {/* Line Chart Section */}
      {selectedFeature && (
        <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg border border-gray-200 mt-6 transition-all duration-200 ease-in-out">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Line Chart
          </h2>
          <LineChart
            feature={selectedFeature}
            onSelectFeature={setSelectedFeature}
            completeData={filteredData}
          />
        </div>
      )}
    </div>
  );
};

export default Graphs;
