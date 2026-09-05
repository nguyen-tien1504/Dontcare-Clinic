import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const UpdateDoctor = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const {
    aToken,
    backendUrl,
    doctors,
    getAllDoctors,
  } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(false);
  const [oldImage, setOldImage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aToken && doctors.length === 0) {
      getAllDoctors();
    }
  }, [aToken]);

  useEffect(() => {
    if (!docId || doctors.length === 0) return;

    const doctor = doctors.find((doc) => doc._id === docId);

    if (!doctor) {
      toast.error("Không tìm thấy bác sĩ");
      return;
    }

    setName(doctor.name || "");
    setEmail(doctor.email || "");
    setSpeciality(doctor.speciality || "General physician");
    setDegree(doctor.degree || "");
    setExperience(doctor.experience || "1 Year");
    setFees(doctor.fees || "");
    setAbout(doctor.about || "");

    setOldImage(doctor.image || "");

    setAddress1(doctor.address?.line1 || "");
    setAddress2(doctor.address?.line2 || "");
  }, [docId, doctors]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (
      !name ||
      !email ||
      !speciality ||
      !degree ||
      !experience ||
      !fees ||
      !about ||
      !address1
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("docId", docId);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);

      formData.append(
        "address",
        JSON.stringify({
          line1: address1,
          line2: address2,
        })
      );

      // Chỉ gửi ảnh khi người dùng chọn ảnh mới
      if (docImg) {
        formData.append("image", docImg);
      }

      const { data } = await axios.put(
        `${backendUrl}/api/admin/update-doctor/${docId}`,
        formData,
        {
          headers: {
            aToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        await getAllDoctors();

        navigate("/doctor-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="m-5 w-full"
    >
      <p className="mb-3 text-lg font-medium">
        Cập nhật bác sĩ
      </p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* IMAGE */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer"
              src={
                docImg
                  ? URL.createObjectURL(docImg)
                  : oldImage
              }
              alt="Doctor"
            />
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
            accept="image/*"
          />

          <p>
            Thay đổi
            <br />
            ảnh bác sĩ
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* LEFT */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Tên bác sĩ</p>

              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Tên bác sĩ"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Email</p>

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Kinh nghiệm</p>

              <select
                onChange={(e) =>
                  setExperience(e.target.value)
                }
                value={experience}
                className="border rounded px-3 py-2"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Phí khám</p>

              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Phí khám"
                required
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Chuyên khoa</p>

              <select
                onChange={(e) =>
                  setSpeciality(e.target.value)
                }
                value={speciality}
                className="border rounded px-3 py-2"
              >
                <option value="General physician">
                  General physician
                </option>

                <option value="Gynecologist">
                  Gynecologist
                </option>

                <option value="Dermatologist">
                  Dermatologist
                </option>

                <option value="Pediatricians">
                  Pediatricians
                </option>

                <option value="Neurologist">
                  Neurologist
                </option>

                <option value="Gastroenterologist">
                  Gastroenterologist
                </option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Bằng cấp</p>

              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Bằng cấp"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Địa chỉ</p>

              <input
                onChange={(e) =>
                  setAddress1(e.target.value)
                }
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Địa chỉ 1"
                required
              />

              <input
                onChange={(e) =>
                  setAddress2(e.target.value)
                }
                value={address2}
                className="border rounded px-3 py-2 mt-2"
                type="text"
                placeholder="Địa chỉ 2"
              />
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-4">
          <p className="mb-2">
            Giới thiệu bác sĩ
          </p>

          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            placeholder="Thông tin về bác sĩ"
            rows={5}
            required
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={() => navigate("/doctor-list")}
            className="bg-gray-200 px-8 py-3 rounded-full text-gray-700"
          >
            Hủy
          </button>

          <button
            disabled={loading}
            type="submit"
            className={`bg-primary px-10 py-3 text-white rounded-full ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật bác sĩ"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateDoctor;