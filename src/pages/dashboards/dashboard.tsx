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

  if (!role) return <p>Loading...</p>;

  return role === "tenant" ? <TenantDashboard /> : <LandlordDashboard />;
};

export default Dashboard;
