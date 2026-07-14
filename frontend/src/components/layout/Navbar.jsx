import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiBell, FiSearch } from "react-icons/fi";
import ProfileDropdown from "./ProfileDropdown";
import { supabase } from "../../supabase/supabaseClient";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/upload": "Upload Contract",
    "/analysis": "Contract Analysis",
    "/contracts": "My Contracts",
    "/chat": "AI Chat",
    "/history": "History",
    "/settings": "Settings",
    "/profile": "Profile",
  };

  const name =
    user?.user_metadata?.full_name ||
    user?.email ||
    "User";

  const avatar =
    (name.match(/[A-Za-z]/)?.[0] || "U").toUpperCase();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-semibold">
          {pageTitles[location.pathname]}
        </h2>

        <p className="text-slate-400 text-sm">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-5">

        <div className="relative">

          <FiSearch className="absolute left-3 top-3 text-slate-400" />

          <input
            placeholder="Search contracts..."
            className="bg-slate-800 rounded-xl pl-10 pr-4 py-2 w-72 outline-none"
          />

        </div>

        <button className="relative p-3 rounded-xl bg-slate-800 hover:bg-slate-700">
          <FiBell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-12 h-12 rounded-full overflow-hidden bg-blue-600"
          >
            <img
              src={user?.user_metadata?.avatar_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {open && (
            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
            />
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
