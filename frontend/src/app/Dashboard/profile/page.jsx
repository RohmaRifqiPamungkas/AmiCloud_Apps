'use client';
"use client";

import { useRouter } from "next/navigation"; // Untuk navigasi
import { useSearchParams } from "next/navigation"; // Untuk membaca query parameter
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const sampleData = {
    fullName: "Lalapowww",
    username: "Lalapow",
    email: "lalapow@gmail.com",
    phone: "089765432134",
    dateOfBirth: "09/12/2024",
    password: "********",
    role: "User",
    profilePicture:
      "https://via.placeholder.com/150", // Ganti dengan URL foto profil
  };

  const router = useRouter();
  const searchParams = useSearchParams(); // Membaca query parameter
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    // Cek apakah ada query "success=true"
    if (searchParams.get("success") === "true") {
      setNotification(true);
      setTimeout(() => setNotification(false), 3000); // Notifikasi hilang setelah 3 detik
    }
  }, [searchParams]);

  const goToEditProfile = () => {
    router.push("/Dashboard/profile/edit-profile");
  };

  const goToEditInformation = () => {
    router.push("/Dashboard/profile/edit-information-profile");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-lg font-bold text-purple-700">My Profile</h1>
      <p className="text-gray-600">Complete your profile now!</p>

      {/* Notification */}
      {notification && (
        <div className="my-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
          <span>✅ Information Profile successfully updated</span>
        </div>
      )}

      {/* User Card */}
      <div className="flex items-center bg-white shadow-md p-4 rounded-lg mt-6">
        <img
          src={sampleData.profilePicture}
          alt="Profile Picture"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="ml-4 flex-1">
          <h2 className="font-bold">{sampleData.fullName}</h2>
          <p className="text-gray-600">{sampleData.role}</p>
        </div>
        <button
          onClick={goToEditProfile}
          className="text-yellow-500 border border-yellow-500 rounded-lg px-4 py-2 flex items-center hover:bg-yellow-50"
        >
          ✏️ Edit
        </button>
      </div>

      {/* Information Card */}
      <div className="bg-white shadow-md p-4 rounded-lg mt-4 relative">
        <h2 className="text-gray-700 font-bold mb-4">Information Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Full name</p>
            <p className="font-medium">{sampleData.fullName}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{sampleData.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Username</p>
            <p className="font-medium">{sampleData.username}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">{sampleData.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-gray-500">E-mail</p>
            <p className="font-medium">{sampleData.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Password</p>
            <p className="font-medium">{sampleData.password}</p>
          </div>
        </div>
        <button
          onClick={goToEditInformation}
          className="absolute top-4 right-4 text-yellow-500 border border-yellow-500 rounded-lg px-4 py-2 flex items-center hover:bg-yellow-50"
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
}
