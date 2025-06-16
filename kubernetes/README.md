# Kubernetes Deployment for Backstage K0rdent

This directory contains Kubernetes manifests for deploying Backstage K0rdent to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster
- kubectl configured to connect to your cluster
- Access to GitHub Container Registry (GHCR)
- Accessible port 80 port 

## Configuration

<!-- 1. **Docker Image**:

The application uses GitHub Container Registry for images. The workflow automatically builds and pushes images on tags and releases. -->

```bash
# Images are published to:
ghcr.io/barelyanxer/backstage:VERSION
```


## Deployment
In this demo, we’ll use a cloud-based Kubernetes cluster with k0rdent installed.

1. Set up your Kubernetes Cluster and connect to it.
2. Install k0rdent in your cluster by following the official installation guide:
https://docs.k0rdent.io/1.0.0/admin/installation/install-k0rdent/

3. Create a namespace and expose your application using a service.
```bash
# Create Namespace
kubectl create namespace backstage-k0rdent

# Apply Service
kubectl apply -f service-loadbalancer.yaml 

# You should see something like this 

# NAMESPACE           NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP            PORT(S)           AGE
# 
# backstage-k0rdent   backstage-k0rdent     LoadBalancer   10.100.98.28     <Your External IP>     80:31903/TCP      1m10s 

```

2. In `kubernetes/deployment.yaml`, set `APP_BASE_URL`, `BACKEND_BASE_URL`, and `BACKEND_CORS_ORIGIN` to your service's **EXTERNAL-IP**, and wrap the values in double quotes.

```yaml
env:
    - name: APP_BASE_URL
        value: "YOUR_EXTERNAL_IP"
    - name: BACKEND_BASE_URL
        value: "YOUR_EXTERNAL_IP"
    - name: BACKEND_CORS_ORIGIN
        value: "YOUR_EXTERNAL_IP"
```

3. Apply deployment
```
kubectl apply -f deployment.yaml
```

4. You can now access your Backstage application using your cluster's external IP address.


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
