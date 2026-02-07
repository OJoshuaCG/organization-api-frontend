import { writable } from 'svelte/store';

// Detect system preference
const getInitialMode = () => {
	if (typeof window === 'undefined') return 'dark';
	
	const stored = localStorage.getItem('mode');
	if (stored === 'light' || stored === 'dark') return stored;
	
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const mode = writable<'light' | 'dark'>('dark');

export function toggleMode() {
	mode.update(current => {
		const next = current === 'light' ? 'dark' : 'light';
		if (typeof window !== 'undefined') {
			localStorage.setItem('mode', next);
			document.documentElement.classList.toggle('dark', next === 'dark');
		}
		return next;
	});
}

export function setInitialMode() {
	const initial = getInitialMode();
	mode.set(initial);
	document.documentElement.classList.toggle('dark', initial === 'dark');
}
