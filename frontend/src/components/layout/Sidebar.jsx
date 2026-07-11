import {
  FiHome,
  FiUpload,
  FiFileText,
  FiMessageSquare,
  FiClock,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: <FiHome />, path: "/dashboard" },
  { label: "Upload Contract", icon: <FiUpload />, path: "/upload" },
  { label: "My Contracts", icon: <FiFileText />, path: "/contracts" },
  { label: "AI Chat", icon: <FiMessageSquare />, path: "/chat" },
  { label: "History", icon: <FiClock />, path: "/history" },
  { label: "Settings", icon: <FiSettings />, path: "/settings" },
  { label: "Profile", icon: <FiUser />, path: "/profile" },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex w-64 h-screen bg-slate-900 border-r border-slate-800 flex-col">
      <div className="p-6 text-2xl font-bold text-blue-500">AI Contract</div>

      <nav className="flex-1 px-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
