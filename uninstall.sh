#!/bin/bash

# Make script exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Confirm uninstallation
read -p "This will remove all containers, volumes, and data. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Stop and remove containers
echo "Stopping and removing containers..."
docker compose down -v

# Remove data directories
echo "Removing data directories..."
rm -rf uploads/*

echo -e "${GREEN}Uninstallation completed successfully!${NC}"