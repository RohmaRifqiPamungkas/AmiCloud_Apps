// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";
// import Image from "next/image";
// import { useAuth } from "@/hooks/auth";


// export default function EditProfilePage() {
//   const router = useRouter();
//   const {user} = useAuth();

//   const [profile, setProfile] = useState({
//     fullName: "Lalapowww",
//     roleName: "User",
//     profilePicture:
//       "https://via.placeholder.com/150", 
//   });

//   const handleSave = () => {  
//     setTimeout(() => {
//       router.push("/Dashboard/profile?success=true"); 
//     }, 500);
//   };

//   const handleCancel = () => {
//     router.push("/Dashboard/profile"); 
//   };

//   const handleChangePicture = () => {
//     const newPicture = prompt("Masukkan URL gambar baru:");
//     if (newPicture) {
//       setProfile({ ...profile, profilePicture: newPicture });
//     }
//   };

//   const handleDeletePicture = () => {
//     Swal.fire({
//       title: "Delete this picture?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Delete",
//       cancelButtonText: "Cancel",
//       customClass: {
//         confirmButton: "bg-secondary px-6 py-2 rounded-2xl text-black hover:bg-primary hover:text-white ",
//         cancelButton: "swal2-cancel !border-2 !border-primary !px-6 !py-2 !rounded-2xl !text-primary !hover:bg-primary !hover:text-white ",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setProfile({ ...profile, profilePicture: "" }); 
//         Swal.fire("Deleted!", "Gambar telah berhasil dihapus.", "success");
//       }
//     });
//   };

//   return (
//     <div className="p-6 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-xl font-bold text-primary">My Profile</h1>
//           <p className="text-foreground text-lg">Complete your profile now!</p>
//         </div>
//         <div className="flex gap-4">
//           <button
//             onClick={handleSave}
//             className="bg-secondary text-foreground hover:text-white px-6 py-2 rounded-2xl hover:bg-primary "
//           >
//             Save
//           </button>
//           <button
//             onClick={handleCancel}
//             className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white "
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Profile Card */}
//       <div className="bg-white shadow-lg p-6 rounded-3xl">
//         <div className="flex items-center gap-6">
//           {/* Gambar Profil */}
//           {profile.profilePicture ? (
//             <Image
//               src={profile.profilePicture}
//               alt="Profile Picture"
//               className="w-16 h-16 lg:w-32 lg:h-32 rounded-full object-cover"
//               width={20}
//               height={20}
//             />
//           ) : (
//             <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
//               No Image
//             </div>
//           )}

//           {/* Tombol Ganti dan Hapus Gambar */}
//           <div className="flex gap-4">
//             <button
//               onClick={handleChangePicture}
//               className="bg-primary text-white px-6 py-2 rounded-2xl hover:bg-secondary hover:text-black"
//             >
//               Change Picture
//             </button>
//             <button
//               onClick={handleDeletePicture}
//               className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white"
//             >
//               Delete
//             </button>
//           </div>
//         </div>

//         {/* Informasi Profil */}
//         <div className="grid grid-cols-4 gap-4 mt-6">
//           <div>
//             <label className="text-gray-500">Full Name</label>
//             <p className="font-medium">{user.full_name}</p>
//           </div>
//           <div>
//             <label className="text-gray-500">Role Name</label>
//             <p className="font-medium">{user.username}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { useAuth } from "@/hooks/auth";
import { useUsers } from "@/hooks/users"; // Pastikan path sudah sesuai
import axios from "axios";
import { useForm } from "react-hook-form";


export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { users, isLoading: isLoadingUsers } = useUsers(1, 10); // Ambil 10 pengguna pertama
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      full_name: users.full_name || "",
      roles: users.roles || "", // Default value dari roles user
      image_profile: users.image_profile || "https://via.placeholder.com/150",
    },
  });

  const [previewImage, setPreviewImage] = useState(users.image_profile || "https://via.placeholder.com/150");

  useEffect(() => {
    // Update roles jika API selesai load
    if (!isLoadingUsers && users.length > 0) {
      setValue("roles", users.roles || users[0].role); // Set default role
    }
  }, [isLoadingUsers, users]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image_profile", file); // Set the file in react-hook-form
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Update the preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setValue("image_profile", null); // Remove the image from react-hook-form
    setPreviewImage("https://via.placeholder.com/150"); // Reset to default image
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("roles", data.roles);
      if (data.image_profile instanceof File) {
        formData.append("image_profile", data.image_profile);
      } else {
        formData.append("image_profile", "");
      }

      const response = await axios.patch("/api/v1/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profil berhasil diperbarui:", response.data);
      router.push("/Dashboard/profile?success=true");
    } catch (error) {
      console.error("Gagal memperbarui profil:", error.response?.data || error.message);
      Swal.fire("Error", "Failed to update profile. Please try again.", "error");
    }
  };

  const handleCancel = () => {
    router.push("/Dashboard/profile");
  };

  return (
    <div className="p-6 min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-primary">My Profile</h1>
            <p className="text-foreground text-lg">Complete your profile now!</p>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-secondary text-foreground hover:text-white px-6 py-2 rounded-2xl hover:bg-primary disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-3xl">
          <div className="flex items-center gap-6">
            <Image
              src={previewImage}
              alt="Profile Picture"
              className="w-16 h-16 lg:w-32 lg:h-32 rounded-full object-cover"
              width={128}
              height={128}
            />
            <div>
              <label htmlFor="image_profile" className="block text-gray-500">Change Profile Picture</label>
              <input
                type="file"
                id="image_profile"
                {...register("image_profile")}
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="mt-2 text-red-600 hover:underline"
              >
                Delete Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div>
              <label htmlFor="full_name" className="text-gray-500">Full Name</label>
              <input
                id="full_name"
                {...register("full_name")}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="roles" className="text-gray-500">Role Name</label>
              <select
                id="roles"
                {...register("roles")}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg"
              >
                {users.map((userRole) => (
                  <option key={userRole.id} value={userRole.role}>
                    {userRole.role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
