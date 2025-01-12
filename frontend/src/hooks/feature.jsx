// import axios from '../lib/axios';

// const useAuthenticatedFeatures = () => {
//     const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (sesuaikan dengan backend)
//     const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
  
//     const validateFile = (file) => {
//       if (!file) throw new Error("No file provided.");
//       if (file.size > MAX_FILE_SIZE) {
//         throw new Error("File size exceeds the maximum limit of 5MB.");
//       }
//       if (!SUPPORTED_FORMATS.includes(file.type)) {
//         throw new Error("Unsupported file format. Please upload a JPG, PNG, JPEG, GIF, or WebP file.");
//       }
//       return true;
//     };
  

//     const uploadImage = async (file) => {
//       try {
//         validateFile(file); 
  
//         const formData = new FormData();
//         formData.append("image", file);
  
//         const response = await axios.post('/api/v1/file/upload/image', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
  
//         return response.data;
//       } catch (error) {
//         console.error("Error in uploadImage (authenticated):", error);
//         throw error.response?.data || { message: error.message, status: error.response?.status };
//       }
//     };
  
//     // Fungsi untuk reupload link (pengguna login)
//     const linkUpload = async (url) => {
//       if (!url) throw new Error("URL is required for linkUpload");


//       if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/.test(url)) {
//         throw new Error("Invalid URL format. Please provide a valid image URL.");
//       }
  
//       try {
//         const response = await axios.post('/api/v1/file/link-upload', { url });
//         return response.data;
//       } catch (error) {
//         console.error("Error in linkUpload (authenticated):", error);
//         throw error.response?.data || { message: error.message, status: error.response?.status };
//       }
//     };
  
//     return { uploadImage, linkUpload };
//   };

// //   belum login
// const useUnauthenticatedFeatures = () => {
//     const MAX_FILE_SIZE = 5 * 1024 * 1024; 
//     const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
  
//     const validateFile = (file) => {
//       if (!file) {
//         throw new Error("No file provided.");
//       }
  
//       if (file.size > MAX_FILE_SIZE) {
//         throw new Error("File size exceeds the maximum limit of 5MB.");
//       }
  
//       if (!SUPPORTED_FORMATS.includes(file.type)) {
//         throw new Error("Unsupported file format. Please upload a JPG, PNG, JPEG, GIF, or WebP file.");
//       }
  
//       return true;
//     };
  
//     const uploadImage = async (file) => {
//       try {
//         validateFile(file); // Validasi file sebelum upload
  
//         const formData = new FormData();
//         formData.append("image", file);
  
//         const response = await axios.post("/file/upload/image", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
  
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     };
  
//     const linkUpload = async (url) => {
//       // Validasi URL format
//       if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/.test(url)) {
//         throw new Error("Invalid URL format. Please provide a valid image URL.");
//       }

//       try {
//         const response = await axios.post("/file/link-upload", { url });
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     };
  
//     return { uploadImage, linkUpload };
//   };

// export { useAuthenticatedFeatures, useUnauthenticatedFeatures };

// import axios from '../lib/axios';

// const MAX_FILE_SIZE = 5 * 1024 * 1024; 
// const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

// const validateFile = (file) => {
//   if (!file) throw new Error("No file provided.");
//   if (file.size > MAX_FILE_SIZE) throw new Error("File size exceeds the maximum limit of 5MB.");
//   if (!SUPPORTED_FORMATS.includes(file.type)) throw new Error("Unsupported file format.");
//   return true;
// };

// const validateUrl = (url) => {
//   if (!url) throw new Error("URL is required.");
//   const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
//   if (!urlPattern.test(url)) {
//     throw new Error("Invalid URL format. Please provide a valid image URL.");
//   }
//   return true;
// };

