

import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
const MAX_GUEST_UPLOADS = 3;

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

const appendUserIdToRequestData = (data, user) => {
  return { ...data, user_id: user?.id || null };
};

const useAuthenticatedFeatures = () => {
  const { user } = useAuth();

  const uploadImage = async (file) => {
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
    formData.append("user_id", user?.id || null);

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
    let guestUploadCount = getGuestUploadCount();
    if (!user) {
      if (guestUploadCount >= MAX_GUEST_UPLOADS) {
        throw new Error("Guest users are limited to 3 uploads. Please log in for unlimited access.");
      }
      guestUploadCount++;
      setGuestUploadCount(guestUploadCount);
    }

    validateUrl(url);

    const requestData = appendUserIdToRequestData({ image_url: url }, user);

    try {
      const response = await axios.post('/api/v1/file/link-upload', requestData);

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
