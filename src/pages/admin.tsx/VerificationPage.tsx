import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "../../superbase";
import VerificationCard from "./VerificationCard";

type Verification = {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;

  users: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
};

export default function VerificationPage() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [verifications, setVerifications] =
    useState<Verification[]>([]);

  useEffect(() => {
    loadVerification();
  }, []);

  async function loadVerification() {
    setLoading(true);

    const { data, error } = await supabase
      .from("verification")
      .select(
        `
        *,
        users(
            full_name,
            email,
            avatar_url
        )
    `
      )
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setVerifications(data as any);
    }

    setLoading(false);
  }

  const filtered = useMemo(() => {
    return verifications.filter((v) => {
      const q = search.toLowerCase();

      return (
        v.users.full_name
          ?.toLowerCase()
          .includes(q) ||
        v.users.email
          ?.toLowerCase()
          .includes(q)
      );
    });
  }, [verifications, search]);

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Verification Requests
          </h1>

          <p className="text-gray-500">
            Review users requesting verification.
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="relative mb-8">

        <Search
          size={18}
          className="absolute left-4 top-3.5 text-gray-400"
        />

        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl pl-11 pr-4 py-3"
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-6 py-4">
                User
              </th>

              <th>Status</th>

              <th>Date</th>

              <th className="text-right pr-6">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={4}
                  className="text-center py-20"
                >
                  Loading...
                </td>

              </tr>

            ) : filtered.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="text-center py-20"
                >
                  No verification requests.
                </td>

              </tr>

            ) : (

              filtered.map((verification) => (

                <VerificationCard
                  key={verification.id}
                  verification={verification}
                  reload={loadVerification}
                />

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}