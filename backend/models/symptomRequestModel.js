import mongoose from "mongoose";

const symptomRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    symptoms: [
      {
        type: String,
        required: true,
      },
    ],

    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    duration: {
      type: String,
      default: "",
    },

    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],
      default: "Mild",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "REVIEWING",
        "CONSULTED",
        "APPOINTMENT_CREATED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    adminNote: {
      type: String,
      default: "",
    },

    recommendedSpeciality: {
      type: String,
      default: "",
    },

    recommendedDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      default: null,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const symptomRequestModel =
  mongoose.models.symptomRequest ||
  mongoose.model("symptomRequest", symptomRequestSchema);

export default symptomRequestModel;