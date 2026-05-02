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

const nigeriaLocations = [
  // LAGOS
  "Lagos, Lagos 100001",
  "Ikeja, Lagos 100271",
  "Lekki, Lagos 105102",
  "Victoria Island, Lagos 101241",
  "Ikoyi, Lagos 101233",
  "Yaba, Lagos 101212",
  "Surulere, Lagos 101283",
  "Ajah, Lagos 105101",
  "Badagry, Lagos 103101",
  "Epe, Lagos 106101",

  // FCT ABUJA
  "Abuja, FCT 900001",
  "Wuse, Abuja, FCT 900281",
  "Maitama, Abuja, FCT 900271",
  "Gwarinpa, Abuja, FCT 900108",
  "Asokoro, Abuja, FCT 900231",
  "Lugbe, Abuja, FCT 900107",

  // OYO
  "Ibadan, Oyo 200001",
  "Bodija, Ibadan, Oyo 200212",
  "Ogbomosho, Oyo 210001",
  "Oyo Town, Oyo 211001",

  // RIVERS
  "Port Harcourt, Rivers 500001",
  "Obio-Akpor, Rivers 500102",

  // KANO
  "Kano, Kano 700001",

  // KADUNA
  "Kaduna, Kaduna 800001",
  "Zaria, Kaduna 810001",

  // ENUGU
  "Enugu, Enugu 400001",
  "Nsukka, Enugu 410001",

  // IMO
  "Owerri, Imo 460001",
  "Orlu, Imo 470001",

  // EDO
  "Benin City, Edo 300001",

  // DELTA
  "Asaba, Delta 320001",
  "Warri, Delta 332101",

  // AKWA IBOM
  "Uyo, Akwa Ibom 520001",
  "Eket, Akwa Ibom 524101",

  // CROSS RIVER
  "Calabar, Cross River 540001",

  // OGUN
  "Abeokuta, Ogun 110001",
  "Ijebu Ode, Ogun 120101",

  // KWARA
  "Ilorin, Kwara 240001",

  // ONDO
  "Akure, Ondo 340001",

  // OSUN
  "Osogbo, Osun 230001",
  "Ife, Osun 220101",

  // EKITI
  "Ado Ekiti, Ekiti 360001",

  // PLATEAU
  "Jos, Plateau 930001",

  // NIGER
  "Minna, Niger 920001",

  // NASARAWA
  "Lafia, Nasarawa 962101",

  // KOGI
  "Lokoja, Kogi 260001",

  // ANAMBRA
  "Awka, Anambra 420001",
  "Onitsha, Anambra 434101",
  "Nnewi, Anambra 435101",

  // EBONYI
  "Abakaliki, Ebonyi 840001",

  // ABIA
  "Umuahia, Abia 440001",
  "Aba, Abia 450001",

  // BAYELSA
  "Yenagoa, Bayelsa 561101",

  // ADAMAWA
  "Yola, Adamawa 640001",

  // TARABA
  "Jalingo, Taraba 660001",

  // GOMBE
  "Gombe, Gombe 760001",

  // BAUCHI
  "Bauchi, Bauchi 740001",

  // BORNO
  "Maiduguri, Borno 600001",

  // YOBE
  "Damaturu, Yobe 620001",

  // JIGAWA
  "Dutse, Jigawa 720001",

  // KATSINA
  "Katsina, Katsina 820001",

  // KEBBI
  "Birnin Kebbi, Kebbi 860001",

  // SOKOTO
  "Sokoto, Sokoto 840001",

  // ZAMFARA
  "Gusau, Zamfara 860001",
];
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
const [amenities, setAmenities] = useState<string[]>([]);
  const [listings, setListings] = useState<Property[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
const [listingType, setListingType] = useState<string>("");
const [suggestions, setSuggestions] = useState<string[]>([]);


const handleLocationChange = (value: string) => {
  setForm({ ...form, location: value });

  if (!value) {
    setSuggestions([]);
    return;
  }

  const filtered = nigeriaLocations.filter((loc) =>
    loc.toLowerCase().includes(value.toLowerCase())
  );

  setSuggestions(filtered);
};
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
    <div className="p-8 flex  flex-col  gap-8">

      {/* ---------------- FORM ---------------- */}
      <div className="mb-8  border-b">
        <h1 className="text-2xl font-bold mb-6">
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

       <div className="relative w-full">
  <input
    className="w-full border p-3 rounded-lg focus:border-purple-500 outline-none"
    placeholder="Enter location"
    value={form.location}
    onChange={(e) => handleLocationChange(e.target.value)}
  />

  {/* SUGGESTIONS */}
  {suggestions.length > 0 && (
    <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-50 max-h-48 overflow-y-auto">
      {suggestions.map((loc, i) => (
        <div
          key={i}
          onClick={() => {
            setForm({ ...form, location: loc });
            setSuggestions([]);
          }}
          className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
        >
          {loc}
        </div>
      ))}
    </div>
  )}
</div>

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

<div> <hr /> <hr /> <hr /> <hr /></div>
      {/* ---------------- MY LISTINGS ---------------- */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-center mb-6">My Listings</h2>

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