#!/bin/bash

# Change directory to the backend folder
cd backend

# Check if the .env file exists and has the required values
if [ -f ".env" ] && grep -q "MONGODB_URI" .env && grep -q "JWT_SECRET" .env && grep -q "PORT" .env && grep -q "REACT_APP_FRONTEND_BASE_URL" .env && grep -q "API_RESET_EMAIL" .env && grep -q "API_RESET_PASSWORD" .env; then
    echo ".env file with required values already exists in the backend folder."
else
    # Prompt the user for MONGODB_URI
    read -p "Enter the MONGODB_URI: " mongodb_uri

    # Prompt the user for JWT_SECRET
    read -p "Enter the JWT_SECRET: " jwt_secret

    # Prompt the user for PORT
    read -p "Enter the PORT for the backend server (default: 8000): " port
    port=${port:-8000}

    # Set the frontend port to the default value of 3000
    frontend_port=3000

    # Prompt the user for API_RESET_EMAIL
    read -p "Enter the API_RESET_EMAIL: " api_reset_email

    # Prompt the user for API_RESET_PASSWORD
    read -p "Enter the API_RESET_PASSWORD: " api_reset_password

    # Create the .env file in the backend folder
    echo "MONGODB_URI=$mongodb_uri" > .env
    echo "JWT_SECRET=$jwt_secret" >> .env
    echo "PORT=$port" >> .env
    echo "REACT_APP_FRONTEND_BASE_URL=http://localhost:$frontend_port" >> .env
    echo "API_RESET_EMAIL=$api_reset_email" >> .env
    echo "API_RESET_PASSWORD=$api_reset_password" >> .env

    echo ".env file created in the backend folder with the provided values."
fi

# Install backend dependencies
npm install

# Start the backend server
npm start &

# Change back to the parent directory
cd ..

# Change directory to the frontend folder
cd frontend

# Check if the .env file exists and has the required value
if [ -f ".env" ] && grep -q "REACT_APP_API_BASE_URL" .env; then
    echo ".env file with required value already exists in the frontend folder."
else
    # Create the .env file in the frontend folder
    echo "REACT_APP_API_BASE_URL=http://localhost:$port" > .env

    echo ".env file created in the frontend folder with the provided value."
fi

# Install frontend dependencies
npm install

# Start the frontend development server
npm start