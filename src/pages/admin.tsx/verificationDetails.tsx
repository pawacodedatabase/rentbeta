import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../superbase";

type Verification = {
  id: string;
  user_id: string;

  full_name: string;
  email: string;
  phone: string;

  id_type: string;
  id_number: string;

  selfie_url: string;
  id_front_url: string;
  id_back_url: string;
  proof_of_address_url: string;

  status: "pending" | "approved" | "rejected";

  created_at: string;
};

const getInitials = (name: string = "") =>
  name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

export default function VerificationDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [verification, setVerification] =
    useState<Verification | null>(null);

  const [userAvatar, setUserAvatar] =
    useState("");

  useEffect(() => {
    loadVerification();
  }, []);

  async function loadVerification() {
    const { data, error } = await supabase
      .from("verification")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      navigate(-1);
      return;
    }

    setVerification(data);

    const { data: user } = await supabase
      .from("users")
      .select("avatar_url")
      .eq("id", data.user_id)
      .single();

    setUserAvatar(user?.avatar_url || "");

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        Loading...
      </div>
    );
  }

  if (!verification) return null;


  return (
    <div className="max-w-6xl mx-auto pb-16">

      {/* HEADER */}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-600 mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="flex items-center gap-5">

          {userAvatar ? (
            <img
              src={userAvatar}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 text-white text-3xl font-bold flex items-center justify-center">
              {getInitials(
                verification.full_name
              )}
            </div>
          )}

          <div>

            <h1 className="text-3xl font-bold">
              {verification.full_name}
            </h1>

            <p className="text-gray-500">
              {verification.email}
            </p>

            <p className="text-gray-500">
              {verification.phone}
            </p>

          </div>

        </div>

        {/* INFORMATION */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="border rounded-2xl p-6">

            <h2 className="font-bold mb-4">
              Identity Information
            </h2>

            <div className="space-y-4">

              <div>

                <p className="text-gray-500 text-sm">
                  ID Type
                </p>

                <p className="font-medium">
                  {verification.id_type}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  ID Number
                </p>

                <p className="font-medium">
                  {verification.id_number}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Submitted
                </p>

                <p className="font-medium">
                  {new Date(
                    verification.created_at
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>

          </div>

          <div className="border rounded-2xl p-6">

            <h2 className="font-bold mb-4">
              Verification Status
            </h2>

            <span
              className={`px-4 py-2 rounded-full font-medium capitalize ${
                verification.status ===
                "approved"
                  ? "bg-green-100 text-green-700"
                  : verification.status ===
                    "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {verification.status}
            </span>

          </div>

        </div>

        {/* DOCUMENTS */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-6">
            Uploaded Documents
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div>

              <p className="font-semibold mb-2">
                Selfie
              </p>

              <img
                src={verification.selfie_url}
                className="rounded-xl border w-full h-64 object-cover cursor-pointer hover:scale-105 transition"
                onClick={() =>
                  window.open(
                    verification.selfie_url,
                    "_blank"
                  )
                }
              />

            </div>

            <div>

              <p className="font-semibold mb-2">
                Front of ID
              </p>

              <img
                src={verification.id_front_url}
                className="rounded-xl border w-full h-64 object-cover cursor-pointer hover:scale-105 transition"
                onClick={() =>
                  window.open(
                    verification.id_front_url,
                    "_blank"
                  )
                }
              />

            </div>

            <div>

              <p className="font-semibold mb-2">
                Back of ID
              </p>

              <img
                src={verification.id_back_url}
                className="rounded-xl border w-full h-64 object-cover cursor-pointer hover:scale-105 transition"
                onClick={() =>
                  window.open(
                    verification.id_back_url,
                    "_blank"
                  )
                }
              />

            </div>

            <div>

              <p className="font-semibold mb-2">
                Proof of Address
              </p>

              <img
                src={
                  verification.proof_of_address_url
                }
                className="rounded-xl border w-full h-64 object-cover cursor-pointer hover:scale-105 transition"
                onClick={() =>
                  window.open(
                    verification.proof_of_address_url,
                    "_blank"
                  )
                }
              />

            </div>

          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-wrap justify-end gap-4 mt-10">

          <button
            onClick={rejectVerification}
            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            Reject Verification
          </button>

          <button
            onClick={approveVerification}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition"
          >
            Approve Verification
          </button>

          <button
            onClick={deleteVerification}
            className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-medium transition"
          >
            Delete Request
          </button>

        </div>

      </div>

    </div>
  );

  async function approveVerification() {
  if (!verification) return;

  await supabase
    .from("verification")
    .update({ status: "approved" })
    .eq("id", verification.id);

  await supabase
    .from("users")
    .update({ verified: true })
    .eq("id", verification.user_id);

  alert("Verification Approved");
  navigate("/admin/verification");
}

  async function rejectVerification() {
  if (!verification) return;

  await supabase
    .from("verification")
    .update({ status: "rejected" })
    .eq("id", verification.id);

  await supabase
    .from("users")
    .update({ verified: false })
    .eq("id", verification.user_id);

  alert("Verification Rejected");
  navigate("/admin/verification");
}

  async function deleteVerification() {
  if (!verification) return;

  if (!window.confirm("Delete this verification request?")) return;

  await supabase
    .from("verification")
    .delete()
    .eq("id", verification.id);

  await supabase
    .from("users")
    .update({ verified: false })
    .eq("id", verification.user_id);

  alert("Verification deleted.");
  navigate("/admin/verification");
}
}
