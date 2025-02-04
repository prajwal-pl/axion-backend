import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import DashboardRoute from "./routes/dashboard.route";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/dashboard", DashboardRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
