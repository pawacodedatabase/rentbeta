import { useEffect, useState } from "react";
import { supabase } from "../../../superbase";

type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[]; 
  listing_type: string; 
};





const CreateListing = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
  });


  const amenitiesOptions = [
  "AC",
  "Furnished",
  "POP_Ceiling",
  "Pool",
  "Garage",
  "WiFi",
  "Security",
  "Gym",
];

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
const [amenities, setAmenities] = useState<string[]>([]);
  const [listings, setListings] = useState<Property[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
const [listingType, setListingType] = useState<string>("");


  const CLOUD_NAME = "dx90y9zdx";
  const UPLOAD_PRESET = "adorethebrand";

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    getUser();
    fetchListings();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) setUserId(user.id);
  };

const fetchListings = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id); // 🔥 THIS IS THE FIX

  setListings(data || []);
};
  // ---------------- IMAGE PREVIEW ----------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 🔥 FIX: append instead of replace
    setImages((prev) => [...prev, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...previewUrls]);
  };

  const toggleAmenity = (item: string) => {
  setAmenities((prev) =>
    prev.includes(item)
      ? prev.filter((a) => a !== item)
      : [...prev, item]
  );
};



  // ---------------- UPLOAD IMAGES ----------------
  const uploadImages = async () => {
    const uploadedUrls: string[] = [];

    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) throw new Error("Upload failed");

      uploadedUrls.push(data.secure_url);
    }

    return uploadedUrls;
  };

  // ---------------- SUBMIT ----------------
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    let uploadedImages: string[] = [];

    const payload: any = {};

    // text fields
    if (form.title) payload.title = form.title;
    if (form.description) payload.description = form.description;
    if (form.location) payload.location = form.location;
    if (form.price) payload.price = Number(form.price);
    if (form.bedrooms) payload.bedrooms = Number(form.bedrooms);
    if (form.bathrooms) payload.bathrooms = Number(form.bathrooms);
    if (amenities.length > 0) payload.amenities = amenities;
 if (listingType) payload.listing_type = listingType;
    // images only if new ones selected
    if (images.length > 0) {
      uploadedImages = await uploadImages();
      payload.images = uploadedImages;
    }

    // CREATE
    if (!editingId) {
      await supabase.from("properties").insert([
        {
          user_id: userId,
          ...payload,
        },
      ]);
    }

    // UPDATE (PATCH STYLE)
    else {
      await supabase
        .from("properties")
        .update(payload)
        .eq("id", editingId);
    }

    resetForm();
    fetchListings();
  } catch (err) {
    console.log(err);
    alert("Error saving listing");
  } finally {
    setLoading(false);
  }
};

  // ---------------- DELETE ----------------
  const handleDelete = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    fetchListings();
  };

  // ---------------- EDIT ----------------
const handleEdit = (p: Property) => {
  setForm({
    title: p.title,
    description: p.description,
    location: p.location,
    price: String(p.price),
    bedrooms: String(p.bedrooms),
    bathrooms: String(p.bathrooms),
  });

  // 🔥 FIXED
  setAmenities(p.amenities || []);
  setListingType(p.listing_type || ""); 
  setImages([]);
  setPreviews(p.images || []);

  setEditingId(p.id);
};

  // ---------------- RESET ----------------
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
    });
 
  setAmenities([]);
  setListingType("");

    setImages([]);
    setPreviews([]);
    setEditingId(null);
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-8">

      {/* ---------------- FORM ---------------- */}
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Listing" : "Create Listing"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            className="w-full border p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div>
  <p className="font-semibold mb-2">Listing Type</p>

  <div className="grid grid-cols-3 gap-2">
    {["Shortlet", "Rent", "Sale"].map((type) => (
      <button
        type="button"
        key={type}
        onClick={() => setListingType(type)}
        className={`border p-2 rounded text-sm transition ${
          listingType === type
            ? "bg-purple-600 text-white"
            : "bg-white"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
</div>

          {/* DESCRIPTION ADDED */}
          <textarea
            className="w-full border p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            className="w-full border p-2"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            className="w-full border p-2"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <div className="flex gap-2">
            <input
              className="w-full border p-2"
              type="number"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={(e) =>
                setForm({ ...form, bedrooms: e.target.value })
              }
            />

            <input
              className="w-full border p-2"
              type="number"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={(e) =>
                setForm({ ...form, bathrooms: e.target.value })
              }
            />
          </div>

          <div>
  <p className="font-semibold mb-2">Amenities</p>

  <div className="grid grid-cols-3 gap-2">
    {amenitiesOptions.map((item) => (
      <button
        type="button"
        key={item}
        onClick={() => toggleAmenity(item)}
        className={`border p-2 rounded text-sm transition ${
          amenities.includes(item)
            ? "bg-purple-600 text-white"
            : "bg-white"
        }`}
      >
        {item}
      </button>
    ))}
  </div>
</div>

          {/* MULTI IMAGE INPUT */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* PREVIEW */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-24 w-full object-cover rounded"
                />
              ))}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white p-2 rounded"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Create"}
          </button>

        </form>
      </div>

      {/* ---------------- MY LISTINGS ---------------- */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Listings</h2>

        <div className="space-y-4">
          {listings.map((p) => (
            <div key={p.id} className="border rounded-xl p-3">

              {/* IMAGE GRID */}
              <div className="grid grid-cols-2 gap-1">
                {p.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-24 w-full object-cover rounded"
                  />
                ))}
              </div>

              <h3 className="font-bold mt-2">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p>{p.location}</p>
              <p className="font-semibold">${p.price}</p>

              <p className="text-sm text-gray-500">
                {p.bedrooms} bed / {p.bathrooms} bath
              </p>

              {p.amenities?.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-2">
    {p.amenities.map((a, i) => (
      <span
        key={i}
        className="text-xs bg-gray-200 px-2 py-1 rounded"
      >
        {a}
      </span>
    ))}
  </div>
)}


              {/* ACTIONS */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CreateListing;