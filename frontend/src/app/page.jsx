


"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Upload from "../../public/Feature/Upload.png";
import { FaRegTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function FileUpload() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadCount, setUploadCount] = useState(0);
  const [urlUploadCount, setUrlUploadCount] = useState(0);

  const MAX_UPLOADS = 3;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

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

    if (uploadCount >= MAX_UPLOADS) {
      Swal.fire({
        icon: "warning",
        title: "Upload Limit Reached",
        text: "You can only upload up to 3 files. Please log in for more uploads.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-secondary px-10 py-3 text-black rounded-2xl"
        }
      });
      return;
    }

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          icon: "warning",
          title: "File Size Too Large",
          text: "The maximum allowed file size is 5MB. Please upload a smaller file.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-secondary px-10 py-3 text-black rounded-2xl"
          }
        });
        return;
      }

      if (!SUPPORTED_FORMATS.includes(file.type)) {
        Swal.fire({
          icon: "warning",
          title: "Unsupported File Format",
          text: "Please upload files in JPG, PNG, JPEG, or GIF format.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-secondary px-10 py-3 text-black rounded-2xl"
          }
        });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setUploadCount((prev) => prev + 1);
      setValue("file", file, { shouldValidate: true });
      trigger("file");

      // Swal.fire({
      //   icon: "success",
      //   title: "File Uploaded Successfully",
      //   text: "Your file has been uploaded.",
      //   confirmButtonText: "OK",
      // });
    }
  };

  const handleUrlUpload = () => {
    const url = watch("url");

    if (urlUploadCount >= MAX_UPLOADS) {
      Swal.fire({
        icon: "warning",
        title: "URL Upload Limit Reached",
        text: "You can only upload up to 3 URLs. Please log in for more uploads.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-secondary px-10 py-3 text-black rounded-2xl"
        }
      });
      return;
    }

    if (url && /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(url)) {
      setUploadedUrl(url);
      setUrlUploadCount((prev) => prev + 1);

      // Swal.fire({
      //   icon: "success",
      //   title: "URL Uploaded Successfully",
      //   text: "Your URL has been uploaded.",
      //   confirmButtonText: "OK",
      // });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Invalid URL",
        text: "Please check the URL format. It should end with .jpg, .jpeg, .png, or .gif.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-secondary px-10 py-3 text-black rounded-2xl"
        }
      });
    }
  };

  const removeFile = () => {
    setUploadedImage(null);
    setValue("file", null);
  };

  const onSubmit = (data) => {
    if (!uploadedImage && !uploadedUrl) {
      Swal.fire({
        icon: "warning",
        title: "No File or URL Provided",
        text: "Please upload a file or URL before submitting.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-secondary px-10 py-3 text-black rounded-2xl"
        }
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Submission Successful",
      text: "Your file or URL has been submitted.",
      confirmButtonText: "OK",
    });

    reset();
    setUploadedImage(null);
    setUploadedUrl("");
    setUploadCount(0);
    setUrlUploadCount(0);
  };

  return (
    <div className="container mx-auto px-20 ">
      <div className="min-h-screen flex flex-col items-center justify-center  ">
        <h1 className="text-2xl font-bold text-center text-black mb-4 md:text-4xl mt-20">
          Quick Reupload, <span className="text-primary">Instant Links!</span>
        </h1>
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
                  className="cursor-pointer bg-secondary hover:bg-primary text-black hover:text-white px-4 py-2 rounded-xl"
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
                    width={40}
                    height={40}
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
                className="bg-tertiary-25 rounded-2xl border focus:ring-primary focus:border-primary w-full py-4 pl-4 pr-16"
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
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-primary hover:bg-secondary text-white hover:text-black px-4 py-2 rounded-2xl"
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
