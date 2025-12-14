import { FaMoneyCheckAlt, FaSyncAlt, FaCheckCircle, FaHistory, FaUsers, FaSignOutAlt, FaBook } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const menuItems = [
    { icon: <FaMoneyCheckAlt />, label: "Payments", path: "/admin/payments" },
    { icon: <FaSyncAlt />, label: "Payment Management", path: "/admin/managepayments" },
    { icon: <FaHistory />, label: "Payment History", path: "/admin/paymenthistory" },
    { icon: <FaUsers />, label: "Faculty Management", path: "/admin/facultymanager" },
    { icon: <FaBook />, label: "Subject Management", path: "/admin/subjectmanager" },
  ];

  return (
    <>
      {/* Logo + Title */}
      <div className="text-center mb-4">
        <img
          src="/rcoe-logo.jpg"
          alt=""
          className="w-[60px] rounded-full mb-2 mx-auto animate-[fadeIn_0.4s_ease]"
        />
        <h5 className="font-semibold mb-0 animate-[fadeIn_0.5s_ease]">
          Rizvi College of Engineering
        </h5>
        <small className="text-gray-500 animate-[fadeIn_0.6s_ease]">
          Admin Panel
        </small>
      </div>

      {/* Menu */}
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li key={index} className="transition">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded no-underline transition-all duration-200
                 hover:scale-[1.02] hover:no-underline
                 ${isActive
                   ? "bg-blue-600 text-white shadow-sm scale-[1.02] transition-all duration-300"
                   : "text-gray-900 hover:bg-gray-100"
                 }`
              }
            >
              {/* Icon animation */}
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

export default AdminSidebar;