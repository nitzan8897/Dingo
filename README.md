# 🦴 Dingo - Smart Ratings Platform

A production-ready monorepo for a smart ratings platform that starts with lawyers and will expand to other professionals. Built with **SOLID principles**, **Clean Architecture**, and **vendor-agnostic infrastructure**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Dingo Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │   Web App    │    │  Mobile App  │    │   Future     │    │
│  │  (Next.js)   │    │   (Expo)     │    │   Clients    │    │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘    │
│         │                    │                    │            │
│         └────────────────────┴────────────────────┘            │
│                              │                                 │
│                    ┌─────────▼─────────┐                      │
│                    │    API Gateway    │                      │
│                    │   (NestJS API)    │                      │
│                    └─────────┬─────────┘                      │
│                              │                                 │
│         ┌────────────────────┼────────────────────┐           │
│         │                    │                    │           │
│    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐      │
│    │ Health  │         │ Lawyers │         │ Future  │      │
│    │ Service │         │ Service │         │Services │      │
│    └─────────┘         └────┬────┘         └─────────┘      │
│                             │                                 │
│                    ┌────────▼────────┐                       │
│                    │  Lawyers Repo   │                       │
│                    └────────┬────────┘                       │
│                             │                                 │
│                    ┌────────▼────────┐                       │
│                    │  PostgreSQL DB  │                       │
│                    └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
dingo/
├── apps/
│   ├── api/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── health/    # Health check module
│   │   │   │   ├── lawyers/   # Lawyers module (Controller → Service → Repository)
│   │   │   │   └── prisma/    # Prisma service
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── seed.ts        # Database seeder
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── web/                    # Next.js 15 + React 19 Web App
│   │   ├── src/
│   │   │   ├── app/           # App router
│   │   │   └── components/    # React components
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── mobile/                 # React Native + Expo Mobile App
│       ├── app/               # Expo router
│       ├── components/        # RN components
│       └── package.json
│
├── packages/
│   ├── types/                 # Shared TypeScript types & DTOs
│   ├── ui/                    # Shared UI components
│   └── config/                # Shared configs (ESLint, Prettier, tsconfig)
│
├── charts/                    # Helm charts for Kubernetes
│   ├── dingo-api/
│   └── dingo-web/
│
├── .github/
│   └── workflows/            # GitHub Actions CI/CD
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml        # Local development setup
├── Makefile                  # Build & deployment commands
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # pnpm workspaces
```

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

#### Option 2: Using Windows CMD

```cmd
REM Clone the repository
git clone <your-repo-url>
cd Dingo

REM Install dependencies
pnpm install

REM Start PostgreSQL with Docker
docker compose up -d postgres

REM Set up environment variables
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env

REM Set DATABASE_URL in apps\api\.env
REM DATABASE_URL="postgresql://dingo:dingo123@localhost:5432/dingo?schema=public"

REM Push database schema
pnpm db:push

REM Seed database with sample data
pnpm db:seed

REM Start development servers
pnpm dev
```

### Accessing the Applications

After running `pnpm dev`, you can access:

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001/v1
- **API Health**: http://localhost:3001/v1/health
- **Prisma Studio**: `pnpm db:studio` (opens at http://localhost:5555)

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
- **PostgreSQL**: localhost:5432
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

### SOLID Principles

- **Single Responsibility**: Each module/class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Services depend on abstractions
- **Interface Segregation**: Focused, minimal interfaces
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### Technology Stack

#### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type safety
- **Class Validator** - DTO validation

#### Frontend (Web)
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TailwindCSS** - Utility-first CSS
- **TypeScript** - Type safety

#### Mobile
- **Expo** - React Native framework
- **React Native** - Mobile UI
- **TypeScript** - Type safety

#### Infrastructure
- **Docker** - Containerization
- **Helm** - Kubernetes package manager
- **GitHub Actions** - CI/CD
- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk-efficient package manager

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
DATABASE_URL=postgresql://dingo:dingo123@localhost:5432/dingo?schema=public
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Web (`apps/web/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Clean Architecture and SOLID principles
