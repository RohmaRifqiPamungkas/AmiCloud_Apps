

"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";

export default function EditInformationProfile() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        birthday_date: user.birthday_date,
      });
    }
  }, [user, reset]);

  const handleSave = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.patch("api/v1/profile", data);
      console.log("Profil berhasil diperbarui:", response.data);
      router.push("/Dashboard/profile?success=true");
    } catch (error) {
      console.error("Gagal memperbarui profil:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const togglePasswordVisibility = () => {
  //   setShowPassword((prevState) => !prevState);
  // };

  const handleCancel = () => {
    router.push("/Dashboard/profile");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary">
            Edit Information Profile
          </h1>
          <p className="text-foreground text-lg">Edit your information profile!</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit(handleSave)}
            className="bg-secondary text-black hover:text-white px-6 py-2 rounded-2xl hover:bg-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-3xl">
        <form className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
            id="full_name"
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("full_name", { required: "Full name is required" })}
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
            id="name"
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("name", { required: "Username is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>


          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
            id="username"
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
            id="email"
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
            id="phone"
              type="tel"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
            id="birthday_date"
              type="date"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("birthday_date", {
                required: "Date of birth is required",
              })}
            />
            {errors.birthday_date && (
              <p className="text-sm text-red-500">
                {errors.birthday_date.message}
              </p>
            )}
          </div>

          {/* Password */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">

              <input
              id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
                {...register("password", { required: "Password is required" })}
              />
              <span
                className="absolute inset-y-0 right-5 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff size={16} className="text-black mt-3" />
                ) : (
                  <FiEye size={16} className="text-black mt-3" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div> */}
        </form>
      </div>
    </div>
  );
}
