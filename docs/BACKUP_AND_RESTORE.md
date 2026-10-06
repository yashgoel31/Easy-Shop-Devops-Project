# Disaster Recovery & Database Backup Runbook

## Objectives
- **RPO (Recovery Point Objective)**: < 4 hours
- **RTO (Recovery Time Objective)**: < 30 minutes

## Automated Backups
- Runs daily via Kubernetes CronJob or external scheduler.
- Archives are encrypted at rest using AWS S3 SSE-S3.
- Retention: 30 days daily backups, 12 months monthly snapshots.

## Manual Execution
```bash
export MONGO_HOST="mongodb.easyshop.svc.cluster.local"
export S3_BACKUP_BUCKET="easyshop-database-backups"
./scripts/backup-mongodb.sh
```

## Emergency Restore Procedure
1. Identify the latest valid timestamped archive in S3.
2. Download archive:
   ```bash
   aws s3 cp s3://easyshop-database-backups/mongodb_backup_YYYYMMDD.tar.gz .
   ```
3. Run restore:
   ```bash
   ./scripts/restore-mongodb.sh mongodb_backup_YYYYMMDD.tar.gz
   ```
4. Verify data integrity with test query:
   ```bash
   mongosh --eval "db.products.countDocuments()"
   ```
