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

  // --- 1. FETCH USER DATA ---
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setProfileData(res.data);
        setNameInput(res.data.name);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
        if (err.response?.status === 401) logout();
      }
    };

    if (user) fetchProfile();
  }, [user, authLoading, navigate, logout]);

  // --- 2. HANDLE PROFILE UPDATE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    try {
      const res = await api.put("/profile", { name: nameInput });
      setProfileData(res.data);
      setIsEditing(false);
      setSaveStatus("Updated!");
      login(res.data, localStorage.getItem("token"));
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      setSaveStatus("Failed!");
    }
  };

  if (loading || authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!profileData)
    return (
      <div className="text-white text-center mt-20">
        Failed to load profile.
      </div>
    );

  const firstName = profileData.name ? profileData.name.split(" ")[0] : "User";
  // ALIGNMENT FIX: Ensure history exists
  const history = profileData.history || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white mb-8">
        Dashboard for {firstName}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* --- LEFT: USER DETAILS (1 Column) --- */}
        <div className="md:col-span-1 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl h-fit">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-3">
            Account
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

            <div className="pt-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-500 text-slate-900 font-bold py-2 rounded-lg hover:bg-cyan-400"
                  >
                    {saveStatus || "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-slate-700 text-white font-bold py-2 rounded-lg hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full border border-slate-600 text-slate-300 font-bold py-2 rounded-lg hover:bg-slate-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- RIGHT: PREDICTION HISTORY (2 Columns) --- */}
        <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-3">
            Prediction History{" "}
            <span className="text-slate-500 text-sm ml-2">
              ({history.length} Analysis Runs)
            </span>
          </h2>

          {history.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {history
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition group relative overflow-hidden"
                  >
                    {/* Confidence Badge */}
                    <div className="absolute top-4 right-4 text-right">
                      <div
                        className={`text-xl font-black ${
                          item.confidence > 80
                            ? "text-emerald-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {item.confidence}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        Confidence
                      </div>
                    </div>

                    {/* Main Result */}
                    <div className="pr-16">
                      <span className="inline-block px-2 py-1 rounded text-[10px] font-bold bg-slate-700 text-slate-300 mb-2 uppercase tracking-wide">
                        {item.module || "General"} Analysis
                      </span>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition">
                        {item.topPrediction}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="mt-3 text-xs text-slate-600 font-mono">
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-slate-400 mb-6">
                You haven't taken any career tests yet.
              </p>
              <button
                onClick={() => navigate("/quiz-u10")}
                className="bg-cyan-500 text-slate-900 font-bold py-2 px-6 rounded-full hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
              >
                Take your first quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full py-2 px-3 rounded-lg border text-sm focus:outline-none transition 
                ${
                  disabled
                    ? "bg-slate-900/50 border-slate-800 text-slate-400"
                    : "bg-slate-900 border-slate-600 text-white focus:border-cyan-500"
                }
            `}
    />
  </div>
);

export default ProfilePage;
