// src/components/Header.tsx
import { Link } from "react-router-dom";
import { UserCircle, LogOut, LogIn, UserPlus } from "lucide-react";
import logo from '../assets/icons/logo.png'
type HeaderProps = {
  user: any; // replace with your user type
  onLogout: () => void;
};

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <Link to="/" className="text-xl font-semibold text-purple-600">
       <img src={logo} alt="" width={100}/>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {!user ? (
        
<>
  {/* LOGIN */}
  <Link
    to="/login"
    className="flex text-[10px] items-center gap-2 px-2 py-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition font-medium"
  >
    <LogIn size={18} />
    Login
  </Link>

  {/* SIGN UP */}
  <Link
    to="/signup"
    className="flex text-[10px] items-center gap-2 px-2 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition font-medium shadow-sm hover:shadow-md"
  >
    <UserPlus size={18} />
    Sign Up
  </Link>
</>
        ) : (
          <div className="flex items-center gap-3">
            
            {/* User Icon */}
            <div className="flex items-center gap-2 cursor-pointer">
              <UserCircle className="w-7 h-7 text-purple-600" />
              <span className="text-sm text-gray-700">
                {user?.name || "User"}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;