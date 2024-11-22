#!/bin/bash

# Make script exit on any error
set -e

# Load environment variables
source .env

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Error: Please provide the backup file path"
    echo "Usage: ./restore.sh <backup_file>"
    exit 1
fi

BACKUP_FILE="$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# If file is gzipped, decompress it
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Decompressing backup file..."
    gunzip -c "$BACKUP_FILE" > "${BACKUP_FILE%.gz}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Restore backup
echo "Restoring database from backup..."
docker-compose exec -T db mysql -u fpinnova -p"$DB_PASSWORD" fpinnova < "$BACKUP_FILE"

# Clean up decompressed file if original was gzipped
if [[ "$1" == *.gz ]]; then
    rm "$BACKUP_FILE"
fi

echo "Database restore completed successfully!"