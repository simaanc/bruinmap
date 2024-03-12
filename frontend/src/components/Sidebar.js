import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { SidebarData } from "./SidebarData";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Sidebar = ({ sidebar, showSidebar, isLoggedIn }) => {
	const handleSearchBarClick = (event) => {
		event.stopPropagation();
	};

	return (
		<div className="wrapper">
		<div className="sidebar">
			{/* Sidebar */}
			<nav className={sidebar ? "sidebar-menu active" : "sidebar-menu"} >
				<ul className="sidebar-menu-items" onClick={showSidebar}
					>
					{/* Sidebar Items */}
					{SidebarData.filter((item) => !item.protected || isLoggedIn).map(
						(item, index) => {
							if (item.type === "searchBar") {
								// Render the SearchBar component for this special case
								return (
									<li
										key={index}
										className="sidebar-item"
										onClick={handleSearchBarClick}
									>
										<SearchBar />
									</li>
								);
							} else if (item.type === "gitHubButton") {
								// Render the SearchBar component for this special case
								return (
									<li key={index} className={item.cName}>
										<Link to={"https://github.com/simaanc/bruinmap"}>
											{item.icon}
											<span>{item.title}</span>
										</Link>

									</li>

								);
							}
							else {
								// Render normal sidebar items
								return (
									<li key={index} className={item.cName}>
										<Link to={item.path}>
											{item.icon}
											<span>{item.title}</span>
										</Link>
									</li>
								);
							}
						}
					)}
				</ul>
			</nav>
		</div >
		</div>
	);
};

export default Sidebar;
