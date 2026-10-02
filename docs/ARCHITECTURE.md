# System Architecture & Design

## Overview
EasyShop is an enterprise-grade cloud-native e-commerce system architected using Next.js 14, containerized with Docker, deployed on AWS EKS Kubernetes cluster, and provisioned via Terraform.

```mermaid
graph TD
    Client[Browser / Mobile Client] --> CloudFront[AWS CloudFront / Ingress NGINX]
    CloudFront --> Ingress[Kubernetes Ingress Controller]
    Ingress --> EasyShopSvc[EasyShop Service]
    EasyShopSvc --> Pod1[EasyShop App Pod 1]
    EasyShopSvc --> Pod2[EasyShop App Pod 2]
    EasyShopSvc --> Pod3[EasyShop App Pod N]
    Pod1 --> MongoSvc[MongoDB Service]
    Pod2 --> MongoSvc
    Pod3 --> MongoSvc
    MongoSvc --> MongoStateful[MongoDB StatefulSet]
    MongoStateful --> EBS[AWS EBS Persistent Volume]
    Jenkins[Jenkins CI/CD] --> ECR[AWS ECR / Docker Registry]
    ECR --> EasyShopSvc
```

## Core Layers
1. **Frontend**: Next.js App Router, Tailwind CSS, Redux Toolkit.
2. **Backend**: Next.js Route Handlers, Mongoose ODM, JWT verification.
3. **Data Storage**: MongoDB with persistent storage volume claims.
4. **DevOps & Infrastructure**: Docker multi-stage images, AWS EKS, Terraform IaC, Jenkins automated deployment.
