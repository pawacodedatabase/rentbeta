import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  UploadCloud,
  CheckCircle,
  Clock3,
  XCircle,
  ArrowLeft,
} from "lucide-react";

import { supabase } from "../../superbase";



const CLOUD_NAME = "dx90y9zdx";
const UPLOAD_PRESET = "adorethebrand";

type Verification = {
  id: string;
  user_id: string;
  id_image: string;
  selfie_image: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function VerifyAccount() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [verification, setVerification] =
    useState<Verification | null>(null);

  const [idImage, setIdImage] =
    useState<File | null>(null);

  const [selfieImage, setSelfieImage] =
    useState<File | null>(null);

  const [idPreview, setIdPreview] =
    useState("");

  const [selfiePreview, setSelfiePreview] =
    useState("");

  useEffect(() => {
    loadVerification();
  }, []);

  async function loadVerification() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data } = await supabase
      .from("verifications")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setVerification(data);
    }
  }

  async function uploadToCloudinary(file: File) {
    const form = new FormData();

    form.append("file", file);

    form.append(
      "upload_preset",
      UPLOAD_PRESET
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message ||
          "Upload failed"
      );
    }

    return data.secure_url;
  }

  function handleID(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    setIdImage(file);

    setIdPreview(
      URL.createObjectURL(file)
    );
  }

  function handleSelfie(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    setSelfieImage(file);

    setSelfiePreview(
      URL.createObjectURL(file)
    );
  }
    async function submitVerification() {
    if (loading) return;

    if (!idImage) {
      alert("Please upload your government ID.");
      return;
    }

    if (!selfieImage) {
      alert("Please upload a selfie.");
      return;
    }

    setLoading(true);

    try {
      // Get logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Prevent duplicate submissions while pending
      const { data: existing } = await supabase
        .from("verifications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing?.status === "pending") {
        alert(
          "Your verification request is already pending review."
        );
        setLoading(false);
        return;
      }

      // Upload ID
      const idImageUrl = await uploadToCloudinary(idImage);

      // Upload Selfie
      const selfieImageUrl = await uploadToCloudinary(
        selfieImage
      );

      // Save verification
      const { error } = await supabase
        .from("verifications")
        .upsert({
          user_id: user.id,
          id_image: idImageUrl,
          selfie_image: selfieImageUrl,
          status: "pending",
        });

      if (error) throw error;

      // Ensure user starts as unverified
      await supabase
        .from("users")
        .update({
          verified: false,
        })
        .eq("id", user.id);

      setVerification({
        id: "",
        user_id: user.id,
        id_image: idImageUrl,
        selfie_image: selfieImageUrl,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      alert(
        "Verification submitted successfully. Please wait while an administrator reviews your documents."
      );

      navigate("/profile");
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const statusColor =
    verification?.status === "approved"
      ? "bg-green-100 text-green-700"
      : verification?.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  const StatusIcon =
    verification?.status === "approved"
      ? CheckCircle
      : verification?.status === "rejected"
      ? XCircle
      : Clock3;
      return (
  <div className="min-h-screen bg-gray-100 py-8 px-4">
    <div className="max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold">
            Verify Identity
          </h1>

          <p className="text-sm text-gray-500">
            Complete your identity verification.
          </p>
        </div>

      </div>

      {/* Status Card */}

      {verification && (
        <div
          className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${statusColor}`}
        >
          <StatusIcon size={32} />

          <div>

            <h2 className="font-bold capitalize text-lg">
              {verification.status}
            </h2>

            <p className="text-sm">

              {verification.status === "pending" &&
                "Your verification is under review."}

              {verification.status === "approved" &&
                "Your account has been verified."}

              {verification.status === "rejected" &&
                "Please upload clearer documents."}

            </p>

          </div>

        </div>
      )}

      {/* Main Card */}

      <div className="bg-white rounded-3xl shadow-lg p-7">

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">

            <ShieldCheck
              className="text-purple-600"
              size={40}
            />

          </div>

        </div>

        <h2 className="text-center text-2xl font-bold mt-5">
          Identity Verification
        </h2>

        <p className="text-center text-gray-500 mt-2">

                  Upload a valid government-issued ID and a clear selfie.
          Verification usually takes less than 24 hours.
        </p>

        {/* Government ID */}

        <div className="mt-8">

          <label className="block font-semibold mb-3">
            Government ID
          </label>

          <label
            className={`border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer transition ${
              verification?.status === "pending"
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-purple-500"
            }`}
          >
            {idPreview ? (
              <img
                src={idPreview}
                alt="Government ID"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <>
                <UploadCloud
                  size={40}
                  className="text-purple-600"
                />

                <p className="mt-3 text-gray-600">
                  Click to upload your ID
                </p>

                <span className="text-xs text-gray-400 mt-2">
                  PNG, JPG or JPEG
                </span>
              </>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleID}
              disabled={verification?.status === "pending"}
            />

          </label>

        </div>

        {/* Selfie */}

        <div className="mt-8">

          <label className="block font-semibold mb-3">
            Selfie
          </label>

          <label
            className={`border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer transition ${
              verification?.status === "pending"
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-purple-500"
            }`}
          >
            {selfiePreview ? (
              <img
                src={selfiePreview}
                alt="Selfie"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <>
                <UploadCloud
                  size={40}
                  className="text-purple-600"
                />

                <p className="mt-3 text-gray-600">
                  Upload a clear selfie
                </p>

                <span className="text-xs text-gray-400 mt-2">
                  Face must be clearly visible
                </span>
              </>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleSelfie}
              disabled={verification?.status === "pending"}
            />

          </label>

        </div>

        {/* Tips */}

        <div className="mt-8 bg-purple-50 rounded-2xl p-5">

          <h3 className="font-semibold mb-2">
            Before you submit
          </h3>

          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">

            <li>
              Upload a valid government-issued ID.
            </li>

            <li>
              Make sure all text on the ID is readable.
            </li>

            <li>
              Your selfie should match your ID photo.
            </li>

            <li>
              Avoid blurry or cropped images.
            </li>

          </ul>

        </div>

        {/* Submit */}

        <button
          onClick={submitVerification}
          disabled={
            loading ||
            verification?.status === "pending"
          }
          className={`w-full mt-8 rounded-2xl py-4 font-semibold text-white transition ${
            verification?.status === "pending"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading
            ? "Uploading..."
            : verification?.status === "pending"
            ? "Verification Pending"
            : verification?.status === "approved"
            ? "Verified"
            : "Submit Verification"}
        </button>

      </div>

    </div>
  </div>
);

} 