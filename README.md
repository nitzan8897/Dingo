# 🐕 Dingo - Smart Ratings Platform

A Monorepo for a smart analyzed ratings & searching platform that starts with lawyers and will expand to other professionals. Built with **SOLID principles**, **Clean Architecture**, and **vendor-agnostic infrastructure**.

## 🏗️ Architecture
### Clients
1) Web using React + Next.js + ShadcnUI.
2) Mobile using Expo + React Native
Clients shares common headless components

### Services
1) Dingo API - NestJS for simple CRUD actions on `lawyers` table and `cases` table
2) Differ - Simple service that acts as Pipeline for analyzing cases data and updating `lawyer_case`, `cases` tables.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **pnpm** 8 or higher
- **Docker** and **Docker Compose**
- **PostgreSQL** (via Docker or local)

### Installation

#### Option 1: Using Bash (Git Bash, WSL, Linux, macOS)

```bash
# Clone the repository
git clone <your-repo-url>
cd Dingo

# Install dependencies
pnpm install

# Start PostgreSQL with Docker
docker compose up -d postgres

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Push database schema
pnpm db:push

# Seed database with sample data
pnpm db:seed

# Start development servers
pnpm dev
```

### Accessing the Applications

After running `pnpm dev`, you can access:

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001/v1
- **API Health**: http://localhost:3001/v1/health
- **Prisma Studio**: `pnpm db:studio` (opens at http://localhost:5555)
- **Postgres**: listens at http://localhost:5433

## 🛠️ Development

### Available Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Start all apps in development mode
pnpm dev --filter @dingo/api    # Start only API
pnpm dev --filter @dingo/web    # Start only web

# Build
pnpm build            # Build all apps
pnpm build --filter @dingo/api  # Build only API

# Testing
pnpm test             # Run all tests
pnpm lint             # Run linters
pnpm format           # Format code with Prettier

# Database
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio

# Clean
pnpm clean            # Clean all build artifacts
```

### Using Makefile

```bash
make help             # Show all available commands
make install          # Install dependencies
make dev              # Start development servers
make build            # Build all applications
make docker-up        # Start Docker containers
make docker-down      # Stop Docker containers
make db-push          # Push database schema
make db-seed          # Seed database
```

## 🐳 Docker Deployment

### Local Docker Development

```bash
# Build Docker images
make docker-build
# or
docker-compose build

# Start all services (API, Web, PostgreSQL, PgAdmin)
make docker-up
# or
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
make docker-down
# or
docker-compose down
```

### Services

- **API**: http://localhost:3001
- **Web**: http://localhost:3000
- **PostgreSQL**: localhost:5433
- **PgAdmin**: http://localhost:5050 (admin@dingo.com / admin123)

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (local with Minikube/Kind or cloud provider)
- Helm 3 installed
- kubectl configured

### Deploy with Helm

```bash
# Dry run to validate
make deploy-k8s-dry

# Deploy API
helm upgrade --install dingo-api ./charts/dingo-api \
  --namespace production \
  --create-namespace \
  --set image.tag=latest

# Deploy Web
helm upgrade --install dingo-web ./charts/dingo-web \
  --namespace production \
  --create-namespace \
  --set image.tag=latest

# Or use Makefile
make deploy-k8s
```

### Configuration

Edit values in `charts/dingo-api/values.yaml` and `charts/dingo-web/values.yaml`:

- Image repository and tags
- Resource limits
- Environment variables
- Ingress hosts and TLS
- Autoscaling parameters

## 🔄 CI/CD

### GitHub Actions

The project includes two workflows:

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Lint
   - Type check
   - Test
   - Build
   - Docker image build
   - Helm chart validation

2. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
   - Deploy to staging
   - Deploy to production (manual approval)

### Required Secrets

Add these secrets to your GitHub repository:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token
- `KUBE_CONFIG_STAGING` - Base64 encoded kubeconfig for staging
- `KUBE_CONFIG_PRODUCTION` - Base64 encoded kubeconfig for production

## 🏛️ Architecture & Design Principles

### Clean Architecture

The API follows Clean Architecture with clear separation of concerns:

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Business logic layer
3. **Repositories** - Data access layer
4. **DTOs** - Data Transfer Objects with validation
5. **Entities** - Domain models

## 📊 Database Schema

```prisma
model Lawyer {
  id                String   @id @default(uuid())
  fullName          String
  city              String
  specialties       String[]
  yearsOfExperience Int
  ratingVector      Json     // { professionalism, availability, empathy, cost }
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Rating System

Each lawyer has a **rating vector** with four metrics (FIFA-style):

- **Professionalism** (0-100): Quality of service and expertise
- **Availability** (0-100): Responsiveness and accessibility
- **Empathy** (0-100): Understanding and communication
- **Cost** (0-100): Value for money

## 🔌 API Endpoints

### Health

- `GET /v1/health` - Health check

### Lawyers

- `GET /v1/lawyers` - Get all lawyers
  - Query params: `?specialty=CRIMINAL&city=Boston&minYearsOfExperience=5`
- `POST /v1/lawyers` - Create a new lawyer
  ```json
  {
    "fullName": "John Doe",
    "city": "New York",
    "specialties": ["CRIMINAL", "CIVIL"],
    "yearsOfExperience": 10,
    "ratingVector": {
      "professionalism": 95,
      "availability": 88,
      "empathy": 92,
      "cost": 75
    }
  }
  ```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch
```

## 📝 Environment Variables

### API (`apps/api/.env`)

```env
DATABASE_URL=postgresql://dingo:dingo123@localhost:5433/dingo?schema=public
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Web (`apps/web/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
```


## 📄 License

This project is licensed under the MIT License.

Built with ❤️ 
