import FacultySidebar from "./FacultySidebar";

const FacultyDesktopSidebar = () => {
  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-72 bg-gradient-to-b from-white to-slate-50 border-r border-gray-200">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <FacultySidebar />
            </div>
            <div className="p-6 border-t border-gray-200 bg-white/60 backdrop-blur">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Role
              </div>
              <div className="text-sm text-gray-900 mt-1 font-medium">
                Faculty Member
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDesktopSidebar;
