import { Navigate } from "react-router-dom";
import { useUserRole } from "../../../components/userRole";

const LandlordOnlyRoute = ({ children }: any) => {
  const { role, loading } = useUserRole();

  if (loading) return <p>Loading...</p>;

  if (role !== "landlord") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default LandlordOnlyRoute;