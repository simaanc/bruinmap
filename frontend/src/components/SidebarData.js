import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLocationDot,
	faHome,
	faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

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
		title: "My Events",
		path: "/saved-events",
		icon: <FontAwesomeIcon icon={faCalendarDays} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: true,
	},
	{
		title: "Navigation",
		path: "/nav",
		icon: <FontAwesomeIcon icon={faLocationDot} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: false,
	},
];
