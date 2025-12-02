import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext); // Access global login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Call Backend
      const data = await loginUser({ email, password });

      // 2. Update Context (Saves to LocalStorage)
      login(data.user, data.token);

      // 3. Redirect
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">
            Sign in to access your Career Dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              className="block text-slate-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-slate-300 text-sm font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">
                Forgot?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-cyan-500/20 transform active:scale-95 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
