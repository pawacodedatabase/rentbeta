import { useEffect, useState } from "react";
import { supabase } from "../../superbase";
import TenantDashboard from "./Tenant/TenantDashboard";
import LandlordDashboard from "./Landlord/LandlordDashboard";

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(data?.role);
    };

    fetchUser();
  }, []);

  if (!role) return <p> <div className="p-6">
      {/* HEADER SKELETON */}
      <div className="flex justify-between items-center mb-6 animate-pulse">
        <div className="h-10 w-44 bg-gray-300 rounded-full"></div>

        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>

      {/* PROFILE SKELETON */}
      <div className="mb-6 p-4 border rounded-xl bg-gray-50 animate-pulse">
        <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>

        <div className="space-y-3">
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
          <div className="h-4 w-40 bg-gray-300 rounded"></div>
          <div className="h-4 w-52 bg-gray-300 rounded"></div>
          <div className="h-4 w-72 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* CARDS SKELETON */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border rounded-xl overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative animate-pulse">
              <div className="h-32 w-full bg-gray-300"></div>

              <div className="absolute top-2 left-2 h-6 w-20 bg-white rounded-full"></div>
            </div>

            {/* CONTENT */}
            <div className="p-3 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div></p>;

  return role === "tenant" ? <TenantDashboard /> : <LandlordDashboard />;
};

export default Dashboard;
