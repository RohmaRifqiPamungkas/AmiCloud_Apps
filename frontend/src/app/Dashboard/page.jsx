"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Upload from "../../../public/Feature/Upload.png";
import { FaRegTrashCan } from "react-icons/fa6";

export default function FileUpload() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setValue("file", file, { shouldValidate: true });
      trigger("file");
    }
  };

  const handleUrlUpload = () => {
    const url = watch("url");
    if (url && /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(url)) {
      setUploadedUrl(url);
      alert("File uploaded from URL successfully!");
    } else {
      alert("Invalid URL. Please check the format.");
    }
  };

  const removeFile = () => {
    setUploadedImage(null);
    setValue("file", null);
  };

  const onSubmit = (data) => {
    if (!uploadedImage) {
      alert("File is required!");
      return;
    }
    console.log("Submitted Data:", data);
    alert("File uploaded successfully!");
    reset();
    setUploadedImage(null);
    setUploadedUrl("");
  };

  return (
    <div className="container mx-auto ">
      <div className="min-h-screen flex flex-col items-center justify-center  ">       
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white py-10 rounded-lg shadow-md max-w-4xl w-full px-20 mt-16"
        >
          <div>
            <h3 className="md:text-2xl font-semibold">Upload File</h3>
          </div>

          <div>
            <div className="border-dashed border-2 border-primary px-6 py-10 rounded-lg mt-6 relative bg-tertiary-25">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-3/4 max-w-md h-auto flex justify-center text-center items-center">
                  <Image src={Upload} alt="Upload" />
                </div>
                <div>
                  <h5>or drag and drop them here</h5>
                </div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-secondary text-black px-4 py-2 rounded-xl"
                >
                  Choose Files
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("file", { required: "File is required" })}
                  onChange={(event) => {
                    handleFileUpload(event);
                    trigger("file");
                  }}
                />
                {errors.file && !uploadedImage && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.file.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <p className="text-gray-500 text-sm text-center">
                Supported formats: JPG, PNG, JPEG, GIF.
              </p>
              <p className="text-gray-500 text-sm text-center">
                Maximum size: 5MB
              </p>
            </div>

            {uploadedImage && (
              <div className="flex flex-col items-center mt-4 ">
                <div className="max-h-48 max-w-48 bg-tertiary-25 rounded-2xl p-4 relative">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -bottom-3 -right-3 bg-white text-red-600 p-2 rounded-lg shadow-md hover:bg-red-600 hover:text-white"
                  >
                    <FaRegTrashCan className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center space-x-4 text-foreground">
              <hr className="flex-grow border-black" />
              <p className="text-black font-medium">OR Upload from URL</p>
              <hr className="flex-grow border-black" />
            </div>

            <div className="pt-4">
              <h3 className="md:text-2xl font-semibold">Reupload Link</h3>
            </div>

            <div className="relative mt-4">
              <input
                id="url-upload"
                type="text"
                placeholder="Upload from URL"
                className="border-gray-300 rounded-2xl border focus:ring-primary focus:border-primary w-full py-4 pl-4 pr-16"
                {...register("url", {
                  pattern: {
                    value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/,
                    message: "Invalid URL format",
                  },
                })}
              />
              <button
                type="button"
                onClick={handleUrlUpload}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-2xl"
              >
                Upload
              </button>
            </div>
            {errors.url && (
              <p className="text-red-500 text-sm mt-2">{errors.url.message}</p>
            )}
            {uploadedUrl && (
              <p className="text-green-500 text-sm mt-2">
                Uploaded URL: {uploadedUrl}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-6 max-w-40 bg-secondary text-black font-bold py-2 px-4 rounded-xl hover:bg-primary hover:text-white"
            >
              Get Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
