"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";

export default function EditProfilePage() {
  const router = useRouter();

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
      title: "Apakah Anda yakin?",
      text: "Gambar ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        setProfile({ ...profile, profilePicture: "" }); 
        Swal.fire("Terhapus!", "Gambar telah berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-bold text-purple-700">My Profile</h1>
          <p className="text-gray-600">Complete your profile now!</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="border border-purple-700 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <div className="flex items-center gap-6">
          {/* Gambar Profil */}
          {profile.profilePicture ? (
            <Image
              src={profile.profilePicture}
              alt="Profile Picture"
              className="w-20 h-20 rounded-full object-cover"
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
              className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
            >
              Change Picture
            </button>
            <button
              onClick={handleDeletePicture}
              className="border border-purple-700 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Informasi Profil */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="text-gray-500">Full Name</label>
            <p className="font-medium">{profile.fullName}</p>
          </div>
          <div>
            <label className="text-gray-500">Role Name</label>
            <p className="font-medium">{profile.roleName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
