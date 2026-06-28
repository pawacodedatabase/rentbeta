import { Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../superbase";

type Props = {
  verification: any;
  reload: () => void;
};

const getInitials = (name: string = "") =>
  name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

export default function VerificationCard({
  verification,
  reload,
}: Props) {
  const navigate = useNavigate();

  async function approve() {
    // Update verification status
    await supabase
      .from("verification")
      .update({
        status: "approved",
      })
      .eq("id", verification.id);

    // Update user account
    await supabase
      .from("users")
      .update({
        verified: true,
      })
      .eq("id", verification.user_id);

    reload();
  }

  async function reject() {
    await supabase
      .from("verification")
      .update({
        status: "rejected",
      })
      .eq("id", verification.id);

    await supabase
      .from("users")
      .update({
        verified: false,
      })
      .eq("id", verification.user_id);

    reload();
  }

  async function deleteRequest() {
    if (
      !window.confirm(
        "Delete this verification request?"
      )
    )
      return;

    await supabase
      .from("verification")
      .delete()
      .eq("id", verification.id);

    reload();
  }

  const statusColor =
    verification.status === "approved"
      ? "bg-green-100 text-green-700"
      : verification.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <tr className="border-b hover:bg-gray-50 transition">

      {/* USER */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-4">

          {verification.users?.avatar_url ? (
            <img
              src={verification.users.avatar_url}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
              {getInitials(
                verification.users?.full_name
              )}
            </div>
          )}

          <div>

            <h3 className="font-semibold">
              {verification.users?.full_name}
            </h3>

            <p className="text-sm text-gray-500">
              {verification.users?.email}
            </p>

          </div>

        </div>

      </td>

      {/* STATUS */}

      <td>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor}`}
        >
          {verification.status}
        </span>

      </td>

      {/* DATE */}

      <td>

        {new Date(
          verification.created_at
        ).toLocaleDateString()}

      </td>

      {/* ACTIONS */}

      <td className="pr-6">

        <div className="flex justify-end gap-2">

          {/* VIEW */}

          <button
            onClick={() =>
              navigate(
                `/admin/verification/${verification.id}`
              )
            }
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
          >
            <Eye
              size={18}
              className="text-blue-600"
            />
          </button>

          {/* APPROVE */}

          {verification.status !== "approved" && (
            <button
              onClick={approve}
              className="p-2 rounded-lg bg-green-100 hover:bg-green-200"
            >
              <CheckCircle
                size={18}
                className="text-green-600"
              />
            </button>
          )}

          {/* REJECT */}

          {verification.status !== "rejected" && (
            <button
              onClick={reject}
              className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200"
            >
              <XCircle
                size={18}
                className="text-yellow-700"
              />
            </button>
          )}

          {/* DELETE */}

          <button
            onClick={deleteRequest}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
          >
            <Trash2
              size={18}
              className="text-red-600"
            />
          </button>

        </div>

      </td>

    </tr>
  );
}