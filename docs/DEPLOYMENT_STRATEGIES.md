# Zero-Downtime Deployment Strategies

## 1. Rolling Updates (Default Strategy)
EasyShop uses Kubernetes native rolling update strategy:
- `maxSurge: 25%`: Launches up to 25% new pods before terminating old pods.
- `maxUnavailable: 0%`: Guarantees 100% capacity during node and application updates.

## 2. Readiness Gates
Pods are only marked `Ready` after:
1. Container starts and passes `startupProbe`.
2. App initializes MongoDB connection pool.
3. Health check at `/api/health` returns HTTP 200 OK.

## 3. Graceful Shutdown
When terminating, the pod receives `SIGTERM` and handles in-flight transactions before shutting down (`terminationGracePeriodSeconds: 30`).
