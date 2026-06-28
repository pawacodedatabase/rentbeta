import { useCallback, useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { supabase } from "../../superbase";
import bg from "../../assets/elegant-purple-wave-background-design-projects-vector.png";
import {
  Building2,
  // BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  XCircle,
//   MapPin,
} from "lucide-react";
import ApartmentCard from "../profile/apartmentCard";
import ProfileSkeleton from "../profile/profileSkeleton";

type Profile = {
  id: string;
  full_name: string;
  role: "landlord" | "tenant";
  created_at: string;
  avatar_url: string;
  verified: boolean;
};

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
};

export default function PublicProfile() {
  const { id } = useParams();
//   const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

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

    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (!userProfile) {
      setLoading(false);
      return;
    }

    setProfile(userProfile);

    if (userProfile.role === "landlord") {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", id)
        .order("created_at", {
          ascending: false,
        });

      setProperties(data || []);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) return <ProfileSkeleton />;

  if (!profile)
    return (
      <div className="h-screen flex items-center justify-center">
        User not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Cover */}
      <div
        className="relative h-56 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-purple-600">
              {getInitials(profile.full_name)}
            </div>
          )}
        </div>
      </div>

      <div className="pt-20 px-5 max-w-3xl mx-auto">

        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {profile.full_name}
          </h1>

          <div className="flex justify-center mt-2">
            <span className="bg-purple-100 text-purple-700 rounded-full px-4 py-1 capitalize text-sm">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Info */}

        <div className="bg-white rounded-2xl shadow-sm mt-8 p-6">

          <h2 className="font-semibold mb-5">
            About
          </h2>

          <div className="space-y-5">

           <div className="flex items-center gap-3">
  {profile.verified ? (
    <>
      <CheckCircle2 className="text-green-600" size={20} />
      <span className="text-green-600 font-medium">
        Verified Member
      </span>
    </>
  ) : (
    <>
      <XCircle className="text-red-600" size={20} />
      <span className="text-red-600 font-medium">
        Not Verified
      </span>
    </>
  )}
</div>

            <div className="flex items-center gap-3">
              <CalendarCheck className="text-purple-600" />
              <span>
                Joined{" "}
                {new Date(
                  profile.created_at
                ).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {profile.role === "landlord" && (
              <div className="flex items-center gap-3">
                <Building2 className="text-purple-600" />
                <span>
                  {properties.length}{" "}
                  {properties.length === 1
                    ? "Apartment"
                    : "Apartments"}
                </span>
              </div>
            )}

          </div>

        </div>

        {profile.role === "landlord" &&
          properties.length > 0 && (
            <div className="mt-8">

              <h2 className="text-xl font-semibold mb-4">
                Listed Apartments
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {properties.map((property) => (
                  <ApartmentCard
                    key={property.id}
                    property={property}
                  />
                ))}

              </div>

            </div>
          )}

      </div>
    </div>
  );
}