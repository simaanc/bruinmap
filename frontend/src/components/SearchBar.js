import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Search Bar Component
const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [placeholder, setPlaceholder] = useState("Search");

	const handleFocus = () => setPlaceholder("Enter room # or building...");
	const handleBlur = () => setPlaceholder("Search");

	const handleChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatchSearchEvent();
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			dispatchSearchEvent();
		}
	};

	const dispatchSearchEvent = () => {
		const searchEvent = new CustomEvent("search", { detail: searchTerm });
		window.dispatchEvent(searchEvent);
	};

	return (
		<div>
			<form onSubmit={handleSubmit} class="d-flex">
				<button
					type="submit"
					style={{
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
					onKeyDown={handleKeyDown}
					style={{
						backgroundColor: "#f1f2f3",
						width: "300px",
						padding: "6px",
						margin: "8px",
					}}
				/>
			</form>
		</div>
	);
};

export default SearchBar;
