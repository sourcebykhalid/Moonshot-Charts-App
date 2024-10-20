import express from "express";
import cors from "cors";
import XLSX from "xlsx";
import dotenv from "dotenv";
import userroute from "./Routes/users.route.js";
import connectionFunc from "./DatabaseConnection/database.connection.js";

dotenv.config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: [
    "https://moonshot-datavista-408h.onrender.com",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cross-Origin-Resource-Policy",
  ],
  exposedHeaders: ["Cross-Origin-Resource-Policy"],
};
app.use(cors(corsOptions));

connectionFunc();

const workbook = XLSX.readFile("./data.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

app.get("/api/data", (req, res) => {
  res.json(data);
});

app.use("/users", userroute);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello World boys!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
