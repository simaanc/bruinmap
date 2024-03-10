import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faHome, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FontAwesomeIcon icon={faHome} />,
        cName: 'sidebar-text'
    },
    {
        title: 'Saved Events',
        path: '/saved-events',
        icon: <FontAwesomeIcon icon={faCalendarDays} />,
        cName: 'sidebar-text'
    },
    {
        title: 'Navigation',
        path: '/nav',
        icon: <FontAwesomeIcon icon={faLocationDot} />,
        cName: 'sidebar-text'
    }
]