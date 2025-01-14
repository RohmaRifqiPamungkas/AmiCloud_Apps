import axios from '../lib/axios';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth';

const useManagementFiles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { user } = useAuth();

  const fetchFiles = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('api/v1/management_files', { params });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`api/v1/management_files/${id}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFile = async (fileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('api/v1/management_files', fileData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`api/v1/management_files/${id}`, updatedData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`api/v1/management_files/${id}`);
      setData({ message: 'File deleted successfully' });
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`api/v1/management_files/${id}/copy-link`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const shareFile = async (id, shareData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`api/v1/management_files/${id}/share`, shareData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    fetchFiles,
    fetchFile,
    createFile,
    updateFile,
    deleteFile,
    copyLink,
    shareFile,
  };
};

export default useManagementFiles;
