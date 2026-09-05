import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const symptoms = [
  "Đau đầu",
  "Chóng mặt",
  "Sốt",
  "Ho",
  "Đau họng",
  "Khó thở",
  "Đau ngực",
  "Đau bụng",
  "Buồn nôn",
  "Nôn",
  "Tiêu chảy",
  "Táo bón",
  "Đau lưng",
  "Đau khớp",
  "Phát ban",
  "Ngứa",
  "Mệt mỏi",
  "Mất ngủ",
  "Đau mắt",
  "Đau tai",
];

const SymptomCheck = () => {
  const { token, backendBase } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const submitRequest = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Vui lòng đăng nhập trước");
      navigate("/login");
      return;
    }

    if (selectedSymptoms.length === 0) {
      toast.error("Vui lòng chọn ít nhất một triệu chứng");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendBase}/api/user/symptom-request`,
        {
          symptoms: selectedSymptoms,
          description,
          duration,
          severity,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success("Đã gửi yêu cầu tư vấn");
        navigate("/my-symptom-requests");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Tư vấn triệu chứng
        </h1>

        <p className="text-gray-500 mt-2">
          Hãy cung cấp thông tin về các triệu chứng bạn đang gặp phải.
          Nhân viên phòng khám sẽ xem xét và hỗ trợ bạn lựa chọn bác sĩ
          phù hợp.
        </p>
      </div>

      <form
        onSubmit={submitRequest}
        className="bg-white border rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-medium mb-4">
          1. Bạn đang gặp triệu chứng nào?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {symptoms.map((symptom) => (
            <label
              key={symptom}
              className={`border rounded-lg p-3 cursor-pointer transition ${
                selectedSymptoms.includes(symptom)
                  ? "border-primary bg-blue-50"
                  : "border-gray-200 hover:border-primary"
              }`}
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
              />

              {symptom}
            </label>
          ))}
        </div>

        <div className="mt-8">
          <label className="block font-medium mb-2">
            2. Triệu chứng xuất hiện bao lâu?
          </label>

          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ví dụ: 2 ngày, 1 tuần..."
            className="w-full border rounded-lg p-3 outline-primary"
          />
        </div>

        <div className="mt-6">
          <label className="block font-medium mb-3">
            3. Mức độ triệu chứng
          </label>

          <div className="flex gap-6">
            {[
              ["Mild", "Nhẹ"],
              ["Moderate", "Trung bình"],
              ["Severe", "Nặng"],
            ].map(([value, label]) => (
              <label key={value} className="flex gap-2 items-center">
                <input
                  type="radio"
                  value={value}
                  checked={severity === value}
                  onChange={(e) => setSeverity(e.target.value)}
                />

                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block font-medium mb-2">
            4. Mô tả thêm
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={2000}
            placeholder="Mô tả chi tiết tình trạng của bạn..."
            className="w-full border rounded-lg p-3 outline-primary resize-none"
          />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-600">
          Thông tin này được sử dụng để nhân viên phòng khám xem xét
          và hỗ trợ lựa chọn bác sĩ phù hợp. Đây không phải là kết quả
          chẩn đoán y khoa.
        </div>

        <button
          disabled={loading}
          className="mt-6 bg-primary text-white px-8 py-3 rounded-full"
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
        </button>
      </form>
    </div>
  );
};

export default SymptomCheck;