#!/bin/bash

# Make script exit on any error
set -e

# Load environment variables
source .env

# Set backup directory
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/fpinnova_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating database backup..."
docker-compose exec -T db mysqldump -u fpinnova -p"$DB_PASSWORD" fpinnova > "$BACKUP_FILE"

# Compress backup
echo "Compressing backup..."
gzip "$BACKUP_FILE"

echo "Backup completed: ${BACKUP_FILE}.gz"

# Keep only last 5 backups
echo "Cleaning old backups..."
ls -t "$BACKUP_DIR"/*.gz | tail -n +6 | xargs -r rm

echo "Backup process completed successfully!"