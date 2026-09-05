import express from "express";
import {
  addSpeciality,
  getSpecialities,
  updateSpeciality,
  deleteSpeciality,
} from "../controllers/specialityController.js";
import authAdmin from "../middlewares/authAdmin.js";

const specialityRouter = express.Router();

// Public
specialityRouter.get("/list", getSpecialities);

// Admin
specialityRouter.post("/add", authAdmin, addSpeciality);
specialityRouter.put("/update/:id", authAdmin, updateSpeciality);
specialityRouter.delete("/delete/:id", authAdmin, deleteSpeciality);

export default specialityRouter;