import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLocationDot,
	faHome,
	faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import "./Sidebar.css";

export const SidebarData = [
	{
		type: "searchBar",
	},
	{
		title: "Home",
		path: "/",
		icon: <FontAwesomeIcon icon={faHome} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: false,
	},
	{
		title: "Events",
		path: "/events",
		icon: <FontAwesomeIcon icon={faCalendarDays} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		type: "events",
		protected: true,
	},
	{
		title: "Navigation",
		path: "/nav",
		icon: <FontAwesomeIcon icon={faLocationDot} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: false,
	},
	{
		title: "GitHub",
		type: "gitHubButton",
		icon: <FontAwesomeIcon icon={faGithub} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: false,
	},
];
