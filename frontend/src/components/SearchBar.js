import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Search Bar Component
const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [placeholder, setPlaceholder] = useState("Search");
	const [suggestions, setSuggestions] = useState([]);

	const handleFocus = () => setPlaceholder("Enter room # or building...");
	const handleBlur = () => setPlaceholder("Search");

	const handleChange = async (event) => {
		const value = event.target.value;
		setSearchTerm(value);



		if (value.trim() !== "") {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/api/search?term=${encodeURIComponent(value)}`
				);

				const suggestions = response.data.filter((suggestion) =>
					suggestion.name.startsWith(value)
				);

				if (value.includes(" ")) {
					const [roomNumber, buildingName] = value.split(" ");
					const matchingRooms = suggestions.filter(
						(suggestion) =>
							suggestion.type === "room" &&
							suggestion.name.startsWith(roomNumber) &&
							suggestion.building
								.toLowerCase()
								.startsWith(buildingName.toLowerCase())
					);

					if (matchingRooms.length > 0) {
						setSuggestions(matchingRooms);
					} else {
						setSuggestions([]);
					}
				} else {
					setSuggestions(suggestions);
				}
			} catch (error) {
				console.error("Error fetching search suggestions:", error);
			}
		} else {
			setSuggestions([]);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && suggestions.length === 1) {
			event.preventDefault(); // Prevent form submission
			handleSuggestionClick(suggestions[0]); // Automatically select the suggestion
		}
	};

	const handleSuggestionClick = (suggestion) => {
		setSearchTerm(suggestion.name);
		setSuggestions([]);
		dispatchSearchEvent(suggestion.name);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (suggestions.length === 1) {
			// If so, automatically select the first (and only) suggestion
			handleSuggestionClick(suggestions[0]);
		} else {
			// Otherwise, dispatch the search event with the current search term
			dispatchSearchEvent(searchTerm);
		}
	};

	const dispatchSearchEvent = (searchInput) => {
		const searchEvent = new CustomEvent("search", { detail: searchInput });
		window.dispatchEvent(searchEvent);
	};

	return (
		<div style={{ position: "relative" }}>
			<form onSubmit={handleSubmit} class="d-flex">
				{/* ... */}
				<button
					type="submit"
					style={{
						zIndex: "999",
						backgroundColor: "#0a87ca",
						borderColor: "#024b76",
						borderWidth: "1.5px",
						boxShadow: "0 0 5px #0a87ca",
						padding: "10px",
						margin: "8px",
						marginRight: "0px",
					}}
					class="input-group-text border-0"
					id="search-addon"
					onChange={handleChange}
				>
					<FontAwesomeIcon icon={faSearch} style={{ color: "white" }} />
				</button>
				<input
					type="search"
					className="form-control rounded"
					placeholder={placeholder}
					onFocus={handleFocus}
					onBlur={handleBlur}
					aria-label="Search"
					aria-describedby="search-addon"
					value={searchTerm}
					onChange={handleChange}
					onKeyDown={handleKeyDown} // Added key down handler
					style={{
						backgroundColor: "#f1f2f3",
						width: "300px",
						padding: "6px",
						margin: "8px",
					}}
				/>
			</form>
			{suggestions.length > 0 && (
				<ul
					className="suggestions-list"
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						backgroundColor: "white",
						borderRadius: "4px",
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
						zIndex: 1000,
						listStyle: "none",
						padding: 0,
						margin: 0,
					}}>
					{suggestions.map((suggestion) => (
						<li
							key={suggestion.id}
							onClick={() => handleSuggestionClick(suggestion)}
							style={{
								padding: "8px 12px",
								cursor: "pointer",
							}}>
							{suggestion.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchBar;
