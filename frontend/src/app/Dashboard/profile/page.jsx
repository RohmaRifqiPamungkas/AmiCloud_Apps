
// "use client";

// import { useRouter } from "next/navigation"; 
// import { useSearchParams } from "next/navigation"; 
// import { useEffect, useState } from "react";
// import Image from "next/image";

// export default function ProfilePage() {
//   const sampleData = {
//     fullName: "Lalapowww",
//     username: "Lalapow",
//     email: "lalapow@gmail.com",
//     phone: "089765432134",
//     dateOfBirth: "09/12/2024",
//     password: "********",
//     role: "User",
//     profilePicture:
//       "https://via.placeholder.com/150", 
//   };

//   const router = useRouter();
//   const searchParams = useSearchParams(); 
//   const [notification, setNotification] = useState(false);

//   useEffect(() => {
//     if (searchParams.get("success") === "true") {
//       setNotification(true);
//       setTimeout(() => setNotification(false), 3000); 
//     }
//   }, [searchParams]);

//   const goToEditProfile = () => {
//     router.push("/Dashboard/profile/edit-profile");
//   };

//   const goToEditInformation = () => {
//     router.push("/Dashboard/profile/edit-information-profile");
//   };

//   return (
//     <div className="p-6 min-h-screen">
//       {/* Header */}
//       <h1 className="text-lg font-bold text-purple-700">My Profile</h1>
//       <p className="text-gray-600">Complete your profile now!</p>

//       {/* Notification */}
//       {notification && (
//         <div className="my-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
//           <span>✅ Information Profile successfully updated</span>
//         </div>
//       )}

//       {/* User Card */}
//       <div className="flex items-center bg-white shadow-md py-10 px-10 rounded-lg mt-6">
//         <Image
//           src={sampleData.profilePicture}
//           alt="Profile Picture"
//           className="w-16 h-16 lg:w-32 lg:h-32 rounded-full object-cover"
//         />
//         <div className="ml-6 flex-1 space-y-2">
//           <h2 className="font-bold">{sampleData.fullName}</h2>
//           <p className="text-gray-600">{sampleData.role}</p>
//         </div>
//         <button
//           onClick={goToEditProfile}
//           className="text-yellow-500 border border-yellow-500 rounded-lg px-4 py-2 flex items-center hover:bg-yellow-50"
//         >
//           ✏️ Edit
//         </button>
//       </div>

//       {/* Information Card */}
//       <div className="bg-white shadow-md px-10 py-10 rounded-lg mt-4 relative">
//         <h2 className="text-gray-700 font-bold mb-4">Information Profile</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <p className="text-gray-500">Full name</p>
//             <p className="font-medium">{sampleData.fullName}</p>
//           </div>
//           <div>
//             <p className="text-gray-500">Phone</p>
//             <p className="font-medium">{sampleData.phone}</p>
//           </div>
//           <div>
//             <p className="text-gray-500">Username</p>
//             <p className="font-medium">{sampleData.username}</p>
//           </div>
//           <div>
//             <p className="text-gray-500">Date of Birth</p>
//             <p className="font-medium">{sampleData.dateOfBirth}</p>
//           </div>
//           <div>
//             <p className="text-gray-500">E-mail</p>
//             <p className="font-medium">{sampleData.email}</p>
//           </div>
//           <div>
//             <p className="text-gray-500">Password</p>
//             <p className="font-medium">{sampleData.password}</p>
//           </div>
//         </div>
//         <button
//           onClick={goToEditInformation}
//           className="absolute top-10 right-10 text-yellow-500 border border-yellow-500 rounded-lg px-4 py-2 flex items-center hover:bg-yellow-50"
//         >
//           ✏️ Edit
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";

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
    dateOfBirth: "09/12/2024",
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
    <div className="p-6 min-h-screen">
      {/* Header */}
      <h1 className="text-lg font-bold text-purple-700">My Profile</h1>
      <p className="text-gray-600">Complete your profile now!</p>

      {/* Notification */}
      {notification && (
        <Notification message="✅ Information Profile successfully updated" />
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
    <div className="my-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
      <span>{message}</span>
    </div>
  );
}

function UserCard({ data, onEditClick }) {
  return (
    <div className="flex items-center bg-white shadow-md py-10 px-10 rounded-lg mt-6">
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
        className="text-yellow-500 border border-yellow-500 rounded-lg px-4 py-2 flex items-center hover:bg-yellow-50"
      >
        ✏️ Edit
      </button>
    </div>
  );
}

function InformationCard({ data, onEditClick }) {
  return (
    <div className="bg-white shadow-md px-10 py-10 rounded-lg mt-4 relative">
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
        className="absolute top-10 right-10 text-yellow-500 border border-yellow-500 rounded-lg px-4 py-2 flex items-center hover:bg-yellow-50"
      >
        ✏️ Edit
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

