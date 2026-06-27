import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Moon,
  Building2,
  Heart,
  MessageCircle,
  LogOut,
  ChevronRight,
  Trash2,
  Shield,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../superbase";

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [, setUser] = useState<any>(null);

  const [notificationSound, setNotificationSound] =
    useState(
      localStorage.getItem("notificationSound") !== "false"
    );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);
  }

  function toggleNotification() {
    const value = !notificationSound;

    setNotificationSound(value);

    localStorage.setItem(
      "notificationSound",
      value.toString()
    );
  }

  function toggleDarkMode() {
    const value = !darkMode;

    setDarkMode(value);

    localStorage.setItem(
      "darkMode",
      value.toString()
    );
  }

  async function logout() {
    await supabase.auth.signOut();

    navigate("/");
  }

  async function deleteAccount() {
    const confirmDelete = window.confirm(
      "Delete your account permanently?"
    );

    if (!confirmDelete) return;

    alert(
      "Delete account requires a secure backend (Edge Function)."
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

   

        <h1 className="text-sm px-6 pt-3 font-semibold text-gray-600">
          Settings
        </h1>



  

      <div className="mt-5 space-y-4">

        {/* ACCOUNT */}

        <div className="bg-white rounded-xl mx-4 overflow-hidden shadow">

          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-3">

              <User size={20} />

              <span>Profile</span>

            </div>

            <ChevronRight size={18} />

          </button>

          <button
            onClick={() => navigate("/profile/edit")}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-3">

              <User size={20} />

              <span>Edit Profile</span>

            </div>

            <ChevronRight size={18} />

          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-3">

              <Building2 size={20} />

              <span>My Apartments</span>

            </div>

            <ChevronRight size={18} />

          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-3">

              <Heart size={20} />

              <span>Saved Apartments</span>

            </div>

            <ChevronRight size={18} />

          </button>

          <button
            onClick={() => navigate("/chat")}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">

              <MessageCircle size={20} />

              <span>Messages</span>

            </div>

            <ChevronRight size={18} />

          </button>

        </div>

        {/* PREFERENCES */}

        <div className="bg-white rounded-xl mx-4 overflow-hidden shadow">

          <div className="flex items-center justify-between p-4 border-b">

            <div className="flex items-center gap-3">

              <Bell size={20} />

              <span>Notification Sound</span>

            </div>

            <input
              type="checkbox"
              checked={notificationSound}
              onChange={toggleNotification}
              className="w-5 h-5"
            />

          </div>

          <div className="flex items-center justify-between p-4">

            <div className="flex items-center gap-3">

              <Moon size={20} />

              <span>Dark Mode</span>

            </div>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="w-5 h-5"
            />

          </div>

        </div>

        {/* HELP */}

        <div className="bg-white rounded-xl mx-4 overflow-hidden shadow">

          <button
            className="w-full flex justify-between items-center p-4 border-b"
          >
            <div className="flex items-center gap-3">

              <Headphones size={20} />

              <span>Support</span>

            </div>

            <ChevronRight size={18} />

          </button>

          <button
            className="w-full flex justify-between items-center p-4"
          >
            <div className="flex items-center gap-3">

              <Shield size={20} />

              <span>Privacy Policy</span>

            </div>

            <ChevronRight size={18} />

          </button>

        </div>

        {/* DANGER */}

        <div className="bg-white rounded-xl mx-4 overflow-hidden shadow">

          <button
            onClick={logout}
            className="w-full flex justify-between items-center p-4 border-b text-red-600"
          >
            <div className="flex items-center gap-3">

              <LogOut size={20} />

              <span>Logout</span>

            </div>

            <ChevronRight size={18} />

          </button>

          <button
            onClick={deleteAccount}
            className="w-full flex justify-between items-center p-4 text-red-600"
          >
            <div className="flex items-center gap-3">

              <Trash2 size={20} />

              <span>Delete Account</span>

            </div>

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

      <div className="text-center text-gray-400 py-8">
        Version 1.0.0
      </div>

    </div>
  );
}