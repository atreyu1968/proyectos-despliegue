#!/bin/bash

# Make script exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting FP Innova installation...${NC}"

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null || ! command -v docker compose &> /dev/null; then
    echo "Installing Docker and Docker Compose..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# Create necessary directories
mkdir -p uploads
chmod 755 uploads

# Start containers
echo "Building and starting containers..."
docker compose up -d --build

echo -e "${GREEN}Installation completed successfully!${NC}"
echo -e "\n${GREEN}You can now access the application at http://localhost:3010${NC}"
echo -e "\n${GREEN}Default admin credentials:${NC}"
echo "Email: admin@fpinnova.es"
echo "Password: admin123"