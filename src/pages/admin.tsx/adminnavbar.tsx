import { Bell, Menu } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function AdminNavbar({ setOpen }: Props) {
  return (
    <header className="bg-white h-20 shadow flex items-center justify-between px-4 md:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={28} />
        </button>

        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            Admin Dashboard
          </h2>

          <p className="hidden sm:block text-gray-500">
            Manage your platform
          </p>
        </div>
      </div>

      {/* Right */}
      <button className="relative">
        <Bell size={24} />

        <span className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center">
          3
        </span>
      </button>
    </header>
  );
}