import {
  LayoutDashboard,
  Users,
  ShieldCheck,

  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../superbase";

const links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    name: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    name: "Verification",
    icon: ShieldCheck,
    path: "/admin/verification",
  },
  // {
  //   name: "Properties",
  //   icon: Building2,
  //   path: "/admin/properties",
  // },
  // {
  //   name: "Reports",
  //   icon: Flag,
  //   path: "/admin/reports",
  // },
];

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function AdminSidebar({ open, setOpen }: Props) {
  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          z-50
          h-screen
          w-72
          bg-white
          shadow-lg
          flex flex-col
          transition-transform duration-300
          ${
            open ? "translate-x-0" : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b">
          <h1 className="text-2xl font-bold text-purple-600">
            RentBeta Admin
          </h1>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <X />
          </button>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-5">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl py-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}