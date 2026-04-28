import { useEffect, useState } from "react";
import { supabase } from "../../../superbase";
import { useNavigate } from "react-router-dom";
import {
  Wifi,
  Snowflake,
  Tv,
  Car,
  Dumbbell,
  Waves,
  Shield,
  Sofa,
} from "lucide-react";

import { Home, CalendarDays, Tag } from "lucide-react";

const listingTypeIcons: Record<string, JSX.Element> = {
  Shortlet: <CalendarDays size={14} />,
  Rent: <Home size={14} />,
  Sale: <Tag size={14} />,
};



type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  listing_type: string;
};

const amenityIcons: Record<string, JSX.Element> = {
  WiFi: <Wifi size={14} />,
  AC: <Snowflake size={14} />,
  TV: <Tv size={14} />,
  Garage: <Car size={14} />,
  Gym: <Dumbbell size={14} />,
  Pool: <Waves size={14} />,
  Security: <Shield size={14} />,
  Furnished: <Sofa size={14} />,
};

const TenantDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    setUser(profile);

    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    setProperties(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.full_name || "Tenant"}
          </h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading properties...</p>}

      {/* EMPTY STATE */}
      {!loading && properties.length === 0 && (
        <p className="text-gray-500">No properties available</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {properties.map((p) => (
    <div
      key={p.id}
      onClick={() => navigate(`/property/${p.id}`)}
      className="border rounded-xl p-3 cursor-pointer hover:shadow-lg transition"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={p.images?.[0]}
          className="h-40 w-full object-cover rounded"
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
      <h2 className="font-bold mt-2">{p.title}</h2>
      <p className="text-sm text-gray-500">{p.location}</p>

      <p className="font-semibold text-purple-600 mt-1">
        ₦{p.price.toLocaleString()}
      </p>

      <p className="text-xs text-gray-400">
        {p.bedrooms} bed • {p.bathrooms} bath
      </p>

      {/* AMENITIES */}
      {p.amenities?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {p.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {amenityIcons[a] || null}
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  ))}
</div>
    </div>
  );
};

export default TenantDashboard;