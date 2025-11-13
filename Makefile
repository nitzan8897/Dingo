.PHONY: help install dev build clean docker-build docker-up docker-down deploy

help: ## Show this help message
	@echo "Dingo Monorepo - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start development servers
	pnpm dev

build: ## Build all applications
	pnpm build

test: ## Run tests
	pnpm test

lint: ## Run linters
	pnpm lint

clean: ## Clean build artifacts and dependencies
	pnpm clean
	rm -rf node_modules

# Database commands
db-push: ## Push Prisma schema to database
	pnpm db:push

db-seed: ## Seed database with sample data
	pnpm db:seed

db-studio: ## Open Prisma Studio
	pnpm db:studio

# Docker commands
docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-ps: ## List running containers
	docker-compose ps

docker-restart: ## Restart Docker containers
	docker-compose restart

# Deployment commands
deploy-dev: docker-build docker-up ## Deploy to local Docker environment

deploy-k8s: ## Deploy to Kubernetes using Helm
	helm upgrade --install dingo-api ./charts/dingo-api
	helm upgrade --install dingo-web ./charts/dingo-web

deploy-k8s-dry: ## Dry run Kubernetes deployment
	helm install dingo-api ./charts/dingo-api --dry-run --debug
	helm install dingo-web ./charts/dingo-web --dry-run --debug
