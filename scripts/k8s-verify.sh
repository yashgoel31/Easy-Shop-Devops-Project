#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="easyshop"

echo "=== EasyShop Kubernetes Health Verification ==="
echo "Checking nodes..."
kubectl get nodes -o wide

echo "Checking Pod statuses in namespace: $NAMESPACE"
kubectl get pods -n "$NAMESPACE"

echo "Checking Services and Endpoints..."
kubectl get svc -n "$NAMESPACE"

echo "Checking Ingress status..."
kubectl get ingress -n "$NAMESPACE"

echo "Checking HPA metrics..."
kubectl get hpa -n "$NAMESPACE"

echo "All cluster resources checked successfully!"
