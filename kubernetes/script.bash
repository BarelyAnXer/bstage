#!/bin/bash

# Simple Kubernetes Deployment Script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_info "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker not found. Please install: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command_exists kind; then
    print_error "Kind not found. Please install: go install sigs.k8s.io/kind@latest"
    exit 1
fi

if ! command_exists kubectl; then
    print_error "kubectl not found. Please install: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

print_info "All prerequisites found"

# Create KinD cluster
print_info "Creating KinD cluster..."
if ! kind create cluster --config kind-cluster.yaml --name kind; then
    print_error "Failed to create KinD cluster"
    exit 1
fi

# Set kubectl context
print_info "Setting kubectl context..."
if ! kubectl config use-context kind-kind; then
    print_error "Failed to set kubectl context"
    exit 1
fi

# Create namespace
print_info "Creating namespace backstage-k0rdent..."
if ! kubectl create namespace backstage-k0rdent; then
    print_error "Failed to create namespace backstage-k0rdent"
    exit 1
fi

# Apply manifests
print_info "Applying deployment..."
if ! kubectl apply -f deployment.yaml -n backstage-k0rdent; then
    print_error "Failed to apply deployment.yaml"
    exit 1
fi

print_info "Applying service..."
if ! kubectl apply -f service.yaml -n backstage-k0rdent; then
    print_error "Failed to apply service.yaml"
    exit 1
fi

print_info "Deployment completed successfully!"
print_info "Use 'kubectl get pods -n backstage-k0rdent' to check status"
print_info "Visit http://localhost:7007/ to see the app"