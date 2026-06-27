import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
};

type Props = {
  property: Property;
};

export default function ApartmentCard({ property }: Props) {
  const navigate = useNavigate();

  const image =
    property.images?.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200";

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`)}
      className="
        min-w-[170px]
        max-w-[170px]
        bg-white
        rounded-xl
        overflow-hidden
        shadow-sm
        border
        border-gray-100
        cursor-pointer
        hover:shadow-md
        transition-all
        duration-300
      "
    >
      <img
        src={image}
        alt={property.title}
        className="w-full h-24 object-cover"
      />

      <div className="p-2.5">

        <h3 className="font-semibold text-sm line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 mt-1 text-gray-500">
          <MapPin size={12} />

          <span className="text-[11px] line-clamp-1">
            {property.location}
          </span>
        </div>

        <div className="mt-2">
          <span className="text-purple-600 text-sm font-bold">
            ₦{property.price.toLocaleString()}
          </span>

          <span className="text-[10px] text-gray-500">
            {" "}
            / year
          </span>
        </div>

      </div>
    </div>
  );
}