import { createQuery, createMutation } from '@tanstack/svelte-query';
import { apiClient } from '../client';
import type { 
	User, 
	CreateUserInput, 
	UpdateUserInput,
	ApiResponse,
	PaginatedResponse 
} from '../types';
import { queryClient } from './queryClient';
import { toast } from 'svelte-sonner';

// Query keys
export const userKeys = {
	all: ['users'] as const,
	lists: () => [...userKeys.all, 'list'] as const,
	list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
	details: () => [...userKeys.all, 'detail'] as const,
	detail: (id: number) => [...userKeys.details(), id] as const,
};

// Hook: List users
export function useUsers(filters: Record<string, any> = {}) {
	return createQuery({
		queryKey: userKeys.list(filters),
		queryFn: async () => {
			const params = new URLSearchParams();
			if (filters.username) params.append('username', filters.username);
			if (filters.email) params.append('email', filters.email);
			if (filters.organization_id) params.append('organization_id', String(filters.organization_id));
			if (filters.company_id) params.append('company_id', String(filters.company_id));
			if (filters.user_role_id) params.append('user_role_id', String(filters.user_role_id));
			if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active));
			if (filters.per_page) params.append('per_page', String(filters.per_page));

			const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
				`/admin/users?${params.toString()}`
			);
			return response.data.data;
		},
	});
}

// Hook: Get single user
export function useUser(id: number) {
	return createQuery({
		queryKey: userKeys.detail(id),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<User>>(`/admin/users/${id}`);
			return response.data.data;
		},
		enabled: !!id,
	});
}

// Hook: Create user
export function useCreateUser() {
	return createMutation({
		mutationFn: async (data: CreateUserInput) => {
			const response = await apiClient.post<ApiResponse<User>>('/admin/users', data);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			toast.success('Usuario creado exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al crear usuario');
		},
	});
}

// Hook: Update user
export function useUpdateUser() {
	return createMutation({
		mutationFn: async ({ id, data }: { id: number; data: UpdateUserInput }) => {
			const response = await apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, data);
			return response.data.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
			toast.success('Usuario actualizado exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al actualizar usuario');
		},
	});
}

// Hook: Delete user
export function useDeleteUser() {
	return createMutation({
		mutationFn: async (id: number) => {
			await apiClient.delete(`/admin/users/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			toast.success('Usuario eliminado exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al eliminar usuario');
		},
	});
}
