import { useState } from 'react';
import useSWR from 'swr';
import axios from '@/lib/axios'; 
import { useAuth } from '@/hooks/auth'; 

export const useUsers = (page, perPage) => {
  const fetcher = async (url) => {
    const response = await axios.get(url, {
      params: { page, perPage },
    });
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR('/api/v1/users', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    users : data,
    isLoading,
    isError: error,
    mutateUsers: mutate,
  };
};

export const useCreateUser = () => {
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async (userData) => {
    if (!user) {
      throw new Error("Unauthorized: User not authenticated");
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/users', userData);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
};

export const useUserForEdit = (id) => {
  const { user } = useAuth(); // Autentikasi pengguna
  const fetcher = async (url) => {
    if (!user) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const response = await axios.get(url);
    return response.data;
  };

  const { data, error, isLoading } = useSWR(
    id ? `/api/v1/users/${id}/edit` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
};

export const useUpdateUser = (id) => {
  const { user } = useAuth(); // Verifikasi autentikasi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = async (userData) => {
    if (!user) {
      throw new Error("Unauthorized: User not authenticated");
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/v1/users/${id}`, userData);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, error };
};

export const useDeleteUser = () => {
  const { user } = useAuth(); // Verifikasi autentikasi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    if (!user) {
      throw new Error("Unauthorized: User not authenticated");
    }

    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/v1/users/${id}`);
      return id;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser, isLoading, error };
};
