import { useEffect, useState } from "react";
import { FaUser, FaMoneyBillWave, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import api from "../../utils/api";

function FacultySidebar() {
  const menuItems = [
    {
      icon: <FaUser />,
      label: "Dashboard",
      path: "/faculty/dashboard",
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Payments",
      path: "/faculty/payments",
    },
  ];

  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const facultyId = localStorage.getItem("facultyId");

    if (!facultyId) {
      console.error("No facultyId found in localStorage");
      setLoading(false);
      return;
    }

    const fetchFacultyData = async () => {
      try {
        const facultyRes = await api.get(
          `/admin/faculty/getSingle/${facultyId}`
        );
        console.log("Getting Faculty Details For Faculty Sidebar");
        console.log(facultyRes.data);
        setFacultyData(facultyRes.data);
      } catch (err) {
        console.error("Error fetching faculty data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  return (
    <>
      {/* Profile Section with Skeleton Loading */}
      <div className="text-center mb-4">
        {loading ? (
          // Skeleton Loading for Profile
          <>
            <div className="relative inline-block mb-3">
              <div className="w-[80px] h-[80px] rounded-full bg-gray-300 animate-pulse mx-auto"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mx-auto mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mx-auto mb-3"></div>
            <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse mx-auto"></div>
          </>
        ) : !facultyData ? (
          // Error State
          <div className="py-8">
            <div className="w-[80px] h-[80px] rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
              <FaUser className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-500 text-sm">No faculty data found</p>
          </div>
        ) : (
          // Loaded State
          <>
            <div className="relative inline-block mb-3">
              <img
                src={facultyData.profileImg || "/F1.jpg"}
                alt="Profile"
                className="w-[90px] h-[90px] rounded-full border-4 border-blue-600 object-cover mx-auto animate-[fadeIn_0.4s_ease] shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <h5 className="font-semibold mb-1 animate-[fadeIn_0.5s_ease] text-gray-900">
              {facultyData.name}
            </h5>
            <small className="text-gray-500 block mb-2 animate-[fadeIn_0.6s_ease]">
              {facultyData.designation}
            </small>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Online
            </span>
          </>
        )}
      </div>

      {/* Menu - Always visible */}
      <ul className="mt-8 space-y-1">
        {menuItems.map((item, index) => (
          <li key={index} className="transition">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded no-underline transition-all duration-200
                 hover:scale-[1.02] hover:no-underline
                 ${
                   isActive
                     ? "bg-blue-600 text-white shadow-sm scale-[1.02] transition-all duration-300"
                     : "text-gray-900 hover:bg-gray-100"
                 }`
              }
            >
              <span className="transition-transform duration-200 group-hover:rotate-3">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}

        {/* Logout */}
        <li className="mt-4">
          <a
            href="/logout"
            className="flex items-center gap-2 px-3 py-2 rounded 
            no-underline text-red-600 hover:bg-red-100
            transition-all duration-200 hover:scale-[1.02]"
          >
            <FaSignOutAlt className="transition-transform duration-200 group-hover:-rotate-6" />
            Logout
          </a>
        </li>
      </ul>
    </>
  );
}

export default FacultySidebar;
