import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { supabase } from "../../supabase/supabaseClient";

const ProfileCard = () => {
  const { user } = useAuthContext();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile(data);
      } else {
        console.error(error);
      }
    };

    fetchProfile();
  }, [user]);

  if (!profile) {
    return (
      <div className="bg-slate-900 rounded-2xl p-8">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <div className="flex items-center gap-6">

        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
              {profile.first_name?.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            {profile.first_name} {profile.last_name}
          </h2>

          <p className="text-slate-400 mt-2">
            {profile.email}
          </p>

          <p className="text-slate-500 mt-1">
            Member since{" "}
            {new Date(profile.created_at).toLocaleDateString()}
          </p>

          <button
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            ✏ Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;
