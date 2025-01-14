

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";


export default function AddROle() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleSave = async (data) => {
    try {
      setIsLoading(true);
      console.log("Data yang diperbarui:", data);
      router.push("/Dashboard/management-role?success=true");
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/Dashboard/management-role");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col justify-start items-start mb-6">
          <h1 className="text-xl font-bold text-primary mt-2">
          Add Role
          </h1>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-3xl">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

        <div className="flex justify-start items-start gap-4">
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
        </form>
      </div>
    </div>
  );
}
