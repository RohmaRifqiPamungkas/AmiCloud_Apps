'use client';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";


export default function EditInformationProfile() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data profil saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/user/profile"); // Ganti endpoint dengan milik Anda
        reset(response.data); // Mengisi form dengan data API
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  // Handling form submission
  const handleSave = async (data) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put("/user/profile", data); // Ganti endpoint sesuai kebutuhan
      console.log("Profile updated successfully:", response.data);

      // Redirect ke halaman profile dengan query success
      router.push("/Dashboard/profile?success=true");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/Dashboard/profile");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header dengan tombol Save dan Cancel */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-bold text-purple-700">My Profile</h1>
          <p className="text-gray-600">Complete your profile now!</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit(handleSave)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="border border-purple-700 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            {...register("dob", { required: "Date of birth is required" })}
          />
          {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
      </form>
    </div>
  );
}
