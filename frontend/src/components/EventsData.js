import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

export const EventData = [
	{
		type: "searchBar",
	},
	{
		title: "Event 1",
		path: "/",
		icon: <FontAwesomeIcon icon={faCalendarDays} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: false,
	},
	{
		title: "Saved Event 1",
		path: "/",
		icon: <FontAwesomeIcon icon={faCalendarDays} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: true,
	},
	{
		title: "Event 2",
		path: "/",
		icon: <FontAwesomeIcon icon={faCalendarDays} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: false,
	},
	{
		title: "Event 3",
		path: "/",
		icon: <FontAwesomeIcon icon={faCalendarDays} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: false,
	},
	{
		title: "Saved Event 2",
		path: "/",
		icon: <FontAwesomeIcon icon={faCalendarDays} style={{ margin: "8px" }} />,
		cName: "sidebar-text",
		protected: true,
	},
];
