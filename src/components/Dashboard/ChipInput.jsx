import React, { useEffect } from "react";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

//not by me
const ChipInput = ({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);
  const [chips, setChips] = useState([]);

  useEffect(() => {
    if (editCourse) {
      try {
        const parsedTags = JSON.parse(course?.tag);
        setChips(parsedTags);
      } catch (error) {
        setChips(course?.tag);
      }
    }
    register(name, { required: true, validate: (value) => value.length > 0 });
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const chipValue = event.target.value.trim();
      if (!chips.includes(chipValue) && chipValue) {
        const chipValues = [...chips, chipValue];
        setChips(chipValues);
        event.target.value = "";
      }
    }
  };

  useEffect(() => {
    setValue(name, chips);
  }, [chips]);

  const handleDelete = (chip) => {
    const deleted = chips.filter((e) => e !== chip);
    setChips(deleted);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-row gap-2 my-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-white text-black px-2 py-1 gap-1 text-sm text-richblack-5"
          >
            {/* Render the chip value */}
            {chip}
            {/* Render the button to delete the chip */}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDelete(chip)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="form-style w-full bg-[#D3E3FD] text-black py-2 px-3 rounded-lg focus:outline-none"
      />
    </div>
  );
};

export default ChipInput;