// const useAuthenticatedFeatures = () => {
//   const uploadImage = async (file) => {
//     try {
//       validateFile(file);
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await axios.post('/api/v1/file/upload/image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (!response.data?.image_url) throw new Error("Unexpected response format from server.");
//       return response.data; 
//     } catch (error) {
//       console.error("Error in uploadImage (authenticated):", error);
//       throw error.response?.data || { message: error.message, status: error.response?.status };
//     }
//   };

//   const linkUpload = async (url) => {
//     try {
//       validateUrl(url);

//       const response = await axios.post('/api/v1/file/link-upload', { url });

//       if (!response.data?.link) throw new Error("Unexpected response format from server.");
//       return response.data; 
//     } catch (error) {
//       console.error("Error in linkUpload (authenticated):", error);
//       throw error.response?.data || { message: error.message, status: error.response?.status };
//     }
//   };

//   return { uploadImage, linkUpload };
// };

// export { useAuthenticatedFeatures };


// import axios from '@/lib/axios';
// import { useAuth } from '@/hooks/auth';

// const MAX_FILE_SIZE = 5 * 1024 * 1024; 
// const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
// let guestUploadCount = 0;
// const MAX_GUEST_UPLOADS = 3;

// const validateFile = (file) => {
//   if (!file) throw new Error("No file provided.");
//   if (file.size > MAX_FILE_SIZE) throw new Error("File size exceeds the maximum limit of 5MB.");
//   if (!SUPPORTED_FORMATS.includes(file.type)) throw new Error("Unsupported file format.");
//   return true;
// };

// const validateUrl = (url) => {
//   if (!url) throw new Error("URL is required.");
//   const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
//   if (!urlPattern.test(url)) {
//     throw new Error("Invalid URL format. Please provide a valid image URL.");
//   }
//   return true;
// };

// const useAuthenticatedFeatures = () => {
//   const { user } = useAuth();

//   const uploadImage = async (file) => {
//     if (!user && typeof user !== "undefined") { 
//       // Ini memastikan hanya memvalidasi setelah data user diambil
//       if (guestUploadCount >= MAX_GUEST_UPLOADS) {
//         throw new Error("Guest users are limited to 3 uploads. Please log in for unlimited access.");
//       }
//       guestUploadCount++;
//     }

//     validateFile(file);
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const response = await axios.post('/api/v1/file/upload/image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (!response.data?.image_url) {
//         throw new Error("Unexpected response format from server.");
//       }

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: error.message, status: error.response?.status };
//     }
//   };

//   const linkUpload = async (url) => {
//     if (!user) {
//       if (guestUploadCount >= MAX_GUEST_UPLOADS) {
//         throw new Error("Guest users are limited to 3 uploads. Please log in for unlimited access.");
//       }
//       guestUploadCount++;
//     }

//     validateUrl(url);

//     try {
//       const response = await axios.post('/api/v1/file/link-upload', { image_url: url });

//       if (!response.data?.image_url) {
//         throw new Error("Unexpected response format from server.");
//       }

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: error.message, status: error.response?.status };
//     }
//   };

//   return { uploadImage, linkUpload };
// };

// export { useAuthenticatedFeatures };


import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
const MAX_GUEST_UPLOADS = 3;

// Menyimpan dan mendapatkan jumlah unggahan tamu di localStorage
const getGuestUploadCount = () => {
  return parseInt(localStorage.getItem('guestUploadCount') || '0', 10);
};

const setGuestUploadCount = (count) => {
  localStorage.setItem('guestUploadCount', count);
};

const validateFile = (file) => {
  if (!file) throw new Error("No file provided.");
  if (file.size > MAX_FILE_SIZE) throw new Error("File size exceeds the maximum limit of 5MB.");
  if (!SUPPORTED_FORMATS.includes(file.type)) throw new Error("Unsupported file format.");
  return true;
};

const validateUrl = (url) => {
  if (!url) throw new Error("URL is required.");
  const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  if (!urlPattern.test(url)) {
    throw new Error("Invalid URL format. Please provide a valid image URL.");
  }
  return true;
};

const useAuthenticatedFeatures = () => {
  const { user } = useAuth();

  const uploadImage = async (file) => {
    // Mengelola upload tamu dengan memeriksa dan mengupdate guestUploadCount
    let guestUploadCount = getGuestUploadCount();
    if (!user && typeof user !== "undefined") {
      if (guestUploadCount >= MAX_GUEST_UPLOADS) {
        throw new Error("Guest users are limited to 3 uploads. Please log in for unlimited access.");
      }
      guestUploadCount++;
      setGuestUploadCount(guestUploadCount);
    }

    validateFile(file);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post('/api/v1/file/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.data?.image_url) {
        throw new Error("Unexpected response format from server.");
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message, status: error.response?.status };
    }
  };

  const linkUpload = async (url) => {
    // Mengelola upload tamu dengan memeriksa dan mengupdate guestUploadCount
    let guestUploadCount = getGuestUploadCount();
    if (!user) {
      if (guestUploadCount >= MAX_GUEST_UPLOADS) {
        throw new Error("Guest users are limited to 3 uploads. Please log in for unlimited access.");
      }
      guestUploadCount++;
      setGuestUploadCount(guestUploadCount);
    }

    validateUrl(url);

    try {
      const response = await axios.post('/api/v1/file/link-upload', { image_url: url });

      if (!response.data?.image_url) {
        throw new Error("Unexpected response format from server.");
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message, status: error.response?.status };
    }
  };

  return { uploadImage, linkUpload };
};

export { useAuthenticatedFeatures };
