import { useState, useEffect } from "react";
import { FaArrowLeft, FaUserPlus, FaUserTie, FaEnvelope, FaPhone } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import toast from "react-hot-toast";
import api from "../../../utils/api";
import AdminDesktopSidebar from "../AdminDesktopSidebar";

function EditFaculty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    email: "",
    password: "",
    phone: "",
    baseSalary: "",
    travelAllowance: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const departments = [
    "Computer Engineering",
    "AIDS Engineering",
    "ECS Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ];

  const designations = [
    "HoD",
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "External Examiner",
  ];

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setFetching(true);

        const res = await api.get(`/admin/faculty/getSingle/${id}`);
        const faculty = res.data;

        setFormData({
          name: faculty.name || "",
          department: faculty.department || "",
          designation: faculty.designation || "",
          email: faculty.email || "",
          password: "",
          phone: faculty.phone || "",
          baseSalary: faculty.baseSalary || "",
          travelAllowance: faculty.travelAllowance || "",
        });

        setError("");
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please login again.");
          navigate("/login");
        } else {
          setError("Failed to load faculty data.");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchFaculty();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        email: formData.email,
        phone: formData.phone,
        baseSalary: Number(formData.baseSalary),
        travelAllowance: Number(formData.travelAllowance),
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      await api.put(`/admin/faculty/edit/${id}`, payload);

      setSuccess(true);

      setTimeout(() => {
        navigate("/admin/facultymanager");
      }, 2000);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Authentication failed.");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error ||
            "Failed to update faculty. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/facultymanager");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                >
                  <FaArrowLeft size={15} />
                  Back
                </button>

                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Edit Faculty Member
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Update faculty information and remuneration
                  </p>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="max-w-full mx-auto mt-5">
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8">
                {fetching ? (
                  <div className="py-20 flex justify-center items-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                      <p className="mt-4 text-gray-500 font-medium">
                        Loading faculty details...
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* LEFT SIDE */}
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FaUserTie className="text-blue-600" size={20} />
                          <h3 className="text-xl font-semibold text-gray-900">
                            Faculty Details
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {/* Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>

                            <input
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter faculty name"
                              required
                            />
                          </div>

                          {/* Department */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Department
                            </label>

                            <Select
                              options={departments.map((dep) => ({
                                value: dep,
                                label: dep,
                              }))}
                              value={
                                formData.department
                                  ? {
                                      value: formData.department,
                                      label: formData.department,
                                    }
                                  : null
                              }
                              onChange={(selected) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  department: selected?.value || "",
                                }))
                              }
                              placeholder="Select Department"
                              classNamePrefix="select"
                            />
                          </div>

                          {/* Designation */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Designation
                            </label>

                            <Select
                              options={designations.map((des) => ({
                                value: des,
                                label: des,
                              }))}
                              value={
                                formData.designation
                                  ? {
                                      value: formData.designation,
                                      label: formData.designation,
                                    }
                                  : null
                              }
                              onChange={(selected) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  designation: selected?.value || "",
                                }))
                              }
                              placeholder="Select Designation"
                              classNamePrefix="select"
                            />
                          </div>

                          {/* Salary Section */}
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <FaUserPlus
                                className="text-emerald-600"
                                size={18}
                              />
                              <h4 className="text-lg font-semibold text-gray-900">
                                Remuneration Details
                              </h4>
                            </div>

                            <div className="space-y-4">
                              {/* Base Salary */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Base Salary
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  name="baseSalary"
                                  value={formData.baseSalary}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Enter base salary"
                                  required
                                />
                              </div>

                              {/* Travel */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Travel Allowance
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  name="travelAllowance"
                                  value={formData.travelAllowance}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Enter travel allowance"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FaEnvelope className="text-blue-600" size={20} />
                          <h3 className="text-xl font-semibold text-gray-900">
                            Contact Details
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>

                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter email"
                              required
                            />
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Password (Leave blank to keep current password)
                            </label>

                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter new password"
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>

                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
                                +91
                              </div>

                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value.length <= 10) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      phone: value.replace(/\D/g, ""),
                                    }));
                                  }
                                }}
                                className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter 10 digit phone"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alerts */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl px-6 py-4 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-6 py-4 text-sm font-medium">
                        Faculty updated successfully! Redirecting...
                      </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaUserPlus size={18} />
                            Update Faculty
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditFaculty;
