import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import symptomRequestModel from "../models/symptomRequestModel.js";
//API for registering the user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter the Valid Email id" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter the Strong Password!" });
    }

    //Hashing the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api for geting the user Informations

const getProfile = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api for updating the user informations (supports partial updates and image uploads)
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!userId) return res.json({ success: false, message: "User not identified" });

    // Build an update object only with provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;
    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (e) {
        // if address is already an object or invalid JSON, attempt to use as-is
        if (typeof address === "object") updateData.address = address;
      }
    }

    // If there are non-image fields to update, apply them
    if (Object.keys(updateData).length > 0) {
      await userModel.findByIdAndUpdate(userId, updateData);
    }

    // Handle image upload separately so user can update only image
    if (imageFile) {
      const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = uploadImage.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "User Info is Updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor is booked for another patient at this time.",
      });
    }
    let slots_booked = docData.slots_booked || {};

    // check if the slot is already booked; if not, record it
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message:
            "Doctor slot is booked for another patient at this time. Please choose another slot.",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      slotDate,
      slotTime,
      amount: docData.fees,
      date: Date.now(),
    };

    // extra safety: ensure no existing appointment was created concurrently
    const existing = await appointmentModel.findOne({ docId, slotDate, slotTime });
    if (existing) {
      return res.json({
        success: false,
        message: "Doctor slot is already booked. Please choose another slot.",
      });
    }

    try {
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
    } catch (err) {
      // handle duplicate key error from unique index
      if (err && err.code === 11000) {
        return res.json({
          success: false,
          message: "Doctor slot was just booked. Please choose another slot.",
        });
      }
      throw err;
    }

    // Atomically add the booked slot into doctor's slots_booked to avoid race conditions
    try {
      await doctorModel.findByIdAndUpdate(
        docId,
        { $addToSet: { [`slots_booked.${slotDate}`]: slotTime } },
        { upsert: true },
      );
    } catch (err) {
      console.log("Failed to update doctor slots_booked:", err);
    }
    res.json({ success: true, message: "Congrats.Appointment Booked Successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api for getting the user appointments for that my-appointments frontend page

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api for cancelling the appointment

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData)
      return res.json({ success: false, message: "Appointment not found" });

    // verify the user
    if (String(appointmentData.userId) !== String(userId)) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // free the booked slot on the doctor
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    if (doctorData) {
      const slots_booked = doctorData.slots_booked || {};
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
      }
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    res.json({ success: true, message: "Appointment Cancelled!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const createSymptomRequest = async (req, res) => {
  try {
    const userId = req.userId;

    const { symptoms, description, duration, severity } = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.json({
        success: false,
        message: "Please select at least one symptom",
      });
    }

    const request = new symptomRequestModel({
      userId,
      symptoms,
      description: description || "",
      duration: duration || "",
      severity: severity || "Mild",
    });

    await request.save();

    res.json({
      success: true,
      message: "Symptom request submitted successfully",
      request,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getMySymptomRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await symptomRequestModel.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  createSymptomRequest,
  getMySymptomRequests,
};
