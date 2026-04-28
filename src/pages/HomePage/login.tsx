import { useState } from "react";
import { supabase } from "../../superbase";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import bg from "../../assets/bg.avif"; // 👉 your background image
import logo from '../../assets/icons/logo.png'
const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* DARK OVERLAY (behind content only) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* FORM CARD */}
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md bg-white backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-6"
      >
 <img src={logo} alt="" className="w-[150px] m-auto mb-8"/>

        <h1 className="text-xl font-semibold text-center text-gray-500">
          Welcome Back
        </h1>

        {/* EMAIL */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="peer w-full p-3 pl-10 border rounded-lg outline-none focus:border-purple-500 bg-transparent"
          />

          <label className="absolute left-10 top-3 text-gray-400 text-sm transition-all
            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
            peer-valid:-top-2 peer-valid:text-xs bg-white px-1">
            Email Address
          </label>
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            className="peer w-full p-3 pl-10 pr-10 border rounded-lg outline-none focus:border-purple-500 bg-transparent"
          />

          <label className="absolute left-10 top-3 text-gray-400 text-sm transition-all
            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
            peer-valid:-top-2 peer-valid:text-xs bg-white px-1">
            Password
          </label>

          {/* EYE ICON */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP LINK */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-medium">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;