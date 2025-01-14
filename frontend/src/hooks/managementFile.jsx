// import axios from '../lib/axios';
// import { useState } from 'react';
// import { useAuth } from '@/hooks/auth';

// const useManagementFiles = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploads, setUploads] = useState(null);
//   const [links, setLinks] = useState(null);
//   const [data, setData] = useState(null);
//   const { user } = useAuth();


//   const fetchFiles = async (type = null, params = {}) => {
//     if (loading) return; 
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('api/v1/management_files', {
//         params: { type, ...params },
//       });

//       if (type === 'upload') {
//         setUploads(response.data.uploads || []);
//         setLinks(null);
//       } else if (type === 'link') {
//         setLinks(response.data.links || []);
//         setUploads(null);
//       } else {
//         setUploads(response.data.uploads || []);
//         setLinks(response.data.links || []);
//       }

//       setData(response.data); 
//     } catch (err) {
//       setError(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   const fetchFile = async (id) => {
//     if (loading) return; 
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`api/v1/management_files/${id}`);
//       setData(response.data);
//     } catch (err) {
//       setError(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createFile = async (fileData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post('api/v1/management_files', fileData);
//       setData(response.data);
//     } catch (err) {
//       setError(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateFile = async (id, updatedData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.put(`api/v1/management_files/${id}`, updatedData);
//       setData(response.data);
//     } catch (err) {
//       setError(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteFile = async (id) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await axios.delete(`api/v1/management_files/${id}`);
//       setData({ message: 'File deleted successfully' });
//     } catch (err) {
//       setError(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyLink = async (id) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`api/v1/management_files/${id}/copy-link`);
//       setData(response.data);
//     } catch (err) {
//       setError(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const shareFile = async (id, shareData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`api/v1/management_files/${id}/share`, shareData);
//       setData(response.data);
//     } catch (err) {
//       setError(err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     error,
//     uploads,
//     links,
//     data,
//     fetchFiles,
//     fetchFile,
//     createFile,
//     updateFile,
//     deleteFile,
//     copyLink,
//     shareFile,
//   };
// };

// export default useManagementFiles;


import axios from '../lib/axios';
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';

const useManagementFiles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploads, setUploads] = useState(null);
  const [links, setLinks] = useState(null);
  const [data, setData] = useState(null);
  const { user } = useAuth();

  const fetchFiles = useCallback(async (type = null, params = {}) => {
    if (loading) return; 
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('api/v1/management_files', {
        params: { type, ...params },
      });

      if (type === 'upload') {
        setUploads(response.data.uploads || []);
        setLinks(null);
      } else if (type === 'link') {
        setLinks(response.data.links || []);
        setUploads(null);
      } else {
        setUploads(response.data.uploads || []);
        setLinks(response.data.links || []);
      }

      setData(response.data); 
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const fetchFile = useCallback(async (id) => {
    if (loading) return; 
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
  }, [loading]);

  const createFile = useCallback(async (fileData) => {
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
  }, []);

  const updateFile = useCallback(async (id, updatedData) => {
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
  }, []);

  const deleteFile = useCallback(async (id) => {
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
  }, []);

  const copyLink = useCallback(async (id) => {
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
  }, []);

  const shareFile = useCallback(async (id, shareData) => {
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
  }, []);

  return {
    loading,
    error,
    uploads,
    links,
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
