import { useEffect, useState } from "react";
import { supabase } from "../../../superbase";
import { Link, useNavigate } from "react-router-dom";
import { Home, CalendarDays, Tag, SquarePen } from "lucide-react";
type Property = {
  id: string;
  title: string;
  location: string;
  images: string;
  listing_type : string;
};

const listingTypeIcons: Record<string, JSX.Element> = {
  Shortlet: <CalendarDays size={14} />,
  Rent: <Home size={14} />,
  Sale: <Tag size={14} />,
};



const LandlordDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [myListings, setMyListings] = useState<Property[]>([]);
  

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAndListings();
  }, []);

  const fetchUserAndListings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // GET PROFILE FROM USERS TABLE
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    setUser(profile);

    // GET LISTINGS
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id);

    setMyListings(data || []);
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="p-6">

      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center mb-6">

<Link
  to="/create-listing"
  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
>
  <SquarePen size={18} />
  Add / Edit Listing
</Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* ---------------- PROFILE ---------------- */}
      <div className="mb-6 p-4 border rounded-xl bg-gray-50">
        <h2 className="text-xl font-bold">
          {user?.full_name || "No Name"} Profile
        </h2>

        <p>
          <span className="font-semibold">Email:</span> {user?.email}
        </p>

        <p>
          <span className="font-semibold">Role:</span> {user?.role}
        </p>

        <p>
          <span className="font-semibold">Phone:</span> {user?.phone}
        </p>

        <p>
          <span className="font-semibold">User ID:</span> {user?.id}
        </p>
      </div>

      {/* ---------------- LISTINGS ---------------- */}
      <div className="grid grid-cols-3 gap-4 mt-6">
  {myListings.map((p) => (
    <Link
      to={`/property/${p.id}`}
      key={p.id}
      className="border rounded-xl overflow-hidden hover:shadow-lg transition"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative">
        <img
          src={p.images?.[0]}
          className="h-32 w-full object-cover"
        />

        {/* 🔥 LISTING TYPE BADGE */}
        {p.listing_type && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
            {listingTypeIcons[p.listing_type] || null}
            {p.listing_type}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h2 className="font-bold">{p.title}</h2>
        <p className="text-sm text-gray-500">{p.location}</p>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
};

export default LandlordDashboard;