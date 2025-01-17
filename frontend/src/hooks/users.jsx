import { useAuth } from '@/hooks/auth';
import axios from '@/lib/axios';
import { useState } from 'react';
import useSWR from 'swr';

export const useUsers = (page, perPage, searchQuery = "") => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetcher = async (url) => {
    try {
      const response = await axios.get(url, {
        params: { page, perPage },
      });
      return response.data.users;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const { data, error: swrError, isLoading: swrLoading, mutate } = useSWR(
    [`/api/v1/users`, page, perPage],
    ([url, page, perPage]) => {
      return fetcher(`${url}?page=${page || 1}&perPage=${perPage || 10}&search=${searchQuery}`);
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // Delete user
  const deleteUser = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/v1/users/${id}`);
      setIsLoading(false);
      mutate();
      return id;
    } catch (err) {
      setIsLoading(false);
      setError(err);
      throw err;
    }
  };

  const getUserById = async (id) => {
    try {
      const response = await axios.get(`/api/v1/users?per_page=999`);
      const user = response.data.users.data.find((user) => user.id == id);
      return user
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  return {
    users: data,
    isLoading: swrLoading || isLoading,
    isError: swrError || error,
    getUserById,
    deleteUser,
    mutateUsers: mutate,
  };
};



export const useGetUserById = (id) => {
  const fetcher = async (url) => {
    const response = await axios.get(url);
    const data = response.data;
    const userList = data.users
    const user = userList.find((user) => user.id == id);
    return user;
  };

  const { data, error: isError, isLoading: isFetching } = useSWR(
    id ? `/api/v1/users/` : null,
    fetcher
  );

  return {
    user: data,
    isUserLoading: isFetching,
    isError,
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
