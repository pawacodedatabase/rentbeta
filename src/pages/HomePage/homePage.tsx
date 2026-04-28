import { useEffect, useState } from "react";
import { supabase } from "../../superbase";
import { Link } from "react-router-dom";
import bgImg from '../../assets/hero.avif'
import {
  Wifi,
  Snowflake,
  Tv,
  Car,
  Dumbbell,
  Waves,
  Shield,
  Sofa,
  Home,
  CalendarDays,
  Tag,
  BedDouble,
  Bath,
  Search,
  ArrowRight,
  LampCeiling,
} from "lucide-react";

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
  POP_Ceiling: <LampCeiling size={14} />,
};

const listingTypeIcons: Record<string, JSX.Element> = {
  Shortlet: <CalendarDays size={14} />,
  Rent: <Home size={14} />,
  Sale: <Tag size={14} />,
};



/* ---------------- SKELETON ---------------- */
const SkeletonCard = () => {
  return (
    <div className="border rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />

      <div className="p-3 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />

        <div className="flex gap-2 mt-3">
          <div className="h-5 w-12 bg-gray-200 rounded" />
          <div className="h-5 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
  search: "",
  minPrice: "",
  maxPrice: "",
  listing_type: "",
});

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    setProperties(data || []);
    setLoading(false);
  };

  const formatMoney = (value: string) => {
  if (!value) return "";
  const num = Number(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
  });
};




  const filteredProperties = properties.filter((p) => {
  const matchesName =
    p.title.toLowerCase().includes(filters.search.toLowerCase());

  const matchesLocation =
    p.location.toLowerCase().includes(filters.search.toLowerCase());

  const matchesPrice =
    (!filters.minPrice || p.price >= Number(filters.minPrice)) &&
    (!filters.maxPrice || p.price <= Number(filters.maxPrice));

  const matchesType =
    !filters.listing_type || p.listing_type === filters.listing_type;

  return (matchesName || matchesLocation) && matchesPrice && matchesType;
});
const randomProperties = [...filteredProperties]
  .sort(() => 0.5 - Math.random())
  .slice(0, 4);
  return (
    <div className="">

 <div
  className="relative w-full h-[80vh] mb-6 overflow-hidden flex items-center justify-center"
  style={{
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/0"></div>

  {/* CONTENT WRAPPER */}
  <div className="relative z-10 w-full max-w-5xl px-4 text-center">

    {/* BRAND TEXT */}
   <h1 className="text-4xl md:text-6xl font-light text-white leading-tight tracking-wide">
  Your Next Home  
  <span className="block font-semibold text-purple-300">
    Starts Here
  </span>
</h1>

<p className="mt-5 text-white/70 text-sm md:text-lg max-w-xl mx-auto">
  Explore verified listings for apartments, shortlets, and properties across Nigeria with ease and confidence.
</p>

    {/* SEARCH BOX */}
    <div className="mt-8 flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">

      {/* SEARCH NAME / LOCATION */}
      <div className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white focus-within:ring-2 focus-within:ring-purple-400">
        <Search size={18} className="text-white/70" />

        <input
          placeholder="Search name or location..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="w-full outline-none bg-transparent placeholder-white/70 text-white"
        />
      </div>

      {/* MIN PRICE */}
      <div className="flex items-center gap-2 w-full md:w-40 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white focus-within:ring-2 focus-within:ring-purple-400">
        <span className="text-white/70 text-sm">₦</span>

        <input
          placeholder="Min"
          value={filters.minPrice ? formatMoney(filters.minPrice) : ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              minPrice: e.target.value.replace(/,/g, ""),
            })
          }
          className="w-full outline-none bg-transparent placeholder-white/70 text-white"
        />
      </div>

      {/* MAX PRICE */}
      <div className="flex items-center gap-2 w-full md:w-40 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white focus-within:ring-2 focus-within:ring-purple-400">
        <span className="text-white/70 text-sm">₦</span>

        <input
          placeholder="Max"
          value={filters.maxPrice ? formatMoney(filters.maxPrice) : ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              maxPrice: e.target.value.replace(/,/g, ""),
            })
          }
          className="w-full outline-none bg-transparent placeholder-white/70 text-white"
        />
      </div>

      {/* LISTING TYPE */}
      <div className="flex items-center gap-2 w-full md:w-48 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white focus-within:ring-2 focus-within:ring-purple-400">
        <Tag size={18} className="text-white/70" />

        <select
          value={filters.listing_type}
          onChange={(e) =>
            setFilters({ ...filters, listing_type: e.target.value })
          }
          className="w-full outline-none bg-transparent text-white"
        >
          <option value="">All Types</option>
          <option value="Rent">Rent</option>
          <option value="Sale">Sale</option>
          <option value="Shortlet">Shortlet</option>
        </select>
      </div>

    </div>

  </div>
</div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
<div className="text-center mb-6">
  <p className="text-xl font-semibold text-gray-700 relative inline-block">
    Available Properties

    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-purple-600 rounded-full"></span>
  </p>
</div>

      {/* GRID */}
      {!loading && (
  <>
    <div className="grid grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

      {randomProperties.map((p) => (
        <Link
          to={`property/${p.id}`}
          key={p.id}
          className="border rounded-xl overflow-hidden hover:shadow-lg transition"
        >

          {/* IMAGE */}
          <div className="h-48 w-full overflow-hidden relative">
            <img
              src={p.images?.[0]}
              className="w-full h-full object-cover hover:scale-105 transition"
            />

            {/* LISTING TYPE BADGE */}
            {p.listing_type && (
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
                {listingTypeIcons[p.listing_type] || null}
                {p.listing_type}
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-3">

            <h2 className="font-semibold text-lg truncate">
              {p.title}
            </h2>

            <p className="text-gray-500 text-sm">
              {p.location}
            </p>

            <p className="mt-2 font-bold text-purple-600">
              ₦{p.price.toLocaleString()}
            </p>

            {/* AMENITIES */}
            {p.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {p.amenities.slice(0, 4).map((a) => (
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

            {/* BED / BATH ICONS */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <BedDouble size={14} />
                {p.bedrooms}
              </span>

              <span className="flex items-center gap-1">
                <Bath size={14} />
                {p.bathrooms}
              </span>
            </div>

          </div>
        </Link>
      ))}

    </div>

    {/* VIEW ALL BUTTON */}
    <div className="flex justify-center mt-2 mb-8">
      <Link
        to="/property"
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded text-sm font-semibold transition shadow-md"
      >
        View All Properties
        <ArrowRight size={16} />
      </Link>
    </div>
  </>
)}

      {/* EMPTY STATE */}
      {!loading && properties.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No apartments available yet
        </p>
      )}

    </div>
  );
};

export default HomePage;