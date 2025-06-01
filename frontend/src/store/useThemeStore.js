import { create } from "zustand";

export const useThemeStore = create((set) => {
	return {
		theme: localStorage.getItem("theme") || "forest",
		setTheme: (theme) => {
			localStorage.setItem("theme", theme);
			set({ theme });
		},
	};
});
