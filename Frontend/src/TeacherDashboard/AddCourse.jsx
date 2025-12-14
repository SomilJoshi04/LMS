import React, { useRef, useState } from "react";
import axios from "axios";
import "./Add.css";
import { handleError, handleSuccess } from "../utils";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function AddCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    price: "",
  });

  const [modules, setModules] = useState([
    { title: "", content: "", videoUrl: "", duration: "" },
  ]);


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addCourseRef = useRef(null);

  useGSAP(() => {
    gsap.from(addCourseRef.current, {
      x: 200,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      stagger: 0.17,
    });

    gsap.from(".addContainer h2", {
      x: 200,
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
    });
  });

  const handleModuleChange = (index, e) => {
    const updated = [...modules];
    updated[index][e.target.name] = e.target.value;
    setModules(updated);
  };

  const addModule = () => {
    setModules([
      ...modules,
      { title: "", content: "", videoUrl: "", duration: "" },
    ]);
  };

  const removeModules = (index) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get teacher/user object from localStorage
      const userId = localStorage.getItem("userId");

      const payload = {
        ...formData,
        modules,
        createdBy: userId,
      };

      const response = await axios.post(
        "https://lms-5-7p4k.onrender.com/course/addCourse",
        payload
      );

      //  const response = await axios.post(
      //   "http://localhost:4000/course/addCourse",
      //   payload
      // );

      if (response.data.success) {
        handleSuccess(response.data.message);
        navigate("/Teacher")
        setFormData({
          title: "",
          description: "",
          thumbnail: "",
          createdBy: "",
          price: "",
        });

        setModules({ title: "", content: "", videoUrl: "", duration: "" });
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      // console.error(err);
      handleError(err.message);
    }
  };

  return (
    <div className="addContainer">
      <h2>Add New Course</h2>

      <form onSubmit={handleSubmit} ref={addCourseRef}>
        <label>Course Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Thumbnail URL</label>
        <input
          type="text"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleChange}
        />

        <label>Course Price</label>
        <input
          type="Number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />

        <h3>Modules</h3>

        {modules.map((module, index) => (
          <div key={index} className="Box">
            <label>Module Title</label>
            <input
              type="text"
              name="title"
              value={module.title}
              onChange={(e) => handleModuleChange(index, e)}
            />

            <label>Content</label>
            <textarea
              name="content"
              value={module.content}
              onChange={(e) => handleModuleChange(index, e)}
            />

            <label>Video URL</label>
            <input
              type="text"
              name="videoUrl"
              value={module.videoUrl}
              onChange={(e) => handleModuleChange(index, e)}
            />

            <label>Duration</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="duration"
              value={module.duration}
              onChange={(e) => handleModuleChange(index, e)}
            />

            {modules.length > 1 && (
              <button type="button" onClick={() => removeModules(index)}>
                Remove Module
              </button>
            )}
            
          </div>
        ))}

        <button type="button" onClick={addModule}>
          + Add Module
        </button>

        <button type="submit">Add Course</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddCourse;
