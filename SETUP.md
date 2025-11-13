# Dingo Setup Guide

Complete setup instructions for Windows, macOS, and Linux.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **pnpm** (version 8 or higher)
   ```bash
   npm install -g pnpm@8.15.0
   ```
   - Verify: `pnpm --version`

3. **Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version` and `docker-compose --version`

4. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

## 🚀 Setup Instructions

### For Windows (CMD)

```cmd
REM 1. Clone the repository
git clone <repository-url>
cd Dingo

REM 2. Install dependencies
pnpm install

REM 3. Start PostgreSQL using Docker
docker-compose up -d postgres

REM Wait for PostgreSQL to be ready (about 10 seconds)
timeout /t 10

REM 4. Set up environment files
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env

REM 5. Configure database (edit apps\api\.env if needed)
REM The default DATABASE_URL should work:
REM DATABASE_URL="postgresql://dingo:dingo123@localhost:5432/dingo?schema=public"

REM 6. Generate Prisma Client
cd apps\api
pnpm prisma generate
cd ..\..

REM 7. Push database schema
pnpm db:push

REM 8. Seed database with sample data
pnpm db:seed

REM 9. Start development servers
pnpm dev
```

### For Windows (PowerShell)

```powershell
# 1. Clone the repository
git clone <repository-url>
cd Dingo

# 2. Install dependencies
pnpm install

# 3. Start PostgreSQL using Docker
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
Start-Sleep -Seconds 10

# 4. Set up environment files
Copy-Item apps\api\.env.example apps\api\.env
Copy-Item apps\web\.env.example apps\web\.env

# 5. Generate Prisma Client
cd apps\api
pnpm prisma generate
cd ..\..

# 6. Push database schema
pnpm db:push

# 7. Seed database with sample data
pnpm db:seed

# 8. Start development servers
pnpm dev
```

### For macOS/Linux (Bash)

```bash
# 1. Clone the repository
git clone <repository-url>
cd Dingo

# 2. Install dependencies
pnpm install

# 3. Start PostgreSQL using Docker
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
sleep 10

# 4. Set up environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 5. Generate Prisma Client
cd apps/api
pnpm prisma generate
cd ../..

# 6. Push database schema
pnpm db:push

# 7. Seed database with sample data
pnpm db:seed

# 8. Start development servers
pnpm dev
```

## ✅ Verification

After running the setup, verify everything is working:

### 1. Check Running Services

```bash
# Check Docker containers
docker ps

# You should see:
# - dingo-postgres (running)
```

### 2. Test API Health

Open your browser or use curl:

**Browser**: http://localhost:3001/v1/health

**cURL (Windows CMD)**:
```cmd
curl http://localhost:3001/v1/health
```

**cURL (Bash)**:
```bash
curl http://localhost:3001/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 3. Test API Lawyers Endpoint

**Browser**: http://localhost:3001/v1/lawyers

**cURL**:
```bash
curl http://localhost:3001/v1/lawyers
```

You should see an array of lawyers with sample data.

### 4. Test Web Application

Open your browser: http://localhost:3000

You should see:
- Dingo logo and title
- Search bar
- Grid of lawyer cards with ratings

## 🐛 Troubleshooting

### Issue: "Port 5432 is already in use"

**Solution**: Another PostgreSQL instance is running
```bash
# Stop other PostgreSQL instances or use a different port
docker-compose down
# Change the port in docker-compose.yml if needed
```

### Issue: "Cannot find module '@dingo/types'"

**Solution**: Build shared packages first
```bash
pnpm --filter "@dingo/types" build
```

### Issue: "Prisma Client is not generated"

**Solution**: Generate Prisma Client manually
```bash
cd apps/api
pnpm prisma generate
cd ../..
```

### Issue: "Database connection failed"

**Solution**: Check if PostgreSQL is running
```bash
docker ps
# If not running, start it:
docker-compose up -d postgres
# Wait 10 seconds, then try again
```

### Issue: "CORS error in browser"

**Solution**: Check API CORS configuration
- Verify `apps/api/.env` has `CORS_ORIGIN=http://localhost:3000`
- Restart the API server

## 🔧 Development Workflow

### Starting Fresh Each Day

```bash
# 1. Start Docker services
docker-compose up -d

# 2. Start development servers
pnpm dev
```

### Stopping Services

```bash
# Stop development servers
# Press Ctrl+C in the terminal

# Stop Docker services
docker-compose down

# Stop Docker services and remove volumes (clean slate)
docker-compose down -v
```

### Database Management

```bash
# Open Prisma Studio (visual database editor)
pnpm db:studio

# Reset database (delete all data)
docker-compose down -v
docker-compose up -d postgres
sleep 10
pnpm db:push
pnpm db:seed

# View database logs
docker-compose logs -f postgres
```

### Running Individual Apps

```bash
# Run only API
pnpm --filter @dingo/api dev

# Run only Web
pnpm --filter @dingo/web dev

# Run only Mobile
pnpm --filter @dingo/mobile dev
```

## 🐳 Full Docker Setup (Alternative)

If you want to run everything in Docker:

```bash
# Build all images
docker-compose build

# Start all services (API, Web, PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Services will be available at:
# - Web: http://localhost:3000
# - API: http://localhost:3001
# - PgAdmin: http://localhost:5050
```

## 📱 Mobile App Setup

```bash
# Navigate to mobile app
cd apps/mobile

# Start Expo development server
pnpm dev

# For iOS (macOS only)
pnpm ios

# For Android
pnpm android

# For web
pnpm web
```

### Mobile Prerequisites

- **iOS**: Xcode (macOS only)
- **Android**: Android Studio with Android SDK
- **Expo Go** app on your physical device

## 🧪 Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch

# Run tests for specific app
pnpm --filter @dingo/api test
```

## 📦 Building for Production

```bash
# Build all applications
pnpm build

# Build specific app
pnpm --filter @dingo/api build
pnpm --filter @dingo/web build

# Start production servers
pnpm --filter @dingo/api start:prod
pnpm --filter @dingo/web start
```

## 🎯 Next Steps

After setup, you can:

1. **Explore the API**
   - Open Prisma Studio: `pnpm db:studio`
   - Test endpoints with Postman or cURL
   - Read API docs: `apps/api/README.md`

2. **Customize the Web App**
   - Modify components in `apps/web/src/components/`
   - Update styles in `apps/web/tailwind.config.js`
   - Add new pages in `apps/web/src/app/`

3. **Add Features**
   - Create new modules in `apps/api/src/modules/`
   - Add new shared types in `packages/types/src/`
   - Build new UI components in `packages/ui/src/`

4. **Deploy**
   - Review deployment docs in main `README.md`
   - Set up CI/CD with GitHub Actions
   - Deploy to Kubernetes with Helm

## 🆘 Getting Help

- Check the main README: `README.md`
- Check app-specific READMEs:
  - API: `apps/api/README.md`
  - Web: `apps/web/README.md`
  - Mobile: `apps/mobile/README.md`
- Open an issue on GitHub
- Review architecture diagrams in documentation

---

**Happy coding! 🚀**
