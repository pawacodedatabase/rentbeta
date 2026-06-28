// src/pages/admin/users/UserCard.tsx

import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Eye,
  Ban,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../superbase";

type User = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "landlord" | "tenant";
  avatar_url?: string;
  verified: boolean;
  created_at: string;
  suspended?: boolean;
};

type Props = {
  user: User;
  reload: () => void;
};

const getInitials = (name: string = "") => {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export default function UserCard({
  user,
  reload,
}: Props) {
  async function toggleVerification() {
    const { error } = await supabase
      .from("users")
      .update({
        verified: !user.verified,
      })
      .eq("id", user.id);

    if (!error) reload();
  }

  async function toggleSuspend() {
    const { error } = await supabase
      .from("users")
      .update({
        suspended: !user.suspended,
      })
      .eq("id", user.id);

    if (!error) reload();
  }

  async function deleteUser() {
    if (!window.confirm("Delete this user?")) return;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    if (!error) reload();
  }

  return (
    <tr className="border-b hover:bg-gray-50 transition">

      {/* User */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-4">

          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
              {getInitials(user.full_name)}
            </div>
          )}

          <div>

            <h3 className="font-semibold">
              {user.full_name}
            </h3>

            <p className="text-xs text-gray-500">
              {user.phone || "No phone"}
            </p>

          </div>

        </div>

      </td>

      {/* Email */}

      <td className="text-sm text-gray-600">
        {user.email}
      </td>

      {/* Role */}

      <td>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            user.role === "landlord"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {user.role}
        </span>

      </td>

      {/* Verification */}

      <td>

        <button
          onClick={toggleVerification}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            user.verified
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.verified ? (
            <>
              <CheckCircle2 size={15} />
              Verified
            </>
          ) : (
            <>
              <XCircle size={15} />
              Pending
            </>
          )}
        </button>

      </td>

      {/* Joined */}

      <td className="text-sm text-gray-500">
        {new Date(user.created_at).toLocaleDateString()}
      </td>

      {/* Actions */}

      <td>

        <div className="flex justify-end gap-2 pr-6">

          {/* View */}

          <Link
            to={`/user/${user.id}`}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <Eye size={17} />
          </Link>

          {/* Edit */}

          <Link
            to={`/admin/users/edit/${user.id}`}
            className="w-9 h-9 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center"
          >
            <Pencil size={17} />
          </Link>

          {/* Suspend */}

          <button
            onClick={toggleSuspend}
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              user.suspended
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100"
            }`}
          >
            <Ban size={17} />
          </button>

          {/* Delete */}

          <button
            onClick={deleteUser}
            className="w-9 h-9 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
          >
            <Trash2 size={17} />
          </button>

        </div>

      </td>

    </tr>
  );
}