import {
  House,
  Users,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Home",
    path: "/admin",
    icon: House,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Verify",
    path: "/admin/verification",
    icon: ShieldCheck,
  },
];

export default function AdminBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-lg z-50">
      <div className="grid grid-cols-4 h-16">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs transition ${
                  isActive
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                }`
              }
            >
              <Icon size={22} />
              <span className="mt-1">{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}