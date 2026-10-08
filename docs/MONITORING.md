# Observability, Metrics, and Alerting Guide

## Metrics Architecture
EasyShop exposes runtime telemetry scraped by Prometheus and visualized using Grafana dashboards.

### Key Performance Indicators (KPIs)
- **HTTP Request Latency (p95, p99)**: < 150ms
- **Error Rate (5xx HTTP responses)**: < 0.1%
- **Pod CPU / Memory Saturation**: Alerts configured at 80% threshold
- **Database Connection Pool**: Active vs Idle connection tracking

## Dashboards
- **EasyShop Application Dashboard**: Request rates, status code distribution, top endpoints.
- **Node & Cluster Dashboard**: CPU load, Memory pressure, Pod restarts, Disk I/O.
