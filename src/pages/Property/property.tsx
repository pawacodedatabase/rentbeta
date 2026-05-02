import { useEffect, useState } from "react";
import { supabase } from "../../superbase";
import { Link } from "react-router-dom";
// import bgImg from "../../assets/hero.avif";
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
  // ArrowRight,
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

const PropertyPage = () => {
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
    return num.toLocaleString("en-NG");
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.location.toLowerCase().includes(filters.search.toLowerCase());

    const matchesPrice =
      (!filters.minPrice || p.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || p.price <= Number(filters.maxPrice));

    const matchesType =
      !filters.listing_type || p.listing_type === filters.listing_type;

    return matchesSearch && matchesPrice && matchesType;
  });

  return (
    <div>
      {/* HERO SEARCH (same as home) */}
      <div
        className="relative w-full h-[50vh] flex items-center justify-center mb-6"
        style={{
          backgroundColor: '#8d31c7',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          {/* <h1 className="text-4xl md:text-5xl font-light text-white">
            Explore All Properties
            <span className="block font-semibold text-purple-300">
              Across Nigeria
            </span>
          </h1> */}

          <p className="text-white/70 mt-3">
            Find apartments, shortlets and homes that match your lifestyle
          </p>

          {/* SEARCH */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">

            {/* SEARCH */}
            <div className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-white/20 text-white">
              <Search size={18} className="text-white/70" />
              <input
                placeholder="Search name or location..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full bg-transparent outline-none text-white placeholder-white/70"
              />
            </div>

            {/* MIN */}
            <input
              placeholder="Min price"
              value={filters.minPrice ? formatMoney(filters.minPrice) : ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minPrice: e.target.value.replace(/,/g, ""),
                })
              }
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />

            {/* MAX */}
            <input
              placeholder="Max price"
              value={filters.maxPrice ? formatMoney(filters.maxPrice) : ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxPrice: e.target.value.replace(/,/g, ""),
                })
              }
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />

            {/* TYPE */}
            <select
              value={filters.listing_type}
              onChange={(e) =>
                setFilters({ ...filters, listing_type: e.target.value })
              }
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            >
              <option value="">All Types</option>
              <option value="Rent">Rent</option>
              <option value="Sale">Sale</option>
              <option value="Shortlet">Shortlet</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

<h3 className="text-xl text-center font-semibold text-gray-600">Available Properties</h3>
        {filteredProperties.map((p) => (
          <Link
            to={`/property/${p.id}`}
            key={p.id}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {/* IMAGE */}
            <div className="h-48 w-full relative">
              <img
                src={p.images?.[0]}
                className="w-full h-full object-cover"
              />

              {p.listing_type && (
                <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  {listingTypeIcons[p.listing_type]}
                  {p.listing_type}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-3">
              <h2 className="font-semibold truncate">{p.title}</h2>
              <p className="text-gray-500 text-sm">{p.location}</p>

              <p className="text-purple-600 font-bold mt-2">
                ₦{p.price.toLocaleString()}
              </p>

              {/* AMENITIES */}
              <div className="flex flex-wrap gap-2 mt-2">
                {p.amenities?.slice(0, 3).map((a) => (
                  <span
                    key={a}
                    className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {amenityIcons[a]}
                    {a}
                  </span>
                ))}
              </div>

              {/* BED/BATH */}
              <div className="flex gap-3 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <BedDouble size={14} /> {p.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath size={14} /> {p.bathrooms}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* EMPTY */}
      {!loading && filteredProperties.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No properties found
        </p>
      )}
    </div>
  );
};

export default PropertyPage;