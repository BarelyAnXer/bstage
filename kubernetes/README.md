# Kubernetes Deployment for Backstage K0rdent

This directory contains Kubernetes manifests for deploying Backstage K0rdent to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster
- kubectl configured to connect to your cluster
- Access to GitHub Container Registry (GHCR)

## Configuration

1. **Docker Image**:

The application uses GitHub Container Registry for images. The workflow automatically builds and pushes images on tags and releases.

```bash
# Images are published to:
ghcr.io/barelyanxer/backstage:VERSION
```


## Deployment

Apply the Kubernetes manifests:

```bash
# Creating KinD Cluster
kind create cluster --config kind-cluster.yaml --name kind

# Apply Deployment
kubectl apply -f deployment.yaml

# Apply Service
kubectl apply -f service.yaml 

```

Note: If you are not using Kind you can just use `kubectl port-forward service/backstage-k0rdent 7007:80`

Common Issues:

kind: Needs port mapping configuration
minikube: Use minikube ip instead of localhost
Docker Desktop: Sometimes has firewall issues with NodePorts


## Verification

Check the status of your deployment:

```bash
# Check deployment status
kubectl get deployment backstage-k0rdent 

# Check pod status
kubectl get pods -l app=backstage-k0rdent 

# Check service
kubectl get service backstage-k0rdent
```
