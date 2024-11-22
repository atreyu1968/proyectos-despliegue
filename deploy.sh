#!/bin/bash

# Make script exit on any error
set -e

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
for cmd in docker docker-compose; do
    if ! command_exists $cmd; then
        echo "Error: $cmd is required but not installed."
        exit 1
    fi
done

# Create necessary directories
mkdir -p uploads
chmod 755 uploads

# Generate secure passwords
DB_ROOT_PASS=$(openssl rand -base64 32)
DB_PASS=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

# Update environment variables
sed -i "s/root_secure_pass/$DB_ROOT_PASS/" docker-compose.yml
sed -i "s/fpinnova_secure_pass/$DB_PASS/" docker-compose.yml
sed -i "s/your_secure_jwt_secret_key_here/$JWT_SECRET/" docker-compose.yml

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d --build

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 30

# Show container status
docker-compose ps

echo "Deployment completed successfully!"
echo "Please access the application at http://localhost"
echo ""
echo "Important: Save these credentials in a secure location:"
echo "Database Root Password: $DB_ROOT_PASS"
echo "Database User Password: $DB_PASS"
echo "JWT Secret: $JWT_SECRET"