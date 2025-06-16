# Development Guide

This guide covers local development setup, project structure, and development workflows for Backstage K0rdent.

## Local Development Setup

### Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** v20 or v22 (recommended: v22.11.0)
- **Yarn** v4.4.1 or later
- **kind** v0.29.0 (for local development)
- **kubectl** (for Kubernetes cluster management)
- **Helm** v3.x (for K0rdent installation)
- **Docker/Podman** (for containerization)

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/BarelyAnXer/bstage
cd bstage
```

#### 2. Set Up Local Kubernetes Environment

```bash
# Create a kind cluster for local development
kind create cluster

# Verify cluster is running
kubectl cluster-info
```

#### 3. Install K0rdent

```bash
# Install K0rdent using Helm
helm install kcm oci://ghcr.io/k0rdent/kcm/charts/kcm \
  --version 1.0.0 \
  -n kcm-system \
  --create-namespace

# Verify K0rdent installation
kubectl get pods -n kcm-system
```

#### 4. Deploy CAPI Visualizer

```bash
# Clone and deploy the CAPI Visualizer
git clone https://github.com/Jont828/cluster-api-visualizer.git
cd cluster-api-visualizer
./hack/deploy-repo-to-kind.sh
cd ../bstage
```

#### 5. Configure Environment

```bash
# Install dependencies
yarn install

# Copy environment template
cp .env.example .env

# Edit .env file and add your GitHub token
# GITHUB_TOKEN=your_github_token_here
```

#### 6. Start the Application

```bash
# Start the development server
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
bstage/
├── packages/
│   ├── app/              # Frontend React application
│   └── backend/          # Node.js backend services
├── plugins/              # Custom Backstage plugins
├── kubernetes/           # Kubernetes deployment manifests
├── examples/             # Example configurations
├── app-config.yaml       # Main application configuration
└── app-config.production.yaml  # Production configuration
```

### Key Directories

- **`packages/app/`** - The frontend React application that users interact with
- **`packages/backend/`** - The Node.js backend that provides APIs and integrations
- **`plugins/`** - Custom Backstage plugins for extending functionality
- **`kubernetes/`** - Production deployment manifests
- **`examples/`** - Example configurations and sample data

## Available Scripts

- `yarn start` - Start the development server (frontend + backend)
- `yarn build:all` - Build all packages for production
- `yarn build:backend` - Build backend only
- `yarn test` - Run tests
- `yarn test:all` - Run all tests with coverage
- `yarn test:e2e` - Run end-to-end tests with Playwright
- `yarn lint` - Lint codebase (changed files only)
- `yarn lint:all` - Lint entire codebase
- `yarn fix` - Auto-fix linting issues
- `yarn clean` - Clean build artifacts
- `yarn new` - Create new plugins or packages

## Configuration

### Configuration Files

The application uses YAML configuration files:

- **`app-config.yaml`** - Development configuration
- **`app-config.production.yaml`** - Production configuration  
- **`app-config.local.yaml`** - Local overrides (git-ignored)

### Environment Variables

Key environment variables for development:

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_BASE_URL` | Frontend base URL | `http://localhost:3000` |
| `BACKEND_BASE_URL` | Backend base URL | `http://localhost:7007` |
| `BACKEND_CORS_ORIGIN` | CORS origins | `http://localhost:3000` |
| `GITHUB_TOKEN` | GitHub API token | Required |

### Software Catalog

The software catalog is populated from locations defined in `app-config.yaml`. You can add your own entities by:

1. Creating entity descriptor files (YAML)
2. Adding locations to the catalog configuration
3. Using the catalog import functionality in the UI

## Creating Custom Plugins

Backstage uses a plugin-based architecture. To create a new plugin:

```bash
yarn new
# Follow the interactive prompts to create your plugin
```

### Plugin Types

- **Frontend plugins** - React components for the UI
- **Backend plugins** - Node.js services and APIs
- **Common plugins** - Shared utilities and types

Plugins are stored in the `plugins/` directory and follow Backstage's plugin architecture conventions.

### Plugin Development

1. Use `yarn new` to scaffold a new plugin
2. Develop your plugin in the `plugins/` directory
3. Export the plugin from `packages/app/src/App.tsx` (frontend) or `packages/backend/src/index.ts` (backend)
4. Test your plugin locally with `yarn start`

## Testing

### Unit Tests

```bash
# Run tests for changed files
yarn test

# Run all tests with coverage
yarn test:all
```

### End-to-End Tests

```bash
# Run E2E tests
yarn test:e2e
```

E2E tests use Playwright and are configured in `playwright.config.ts`.

## Debugging

### Backend Debugging

The backend runs on port 7007 by default. You can:

1. Add breakpoints in your IDE
2. Use `console.log()` for quick debugging
3. Check logs in the terminal where `yarn start` is running

### Frontend Debugging

The frontend runs on port 3000. Use browser developer tools for debugging:

1. Open Developer Tools (F12)
2. Use the React Developer Tools extension
3. Check the Console and Network tabs

## Code Style

The project uses:

- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Linting and Formatting

```bash
# Check linting
yarn lint:all

# Fix linting issues
yarn fix

# Check formatting
yarn prettier:check
```

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the test suite: `yarn test:all`
5. Run linting: `yarn lint:all`
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request

### Development Guidelines

- Follow the existing code style and linting rules
- Add tests for new functionality
- Update documentation as needed
- Ensure all CI checks pass
- Keep commits atomic and write clear commit messages

### Pre-commit Hooks

The project uses lint-staged to run checks before commits:

- ESLint fixes and formatting for code files
- Prettier formatting for JSON and Markdown files

## Troubleshooting

### Common Issues

1. **Port conflicts** - Make sure ports 3000 and 7007 are available
2. **Node version** - Ensure you're using Node.js v20 or v22
3. **Yarn version** - Make sure you're using Yarn v4.4.1+
4. **Kind cluster** - Verify your kind cluster is running with `kubectl cluster-info`

### Getting Help

- Check the [Backstage Documentation](https://backstage.io/docs)
- Review [K0rdent Documentation](https://docs.k0rdent.io/)
- Open an issue on [GitHub](https://github.com/BarelyAnXer/bstage/issues) 