import { useSyncExternalStore } from 'react';

const mediaMatch =
	typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

let darkMode = mediaMatch?.matches ?? false;

mediaMatch?.addEventListener('change', (event) => {
	darkMode = event.matches;
});

function subscribe(onChange: () => void) {
	mediaMatch?.addEventListener('change', onChange);

	return () => {
		mediaMatch?.removeEventListener('change', onChange);
	};
}

export function useIsDarkMode() {
	return useSyncExternalStore(
		subscribe,
		() => darkMode,
		() => false
	);
}
