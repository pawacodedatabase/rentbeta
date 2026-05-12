import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "../../superbase";
import {
  Wifi,
  Snowflake,
  Tv,
  Car,
  Dumbbell,
  Waves,
  Shield,
  Sofa,
  ArrowLeft,
  Phone,
} from "lucide-react";

type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  user_id: string;
};

type Landlord = {
  full_name: string;
  email: string;
  phone: string;
};

const amenityIcons: Record<string, JSX.Element> = {
  WiFi: <Wifi size={16} />,
  AC: <Snowflake size={16} />,
  TV: <Tv size={16} />,
  Garage: <Car size={16} />,
  Gym: <Dumbbell size={16} />,
  Pool: <Waves size={16} />,
  Security: <Shield size={16} />,
  Furnished: <Sofa size={16} />,
};


const PropertyDetailsSkeleton = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">

      {/* BACK BUTTON */}
      <div className="h-5 w-24 bg-gray-200 rounded mb-4" />

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
        <div className="h-80 col-span-2 bg-gray-200" />
        <div className="h-40 bg-gray-200" />
        <div className="h-40 bg-gray-200" />
        <div className="h-40 bg-gray-200" />
        <div className="h-40 bg-gray-200" />
      </div>

      {/* TITLE + PRICE */}
      <div className="mt-6 flex justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>

        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>

      {/* DESCRIPTION */}
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>

      {/* BED / BATH */}
      <div className="mt-3 h-3 w-32 bg-gray-200 rounded" />

      {/* AMENITIES */}
      <div className="mt-5">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>

      {/* HOST CARD */}
      <div className="mt-8 border rounded-xl p-4 bg-gray-100 space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-8 w-40 bg-gray-200 rounded mt-3" />
      </div>

    </div>
  );
};



const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [user, setUser] = useState<any>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    setLoading(true);
   setUser('');

    const { data: propertyData } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    setProperty(propertyData);

    if (propertyData?.user_id) {
      const { data: userData } = await supabase
        .from("users")
        .select("full_name, email, phone")
        .eq("id", propertyData.user_id)
        .single();

      setLandlord(userData);
    }

    setLoading(false);
  };

  const handleWhatsApp = () => {
    if (!user?.phone) return;

    const phone = user.phone.replace(/\D/g, ""); // clean number

    const message = `Hi, I'm interested in your property: ${property?.title}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

if (loading) return <PropertyDetailsSkeleton />;
 if (!property)
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white border rounded-2xl shadow-md p-8 text-center max-w-md w-full">

        {/* ICON */}
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl">
          🏠
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-800">
          Property Not Found
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-500 text-sm mt-2">
          The property you're looking for doesn’t exist or may have been removed.
        </p>

        {/* ACTION BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600"
      >
        <ArrowLeft size={18} /> Go Back
      </button>

      {/* IMAGE HERO */}
      <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
        <img
          src={property.images?.[0]}
          className="h-80 w-full object-cover col-span-2"
        />

        {property.images?.slice(1, 5).map((img, i) => (
          <img key={i} src={img} className="h-40 w-full object-cover" />
        ))}
      </div>

      {/* TITLE + PRICE */}
      <div className="mt-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="text-gray-500">{property.location}</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">
            ₦{property.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-4 text-gray-700">{property.description}</p>

      <p className="mt-2 text-sm text-gray-500">
        {property.bedrooms} bed • {property.bathrooms} bath
      </p>

      {/* AMENITIES */}
      {property.amenities?.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold mb-2">Amenities</h3>

          <div className="flex flex-wrap gap-2">
            {property.amenities.map((a) => (
              <span
                key={a}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {amenityIcons[a] || null}
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* LANDLORD CARD */}
      <div className="mt-8 border rounded-xl p-4 bg-gray-50">
        <h2 className="font-bold text-lg">Hosted by {landlord?.full_name}</h2>

        <p className="text-sm text-gray-600">{landlord?.email}</p>

       <div className="flex items-center gap-3 mt-3">
  
  {/* WHATSAPP BUTTON */}
  <button
    onClick={handleWhatsApp}
    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
  >
    <FaWhatsapp  size={18} />
    WhatsApp Landlord
  </button>

  {/* CALL BUTTON */}
  <a
    href={`tel:${user?.phone}`}
    className="flex items-center gap-2 bg-black hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
  >
    <Phone size={18} />
    Call Landlord
  </a>

</div>
      </div>

      {/* ACTIONS */}
      {/* <div className="mt-6 flex gap-3">
        <button className="border px-4 py-2 rounded">❤️ Save</button>
        <button className="border px-4 py-2 rounded">Share</button>
      </div> */}
    </div>
  );
};

export default PropertyDetails;
