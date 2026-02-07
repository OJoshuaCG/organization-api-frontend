import { createQuery, createMutation } from '@tanstack/svelte-query';
import { apiClient } from '../client';
import type { 
	Organization, 
	CreateOrganizationInput, 
	UpdateOrganizationInput,
	OrganizationFilters,
	ApiResponse,
	PaginatedResponse 
} from '../types';
import { queryClient } from './queryClient';
import { toast } from 'svelte-sonner';

// Query keys
export const organizationKeys = {
	all: ['organizations'] as const,
	lists: () => [...organizationKeys.all, 'list'] as const,
	list: (filters: OrganizationFilters) => [...organizationKeys.lists(), filters] as const,
	details: () => [...organizationKeys.all, 'detail'] as const,
	detail: (id: number) => [...organizationKeys.details(), id] as const,
};

// Hook: List organizations
export function useOrganizations(filters: OrganizationFilters = {}) {
	return createQuery({
		queryKey: organizationKeys.list(filters),
		queryFn: async () => {
			const params = new URLSearchParams();
			if (filters.name) params.append('name', filters.name);
			if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active));
			if (filters.order_by) params.append('order_by', filters.order_by);
			if (filters.order_direction) params.append('order_direction', filters.order_direction);
			if (filters.per_page) params.append('per_page', String(filters.per_page));

			const response = await apiClient.get<ApiResponse<PaginatedResponse<Organization>>>(
				`/admin/organizations?${params.toString()}`
			);
			return response.data.data;
		},
	});
}

// Hook: Get single organization
export function useOrganization(id: number) {
	return createQuery({
		queryKey: organizationKeys.detail(id),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<Organization>>(`/admin/organizations/${id}`);
			return response.data.data;
		},
		enabled: !!id,
	});
}

// Hook: Create organization
export function useCreateOrganization() {
	return createMutation({
		mutationFn: async (data: CreateOrganizationInput) => {
			const response = await apiClient.post<ApiResponse<Organization>>('/admin/organizations', data);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
			toast.success('Organización creada exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al crear organización');
		},
	});
}

// Hook: Update organization
export function useUpdateOrganization() {
	return createMutation({
		mutationFn: async ({ id, data }: { id: number; data: UpdateOrganizationInput }) => {
			const response = await apiClient.put<ApiResponse<Organization>>(`/admin/organizations/${id}`, data);
			return response.data.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: organizationKeys.detail(variables.id) });
			toast.success('Organización actualizada exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al actualizar organización');
		},
	});
}

// Hook: Delete organization
export function useDeleteOrganization() {
	return createMutation({
		mutationFn: async (id: number) => {
			await apiClient.delete(`/admin/organizations/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
			toast.success('Organización eliminada exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al eliminar organización');
		},
	});
}
