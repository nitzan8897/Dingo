# 🚀 Dingo Run Guide

Quick reference for running the Dingo platform on different operating systems.

---

## Windows CMD

### Initial Setup

```cmd
REM Install dependencies
pnpm install

REM Start PostgreSQL
docker-compose up -d postgres

REM Wait 10 seconds for database to start
timeout /t 10

REM Copy environment files
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env

REM Generate Prisma Client
cd apps\api
pnpm prisma generate
cd ..\..

REM Push database schema
pnpm db:push

REM Seed database
pnpm db:seed
```

### Daily Development

```cmd
REM Start all services
docker-compose up -d
pnpm dev

REM Or start services individually:
REM API only
pnpm --filter @dingo/api dev

REM Web only
pnpm --filter @dingo/web dev

REM Mobile only
pnpm --filter @dingo/mobile dev
```

### Using Makefile (requires make)

```cmd
REM With make installed (via chocolatey: choco install make)
make install
make docker-up
make db-push
make db-seed
make dev
```

---

## Windows PowerShell

### Initial Setup

```powershell
# Install dependencies
pnpm install

# Start PostgreSQL
docker-compose up -d postgres

# Wait for database
Start-Sleep -Seconds 10

# Copy environment files
Copy-Item apps\api\.env.example apps\api\.env
Copy-Item apps\web\.env.example apps\web\.env

# Generate Prisma Client
cd apps\api
pnpm prisma generate
cd ..\..

# Push database schema
pnpm db:push

# Seed database
pnpm db:seed
```

### Daily Development

```powershell
# Start all services
docker-compose up -d
pnpm dev

# Or start services individually:
# API only
pnpm --filter @dingo/api dev

# Web only
pnpm --filter @dingo/web dev

# Mobile only
pnpm --filter @dingo/mobile dev
```

---

## Bash (Linux, macOS, Git Bash, WSL)

### Initial Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker-compose up -d postgres

# Wait for database
sleep 10

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Generate Prisma Client
cd apps/api
pnpm prisma generate
cd ../..

# Push database schema
pnpm db:push

# Seed database
pnpm db:seed
```

### Daily Development

```bash
# Start all services
docker-compose up -d
pnpm dev

# Or using Makefile
make install
make docker-up
make db-push
make db-seed
make dev
```

### Individual Services

```bash
# API only
pnpm --filter @dingo/api dev

# Web only
pnpm --filter @dingo/web dev

# Mobile only
pnpm --filter @dingo/mobile dev
```

---

## 📦 Quick Commands Reference

### Database Operations

```bash
# Push schema changes
pnpm db:push

# Seed database with sample data
pnpm db:seed

# Open Prisma Studio (database GUI)
pnpm db:studio

# Generate Prisma Client
cd apps/api && pnpm prisma generate
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

### Docker Operations

```bash
# Start all Docker services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Rebuild images
docker-compose build

# View running containers
docker-compose ps
```

### Makefile Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make dev           # Start development servers
make build         # Build all applications
make test          # Run tests
make lint          # Run linters
make clean         # Clean build artifacts
make docker-build  # Build Docker images
make docker-up     # Start Docker containers
make docker-down   # Stop Docker containers
make db-push       # Push database schema
make db-seed       # Seed database
make db-studio     # Open Prisma Studio
```

---

## 🔗 Access URLs

After running `pnpm dev`:

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001/v1
- **API Health**: http://localhost:3001/v1/health
- **API Lawyers**: http://localhost:3001/v1/lawyers
- **Prisma Studio**: http://localhost:5555 (after `pnpm db:studio`)
- **PgAdmin**: http://localhost:5050 (after `docker-compose up -d`)

---

## 🐛 Troubleshooting

### "Command not found: pnpm"

```bash
npm install -g pnpm@8.15.0
```

### "Port already in use"

```bash
# Find and kill process using the port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Find and kill process (Linux/macOS)
lsof -ti:3000 | xargs kill -9
```

### "Cannot connect to database"

```bash
# Check if PostgreSQL is running
docker ps

# If not running, start it
docker-compose up -d postgres

# Wait 10 seconds and try again
```

### "Prisma Client not generated"

```bash
cd apps/api
pnpm prisma generate
cd ../..
```

---

## 🎯 Environment Variables

### API (apps/api/.env)

```env
DATABASE_URL="postgresql://dingo:dingo123@localhost:5432/dingo?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Web (apps/web/.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
```

---

## 📱 Mobile Development

### Start Expo

```bash
cd apps/mobile
pnpm dev
```

### Run on Device

```bash
# iOS (macOS only)
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

---

## 🚢 Production Deployment

### Build for Production

```bash
# Build all apps
pnpm build

# Or build individually
pnpm --filter @dingo/api build
pnpm --filter @dingo/web build
```

### Docker Deployment

```bash
# Build Docker images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Kubernetes Deployment

```bash
# Deploy API
helm upgrade --install dingo-api ./charts/dingo-api

# Deploy Web
helm upgrade --install dingo-web ./charts/dingo-web
```

---

## 📚 Additional Resources

- **Main README**: `README.md`
- **Setup Guide**: `SETUP.md`
- **Contributing Guide**: `CONTRIBUTING.md`
- **API Documentation**: `apps/api/README.md`
- **Web Documentation**: `apps/web/README.md`
- **Mobile Documentation**: `apps/mobile/README.md`

---

**Need help? Check the troubleshooting section or open an issue!** 🚀
