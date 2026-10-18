# Infrastructure Production Readiness Checklist

## Cluster Health
- [ ] Worker nodes in `Ready` state across multiple Availability Zones.
- [ ] CoreDNS and kube-proxy pods running without restarts.
- [ ] Ingress controller serving valid TLS certificates.

## Application Health
- [ ] All EasyShop deployment replicas passing startup and liveness probes.
- [ ] Horizontal Pod Autoscaler active with CPU target utilization <= 70%.
- [ ] PodDisruptionBudget ensures minimum 1 replica available during node draining.

## Security & Compliance
- [ ] NetworkPolicies actively restrict MongoDB access to authorized app pods only.
- [ ] S3 buckets have server-side encryption and versioning enabled.
- [ ] IAM roles follow principle of least privilege.
- [ ] Dependabot and Trivy vulnerability scans report zero critical issues.

## Observability & DR
- [ ] CloudWatch alarms active for high CPU / memory thresholds.
- [ ] Prometheus scraping application metrics via ServiceMonitor.
- [ ] Daily S3 database backup cron verified within last 24 hours.
