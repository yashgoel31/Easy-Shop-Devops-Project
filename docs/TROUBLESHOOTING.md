# Production Incident Troubleshooting Runbook

## 1. CrashLoopBackOff on Pods
**Symptom**: EasyShop pods repeatedly restarting.
- Check logs: `kubectl logs -l app=easyshop -n easyshop --previous`
- Check environment configs: verify `DATABASE_URL` and `NEXTAUTH_SECRET` in secret manifests.

## 2. ImagePullBackOff
**Symptom**: Pod cannot pull container image.
- Verify AWS ECR login or Docker Hub credentials.
- Verify image tag exists in repository.

## 3. PersistentVolumeClaim Pending
**Symptom**: MongoDB pod stuck in Pending state.
- Check storage class: `kubectl get sc`
- Verify EBS CSI driver status: `kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-ebs-csi-driver`

## 4. OOMKilled (Out of Memory)
**Symptom**: Pod terminated with exit code 137.
- Adjust memory limits in `kubernetes/08-easyshop-deployment.yml`.
