import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "../../superbase";
import UserCard from "./userCard";


type User = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "landlord" | "tenant";
  avatar_url?: string;
  verified: boolean;
  created_at: string;
};

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setUsers(data);
    }

    setLoading(false);
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = search.toLowerCase();

      return (
        user.full_name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div>

       
      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Users
          </h1>

          <p className="text-gray-500">
            Manage all registered users
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="relative mb-8">

        <Search
          className="absolute left-4 top-3.5 text-gray-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search users..."
          className="w-full bg-white rounded-xl border pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">

            <tr className="text-left">

              <th className="px-6 py-4">
                User
              </th>

              <th>Email</th>

              <th>Role</th>

              <th>Verified</th>

              <th>Joined</th>

              <th className="text-right pr-6">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-16"
                >
                  Loading users...
                </td>

              </tr>

            ) : paginatedUsers.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-16"
                >
                  No users found.
                </td>

              </tr>

            ) : (

              paginatedUsers.map((user) => (

                <UserCard
                  key={user.id}
                  user={user}
                  reload={loadUsers}
                />

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2 mt-8">

          {Array.from({
            length: totalPages,
          }).map((_, index) => (

            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`w-10 h-10 rounded-lg ${
                page === index + 1
                  ? "bg-purple-600 text-white"
                  : "bg-white border"
              }`}
            >
              {index + 1}
            </button>

          ))}

        </div>

      )}

    </div>
  );
}