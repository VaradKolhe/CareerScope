import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const ProfilePage = () => {
  const { user, loading: authLoading, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  // --- 1. FETCH USER DATA ON LOAD ---
  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        // Call the PROTECTED GET /api/profile route
        const res = await api.get("/profile");
        setProfileData(res.data);
        setNameInput(res.data.name);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err);
        setLoading(false);
        if (err.response?.status === 401) {
          logout(); // Log out invalid user/token
        }
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate, logout]); // Re-run if user status changes

  // --- 2. HANDLE PROFILE UPDATE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    try {
      const res = await api.put("/profile", { name: nameInput });

      setProfileData(res.data);
      setIsEditing(false);
      setSaveStatus("Profile updated!");

      // Important: Update the user object in AuthContext/LocalStorage
      login(res.data, localStorage.getItem("token"));

      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("Failed to save!");
    }
  };

  // --- LOADING STATE ---
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-400"></div>
        <h3 className="text-xl font-bold text-white ml-4">
          Loading Dashboard...
        </h3>
      </div>
    );
  }

  // --- MAIN RENDER ---
  // Safety check: if profileData is null (api error), show nothing or error
  if (!profileData)
    return (
      <div className="text-white text-center mt-20">
        Failed to load profile.
      </div>
    );

  const firstName = profileData.name ? profileData.name.split(" ")[0] : "User";
  const history = profileData.history || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white mb-8">
        Welcome Back, {firstName}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* --- LEFT COLUMN: USER DETAILS & EDIT --- */}
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-3">
            My Account Details
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <ProfileField
              label="Email"
              value={profileData.email}
              disabled={true}
            />

            <ProfileField
              label="Full Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              disabled={!isEditing}
            />

            <ProfileField
              label="Member Since"
              value={new Date(profileData.createdAt).toLocaleDateString(
                "en-IN"
              )}
              disabled={true}
            />

            <div className="pt-4 flex items-center justify-between">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="bg-cyan-500 text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-cyan-400 transition"
                    disabled={nameInput === profileData.name}
                  >
                    {saveStatus || "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setNameInput(profileData.name);
                      setSaveStatus("");
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="border border-slate-600 text-slate-300 font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- RIGHT COLUMN: PREDICTION HISTORY --- */}
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-3">
            Prediction History ({history.length})
          </h2>

          {history.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {history
                .slice()
                .reverse()
                .map(
                  (
                    item,
                    index // Reverse to show newest first
                  ) => (
                    <div
                      key={index}
                      className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold">
                          {item.result}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(item.date).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Module: {item.module || "U10"}
                      </p>
                    </div>
                  )
                )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p className="mb-4">No predictions saved yet.</p>
              <button
                onClick={() => navigate("/quiz-u10")}
                className="text-cyan-400 font-bold hover:underline"
              >
                Take your first quiz!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component for Profile Form
const ProfileField = ({ label, value, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold text-slate-400 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full py-2 px-3 rounded-lg border focus:outline-none transition 
                ${
                  disabled
                    ? "bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-slate-900 border-slate-600 text-white focus:ring-2 focus:ring-cyan-500"
                }
            `}
    />
  </div>
);

export default ProfilePage;
