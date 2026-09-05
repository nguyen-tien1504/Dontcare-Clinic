import React, { useContext } from "react";
import { specialityData } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  const { specialities } = useContext(AppContext);
  
  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-gray-800 mt-4"
      id="speciality">
      <h1 className="text-3xl font-medium">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted Doctors. <br />
        So,Schedule Your appointment Now.
      </p>
      <div className="flex sm:justify-center gap-3 pt-5 w-full overflow-scroll ">
        {specialities.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            key={index}
            to={`/doctors/${item._id}`}>
            <img
              className="w-16 sm:w-24 mb-2"
              src={item.image}
              alt=""
            />
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
