import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FontAwesomeIcon icon='fa-solid fa-x' />,
        cName: 'sidebar-text'
    },
    {
        title: 'Saved Events',
        path: '/saved-events',
        icon: <FontAwesomeIcon icon='fa-regular fa-calendar-days' />,
        cName: 'sidebar-text'
    },
    {
        title: 'Navigation',
        path: '/nav',
        icon: <FontAwesomeIcon icon='fa-solid fa-location-dot' />,
        cName: 'sidebar-text'
    }
]