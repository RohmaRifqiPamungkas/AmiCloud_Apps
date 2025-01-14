
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const EditRole = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = (data) => {
    console.log(data); 
    setTimeout(() => {
      router.push("/Dashboard/management-role?success=true");
    }, 500);
  };

  const handleCancel = () => {
    router.push("/Dashboard/management-role");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary">Edit Information Role</h1>
          <p className="text-foreground text-lg">Manage role here</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-secondary text-foreground hover:text-white px-6 py-2 rounded-2xl hover:bg-primary"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Role Name */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
            Role Name
          </label>
          <input
            type="text"
            id="roleName"
            placeholder="Enter role name"
            {...register("roleName", { required: "Role name is required" })}
            className={`w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500 ${
              errors.roleName ? "border-red-500" : "border-gray-300"
            } rounded-2xl focus:ring-purple-500 focus:border-purple-500`}
          />
          {errors.roleName && (
            <p className="text-red-500 text-sm mt-1">{errors.roleName.message}</p>
          )}
        </div>

        {/* Permissions */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Information Profile</h3>
          <div className="overflow-x-auto rounded-3xl shadow-lg">
            <table className="min-w-full ">
              <thead>
                <tr className="bg-tertiary-25 text-primary">
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Access</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "My Profile",
                  "Features",
                  "Management File",
                  "Add User",
                  "List User",
                  "Management Role",
                ].map((action, index) => (
                  <tr
                    key={index}
                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-tertiary-10"}`}
                  >
                    <td className="px-4 py-2">{action}</td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        {...register("permissions", { required: false })}
                        value={action}
                        defaultChecked
                        className="h-5 w-5 text-primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRole;
