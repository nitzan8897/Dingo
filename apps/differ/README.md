# Differ - Court Case Analysis Service

Background service for fetching and analyzing Israeli court cases to power Dingo's smart lawyer ratings.

## 🎯 Purpose

Differ periodically:
1. **Fetches** new court cases from external sources
2. **Analyzes** them using AI (Claude/OpenAI) to extract structured data
3. **Saves** results to the database for use in the Dingo platform

## 🏗️ Architecture

```
┌─────────────────┐
│  Court System   │
│   (External)    │
└────────┬────────┘
         │
         │ fetch
         ▼
┌─────────────────┐
│  fetchCases.ts  │  ← Currently uses mock data
└────────┬────────┘
         │
         │ raw text
         ▼
┌─────────────────┐
│ analyzeCase.ts  │  ← AI analysis (placeholder)
└────────┬────────┘
         │
         │ structured data
         ▼
┌─────────────────┐
│  saveToDb.ts    │  ← Saves to Postgres
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│  (Cases table)  │
└─────────────────┘
```

## 🚀 Getting Started

### 1. Setup Database Schema

First, merge the suggested schema into your main Prisma schema:

```bash
# Review the schema extension
cat prisma/schema-extension.prisma

# Manually add the Case and LawyerCase models to:
# apps/api/prisma/schema.prisma

# Then run migration
cd apps/api
npx prisma migrate dev --name add_case_tables
npx prisma generate
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set:
# - DATABASE_URL (same as your API app)
# - ANTHROPIC_API_KEY or OPENAI_API_KEY (for future AI integration)
```

### 3. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 4. Run Differ

```bash
# Development mode (with auto-reload)
cd apps/differ
npm run dev

# Or from monorepo root
pnpm --filter @dingo/differ dev

# Production build
npm run build
npm start
```

## 📁 Project Structure

```
apps/differ/
├── src/
│   ├── index.ts          # Main entrypoint
│   ├── types.ts          # TypeScript types
│   ├── fetchCases.ts     # Fetch raw case data
│   ├── analyzeCase.ts    # AI analysis
│   └── saveToDb.ts       # Database persistence
├── prisma/
│   └── schema-extension.prisma  # Suggested DB schema
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | No | For Claude AI (future) |
| `OPENAI_API_KEY` | No | For OpenAI GPT (future) |
| `LOG_LEVEL` | No | `info` or `debug` |
| `STOP_ON_ERROR` | No | `true` to stop on first error |

## 🤖 AI Integration

Currently returns placeholder data. To enable real AI:

### Option 1: Anthropic Claude

1. Install SDK:
   ```bash
   npm install @anthropic-ai/sdk
   ```

2. Set API key:
   ```bash
   export ANTHROPIC_API_KEY="your-key-here"
   ```

3. Uncomment the Claude integration code in `src/analyzeCase.ts`

### Option 2: OpenAI GPT

1. Install SDK:
   ```bash
   npm install openai
   ```

2. Set API key:
   ```bash
   export OPENAI_API_KEY="your-key-here"
   ```

3. Uncomment the OpenAI integration code in `src/analyzeCase.ts`

## 📊 Data Flow

### Input (Raw Case)
```typescript
{
  id: "case-2024-001-tel-aviv",
  text: "בית המשפט המחוזי בתל אביב-יפו..."
}
```

### Output (Analyzed Case)
```typescript
{
  title: "Cohen vs. Advanced Construction Ltd.",
  specialty: "CIVIL",
  result: "win",
  judgeName: "מרים אלון",
  openedAt: "2023-03-15T00:00:00.000Z",
  closedAt: "2024-01-15T00:00:00.000Z",
  complexityScore: 0.65,
  lawyers: [
    { lawyerName: "שרה לוי", side: "plaintiff" },
    { lawyerName: "יוסף דוד", side: "defendant" }
  ]
}
```

## 🔄 Scheduling

Differ is designed to run as a scheduled job. Options:

### Cron (Linux/Mac)
```bash
# Run every day at 2 AM
0 2 * * * cd /path/to/dingo/apps/differ && npm start >> /var/log/differ.log 2>&1
```

### Systemd Timer (Linux)
```ini
# /etc/systemd/system/differ.timer
[Unit]
Description=Run Differ daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

### Cloud Scheduler
- **AWS**: EventBridge + Lambda/ECS Task
- **GCP**: Cloud Scheduler + Cloud Run
- **Azure**: Logic Apps + Container Instance

## 🐛 Debugging

```bash
# Enable debug logging
export LOG_LEVEL=debug

# Stop on first error
export STOP_ON_ERROR=true

# Run with more verbose output
npm run dev
```

## 📝 TODO

- [ ] Implement real court case fetching (scraping/API)
- [ ] Integrate Claude/OpenAI for AI analysis
- [ ] Add fuzzy matching for lawyer name lookup
- [ ] Implement incremental fetching (track processed cases)
- [ ] Add retry logic with exponential backoff
- [ ] Create metrics/monitoring dashboard
- [ ] Add unit tests
- [ ] Implement rate limiting for AI API calls
- [ ] Add email notifications for errors

## 🤝 Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Test with mock data first
4. Submit a pull request

## 📄 License

Part of the Dingo platform.
