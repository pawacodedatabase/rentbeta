import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import "animate.css";
import Signup from "./pages/HomePage/signup";
import Login from "./pages/HomePage/login";
import Dashboard from "./pages/dashboards/dashboard";
import CreateListing from "./pages/dashboards/Landlord/createListing";
import LandlordOnlyRoute from "./pages/dashboards/Landlord/landlordOnlyRoutes";
import HomePage from "./pages/HomePage/homePage";
import PropertyDetails from "./pages/Property/propertyDetails";
import PropertiesPage from "./pages/Property/property";
import Header from "./components/header";

import { supabase } from "./superbase"; // make sure path is correct
import Footer from "./pages/footer";
import ScrollToTop from "./components/scroll";
import ChatRoom from "./pages/chat/chat";
import Conversations from "./pages/chat/conversation";
import ChatFAB from "./pages/chat/chatFab";
import EditProfile from "./pages/profile/editProfilee";
import Profile from "./pages/profile/profile";
import ProfileSettings from "./pages/profile/profileSettings";
import PublicProfile from "./pages/profile/publicProfile";
import VerifyAccount from "./pages/verification/VerifyAccount";
import AdminDashboard from "./pages/admin.tsx/adminDashboard";
import AdminLayout from "./pages/admin.tsx/adminlayout";
import EditUser from "./pages/admin.tsx/edituser";
// import UserCard from "./pages/admin.tsx/userCard";
import UsersPage from "./pages/admin.tsx/userPage";
import VerificationPage from "./pages/admin.tsx/VerificationPage";
import VerificationDetails from "./pages/admin.tsx/verificationDetails";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // get current session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <div className="font-sans">
        <ScrollToTop/>
        <ChatFAB/>
        
        {/* ✅ Header now inside Router */}
        <Header user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/property" element={<PropertiesPage />} />
<Route path="/chat/:conversationId" element={<ChatRoom />} />
<Route path="/profile/edit" element={<EditProfile />} />
<Route path="/profile" element={<Profile />} />
<Route path="/settings" element={<ProfileSettings />} />
<Route path="/chat" element={<Conversations />} />
<Route path="/verify" element={<VerifyAccount />} />

<Route path="/user/:id" element={<PublicProfile />} />

<Route path="/admin" element={<AdminLayout />} />
<Route path="/admin/users" element={<UsersPage />} />
<Route path="/admin/users/edit/:id" element={<EditUser />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/verification" element={<VerificationPage />} />
<Route path="/admin/verification/details" element={<VerificationDetails />} />
<Route path="/users:id" element={<EditUser />} />
          <Route
            path="/create-listing"
            element={
              <LandlordOnlyRoute>
                <CreateListing />
              </LandlordOnlyRoute>
            }
            
           
          />
        </Routes>

         <Footer/>
      </div>
    </Router>
  );
};

export default App;