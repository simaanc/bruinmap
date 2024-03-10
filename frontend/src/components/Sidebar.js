import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { SidebarData } from './SidebarData';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'

const Sidebar = ({ sidebar, showSidebar }) => {
  return(
    <div>
    {/* Sidebar */}
      <nav className={sidebar ? 'sidebar-menu active' : 'sidebar-menu'}>
        <ul className='sidebar-menu-items' onClick={showSidebar}>
          <li className="sidebar-toggle">
            {/* Sidebar close button */}
            <Button
              data-mdb-collapse-init
              class="navbar-toggler sidebar-button"
              type="button"
              data-mdb-target="#navbarButtonsExample"
              aria-controls="navbarButtonsExample"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <FontAwesomeIcon icon={faX} style={{ color: "white", padding: "4px", right: '0' }} onClick={showSidebar} />
            </Button>  
          </li>
          {/* Sidebar Items */}
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;