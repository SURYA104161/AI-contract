import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/upload": "Upload Contract",
    "/analysis": "Contract Analysis",
    "/contracts": "My Contracts",
    "/chat": "AI Chat",
    "/history": "History",
    "/settings": "Settings",
    "/profile": "Profile",
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">
        {pageTitles[location.pathname] || "AI Contract Assistant"}
      </h2>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          P
        </div>
      </div>
    </header>
  );
};

export default Navbar;
