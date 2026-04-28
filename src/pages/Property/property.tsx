import { useEffect, useState } from "react";
import { supabase } from "../../superbase";
import { Link } from "react-router-dom";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities?: string[];
};

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);

  // filters
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [amenity, setAmenity] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    setProperties(data || []);
    setFiltered(data || []);
  };

  // ---------------- FILTER LOGIC ----------------
  useEffect(() => {
    let result = [...properties];

    // LOCATION FILTER
    if (location) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase()),
      );
    }

    // PRICE FILTER
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // BEDROOM FILTER
    if (bedrooms) {
      result = result.filter((p) => p.bedrooms === Number(bedrooms));
    }

    // AMENITIES FILTER
    if (amenity) {
      result = result.filter((p) => p.amenities?.includes(amenity));
    }

    setFiltered(result);
  }, [location, minPrice, maxPrice, bedrooms, amenity, properties]);

  return (
    <div className="p-6">
      {/* ---------------- FILTER BAR ---------------- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <input
          placeholder="Location"
          className="border p-2 rounded"
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          placeholder="Min Price"
          type="number"
          className="border p-2 rounded"
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          placeholder="Max Price"
          type="number"
          className="border p-2 rounded"
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setBedrooms(e.target.value)}
        >
          <option value="">Bedrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setAmenity(e.target.value)}
        >
          <option value="">Amenities</option>
          <option value="wifi">WiFi</option>
          <option value="parking">Parking</option>
          <option value="ac">AC</option>
          <option value="pool">Pool</option>
        </select>
      </div>

      {/* ---------------- GRID ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <Link
            to={`/property/${p.id}`}
            key={p.id}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <img src={p.images?.[0]} className="h-48 w-full object-cover" />

            <div className="p-3">
              <h2 className="font-semibold truncate">{p.title}</h2>

              <p className="text-gray-500 text-sm">{p.location}</p>

              <p className="text-purple-600 font-bold mt-2">${p.price}</p>

              <p className="text-xs text-gray-400">
                {p.bedrooms} bed • {p.bathrooms} bath
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No properties match your filters
        </p>
      )}
    </div>
  );
};

export default PropertiesPage;
