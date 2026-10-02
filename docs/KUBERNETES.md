# Kubernetes Cluster Deployment & Operations Guide

## Namespace
All services run inside the isolated namespace:
```bash
kubectl apply -f kubernetes/01-namespace.yml
```

## Deployment Order
1. `00-cluster-issuer.yml` (Cert-manager Let's Encrypt issuer)
2. `01-namespace.yml` (Namespace setup)
3. `02-mongodb-pv.yml` & `03-mongodb-pvc.yml` (Storage)
4. `04-configmap.yml` & `05-secrets.yml` (Configuration)
5. `06-mongodb-service.yml` & `07-mongodb-statefulset.yml` (Database)
6. `08-easyshop-deployment.yml` & `09-easyshop-service.yml` (App pods)
7. `10-ingress.yml` (NGINX ingress)
8. `11-hpa.yml` (Horizontal Pod Autoscaler)
9. `12-migration-job.yml` (Database seeding job)

## Useful Inspection Commands
```bash
kubectl get all -n easyshop
kubectl logs -f -l app=easyshop -n easyshop
kubectl top pods -n easyshop
```
