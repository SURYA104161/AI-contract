import { Link } from "react-router-dom";
import { FiUser, FiSettings, FiFileText, FiClock, FiLogOut } from "react-icons/fi";

const ProfileDropdown = ({ user, onLogout }) => {
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";

  const email = user?.email || "";

  return (
    <div className="absolute right-0 top-14 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">

      <div className="p-5 border-b border-slate-800">
        <h3 className="font-semibold text-lg truncate">{name}</h3>

        <p className="text-slate-400 text-sm truncate">
          {email}
        </p>
      </div>

      <div className="py-2">

        <Link
          to="/profile"
          className="flex items-center gap-3 px-5 py-4 hover:bg-slate-800 transition-all duration-200 cursor-pointer"
        >
          <FiUser />
          Profile
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 px-5 py-4 hover:bg-slate-800 transition-all duration-200 cursor-pointer"
        >
          <FiSettings />
          Settings
        </Link>

        <Link
          to="/contracts"
          className="flex items-center gap-3 px-5 py-4 hover:bg-slate-800 transition-all duration-200 cursor-pointer"
        >
          <FiFileText />
          My Contracts
        </Link>

        <Link
          to="/history"
          className="flex items-center gap-3 px-5 py-4 hover:bg-slate-800 transition-all duration-200 cursor-pointer"
        >
          <FiClock />
          History
        </Link>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-600 transition-all duration-200 cursor-pointer text-left"
        >
          <FiLogOut />
          Logout
        </button>

      </div>
    </div>
  );
};

export default ProfileDropdown;
