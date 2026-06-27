import { useEffect, useState } from "react";
import { supabase } from "../../superbase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";

// Replace with your Cloudinary details
const CLOUD_NAME = "dx90y9zdx";
const UPLOAD_PRESET = "adorethebrand";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("tenant");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [avatarUrl, setAvatarUrl] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setUserId(user.id);

    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setFullName(data.full_name || "");

      setPhone(data.phone || "");

      setRole(data.role || "tenant");

      setAvatarUrl(data.avatar_url || "");
    }

    setLoading(false);
  }

  async function saveProfile() {
  if (!fullName.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (!email.trim()) {
    alert("Please enter your email.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (password && password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    setSaving(true);

    // Upload avatar if user selected a new one
    let uploadedAvatar = avatarUrl;

    if (avatarFile) {
      uploadedAvatar = await uploadAvatar();
    }

    // Update users table
    // const { error: profileError } = await supabase
    //   .from("users")
    //   .update({
    //     full_name: fullName,
    //     phone,
    //     role,
    //     email,
    //     avatar_url: uploadedAvatar,
    //   })
    //   .eq("id", userId);

    // if (profileError) {
    //   throw profileError;
    // }


    const { data, error } = await supabase
  .from("users")
  .update({
    full_name: fullName,
    phone,
    role,
    email,
    avatar_url: uploadedAvatar,
  })
  .eq("id", userId)
  .select();

console.log("Auth userId:", userId);
console.log("Updated rows:", data);
console.log("Update error:", error);

if (error) {
  alert(error.message);
  return;
}



    // Update Supabase Auth email
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (email !== user.email) {
        const { error } =
          await supabase.auth.updateUser({
            email,
          });

        if (error) {
          alert(error.message);
        }
      }

      // Update password
      if (password.trim() !== "") {
        const { error } =
          await supabase.auth.updateUser({
            password,
          });

        if (error) {
          alert(error.message);
        }
      }
    }

    alert("Profile updated successfully.");

    navigate("/profile");
  } catch (err: any) {
    console.error(err);

    alert(err.message || "Something went wrong.");
  } finally {
    setSaving(false);
  }
}

  async function uploadAvatar() {
    if (!avatarFile) return avatarUrl;

    const formData = new FormData();

    formData.append("file", avatarFile);

    formData.append(
      "upload_preset",
      UPLOAD_PRESET
    );

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-white">

    {/* Header */}

    {/* <div className="bg-white shadow-sm sticky top-0 z-20">

      <div className="max-w-xl mx-auto flex items-center gap-4 px-5 py-4">

        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-xl font-bold">
          Edit Profile
        </h1>

      </div>

    </div> */}

    <div className="max-w-xl mx-auto p-6">

      {/* Avatar */}

      <div className="flex flex-col items-center mb-8">

        <label className="relative cursor-pointer group">

          <img
            src={
              avatarFile
                ? URL.createObjectURL(avatarFile)
                : avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    fullName || "User"
                  )}&background=7c3aed&color=fff&size=300`
            }
            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
          />

          <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">

            <Camera size={20} />

          </div>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.length) {
                setAvatarFile(e.target.files[0]);
              }
            }}
          />

        </label>

        <p className="mt-4 text-lg font-semibold">
          Change Photo
        </p>

      </div>

      {/* Full Name */}

      <div className="mb-5">

        <label className="text-sm font-medium">
          Full Name
        </label>

        <input
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          className="mt-2 w-full border rounded-xl px-4 py-4 bg-white outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>

      {/* Email */}

      <div className="mb-5">

        <label className="text-sm font-medium">
          Email Address
        </label>

        <input
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mt-2 w-full border rounded-xl px-4 py-4 bg-white outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>

      {/* Phone */}

      <div className="mb-5">

        <label className="text-sm font-medium">
          Phone Number
        </label>

        <input
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="mt-2 w-full border rounded-xl px-4 py-4 bg-white outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>

      {/* Role */}

      <div className="mb-5">

        <label className="text-sm font-medium">
          Role
        </label>

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="mt-2 w-full border rounded-xl px-4 py-4 bg-white outline-none focus:ring-2 focus:ring-purple-500"
        >

          <option value="landlord">
            Landlord
          </option>

          <option value="tenant">
            Tenant
          </option>

        </select>

      </div>

      {/* Password */}

      <div className="mb-5">

        <label className="text-sm font-medium">
          New Password (leave blank to keep current)
        </label>

        <div className="mt-2 relative">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            placeholder="Enter new password"
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-xl px-4 py-4 pr-14 bg-white outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >

            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}

          </button>

        </div>

      </div>

      {/* Confirm Password */}

      <div className="mb-8">

        <label className="text-sm font-medium">
          Confirm New Password
        </label>

        <div className="mt-2 relative">

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            placeholder="Confirm new password"
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full border rounded-xl px-4 py-4 pr-14 bg-white outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >

            {showConfirmPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}

          </button>

        </div>

      </div>

            {/* Save Button */}

      <button
        onClick={saveProfile}
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white py-2 rounded-xl font-semibold text-sm transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>

  </div>
);
}