import { createQuery, createMutation } from '@tanstack/svelte-query';
import { apiClient } from '../client';
import type { 
	Company, 
	CreateCompanyInput, 
	UpdateCompanyInput,
	ApiResponse,
	PaginatedResponse 
} from '../types';
import { queryClient } from './queryClient';
import { toast } from 'svelte-sonner';

// Query keys
export const companyKeys = {
	all: ['companies'] as const,
	lists: () => [...companyKeys.all, 'list'] as const,
	list: (filters: Record<string, any>) => [...companyKeys.lists(), filters] as const,
	details: () => [...companyKeys.all, 'detail'] as const,
	detail: (id: number) => [...companyKeys.details(), id] as const,
};

// Hook: List companies
export function useCompanies(filters: Record<string, any> = {}) {
	return createQuery({
		queryKey: companyKeys.list(filters),
		queryFn: async () => {
			const params = new URLSearchParams();
			if (filters.name) params.append('name', filters.name);
			if (filters.organization_id) params.append('organization_id', String(filters.organization_id));
			if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active));
			if (filters.per_page) params.append('per_page', String(filters.per_page));

			const response = await apiClient.get<ApiResponse<PaginatedResponse<Company>>>(
				`/admin/companies?${params.toString()}`
			);
			return response.data.data;
		},
	});
}

// Hook: Get single company
export function useCompany(id: number) {
	return createQuery({
		queryKey: companyKeys.detail(id),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<Company>>(`/admin/companies/${id}`);
			return response.data.data;
		},
		enabled: !!id,
	});
}

// Hook: Create company
export function useCreateCompany() {
	return createMutation({
		mutationFn: async (data: CreateCompanyInput) => {
			const response = await apiClient.post<ApiResponse<Company>>('/admin/companies', data);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
			toast.success('Empresa creada exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al crear empresa');
		},
	});
}

// Hook: Update company
export function useUpdateCompany() {
	return createMutation({
		mutationFn: async ({ id, data }: { id: number; data: UpdateCompanyInput }) => {
			const response = await apiClient.put<ApiResponse<Company>>(`/admin/companies/${id}`, data);
			return response.data.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: companyKeys.detail(variables.id) });
			toast.success('Empresa actualizada exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al actualizar empresa');
		},
	});
}

// Hook: Delete company
export function useDeleteCompany() {
	return createMutation({
		mutationFn: async (id: number) => {
			await apiClient.delete(`/admin/companies/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
			toast.success('Empresa eliminada exitosamente');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Error al eliminar empresa');
		},
	});
}
