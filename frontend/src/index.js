import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot
import App from "./App";

// Find the root container
const container = document.getElementById("root");

// Create a root
const root = createRoot(container); // Create a root for the container

// Render the app using the root.render method
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
