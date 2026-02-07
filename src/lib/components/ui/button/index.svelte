<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { buttonVariants, type ButtonVariants } from './variants';

	let { 
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable<HTMLButtonElement>(),
		children,
		...props 
	}: { class?: string } & ButtonVariants & { ref?: HTMLButtonElement } & HTMLButtonAttributes = $props();
</script>

<button
	bind:this={ref}
	class={cn(buttonVariants({ variant, size }), className)}
	{...props}
>
	{@render children?.()}
</button>
