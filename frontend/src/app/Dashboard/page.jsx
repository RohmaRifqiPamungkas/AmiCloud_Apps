"use client";

import SuccessAlert from "@/components/Alert/SuccessAlert";
import withAuth from "@/components/AuthProvider";
import { useAuth } from "@/hooks/auth";
import { useAuthenticatedFeatures } from "@/hooks/feature";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom/client";
import { useForm } from "react-hook-form";
import { FaRegTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import Upload from "../../../public/Feature/Upload.png";

function FileUpload() {
  useAuth({ middleware: "auth" });
  const { user } = useAuth();
  const router = useRouter();

  const { uploadImage, linkUpload } = useAuthenticatedFeatures();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm();

  // if (!user) {
  //   router.push("/login");
  //   return null;
  // }

  const removeFile = () => {
    setUploadedImage(null);
    setUploadedData(null);
    setValue("file", null);
  };

  const removeUrl = () => {
    setUploadedUrl(null);
    setValue("url", null);
  };

  const handleSuccess = (url) => {
    const handleCopy = (url) => {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          console.log("Link Copied to Clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    };
    const handleShare = (url) => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
      window.open(whatsappUrl, "_blank");
    };

    Swal.fire({
      html: `<div id="success-alert"></div>`,
      showConfirmButton: true,
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500",
        popup: "rounded-3xl p-6 shadow-lg",
      },
      showCloseButton: true,
      didOpen: () => {
        const onCopy = () => {
          handleCopy(url);
          Swal.close();
        };

        const onShare = () => {
          handleShare(url);
          Swal.close();
        };
        const root = ReactDOM.createRoot(
          document.getElementById("success-alert")
        );
        root.render(
          <SuccessAlert link={url} onCopy={onCopy} onShare={onShare} />
        );
      },
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const response = await uploadImage(file);
        if (response.image_url) {
          const imageUrl = URL.createObjectURL(file);
          setUploadedImage(imageUrl);
          setUploadedData(response);
          setValue("file", file, { shouldValidate: true });
          trigger("file");
          Swal.fire({
            icon: "success",
            title: "File Uploaded Successfully",
            text: "Your file has been uploaded. Please click 'Get Link' to obtain the URL.",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "bg-secondary px-10 py-2 text-black rounded-2xl",
              popup: "rounded-3xl shadow-md",
            },
          });
        } else {
          throw new Error("Unexpected response format.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: error.message || "An error occurred while uploading the file.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-secondary px-10 py-2 text-black rounded-2xl",
            popup: "rounded-3xl shadow-md",
          },
        });
      }
    }
  };

  const handleGetLink = () => {
    if (!uploadedData?.image_url) {
      Swal.fire({
        icon: "warning",
        title: "No File Uploaded",
        text: "Please upload a file first to get a link.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "bg-secondary px-10 py-2 text-black rounded-2xl border-0",
          popup: "rounded-3xl shadow-md",
        },
      });
      return;
    }
    handleSuccess(uploadedData.image_url);
  };

  const handleUrlUpload = async () => {
    const url = watch("image_url");
    try {
      const response = await linkUpload(url);
      
      if (response.image_url) {
        handleSuccess(response.image_url);
        setUploadedUrl(response.image_url);
        reset({ image_url: "" });
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Upload Failed",
        text: error.message || "An error occurred while uploading the URL.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-secondary px-10 py-2 text-black rounded-2xl",
          popup: "rounded-3xl shadow-md",
        },
      });
    }
  };
  

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-6">
        <div>
          <h1 className="text-xl font-bold text-primary">
            Create a Photo Link <span>{user && user.name} </span>
          </h1>
          <p className="text-foreground text-lg">
            Start creating your photo link now!
          </p>
        </div>
      </div>
      <div className="px-20 ">
        <div className="min-h-screen flex flex-col ">
          <form className="bg-white py-10 rounded-lg shadow-md max-w-4xl w-full px-20 mt-16">
            <div>
              <h3 className="md:text-2xl font-semibold">Upload File</h3>
            </div>

            <div>
              <div
                className={`border-dashed border-2 border-primary px-6 py-10 rounded-lg mt-6 relative bg-tertiary-25 ${
                  isDragging ? "bg-blue-100" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-3/4 max-w-md h-auto flex justify-center text-center items-center">
                    <Image src={Upload} alt="Upload" />
                  </div>
                  <div className="flex flex-col space-y-2 justify-center items-center ">
                    <h3 className="font-semibold text-xl">
                      Unlimited Access Now!
                    </h3>
                    <h5 className="font-medium">or drag and drop them here</h5>{" "}
                  </div>

                  <label
                    htmlFor="image"
                    className="cursor-pointer bg-secondary hover:bg-primary text-black hover:text-white px-4 py-2 rounded-xl"
                  >
                    Choose Files
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("image", { required: "File is required" })}
                    onChange={(event) => {
                      handleFileUpload(event);
                      trigger("image");
                    }}
                  />
                  {errors.file && !uploadedImage && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.file.message}
                    </p>
                  )}
                </div>
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

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGetLink}
                className="mt-6 max-w-40 bg-secondary text-black font-bold py-2 px-4 rounded-xl hover:bg-primary hover:text-white"
              >
                Get Link
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-center space-x-4 text-foreground">
                <hr className="flex-grow border-black" />
                <p className="text-black font-medium">OR Upload from URL</p>
                <hr className="flex-grow border-black" />
              </div>

              <div className="mt-8 mb-6 ">
                <h3 className="md:text-2xl font-semibold">Upload from URL</h3>
              </div>

              <div className="relative mt-4">
                <input
                  id="image_url"
                  type="url"
                  placeholder="Upload from URL"
                  className="bg-tertiary-25 rounded-2xl border focus:ring-primary focus:border-primary w-full py-4 pl-4 pr-16"
                  {...register("image_url")}
                />
                <button
                  type="button"
                  onClick={handleUrlUpload}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-primary hover:bg-secondary text-white hover:text-black px-4 py-2 rounded-2xl"
                >
                  Upload
                </button>
              </div>
              {errors.image_url && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.image_url.message}
                </p>
              )}
              {uploadedUrl && (
                <p className="text-green-500 text-sm mt-2">
                  Uploaded URL: {uploadedUrl}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(FileUpload);

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import Image from "next/image";
// import Upload from "../../../public/Feature/Upload.png";
// import { FaRegTrashCan } from "react-icons/fa6";
// import Swal from "sweetalert2";
// import { useAuthenticatedFeatures } from "@/hooks/feature";
// import ReactDOMServer from "react-dom/server";
// import AlertSuccess from "@/components/Alert/SuccessAlert";
// import { useAuth } from "@/hooks/auth";

// export default function FileUpload() {
//   useAuth({ middleware: 'auth' });
//   const { user } = useAuth();
//   const router = useRouter();
//   const { uploadImage, linkUpload } = useAuthenticatedFeatures();
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [uploadedData, setUploadedData] = useState(null);
//   const [uploadedUrl, setUploadedUrl] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     trigger,
//     formState: { errors },
//   } = useForm();

//   const removeFile = () => {
//     setUploadedImage(null);
//     setUploadedData(null);
//     setValue("file", null);
//   };

//   const removeUrl = () => {
//     setUploadedUrl(null);
//     setValue("url", null);
//   };

//   const handleFileUpload = async (input) => {
//     const file = input instanceof Event ? input.target.files[0] : input;

//     if (file) {
//       try {
//         const response = await uploadImage(file);
//         if (response.image_url) {
//           const imageUrl = URL.createObjectURL(file);
//           setUploadedImage(imageUrl);
//           setUploadedData(response);
//           setValue("file", file, { shouldValidate: true });
//           trigger("file");
//           Swal.fire({
//             icon: "success",
//             title: "File Uploaded Successfully",
//             text: "Your file has been uploaded. Please click 'Get Link' to obtain the URL.",
//             confirmButtonText: "OK",
//             customClass: {
//               confirmButton: "bg-secondary px-10 py-2 text-black rounded-2xl hover:bg-primary hover:text-white",
//               popup: "rounded-3xl shadow-md",
//             },
//           });
//         } else {
//           throw new Error("Unexpected response format.");
//         }
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Upload Failed",
//           text: error.message || "An error occurred while uploading the file.",
//           confirmButtonText: "OK",
//           customClass: {
//             confirmButton: "bg-secondary px-10 py-2 text-black rounded-2xl hover:bg-primary hover:text-white",
//             popup: "rounded-3xl shadow-md",
//           },
//         });
//       }
//     }
//   };

//   const handleGetLink = () => {
//     if (!uploadedData?.image_url) {
//       Swal.fire({
//         icon: "warning",
//         title: "No File Uploaded",
//         text: "Please upload a file first to get a link.",
//         confirmButtonText: "OK",
//         customClass: {
//           confirmButton:
//             "bg-secondary px-10 py-2 text-black rounded-2xl border-0 hover:bg-primary hover:text-white",
//           popup: "rounded-3xl shadow-md",
//         },
//       });
//       return;
//     }

//     const alertContent = ReactDOMServer.renderToString(
//       <AlertSuccess link={uploadedData.image_url} />
//     );

//     Swal.fire({
//       html: alertContent,
//       showConfirmButton: true,
//       confirmButtonText: "OK",
//       customClass: {
//         confirmButton:
//           "bg-secondary text-black px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white",
//         popup: "rounded-3xl p-6 shadow-lg",
//       },
//       showCloseButton: true,
//     }).then(() => {
//       removeFile();
//     });
//   };

//   const handleUrlUpload = async () => {
//     const url = watch("image_url");
//     try {
//       const response = await linkUpload(url);
//       if (response.image_url) {
//         const alertContent = ReactDOMServer.renderToString(
//           <AlertSuccess link={response.image_url} />
//         );

//         Swal.fire({
//           html: alertContent,
//           showConfirmButton: true,
//           confirmButtonText: "OK",
//           customClass: {
//             confirmButton: "bg-secondary text-black px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white",
//             popup: "rounded-3xl p-6 shadow-lg",
//           },
//           showCloseButton: true,
//         }).then(() => {
//           removeUrl();
//           reset({ image_url: "" });
//         });

//         setUploadedUrl(response.image_url);
//       } else {
//         throw new Error("Unexpected response format.");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "warning",
//         title: "Upload Failed",
//         text: error.message || "An error occurred while uploading the URL.",
//         confirmButtonText: "OK",
//         customClass: {
//           confirmButton: "bg-secondary px-10 py-2 text-black rounded-2xl hover:bg-primary hover:text-white",
//           popup: "rounded-3xl shadow-md",
//         },
//       });
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setIsDragging(false);

//     const file = event.dataTransfer.files[0];
//     if (file) {
//       handleFileUpload(file);
//     }
//   };

//   return (
//      <div className="container mx-auto">
//   <div className="p-6">
//   <div>
//           <h1 className="text-xl font-bold text-primary">
//           Create a Photo Link
//           </h1>
//           <p className="text-foreground text-lg">Start creating your photo link now!</p>
//         </div>
//   </div>
//     <div className="px-20 ">
//       <div className="min-h-screen flex flex-col justify-center items-center">

//         <form className="bg-white py-10 rounded-lg shadow-md max-w-4xl w-full px-20 mt-16">
//           <div>
//             <h3 className="md:text-2xl font-semibold">Upload File</h3>
//           </div>

//           <div>
//             <div  className={`border-dashed border-2 border-primary px-6 py-10 rounded-lg mt-6 relative bg-tertiary-25 ${isDragging ? 'bg-blue-100' : ''}`}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}>
//               <div className="flex flex-col items-center space-y-6">
//                 <div className="w-3/4 max-w-md h-auto flex justify-center text-center items-center">
//                   <Image src={Upload} alt="Upload" height="auto" width={150} priority/>
//                 </div>
//                 <div className="flex flex-col space-y-2 justify-center items-center ">
//                   <h3 className="font-semibold text-xl">Unlimited Access Now!</h3>
//                   <h5 className="font-medium">or drag and drop them here</h5>{" "}
//                 </div>

//                 <label
//                   htmlFor="image"
//                   className="cursor-pointer bg-secondary hover:bg-primary text-black hover:text-white px-4 py-2 rounded-xl"
//                 >
//                   Choose Files
//                 </label>
//                 <input
//                   id="image"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   {...register("image", { required: "File is required" })}
//                   onChange={(event) => {
//                     handleFileUpload(event);
//                     trigger("image");
//                   }}
//                 />
//                 {errors.file && !uploadedImage && (
//                   <p className="text-red-500 text-sm mt-2">
//                     {errors.file.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {uploadedImage && (
//               <div className="flex flex-col items-center mt-4 ">
//                 <div className="max-h-48 max-w-48 bg-tertiary-25 rounded-2xl p-4 relative">
//                   <Image
//                     src={uploadedImage}
//                     alt="Uploaded preview"
//                     className="w-32 h-32 object-cover rounded-lg"
//                     width={40}
//                     height={40} priority
//                   />
//                   <button
//                     type="button"
//                     onClick={removeFile}
//                     className="absolute -bottom-3 -right-3 bg-white text-red-600 p-2 rounded-lg shadow-md hover:bg-red-600 hover:text-white"
//                   >
//                     <FaRegTrashCan className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="button"
//               onClick={handleGetLink}
//               className="mt-6 max-w-40 bg-secondary text-black font-bold py-2 px-4 rounded-xl hover:bg-primary hover:text-white"
//             >
//               Get Link
//             </button>
//           </div>

//           <div className="mt-8">
//             <div className="flex items-center space-x-4 text-foreground">
//               <hr className="flex-grow border-black" />
//               <p className="text-black font-medium">OR Upload from URL</p>
//               <hr className="flex-grow border-black" />
//             </div>

//             <div className="mt-8 mb-6 ">
//               <h3 className="md:text-2xl font-semibold">Upload from URL</h3>
//             </div>

//             <div className="relative mt-4">
//               <input
//                 id="image_url"
//                 type="url"
//                 placeholder="Upload from URL"
//                 className="bg-tertiary-25 rounded-2xl border focus:ring-primary focus:border-primary w-full py-4 pl-4 pr-16"
//                 {...register("image_url")}
//               />
//               <button
//                 type="button"
//                 onClick={handleUrlUpload}
//                 className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-primary hover:bg-secondary text-white hover:text-black px-4 py-2 rounded-2xl"
//               >
//                 Upload
//               </button>
//             </div>
//             {errors.image_url && (
//               <p className="text-red-500 text-sm mt-2">{errors.image_url.message}</p>
//             )}
//             {uploadedUrl && (
//               <p className="text-green-500 text-sm mt-2">
//                 Uploaded URL: {uploadedUrl}
//               </p>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   );
// }
