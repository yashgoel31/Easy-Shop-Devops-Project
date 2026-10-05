#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/mongodb_backup_$TIMESTAMP"
ARCHIVE_NAME="mongodb_backup_${TIMESTAMP}.tar.gz"
S3_BUCKET="${S3_BACKUP_BUCKET:-easyshop-database-backups}"

echo "Starting MongoDB backup at $(date)..."
mongodump --host="${MONGO_HOST:-localhost}" --port="${MONGO_PORT:-27017}" --out="$BACKUP_DIR"

tar -czf "$ARCHIVE_NAME" -C "$BACKUP_DIR" .
echo "Backup archive created: $ARCHIVE_NAME"

if command -v aws &> /dev/null; then
  echo "Uploading backup to s3://$S3_BUCKET/$ARCHIVE_NAME..."
  aws s3 cp "$ARCHIVE_NAME" "s3://$S3_BUCKET/$ARCHIVE_NAME"
fi

rm -rf "$BACKUP_DIR" "$ARCHIVE_NAME"
echo "Backup process finished successfully."
