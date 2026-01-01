import { FaTimes } from "react-icons/fa";
import FacultySidebar from "./FacultySidebar";

const FacultyMobileSidebar = ({ handleSidebarClose, showSidebar }) => {

  return( 
  <>
    <div
          className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
            showSidebar
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
              showSidebar ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleSidebarClose}
          />
          <div
            className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h5 className="font-semibold text-lg text-gray-900 tracking-tight">
                Menu
              </h5>
              <button
                onClick={handleSidebarClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4">
              <FacultySidebar />
            </div>
            <div className="mt-45 p-6 border-t border-gray-200 bg-white/60 backdrop-blur">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Role
              </div>
              <div className="text-sm text-gray-900 mt-1 font-medium">
                Faculty Member
              </div>
            </div>
          </div>
        </div>
  </>
)};

export default FacultyMobileSidebar;
