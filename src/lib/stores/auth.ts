import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { apiClient } from '../client';
import type { User, LoginCredentials, AuthResponse } from '../types';
import { toast } from 'svelte-sonner';

interface AuthState {
	user: User | null;
	token: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		token: null,
		refreshToken: null,
		isLoading: true,
		isAuthenticated: false,
	});

	return {
		subscribe,

		// Initialize auth state from localStorage
		init: async () => {
			if (!browser) return;

			const token = localStorage.getItem('access_token');
			const refreshToken = localStorage.getItem('refresh_token');

			if (token) {
				try {
					// Validate token and get user data
					const response = await apiClient.get('/auth/me');
					const user = response.data.data;

					update((state) => ({
						...state,
						user,
						token,
						refreshToken,
						isAuthenticated: true,
						isLoading: false,
					}));
				} catch (error) {
					// Token invalid, clear storage
					localStorage.removeItem('access_token');
					localStorage.removeItem('refresh_token');
					update((state) => ({
						...state,
						isLoading: false,
					}));
				}
			} else {
				update((state) => ({
					...state,
					isLoading: false,
				}));
			}
		},

		// Login
		login: async (credentials: LoginCredentials) => {
			try {
				const response = await apiClient.post<{
					success: boolean;
					data: AuthResponse;
					message: string;
				}>('/auth/login', credentials);

				if (response.data.success) {
					const { access_token, refresh_token } = response.data.data;

					localStorage.setItem('access_token', access_token);
					localStorage.setItem('refresh_token', refresh_token);

					// Get user data
					const userResponse = await apiClient.get('/auth/me', {
						headers: {
							Authorization: `Bearer ${access_token}`,
						},
					});

					const user = userResponse.data.data;

					update((state) => ({
						...state,
						user,
						token: access_token,
						refreshToken: refresh_token,
						isAuthenticated: true,
						isLoading: false,
					}));

					toast.success('Inicio de sesión exitoso');
					return { success: true };
				}
			} catch (error: any) {
				const message = error.response?.data?.message || 'Error al iniciar sesión';
				toast.error(message);
				return { success: false, error: message };
			}
		},

		// Logout
		logout: async () => {
			const currentToken = get({ subscribe }).token;

			try {
				if (currentToken) {
					await apiClient.post('/auth/logout', {}, {
						headers: {
							Authorization: `Bearer ${currentToken}`,
						},
					});
				}
			} catch (error) {
				console.error('Logout error:', error);
			} finally {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');

				set({
					user: null,
					token: null,
					refreshToken: null,
					isLoading: false,
					isAuthenticated: false,
				});

				goto('/login');
				toast.success('Sesión cerrada');
			}
		},

		// Refresh token
		refresh: async () => {
			const currentRefreshToken = get({ subscribe }).refreshToken;

			if (!currentRefreshToken) {
				throw new Error('No refresh token');
			}

			try {
				const response = await apiClient.post('/auth/refresh', {}, {
					headers: {
						Authorization: `Bearer ${currentRefreshToken}`,
					},
				});

				const { access_token } = response.data.data;
				localStorage.setItem('access_token', access_token);

				update((state) => ({
					...state,
					token: access_token,
				}));

				return access_token;
			} catch (error) {
				auth.logout();
				throw error;
			}
		},

		// Update user data
		updateUser: (user: User) => {
			update((state) => ({
				...state,
				user,
			}));
		},
	};
}

export const auth = createAuthStore();

// Derived stores
export const user = derived(auth, ($auth) => $auth.user);
export const isAuthenticated = derived(auth, ($auth) => $auth.isAuthenticated);
export const isLoading = derived(auth, ($auth) => $auth.isLoading);
export const userRole = derived(auth, ($auth) => $auth.user?.user_role_id);

// Permission helpers
export function hasRole(roleId: number): boolean {
	const currentUser = get(user);
	if (!currentUser) return false;
	return currentUser.user_role_id === roleId;
}

export function hasAnyRole(roleIds: number[]): boolean {
	const currentUser = get(user);
	if (!currentUser) return false;
	return roleIds.includes(currentUser.user_role_id);
}

export function isAdmin(): boolean {
	return hasAnyRole([1, 2]); // SUPER_ADMIN or ADMIN
}

export function canAccessAdmin(): boolean {
	return isAdmin();
}
