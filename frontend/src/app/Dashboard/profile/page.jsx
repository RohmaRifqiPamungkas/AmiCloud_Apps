

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { RiEdit2Line } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function ProfilePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProfileContent />
    </Suspense>
  );
}



function ProfileContent() {
  const sampleData = {
    fullName: "Lalapowww",
    username: "Lalapow",
    email: "lalapow@gmail.com",
    phone: "089765432134",
    dateOfBirth: "12/01/2024",
    password: "********",
    role: "User",
    profilePicture: "https://via.placeholder.com/150",
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setNotification(true);
      setTimeout(() => setNotification(false), 3000);
    }
  }, [searchParams]);

  const goToEditProfile = () => {
    router.push("/Dashboard/profile/edit-profile");
  };

  const goToEditInformation = () => {
    router.push("/Dashboard/profile/edit-information-profile");
  };

  return (
    <div className="p-6 min-h-screen relative">
      {/* Header */}
      <h1 className="text-xl font-bold text-primary">My Profile</h1>
      <p className="text-foreground text-lg">Complete your profile now!</p>

      {/* Notification */}
      {notification && (
        <Notification message="Information Profile successfully updated" />
      )}

      {/* User Card */}
      <UserCard data={sampleData} onEditClick={goToEditProfile} />

      {/* Information Card */}
      <InformationCard data={sampleData} onEditClick={goToEditInformation} />
    </div>
  );
}

function Notification({ message }) {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#B6D7A8] border border-green-700 rounded-2xl flex items-center p-4 w-auto">
    <FaRegCircleCheck className="mr-4 text-green-700" />
    <span className="text-black font-medium">{message}</span>
  </div>
  );
}

function UserCard({ data, onEditClick }) {
  return (
    <div className="flex items-center bg-white shadow-lg py-10 px-10 rounded-3xl mt-6">
      <Image
        src={data.profilePicture}
        alt="Profile Picture"
        width={128}
        height={128}
        className="w-16 h-16 lg:w-32 lg:h-32 rounded-full object-cover"
      />
      <div className="ml-6 flex-1 space-y-2">
        <h2 className="font-bold">{data.fullName}</h2>
        <p className="text-gray-600">{data.role}</p>
      </div>
      <button
        onClick={onEditClick}
        className="text-black bg-secondary rounded-lg px-4 py-2 flex items-center hover:bg-primary hover:text-white"
      >
        <RiEdit2Line className="mr-2" /> Edit
      </button>
    </div>
  );
}

function InformationCard({ data, onEditClick }) {
  return (
    <div className="bg-white shadow-lg px-10 py-10 rounded-3xl mt-10 relative">
      <h2 className="text-gray-700 font-bold mb-4">Information Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <Detail label="Full name" value={data.fullName} />
        <Detail label="Phone" value={data.phone} />
        <Detail label="Username" value={data.username} />
        <Detail label="Date of Birth" value={data.dateOfBirth} />
        <Detail label="E-mail" value={data.email} />
        <Detail label="Password" value={data.password} />
      </div>
      <button
        onClick={onEditClick}
        className="absolute top-10 right-10 text-black bg-secondary rounded-lg px-4 py-2 flex items-center hover:bg-primary hover:text-white"
      >
       <RiEdit2Line className="mr-2" /> Edit
      </button>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

