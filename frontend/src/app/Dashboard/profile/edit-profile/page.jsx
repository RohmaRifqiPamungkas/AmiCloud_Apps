"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/auth";
import { useForm } from "react-hook-form";
import axios from "@/lib/axios";
import { BASE_URL } from "@/lib/constant";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("/api/v1/users");
        const user = response.data.users[0];
        setUserData(user);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchData();
  }, []);

  const { register, setValue, handleSubmit } = useForm({
    defaultValues: {
      image_profile: user?.profile_picture || null,
    },
  });

  const [previewImage, setPreviewImage] = useState(
    user?.profile_picture || `${BASE_URL}${user?.image_profile}`
  );

  const handleChangePicture = () => {
    const input = document.getElementById("image_profile");
    if (input) input.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setValue("image_profile", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setValue("image_profile", null);
    setPreviewImage("https://via.placeholder.com/150");
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true); 

      const formData = new FormData();
      if (data.image_profile) {
        formData.append("image_profile", data.image_profile);
      }

      const response = await axios.post("api/v1/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profil berhasil diperbarui:", response.data);

      router.push("/Dashboard/profile?success=true");
    } catch (error) {
      console.error(
        "Gagal memperbarui profil:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary">My Profile</h1>
          <p className="text-foreground text-lg">Complete your profile now!</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className={`px-6 py-2 rounded-2xl ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-secondary text-foreground hover:text-white hover:bg-primary"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => router.push("/Dashboard/profile")}
            className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-3xl">
        <div className="flex items-center gap-6 mt-4">
          <Image
            src={previewImage}
            alt="Profile Picture"
            className="w-16 h-16 lg:w-32 lg:h-32 rounded-full object-cover"
            width={128}
            height={128} priority
          />
          <button
            onClick={handleChangePicture}
            className="bg-primary text-white px-4 py-2 rounded-2xl"
          >
            Change Picture
          </button>
          <button
            onClick={handleDeleteImage}
            className="bg-secondary text-black px-4 py-2 rounded-2xl"
          >
            Delete
          </button>
        </div>
        <input
          type="file"
          id="image_profile"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Information Card */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div>
            <label className="text-gray-500">Full Name</label>
            <p className="font-medium">{user?.full_name || "N/A"}</p>
          </div>
          <div>
            <label className="text-gray-500">Role Name</label>
            <p className="font-medium">{userData?.roles?.join(", ") || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
