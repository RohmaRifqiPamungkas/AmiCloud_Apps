"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { useAuth } from "@/hooks/auth";


export default function EditProfilePage() {
  const router = useRouter();
  const {user} = useAuth();

  const [profile, setProfile] = useState({
    fullName: "Lalapowww",
    roleName: "User",
    profilePicture:
      "https://via.placeholder.com/150", 
  });

  const handleSave = () => {  
    setTimeout(() => {
      router.push("/Dashboard/profile?success=true"); 
    }, 500);
  };

  const handleCancel = () => {
    router.push("/Dashboard/profile"); 
  };

  const handleChangePicture = () => {
    const newPicture = prompt("Masukkan URL gambar baru:");
    if (newPicture) {
      setProfile({ ...profile, profilePicture: newPicture });
    }
  };

  const handleDeletePicture = () => {
    Swal.fire({
      title: "Delete this picture?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "bg-secondary px-6 py-2 rounded-2xl text-black hover:bg-primary hover:text-white ",
        cancelButton: "swal2-cancel !border-2 !border-primary !px-6 !py-2 !rounded-2xl !text-primary !hover:bg-primary !hover:text-white ",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile({ ...profile, profilePicture: "" }); 
        Swal.fire("Deleted!", "Gambar telah berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary">My Profile</h1>
          <p className="text-foreground text-lg">Complete your profile now!</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-secondary text-foreground hover:text-white px-6 py-2 rounded-2xl hover:bg-primary "
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white "
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg p-6 rounded-3xl">
        <div className="flex items-center gap-6">
          {/* Gambar Profil */}
          {profile.profilePicture ? (
            <Image
              src={profile.profilePicture}
              alt="Profile Picture"
              className="w-16 h-16 lg:w-32 lg:h-32 rounded-full object-cover"
              width={20}
              height={20}
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          {/* Tombol Ganti dan Hapus Gambar */}
          <div className="flex gap-4">
            <button
              onClick={handleChangePicture}
              className="bg-primary text-white px-6 py-2 rounded-2xl hover:bg-secondary hover:text-black"
            >
              Change Picture
            </button>
            <button
              onClick={handleDeletePicture}
              className="border border-primary text-primary px-6 py-2 rounded-2xl hover:bg-primary hover:text-white"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Informasi Profil */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div>
            <label className="text-gray-500">Full Name</label>
            <p className="font-medium">{user.full_name}</p>
          </div>
          <div>
            <label className="text-gray-500">Role Name</label>
            <p className="font-medium">{user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
