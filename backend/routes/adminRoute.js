import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  getSymptomRequests,
  reviewSymptomRequest,
  createAppointmentFromRequest,
  updateDoctor,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.get("/symptom-requests", authAdmin, getSymptomRequests);
adminRouter.put("/symptom-request/:id", authAdmin, reviewSymptomRequest);
adminRouter.post(
  "/symptom-request/:requestId/create-appointment",
  authAdmin,
  createAppointmentFromRequest,
);
adminRouter.put("/update-doctor/:docId", authAdmin, upload.single("image"), updateDoctor);
export default adminRouter;
