import type { HTMLAttributes } from 'svelte/elements';

export type WithElementRef<T extends HTMLAttributes<HTMLElement>> = T & {
	ref?: HTMLElement | null;
};
