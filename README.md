# Backstage K0rdent

A [Backstage](https://backstage.io/) application integrated with [K0rdent](https://k0rdent.io/) for Kubernetes cluster lifecycle management and visualization.

## Overview

This project provides a developer portal built on Backstage that integrates with K0rdent, enabling teams to:

- **Manage Kubernetes clusters** through K0rdent's cluster lifecycle management
- **Visualize cluster resources** with the integrated CAPI Visualizer
- **Centralize developer resources** in a unified portal
- **Streamline DevOps workflows** with integrated tooling

## Features

- 🎯 **Backstage Developer Portal** - Software catalog, documentation, and developer tools
- ⚡ **K0rdent Integration** - Kubernetes cluster lifecycle management
- 📊 **CAPI Visualizer** - Visual representation of Cluster API resources
- 🐳 **Containerized Deployment** - Ready for production Kubernetes deployment
- 🔧 **Extensible Architecture** - Plugin-based system for custom functionality

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Backstage     │    │    K0rdent      │    │ CAPI Visualizer │
│   Frontend      │◄──►│   (Backend)     │◄──►│   (Plugin)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Kubernetes    │
                    │    Cluster      │
                    └─────────────────┘
```

## Quick Start

For local development and detailed setup instructions, see [development.md](./development.md).

## Deployment

### Prerequisites

- **Kubernetes cluster** with K0rdent installed
- **kubectl** configured to connect to your cluster  
- **LoadBalancer support** - Your cluster must support LoadBalancer services to automatically provision external IPs (available on cloud providers like AWS, Azure, GCP, or on-premises with MetalLB)
- **Container registry access** - Access to GitHub Container Registry (GHCR)

> **Note**: Cloud providers like Azure, AWS, and GCP automatically provision external IPs when you create a LoadBalancer service. For on-premises clusters, you'll need a LoadBalancer implementation like MetalLB.

### Network Access Configuration

Ensure your cluster allows inbound traffic on port 80:

- **Azure**: Add an inbound security rule in your Network Security Group (NSG) to allow port 80
- **AWS**: Configure your Security Groups to allow inbound traffic on port 80
- **GCP**: Add a firewall rule to allow traffic on port 80
- **On-premises**: Configure your firewall/router to allow port 80 traffic to your cluster nodes

### Container Images

Container images are automatically built and published to GitHub Container Registry:

```
ghcr.io/barelyanxer/backstage:VERSION
```

### Deployment Steps

As mentioned in the prerequisites, you need to have a Kubernetes cluster with K0rdent installed. Refer to the [K0rdent documentation](https://docs.k0rdent.io/1.0.0/admin/installation/install-k0rdent/) for installation instructions.

Once that is ready, you can deploy the application to your cluster.

1. **Create Namespace**
   ```bash
   kubectl create namespace backstage-k0rdent
   ```

2. **Deploy LoadBalancer Service**
   ```bash
   kubectl apply -f kubernetes/service-loadbalancer.yaml
   ```

3. **Get External IP**
   ```bash
   kubectl get service backstage-k0rdent -n backstage-k0rdent
   # Note the EXTERNAL-IP for next step
   ```

4. **Configure Environment Variables**
   
   Edit `kubernetes/deployment.yaml` and update the environment variables:
   ```yaml
   env:
     - name: APP_BASE_URL
       value: "http://YOUR_EXTERNAL_IP"
     - name: BACKEND_BASE_URL
       value: "http://YOUR_EXTERNAL_IP"
     - name: BACKEND_CORS_ORIGIN
       value: "http://YOUR_EXTERNAL_IP"
   ```

5. **Deploy Application**
   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   ```

6. **Verify Deployment**
   ```bash
   kubectl get deployment backstage-k0rdent -n backstage-k0rdent
   kubectl get pods -l app=backstage-k0rdent -n backstage-k0rdent
   ```

## Configuration

### Environment Variables

Key environment variables for configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_BASE_URL` | Frontend base URL | `http://localhost:3000` |
| `BACKEND_BASE_URL` | Backend base URL | `http://localhost:7007` |
| `BACKEND_CORS_ORIGIN` | CORS origins | `http://localhost:3000` |
| `GITHUB_TOKEN` | GitHub API token | Required |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the test suite: `yarn test:all`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

For detailed development instructions, see [development.md](./development.md).

## Support

- **Documentation**: [Backstage Documentation](https://backstage.io/docs)
- **K0rdent Documentation**: [K0rdent Docs](https://docs.k0rdent.io/)
- **Issues**: [GitHub Issues](https://github.com/BarelyAnXer/bstage/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [Backstage](https://backstage.io/) - The platform this project is built on
- [K0rdent](https://k0rdent.io/) - Kubernetes cluster lifecycle management
- [CAPI Visualizer](https://github.com/Jont828/cluster-api-visualizer) - Cluster API visualization
