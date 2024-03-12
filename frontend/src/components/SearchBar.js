import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// Search Bar Component
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholder, setPlaceholder] = useState("Search");
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);

  const handleFocus = () => setPlaceholder("Enter room # or building...");
  const handleBlur = () => setPlaceholder("Search");

  const handleChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search?term=${encodeURIComponent(value)}`
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

  const handleSuggestionClick = (suggestion) => {
	setSearchTerm(suggestion.name);
	setSuggestions([]);
	dispatchSearchEvent(suggestion.name);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatchSearchEvent(searchTerm);
  };

  const dispatchSearchEvent = (searchInput) => {
    const searchEvent = new CustomEvent("search", { detail: searchInput });
    window.dispatchEvent(searchEvent);
  };

  return (
    <div style={{ position: "relative" }}>
      <form onSubmit={handleSubmit} class="d-flex">
        {/* ... */}
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
