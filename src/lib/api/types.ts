// User Types
export interface User {
	id: number;
	username: string;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	full_name: string;
	is_active: boolean;
	user_role_id: number;
	organization_id: number | null;
	company_id: number | null;
	role?: {
		id: number;
		name: string;
	};
	organization?: {
		id: number;
		name: string;
	} | null;
	company?: {
		id: number;
		name: string;
	} | null;
}

// Organization Types
export interface Organization {
	id: number;
	name: string;
	description: string | null;
	whmcs_id: number | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	created_by?: {
		id: number;
		name: string;
	};
	updated_by?: {
		id: number;
		name: string;
	};
}

export interface CreateOrganizationInput {
	name: string;
	description?: string;
	whmcs_id?: number;
	is_active?: boolean;
}

export interface UpdateOrganizationInput {
	name?: string;
	description?: string;
	whmcs_id?: number;
	is_active?: boolean;
}

export interface OrganizationFilters {
	name?: string;
	is_active?: boolean;
	order_by?: string;
	order_direction?: 'asc' | 'desc';
	per_page?: number;
}

// Company Types
export interface Company {
	id: number;
	name: string;
	description: string | null;
	whmcs_id: number | null;
	is_active: boolean;
	organization_id: number;
	organization?: {
		id: number;
		name: string;
	};
	created_at: string;
	updated_at: string;
}

export interface CreateCompanyInput {
	name: string;
	organization_id: number;
	description?: string;
	whmcs_id?: number;
	is_active?: boolean;
}

export interface UpdateCompanyInput {
	name?: string;
	description?: string;
	whmcs_id?: number;
	is_active?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
}

// Auth Types
export interface LoginCredentials {
	username: string;
	password: string;
}

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

// Role Constants
export enum UserRole {
	SUPER_ADMIN = 1,
	ADMIN = 2,
	ORGANIZATION_OWNER = 3,
	COMPANY_OWNER = 4,
	USER = 5
}

export const ROLE_LABELS: Record<number, string> = {
	[UserRole.SUPER_ADMIN]: 'Super Admin',
	[UserRole.ADMIN]: 'Admin',
	[UserRole.ORGANIZATION_OWNER]: 'Organization Owner',
	[UserRole.COMPANY_OWNER]: 'Company Owner',
	[UserRole.USER]: 'User'
};
