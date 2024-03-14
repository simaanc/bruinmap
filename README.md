# BruinMap

This is a mobile-first web app that features an interactive campus map for both indoors and outdoors. It features login & signup authentication functionality, reset password capability, an interactive map, searchable rooms in the Math/Sci building of UCLA, an event saving feature, and more. Follow the instructions below to set up and run the project on your local machine.

## Prerequisites

Make sure you have the following installed on your system:

- Node.js
- npm

## Setup Instructions

1. Clone the repository:
`git clone https://github.com/simaanc/bruinmap.git`

2. Navigate to the project directory:
`cd bruinmap`

3. Make the start script executable:
`chmod +x start.sh`

4. Run the setup script:
`./start.sh`

The setup script will guide you through the following steps:

- Enter the MongoDB URI for the backend.
- Enter the JWT secret for the backend.
- Enter the backend server port (default: 8000).
- Enter the API reset email.
- Enter the API reset password.

The script will create the necessary `.env` files in the backend and frontend folders with the provided values.

5. The script will automatically install the dependencies and start the backend and frontend servers.

6. Once the setup is complete, you can access the application in your web browser at `http://localhost:3000`.

## Folder Structure

The project has the following folder structure:
```bruinmap/
├── backend/
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── .env
│   ├── package.json
│   └── ...
├── start.sh
└── README.md
```

- The `backend` folder contains the backend application code and its associated files.
- The `frontend` folder contains the frontend application code and its associated files.
- The `start.sh` file is the start and setup script that automates the setup  and starting process.

## Authors
* Christopher Simaan (506231577)
* Srishti Ganu (206230881)
* Riley Jahanshahi (406280988)
* Chrissy Chien (406232884)
* Brandon Rodmel (806280905)
