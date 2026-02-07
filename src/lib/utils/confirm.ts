import { toast } from 'svelte-sonner';

export function confirmDelete(message: string): Promise<boolean> {
	return new Promise((resolve) => {
		// Simple confirmation for now - can be replaced with a modal
		const confirmed = window.confirm(message);
		resolve(confirmed);
	});
}

export function confirmAction(message: string): Promise<boolean> {
	return new Promise((resolve) => {
		const confirmed = window.confirm(message);
		resolve(confirmed);
	});
}
