import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import specialityRouter from "./routes/specialityRoute.js";
import path from "path";
//app configuration
const app = express();
const port = process.env.PORT || 4000;
connectDB();
// try {
//     await connectCloudinary()
//     console.log('Cloudinary configured')
// } catch (err) {
//     console.warn('Cloudinary not configured:', err.message)
// }

//middlewares(Built-in middleware)
app.use(express.json());
app.use(cors());

// Biến thư mục 'uploads' thành thư mục công khai (Static Folder)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//API endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/speciality", specialityRouter);
app.get("/", (req, res) => {
  res.send("API is Working Great");
});

app.listen(port, () => console.log("Server is started", port));
