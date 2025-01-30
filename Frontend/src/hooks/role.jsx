import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import axios from '../lib/axios';

const fetcher = (url) => axios.get(url).then(res => {
    return res.data
});

const useRoleManagement = () => {
    const { data: roleList, error, isLoading, mutate: revalidate } = useSWR('/api/v1/roles', fetcher);
    const { data: permissionList, mutate: revalidatePermission } = useSWR('/api/v1/permissions?per_page=999', fetcher);



    const getRoleById = async (id) => {
        try {
            const response = await axios.get(`/api/v1/roles?per_page=999`);
            const role = response.data.data.find((role) => role.id == id);
            return role;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    const addRole = async (roleData) => {
        try {
            const response = await axios.post(`/api/v1/roles`, roleData);
            mutate('/api/v1/roles');
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const updateRole = async ({ payload, id }) => {
        try {
            const response = await axios.put(`/api/v1/roles/${id}`, payload);
            mutate('/api/v1/roles');
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };


    const deleteRole = async (id) => {
        try {
            const response = await axios.delete(`/api/v1/roles/${id}`);
            mutate('/api/v1/roles');
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return {
        roleList,
        permissionList,
        getRoleById,
        addRole,
        updateRole,
        deleteRole,
        isLoading,
        error,
    };
};

export default useRoleManagement;
