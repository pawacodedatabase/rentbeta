import { useState } from "react";
import { supabase } from "../../superbase";
import { Link, useNavigate } from "react-router-dom";
import tenantBlack from "../../assets/icons/tenantwhite.png";
import tenantPurple from "../../assets/icons/tenantpurple.png";
import landlordBlack from "../../assets/icons/landlordwhite.png";
import landlordPurple from "../../assets/icons/landlordpurple.png";
import logo from '../../assets/icons/logo.png'


import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";



import bg from '../../assets/bg.avif'
const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
     confirm_password: "",
    role: "" as "tenant" | "landlord" | "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ROLE SELECT (LOCKS IT)
  const selectRole = (role: "tenant" | "landlord") => {
    setForm({ ...form, role });
    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setError("Signup failed. Try again.");
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("users").insert([
      {
        id: user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
      },
    ]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/login");
  };

  return (
<div
  className="min-h-screen flex items-center p-8 justify-center px-4 relative bg-center bg-cover"
  style={{
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
      url(${bg})
    `,
  }}
>
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">

        {/* LOGO */}
       
       <img src={logo} alt="" className="w-[150px] m-auto mb-8"/>

        <p className="text-center text-gray-500 mb-6">
          {step === 1 ? "How do you want to use RentBeta?" : "Create your account"}
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* ================= STEP 1 ================= */}
{step === 1 && (
  <div className="space-y-6">

    {/* HEADER */}
    <div className="flex items-center justify-between text-sm text-gray-500">
      <h2 className="font-semibold text-purple-700">RentBeta</h2>
      <span>Step 1 of 2</span>
    </div>

    {/* PROGRESS BAR */}
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="w-[50%] h-full bg-purple-600 rounded-full"></div>
    </div>



    {/* TENANT CARD */}
    <div
      onClick={() => selectRole("tenant")}
      className={`group relative cursor-pointer p-5 rounded-2xl border transition shadow-sm flex gap-4 items-center
      ${
        form.role === "tenant"
          ? "border-purple-500 bg-purple-50"
          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
      }`}
    >
      {/* BLACK ICON */}
      <img
        src={tenantBlack}
        alt="Tenant"
        className="w-[80px] h-[80px] transition-all duration-200 group-hover:scale-125"
      />

      {/* PURPLE ICON (on hover) */}
      <img
        src={tenantPurple}
        alt="Tenant Hover"
        className="absolute left-5 w-[90px] h-[90px] opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-125"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">Tenant</h3>
        <p className="text-sm text-gray-500">
          Find apartments, houses, and rooms for rent. Browse thousands of listings.
        </p>
      </div>

      {form.role === "tenant" && (
        <div className="text-purple-600 font-bold">✓</div>
      )}
    </div>

    {/* LANDLORD CARD */}
    <div
      onClick={() => selectRole("landlord")}
      className={`group relative cursor-pointer p-5 rounded-2xl border transition shadow-sm flex gap-4 items-center
      ${
        form.role === "landlord"
          ? "border-purple-500 bg-purple-50"
          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
      }`}
    >
      {/* BLACK ICON */}
      <img
        src={landlordBlack}
        alt="Landlord"
        className="w-[80px] h-[80px] transition-all duration-200 group-hover:scale-125"
      />

      {/* PURPLE ICON (on hover) */}
      <img
        src={landlordPurple}
        alt="Landlord Hover"
        className="absolute left-5 w-[90px] h-[90px] opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-125"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">Landlord</h3>
        <p className="text-sm text-gray-500">
          List your property, manage applicants, and sign leases. Reach tenants easily.
        </p>
      </div>

      {form.role === "landlord" && (
        <div className="text-purple-600 font-bold">✓</div>
      )}
    </div>

    {/* CONTINUE BUTTON */}
    <button
      disabled={!form.role}
      onClick={() => setStep(2)}
      className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-purple-500 disabled:opacity-40"
    >
      Continue
    </button>

    {/* LOGIN */}
    <p className="text-center text-sm text-gray-500">
      Already have an account?{" "}
      <Link to="/login" className="text-purple-600 font-medium">
        Log in
      </Link>
    </p>

  </div>
)}
        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            {/* show selected role */}
          <div className="mb-6 flex justify-center">
  <div className="relative w-full max-w-sm rounded-2xl p-5 
    bg-gradient-to-br from-purple-50 via-white to-purple-100
    border border-purple-200 shadow-md
    overflow-hidden"
  >
    {/* glow effect */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-300/30 rounded-full blur-2xl"></div>

    <div className="relative text-center">
      <p className="text-xs uppercase tracking-widest text-gray-500">
        Selected Role
      </p>

      <h2 className="mt-2 text-xl font-bold text-purple-700  capitalize">
        {form.role}
      </h2>

     
    </div>
  </div>
</div>
            <form onSubmit={handleSignup} className="space-y-4">

    <div className="relative">
  <User className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />

  <input
    name="full_name"
    onChange={handleChange}
    className="peer w-full p-3 pl-10 border rounded-lg focus:border-purple-500 outline-none"
    required
  />

  <label
    className="absolute left-10 top-3 text-gray-400 text-sm transition-all
    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
    peer-valid:-top-2 peer-valid:text-xs bg-white px-1 pointer-events-none"
  >
    Full Name
  </label>
</div>



             <div className="relative">
  <Mail className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />

  <input
    name="email"
    type="email"
    onChange={handleChange}
    className="peer w-full p-3 pl-10 border rounded-lg focus:border-purple-500 outline-none"
    required
  />

  <label className="absolute left-10 top-3 text-gray-400 text-sm transition-all
    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
    peer-valid:-top-2 peer-valid:text-xs bg-white px-1 pointer-events-none">
    Email Address
  </label>
</div>

            <div className="relative">
  <Phone className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />

  <input
    name="phone"
    onChange={handleChange}
    className="peer w-full p-3 pl-10 border rounded-lg focus:border-purple-500 outline-none"
  />

  <label className="absolute left-10 top-3 text-gray-400 text-sm transition-all
    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
    peer-valid:-top-2 peer-valid:text-xs bg-white px-1 pointer-events-none">
    Phone Number
  </label>
</div>

            <div className="relative">
  <Lock className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />

  <input
    name="password"
    type={showPassword ? "text" : "password"}
    onChange={handleChange}
    className="peer w-full p-3 pl-10 pr-10 border rounded-lg focus:border-purple-500 outline-none"
    required
  />

  <label className="absolute left-10 top-3 text-gray-400 text-sm transition-all
    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
    peer-valid:-top-2 peer-valid:text-xs bg-white px-1 pointer-events-none">
    Password
  </label>

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3 text-gray-500"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

<div className="relative">
  <Lock className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />

  <input
    name="confirm_password"
    type={showConfirmPassword ? "text" : "password"}
    onChange={handleChange}
    className="peer w-full p-3 pl-10 pr-10 border rounded-lg focus:border-purple-500 outline-none"
    required
  />

  <label className="absolute left-10 top-3 text-gray-400 text-sm transition-all
    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
    peer-valid:-top-2 peer-valid:text-xs bg-white px-1 pointer-events-none">
    Confirm Password
  </label>

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-3 text-gray-500"
  >
    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              {/* back button */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 font-bold hover:text-purple-600"
              >
                Change role
              </button>

            </form>
          </>
        )}

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;