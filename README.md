# Project Name

This project consists of a backend and frontend application. Follow the instructions below to set up and run the project on your local machine.

## Prerequisites

Make sure you have the following installed on your system:

- Node.js (version X.X.X)
- npm (version X.X.X)

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

The script will create the necessary `.env` files in the backend and frontend folders with the provided values.

5. The script will automatically install the dependencies and start the backend and frontend servers.

6. Once the setup is complete, you can access the application in your web browser at `http://localhost:3000`.
