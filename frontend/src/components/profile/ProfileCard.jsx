import { FiUser } from "react-icons/fi";
import { useAuthContext } from "../../context/AuthContext";

const ProfileCard = () => {
  const { user } = useAuthContext();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            {user?.user_metadata?.full_name || "User"}
          </h2>

          <p className="text-slate-400 mt-2">
            {user?.email}
          </p>

          <p className="text-slate-500 mt-1">
            Member since {" "}
            {new Date(user?.created_at || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
