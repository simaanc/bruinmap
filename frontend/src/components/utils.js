import { useState, useEffect } from "react";

export function useThemeDetector() {
	const [theme, setTheme] = useState("dark"); // Default to dark

	useEffect(() => {
		const matchDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = ({ matches }) => setTheme(matches ? "dark" : "light");

		matchDarkMode.addEventListener("change", handleChange);
		// Set initial theme
		handleChange(matchDarkMode);

		return () => matchDarkMode.removeEventListener("change", handleChange);
	}, []);

	return theme;
}
