
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { RiEdit2Line } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
import defaultProfile from "../../../../public/Navbar/Profile.png";
import axios from "@/lib/axios";
import { BASE_URL } from "@/lib/constant";
import { useForm } from "react-hook-form";

export default function ProfilePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/v1/profile");
        setUserData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setNotification(true);
      setTimeout(() => setNotification(false), 3000);
    }
  }, [searchParams]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const isAdmin = userData?.roles?.includes("admin");

  const goToEditProfile = () => {
    router.push("/Dashboard/profile/edit-profile");
  };

  const goToEditInformation = () => {
    router.push("/Dashboard/profile/edit-information-profile");
  };

  return (
    <div className="p-6 min-h-screen relative">
      <h1 className="text-xl font-bold text-primary">My Profile</h1>
      <p className="text-foreground text-lg">Complete your profile now!</p>

      {notification && <Notification message="Profile successfully updated" />}

      <UserCard data={userData} onEditClick={goToEditProfile} />
      {isAdmin ? (
        <AdminInformationForm data={userData.user} />
      ) : (
        <UserInformationView data={userData.user} onEditClick={goToEditInformation} />
      )}
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
        src={
          data?.user?.image_profile
            ? `${BASE_URL}${data.user.image_profile}`
            : defaultProfile
        }
        alt="Profile Picture"
        width={128}
        height={128}
        className="w-16 h-16 lg:w-32 lg:h-32 rounded-full object-cover"
        priority
      />
      <div className="ml-6 flex-1 space-y-2">
        <h2 className="font-bold">{data?.user?.full_name || "N/A"}</h2>
        <p className="text-gray-600">
          {data?.roles?.join(", ") || "No roles available"}
        </p>
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

function InformationCard({ data, roles }) {
  const isAdmin = roles?.includes("admin");

  return isAdmin ? (
    <AdminInformationForm data={data} />
  ) : (
    <UserInformationView data={data} />
  );
}

function AdminInformationForm({ data }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: data?.full_name || "",
      email: data?.email || "",
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const [notification, setNotification] = useState(false);

  const onSubmit = async (formData) => {
    try {
      await axios.post("/api/v1/profile", formData);
      setNotification(true); // Setel notifikasi berhasil
      setTimeout(() => setNotification(false), 3000); // Hapus notifikasi setelah 3 detik
    } catch (error) {
      setNotification(false); // Hapus notifikasi jika ada error
      alert(error.message || "Failed to update profile");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-lg px-10 py-10 rounded-3xl mt-10"
    >
      <h2 className="text-gray-700 font-bold mb-4">Edit Information Profile</h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            {...register("full_name", { required: "Full name is required" })}
            className="block w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="block w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            {...register("old_password", {
              required: "Old password is required",
            })}
            className=" w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.old_password && (
            <p className="text-red-500 text-sm">
              {errors.old_password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            {...register("new_password", {
              required: "New password is required",
            })}
            className=" w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.new_password && (
            <p className="text-red-500 text-sm">
              {errors.new_password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirm_password", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("new_password") || "Passwords do not match",
            })}
            className=" w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-start space-x-4">
        <button
          type="submit"
          className="bg-secondary text-black hover:bg-primary hover:text-white px-6 py-2 rounded-2xl "
        >
          Save
        </button>
        <button
          type="button"
          className="border border-primary hover:bg-primary text-primary hover:text-white px-6 py-2 rounded-2xl "
        >
          Cancel
        </button>
      </div>

      {notification && <Notification message="Profile successfully updated" />}
    </form>
  );
}

function UserInformationView({ data, onEditClick }) {
  return (
    <div className="bg-white shadow-lg px-10 py-10 rounded-3xl mt-10 relative">
      <h2 className="text-gray-700 font-bold mb-4">Information Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <Detail label="Full name" value={data?.full_name || "N/A"} />
        <Detail label="Phone" value={data?.phone || "N/A"} />
        <Detail label="Name" value={data?.name || "N/A"} />
        <Detail label="Date of Birth" value={data?.birthday_date || "N/A"} />
        <Detail label="Username" value={data?.username || "N/A"} />
        <Detail label="E-mail" value={data?.email || "N/A"} />
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
