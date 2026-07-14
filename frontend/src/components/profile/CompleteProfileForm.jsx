import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { useAuthContext } from "../../context/AuthContext";

const CompleteProfileForm = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    occupation: "",
    organization: "",
    country: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...formData,
        profile_completed: true,
      })
      .eq("id", user.id)
      .select();

    console.log("USER ID:", user.id);
    console.log("UPDATED DATA:", data);
    console.log("ERROR:", error);

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    console.log("✅ Profile updated successfully");
    console.log("➡️ Navigating to dashboard...");

    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-xl bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">
      <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>

      <p className="text-slate-400 mt-2 mb-8">
        Tell us a little about yourself.
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <input
          type="date"
          name="dob"
          onChange={handleChange}
          className="input"
        />

        <input
          name="occupation"
          placeholder="Occupation"
          onChange={handleChange}
          className="input"
        />

        <input
          name="organization"
          placeholder="Organization / College"
          onChange={handleChange}
          className="input"
        />

        <input
          name="country"
          placeholder="Country"
          onChange={handleChange}
          className="input"
        />

        <textarea
          rows="4"
          name="bio"
          placeholder="Tell us about yourself..."
          onChange={handleChange}
          className="input resize-none"
        />

        <button className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-semibold text-lg">
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfileForm;
