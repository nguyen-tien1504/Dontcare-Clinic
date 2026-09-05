import React, { useContext, useEffect, useMemo, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const SymptomRequests = () => {
  const {
    aToken,
    symptomRequests,
    getSymptomRequests,
    createAppointmentFromRequest,
    doctors,
    getAllDoctors,
  } = useContext(AdminContext);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [speciality, setSpeciality] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (aToken) {
      getSymptomRequests();
      getAllDoctors();
    }
  }, [aToken]);

  useEffect(() => {
    if (selectedRequest) {
      setSpeciality(selectedRequest.recommendedSpeciality || "");
      setDoctorId(selectedRequest.recommendedDoctorId?._id || "");
      setAdminNote(selectedRequest.adminNote || "");
      setSlotDate("");
      setSlotTime("");
    }
  }, [selectedRequest]);

  const specialityList = useMemo(() => {
    return [...new Set(doctors.map((doctor) => doctor.speciality))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!speciality) return doctors;

    return doctors.filter((doctor) => doctor.speciality === speciality);
  }, [doctors, speciality]);

  const selectedDoctor = useMemo(() => {
    return doctors.find((doctor) => doctor._id === doctorId);
  }, [doctors, doctorId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "REVIEWING":
        return "bg-blue-100 text-blue-700";

      case "CONSULTED":
        return "bg-purple-100 text-purple-700";

      case "APPOINTMENT_CREATED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "Severe":
        return "bg-red-100 text-red-600";

      case "Moderate":
        return "bg-orange-100 text-orange-600";

      default:
        return "bg-green-100 text-green-600";
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case "Severe":
        return "Nặng";

      case "Moderate":
        return "Trung bình";

      default:
        return "Nhẹ";
    }
  };

  const generateSlots = () => {
    if (!selectedDoctor || !slotDate) return [];

    const slots = [];

    const start = new Date(`${slotDate}T09:00:00`);
    const end = new Date(`${slotDate}T17:00:00`);

    while (start < end) {
      const time = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      slots.push(time);

      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };

  const handleCreateAppointment = async () => {
    if (!selectedRequest) return;

    if (!doctorId || !slotDate || !slotTime) {
      alert("Vui lòng chọn đầy đủ bác sĩ, ngày và giờ khám.");
      return;
    }

    await createAppointmentFromRequest(
      selectedRequest._id,
      doctorId,
      slotDate,
      slotTime,
      adminNote,
      speciality,
    );

    setSelectedRequest(null);
  };

  return (
    <div className="w-full p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Yêu cầu tư vấn triệu chứng
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Xem thông tin triệu chứng bệnh nhân, tư vấn và sắp xếp lịch khám với bác sĩ phù
          hợp.
        </p>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ================= LEFT ================= */}
        <div className="xl:col-span-1 bg-white border rounded-xl overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-gray-700">Danh sách yêu cầu</h2>

            <p className="text-xs text-gray-400 mt-1">
              Tổng: {symptomRequests?.length || 0} yêu cầu
            </p>
          </div>

          <div className="max-h-[75vh] overflow-y-auto">
            {symptomRequests?.length === 0 && (
              <div className="p-10 text-center text-gray-400 text-sm">
                Chưa có yêu cầu tư vấn nào.
              </div>
            )}

            {symptomRequests?.map((request) => {
              const active = selectedRequest?._id === request._id;

              return (
                <div
                  key={request._id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 border-b cursor-pointer transition ${
                    active ? "bg-blue-50 border-l-4 border-l-primary" : "hover:bg-gray-50"
                  }`}>
                  {/* patient */}
                  <div className="flex justify-between gap-2">
                    <div className="flex gap-3">
                      <img
                        src={request.userId?.image || "https://via.placeholder.com/40"}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-medium text-gray-800">
                          {request.userId?.name || "Không xác định"}
                        </p>

                        <p className="text-xs text-gray-400">
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleDateString("vi-VN")
                            : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`h-fit text-[11px] px-2 py-1 rounded-full font-medium ${getStatusStyle(
                        request.status,
                      )}`}>
                      {request.status}
                    </span>
                  </div>

                  {/* symptoms */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {request.symptoms?.slice(0, 3).map((symptom, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {symptom}
                      </span>
                    ))}

                    {request.symptoms?.length > 3 && (
                      <span className="text-xs text-gray-400 px-1 py-1">
                        +{request.symptoms.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${getSeverityStyle(
                        request.severity,
                      )}`}>
                      {getSeverityText(request.severity)}
                    </span>

                    <span className="text-xs text-gray-400">{request.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="xl:col-span-2">
          {!selectedRequest ? (
            <div className="bg-white border rounded-xl min-h-[500px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-5xl mb-3">🩺</div>

                <p className="font-medium text-gray-600">Chọn một yêu cầu</p>

                <p className="text-sm mt-1">
                  Chọn bệnh nhân bên trái để xem chi tiết và tư vấn.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* PATIENT INFORMATION */}
              <div className="bg-white border rounded-xl p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Thông tin bệnh nhân</h2>

                <div className="flex gap-4 items-center">
                  <img
                    src={
                      selectedRequest.userId?.image || "https://via.placeholder.com/64"
                    }
                    className="w-16 h-16 rounded-full object-cover"
                    alt=""
                  />

                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedRequest.userId?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {selectedRequest.userId?.email}
                    </p>

                    <p className="text-sm text-gray-500">
                      {selectedRequest.userId?.phone || "Chưa có số điện thoại"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SYMPTOM */}
              <div className="bg-white border rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">Thông tin triệu chứng</h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getSeverityStyle(
                      selectedRequest.severity,
                    )}`}>
                    {getSeverityText(selectedRequest.severity)}
                  </span>
                </div>

                <div className="mb-5">
                  <p className="text-sm text-gray-500 mb-2">Triệu chứng</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.symptoms?.map((symptom, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-primary px-3 py-1.5 rounded-lg text-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-sm text-gray-400">Thời gian xuất hiện</p>

                    <p className="mt-1 font-medium text-gray-700">
                      {selectedRequest.duration || "Không cung cấp"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Ngày gửi</p>

                    <p className="mt-1 font-medium text-gray-700">
                      {new Date(selectedRequest.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Mô tả của bệnh nhân</p>

                  <div className="bg-gray-50 border rounded-lg p-4 text-gray-700 text-sm leading-6">
                    {selectedRequest.description ||
                      "Bệnh nhân không cung cấp mô tả thêm."}
                  </div>
                </div>
              </div>

              {/* ADMIN CONSULTATION */}
              <div className="bg-white border rounded-xl p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Tư vấn của Admin</h2>

                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Nhập ghi chú, lời khuyên hoặc thông tin cần thiết cho bệnh nhân..."
                  rows={5}
                  className="w-full border rounded-lg px-4 py-3 text-sm outline-primary resize-none"
                />
              </div>

              {/* DOCTOR */}
              <div className="bg-white border rounded-xl p-5">
                <h2 className="font-semibold text-gray-800 mb-5">
                  Lựa chọn bác sĩ phù hợp
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* speciality */}
                  <div>
                    <label className="text-sm text-gray-600">Chuyên khoa</label>

                    <select
                      value={speciality}
                      onChange={(e) => {
                        setSpeciality(e.target.value);
                        setDoctorId("");
                      }}
                      className="w-full mt-2 border rounded-lg px-3 py-3 outline-primary bg-white">
                      <option value="">Chọn chuyên khoa</option>

                      {specialityList.map((item, index) => (
                        <option
                          key={index}
                          value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* doctor */}
                  <div>
                    <label className="text-sm text-gray-600">Bác sĩ</label>

                    <select
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      className="w-full mt-2 border rounded-lg px-3 py-3 outline-primary bg-white">
                      <option value="">Chọn bác sĩ</option>

                      {filteredDoctors.map((doctor) => (
                        <option
                          key={doctor._id}
                          value={doctor._id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* selected doctor */}
                {selectedDoctor && (
                  <div className="mt-5 flex gap-4 border rounded-xl p-4 bg-gray-50">
                    <img
                      src={selectedDoctor.image}
                      alt=""
                      className="w-20 h-20 rounded-lg object-cover bg-blue-50"
                    />

                    <div>
                      <h3 className="font-medium text-gray-800">{selectedDoctor.name}</h3>

                      <p className="text-sm text-primary mt-1">
                        {selectedDoctor.speciality}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {selectedDoctor.degree}
                      </p>

                      <p className="text-xs text-gray-500">
                        Kinh nghiệm: {selectedDoctor.experience}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* APPOINTMENT */}
              <div className="bg-white border rounded-xl p-5">
                <h2 className="font-semibold text-gray-800 mb-5">Lịch khám</h2>

                <div className="mb-5">
                  <label className="text-sm text-gray-600">Ngày khám</label>

                  <input
                    type="date"
                    value={slotDate}
                    onChange={(e) => {
                      setSlotDate(e.target.value);
                      setSlotTime("");
                    }}
                    className="block mt-2 border rounded-lg px-4 py-3 outline-primary"
                  />
                </div>

                {doctorId && slotDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Chọn giờ khám</p>

                    <div className="flex flex-wrap gap-2">
                      {generateSlots().map((time, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSlotTime(time)}
                          className={`px-4 py-2 rounded-full text-sm border transition ${
                            slotTime === time
                              ? "bg-primary text-white border-primary"
                              : "border-gray-300 text-gray-600 hover:border-primary"
                          }`}>
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION */}
              <div className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>

                  <span
                    className={`inline-block mt-1 text-xs px-3 py-1 rounded-full ${getStatusStyle(
                      selectedRequest.status,
                    )}`}>
                    {selectedRequest.status}
                  </span>
                </div>

                <button
                  onClick={handleCreateAppointment}
                  disabled={selectedRequest.status === "APPOINTMENT_CREATED"}
                  className={`px-8 py-3 rounded-lg text-white transition ${
                    selectedRequest.status === "APPOINTMENT_CREATED"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:opacity-90"
                  }`}>
                  {selectedRequest.status === "APPOINTMENT_CREATED"
                    ? "Đã tạo lịch hẹn"
                    : "Tạo lịch hẹn"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomRequests;
