#!/usr/bin/env bash
set -euo pipefail

ARCHIVE_FILE="${1:-}"
if [ -z "$ARCHIVE_FILE" ]; then
  echo "Usage: $0 <backup_archive.tar.gz>"
  exit 1
fi

EXTRACT_DIR="/tmp/restore_$(date +%s)"
mkdir -p "$EXTRACT_DIR"

echo "Extracting backup $ARCHIVE_FILE..."
tar -xzf "$ARCHIVE_FILE" -C "$EXTRACT_DIR"

echo "Restoring database into MongoDB..."
mongorestore --host="${MONGO_HOST:-localhost}" --port="${MONGO_PORT:-27017}" --drop "$EXTRACT_DIR"

rm -rf "$EXTRACT_DIR"
echo "Database restore completed successfully!"
