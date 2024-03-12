import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const GitHubButton = () => (
	<button
		className="input-group-text border-0"
		onClick={() => {
			window.location.href = "https://github.com/simaanc/bruinmap";
		}}
		style={{
			backgroundColor: "black",
			color: "white",
			borderWidth: "1.5px",
			padding: "12px",
			margin: "8px",
		}}
	>
		<FontAwesomeIcon icon={faGithub} />
	</button>
);

export default GitHubButton;
