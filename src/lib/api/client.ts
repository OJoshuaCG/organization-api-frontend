import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { browser } from '$app/environment';

// Create axios instance
export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	}
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (browser) {
			const token = localStorage.getItem('access_token');
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
	refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken: string) {
	refreshSubscribers.forEach((callback) => callback(newToken));
	refreshSubscribers = [];
}

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

		if (error.response?.status === 401 && !originalRequest._retry && browser) {
			if (isRefreshing) {
				// Wait for token refresh
				return new Promise((resolve) => {
					subscribeTokenRefresh((token: string) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						resolve(apiClient(originalRequest));
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = localStorage.getItem('refresh_token');
				if (!refreshToken) {
					throw new Error('No refresh token');
				}

				const response = await axios.post(
					`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
					{},
					{
						headers: {
							'Authorization': `Bearer ${refreshToken}`
						}
					}
				);

				const { access_token } = response.data.data;
				localStorage.setItem('access_token', access_token);

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${access_token}`;
				}

				onTokenRefreshed(access_token);
				isRefreshing = false;

				return apiClient(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);
