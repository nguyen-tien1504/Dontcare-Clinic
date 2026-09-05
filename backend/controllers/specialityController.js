import specialityModel from "../models/specialityModel.js";

const getSpecialities = async (req, res) => {
  try {
    const specialities = await specialityModel.find({ active: true }).sort({ name: 1 });

    res.json({
      success: true,
      specialities,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const addSpeciality = async (req, res) => {
  try {
    const { name, code, description, image } = req.body;

    const speciality = await specialityModel.create({
      name,
      code,
      description,
      image,
    });

    res.json({
      success: true,
      message: "Them khoa thanh cong",
      speciality,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateSpeciality = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, image } = req.body;
    const speciality = await specialityModel.findByIdAndUpdate(
      id,
      { name, code, description, image },
      { new: true },
    );
    res.json({
      success: true,
      message: "Cap nhat khoa thanh cong",
      speciality,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
const deleteSpeciality = async (req, res) => {
  try {
    const { id } = req.params;
    const speciality = await specialityModel.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Xoa khoa thanh cong",
      speciality,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export { getSpecialities, addSpeciality, updateSpeciality, deleteSpeciality };
