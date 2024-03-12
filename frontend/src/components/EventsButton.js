import React, { useState, useEffect } from "react";


const EventsButton = () => {
    const [showEventsSidebar, setShowEventsSidebar] = useState(false);
    const toggleEventsBar = () => {
        setShowEventsSidebar(!showEventsSidebar);
    };
    return (
        <button
            class="input-group-text border-0"
            //href="#"
            style={{
                backgroundColor: "#0a87ca",
                borderColor: "#024b76",
                borderWidth: "1.5px",
                //boxShadow: "0 0 5px #0a87ca",
                padding: "8px",
                margin: "8px",
                color: "white",
                borderRadius: "8px"
            }}
            onClick={toggleEventsBar}
        >
            Events
        </button>
    );
};

export default EventsButton