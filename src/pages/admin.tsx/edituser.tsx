import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../../superbase";

type User = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "tenant" | "landlord";
  avatar_url?: string;
  verified: boolean;
  suspended: boolean;
};

const getInitials = (name: string = "") =>
  name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

export default function EditUser() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<User>({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    role: "tenant",
    avatar_url: "",
    verified: false,
    suspended: false,
  });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setUser(data);
    }

    setLoading(false);
  }

  async function saveUser() {
  setSaving(true);

  const { error } = await supabase
    .from("users")
    .update({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verified: user.verified,
      suspended: user.suspended,
    })
    .eq("id", id);

  setSaving(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("User updated successfully!");

  navigate("/admin/users");
}



  if (loading) {
    return (
      <div className="flex justify-center py-32">
        Loading user...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-600 mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white rounded-3xl shadow p-8">

        <h1 className="text-3xl font-bold">
          Edit User
        </h1>

        <p className="text-gray-500 mt-2">
          Update account information
        </p>

        <div className="flex justify-center mt-8">

          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-purple-600 text-white text-4xl font-bold flex items-center justify-center">
              {getInitials(user.full_name)}
            </div>
          )}

        </div>

        <div className="mt-10 grid gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              value={user.full_name}
              onChange={(e) =>
                setUser({
                  ...user,
                  full_name: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              value={user.email}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              value={user.phone || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  phone: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            />

          </div>

                    {/* Role */}

          <div>

            <label className="block mb-2 font-medium">
              Account Role
            </label>

            <select
              value={user.role}
              onChange={(e) =>
                setUser({
                  ...user,
                  role: e.target.value as "tenant" | "landlord",
                })
              }
              className="w-full border rounded-xl p-3"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>

          </div>

          {/* Verification */}

          <div className="flex items-center justify-between border rounded-xl p-4">

            <div>

              <h3 className="font-semibold">
                Verified Account
              </h3>

              <p className="text-sm text-gray-500">
                Allow this user to become verified.
              </p>

            </div>

            <input
              type="checkbox"
              checked={user.verified}
              onChange={(e) =>
                setUser({
                  ...user,
                  verified: e.target.checked,
                })
              }
              className="w-5 h-5"
            />

          </div>

          {/* Suspension */}

          <div className="flex items-center justify-between border rounded-xl p-4">

            <div>

              <h3 className="font-semibold">
                Suspend User
              </h3>

              <p className="text-sm text-gray-500">
                Suspended users cannot access the app.
              </p>

            </div>

            <input
              type="checkbox"
              checked={user.suspended}
              onChange={(e) =>
                setUser({
                  ...user,
                  suspended: e.target.checked,
                })
              }
              className="w-5 h-5"
            />

          </div>

        </div>
        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={saveUser}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}