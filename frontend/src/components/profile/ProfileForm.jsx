import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { supabase } from "../../supabase/supabaseClient";

const ProfileForm = () => {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    occupation: "",
    organization: "",
    country: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          occupation: data.occupation || "",
          organization: data.organization || "",
          country: data.country || "",
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setMessage("❌ Failed to update profile: " + error.message);
    } else {
      setMessage("✅ Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="text-white">Loading profile form...</div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

      {message && (
        <div
          className={`mb-4 rounded-xl p-3 text-sm ${
            message.includes("✅")
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="e.g., Software Engineer"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Organization</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="e.g., Tech Company Inc."
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g., United States"
            className="input"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 py-3 rounded-xl font-semibold text-white transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
