import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../superbase";
import bg from '../../assets/elegant-purple-wave-background-design-projects-vector.png'
import {
  Mail,
  Phone,
  Home,
//   MessageCircle,
  Pencil,
  LogOut,
  Settings,
  Building2,
  Camera,
  CalendarCheck,
  ArrowRight,
  Plus,
  BadgeCheck,
  MessageSquareText,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import ProfileSkeleton from "./profileSkeleton";
import ApartmentCard from "./apartmentCard";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "landlord" | "tenant";
  created_at: string;
  avatar_url: string;
  verified : boolean;
  suspended : boolean;
};

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
};

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);

  const [stats, setStats] = useState({
    apartments: 0,
    conversations: 0,
  });

  const getInitials = (name?: string) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const loadProfile = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    /* ---------------- PROFILE ---------------- */

    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.log(profileError);
      setLoading(false);
      return;
    }

    setProfile(userProfile);

    /* ---------------- APARTMENTS ---------------- */

    const { data: apartmentList } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setProperties(apartmentList || []);

    /* ---------------- CONVERSATIONS ---------------- */

    const { count } = await supabase
      .from("conversations")
      .select("*", {
        head: true,
        count: "exact",
      })
      .or(`tenant_id.eq.${user.id},landlord_id.eq.${user.id}`);

    setStats({
      apartments: apartmentList?.length || 0,
      conversations: count || 0,
    });

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadProfile();

    const channel = supabase
      .channel("profile-page")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
        },
        () => {
          loadProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadProfile]);

  const logout = async () => {
    await supabase.auth.signOut();

    navigate("/login");
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        Profile not found.
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-white">

    {/* HEADER */}

   <div
  className="relative h-56 bg-cover bg-center "
  style={{
    backgroundImage: `url(${bg})`,
  }}
>

  <button
    onClick={() => navigate("/settings")}
    className="absolute top-6 right-6 bg-white/20 p-3 rounded-full backdrop-blur-sm"
  >
    <Settings className="text-white" />
  </button>


  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">

    <div className="relative">

      {profile.avatar_url ? (

        <img
          src={profile.avatar_url}
          className="w-32 h-32 rounded-full object-cover border-[6px] border-white shadow-xl"
        />

      ) : (

        <div className="w-32 h-32 rounded-full bg-white border-[6px] border-white shadow-xl flex items-center justify-center text-4xl font-bold text-purple-700">
          {getInitials(profile.full_name)}
        </div>

      )}


      <button
        onClick={() => navigate("/profile/edit")}
        className="absolute bottom-1 right-1 bg-white p-2 rounded-full"
      >
        <Camera size={18} className="text-purple-800" />
      </button>

    </div>

  </div>

</div>

    <div className="pt-4 px-5">

      {/* NAME */}

      <div className="text-center">

        <h1 className="text-2xl font-bold">
          {profile.full_name}
        </h1>

        <p className="capitalize text-gray-500 text-sm font-medium mt-1">
          {profile.role}
        </p>

      </div>

      {/* STATS */}

  <div className="grid grid-cols-3 gap-3 mt-8">

  {/* Apartments */}
  <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <Building2 size={18} className="text-purple-600" />

      <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-600">
        Active
      </span>
    </div>

    <h2 className="mt-5 text-3xl font-bold text-gray-900">
      {stats.apartments}
    </h2>

    <p className="mt-1 text-xs text-gray-500">
      {stats.apartments <= 1 ? "Apartment" : "Apartments"}
    </p>
  </div>

  {/* Conversations */}
  <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <MessageSquareText size={18} className="text-sky-600" />

      <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-sky-50 text-sky-600">
        Inbox
      </span>
    </div>

    <h2 className="mt-5 text-3xl font-bold text-gray-900">
      {stats.conversations}
    </h2>

    <p className="mt-1 text-xs text-gray-500">
      {stats.conversations <= 1
        ? "Conversation"
        : "Conversations"}
    </p>
  </div>

  {/* Account */}
  <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <BadgeCheck
        size={18}
        className={
          profile.role === "landlord"
            ? "text-emerald-600"
            : "text-orange-500"
        }
      />

    <span
  className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${
    profile.verified
      ? "bg-emerald-50 text-emerald-600"
      : "bg-red-50 text-red-600"
  }`}
>
  {profile.verified ? (
    <>
      <CheckCircle2 size={12} />
      Verified
    </>
  ) : (
    <>
      <XCircle size={12} />
      Not Verified
    </>
  )}
</span>
    </div>

    <h2 className="mt-5 text-lg font-semibold capitalize text-gray-900">
      {profile.role}
    </h2>

    <p className="mt-1 text-xs text-gray-500">
      Account Type
    </p>
  </div>

</div>

 {!profile.verified && (
  <button
    onClick={() => navigate("/verify")}
    className="px-4 py-2 bg-black mt-8 text-sm hover:bg-purple-700 text-white rounded-lg font-medium transition"
  >
    Verify Account
  </button>
)}

      {/* PROFILE DETAILS */}

      <div className="bg-white rounded-2xl shadow mt-8 p-5">

        <h2 className="font-semibold text-sm mb-5">
          Personal Information
        </h2>

        <div className="space-y-5">

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

              <Mail
                size={18}
                className="text-purple-600"
              />

            </div>

            <div>

              <p className="text-xs text-gray-500">
                Email
              </p>

              <p className="font-medium text-sm">
                {profile.email}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

              <Phone
                size={18}
                className="text-purple-600 "
              />

            </div>

            <div>

              <p className="text-xs text-gray-500">
                Phone Number
              </p>

              <p className="font-medium text-sm">
                {profile.phone || "Not provided"}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

              <Home
                size={18}
                className="text-purple-600"
              />

            </div>

            <div>

              <p className="text-xs text-gray-500">
                Role
              </p>

              <span className="inline-block bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm capitalize">

                {profile.role}

              </span>

            </div>
            <div>

           

            </div>

          </div>
          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

              <CalendarCheck
                size={18}
                className="text-purple-600"
              />

            </div>

            <div>

              <p className="text-xs text-gray-500">
                Joined
              </p>

             <span className="inline-block   rounded-full px-3 py-1 text-sm capitalize">
  {new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</span>

            </div>
            <div>

           

            </div>

          </div>
       

        </div>

      </div>

           {/* My Apartments */}

   {profile.role === "landlord" && (
  <div className="mt-6">

    <div className="flex items-center justify-between mb-2">

      <h2 className="text-base font-semibold">
        My Apartments
      </h2>

      <button
        onClick={() => navigate("/create-listing")}
        className="bg-purple-600 text-white p-1.5 rounded-lg"
      >
        <Plus size={14} />
      </button>

    </div>

    {properties.length === 0 ? (

      <div className="bg-white rounded-xl p-6 text-center shadow-sm">

        <Building2
          size={40}
          className="mx-auto text-gray-300 mb-2"
        />

        <h3 className="font-medium text-base">
          No Apartments Yet
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Start listing your apartments to receive enquiries.
        </p>

      </div>

    ) : (

      <>
        <div className="flex justify-end mb-2">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
          >
            View all
            <ArrowRight size={13} />
          </button>

        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

          {properties.map((property) => (

            <ApartmentCard
              key={property.id}
              property={property}
            />

          ))}

        </div>

      </>

    )}

  </div>
)}

      {/* ACTION BUTTONS */}

    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

  {/* Edit Profile */}
  <button
    onClick={() => navigate("/profile/edit")}
    className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
        <Pencil size={18} className="text-purple-600" />
      </div>

      <div className="text-left">
        <p className="font-medium text-gray-900">
          Edit Profile
        </p>
        <p className="text-xs text-gray-500">
          Update your personal information
        </p>
      </div>
    </div>

    <ChevronRight size={18} className="text-gray-400" />
  </button>

  <div className="border-t" />

  {/* Settings */}
  <button
    onClick={() => navigate("/settings")}
    className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
        <Settings size={18} className="text-blue-600" />
      </div>

      <div className="text-left">
        <p className="font-medium text-gray-900">
          Settings
        </p>
        <p className="text-xs text-gray-500">
          Preferences & security
        </p>
      </div>
    </div>

    <ChevronRight size={18} className="text-gray-400" />
  </button>

  <div className="border-t" />

  {/* Logout */}
  <button
    onClick={logout}
    className="w-full flex items-center justify-between px-4 py-4 hover:bg-red-50 transition"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
        <LogOut size={18} className="text-red-600" />
      </div>

      <div className="text-left">
        <p className="font-medium text-red-600">
          Logout
        </p>
        <p className="text-xs text-gray-500">
          Sign out of your account
        </p>
      </div>
    </div>

    <ChevronRight size={18} className="text-gray-400" />
  </button>

</div>

    </div>

  </div>
);
} 