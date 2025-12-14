import { FaBars, FaGraduationCap, FaPlus } from "react-icons/fa";

function AdminNavbar({ handleSidebarOpen, page, desc }) {
  return (
    <>
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {/* Hamburger Button */}
              <button
                onClick={handleSidebarOpen}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <FaBars size={20} />
              </button>

              {/* Description of Page */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-inner">
                  <FaGraduationCap className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                    {page}
                  </h1>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;
