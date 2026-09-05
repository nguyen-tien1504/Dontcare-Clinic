import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "",
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [symptomRequests, setSymptomRequests] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const backendUrl = "http://localhost:4000";
  const backendBase = backendUrl ? String(backendUrl).replace(/\/$/, "") : "";

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendBase + "/api/admin/all-doctors",
        {},
        { headers: { aToken } },
      );
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllSpecialities = async () => {
    try {
      const { data } = await axios.get(backendBase + "/api/speciality/list", {
        headers: { aToken },
      });
      if (data.success) {
        setSpecialities(data.specialities);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendBase + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } },
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendBase + "/api/admin/appointments", {
        headers: { aToken },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendBase + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendBase + "/api/admin/dashboard", {
        headers: { aToken },
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  const getSymptomRequests = async () => {
    try {
      const { data } = await axios.get(backendBase + "/api/admin/symptom-requests", {
        headers: { aToken },
      });

      if (data.success) {
        setSymptomRequests(data.requests);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const reviewSymptomRequest = async (requestId, adminNote, speciality) => {
    try {
      const { data } = await axios.put(
        `${backendBase}/api/admin/symptom-request/${requestId}`,
        {
          adminNote,
          recommendedSpeciality: speciality,
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getSymptomRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createAppointmentFromRequest = async (requestId, docId, slotDate, slotTime) => {
    try {
      const { data } = await axios.post(
        `${backendBase}/api/admin/symptom-request/${requestId}/create-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: { aToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getSymptomRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    symptomRequests,
    getSymptomRequests,
    reviewSymptomRequest,
    createAppointmentFromRequest,
    specialities,
    getAllSpecialities,
  };

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
