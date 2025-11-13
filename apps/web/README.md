# Dingo Web

Next.js 15 + React 19 web application with TailwindCSS.

## Features

- ⚛️ **React 19** - Latest React features
- 🚀 **Next.js 15** - App Router with Server Components
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 📱 **Responsive Design** - Mobile-first approach
- 🔍 **Search & Filter** - Real-time search and filtering
- 📊 **FIFA-style Ratings** - Visual rating bars
- 🎯 **TypeScript** - Full type safety
- 🔄 **Shared Components** - Reusable UI from @dingo/ui

## Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Lint code
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   │
│   └── components/
│       ├── LawyerCard.tsx      # Lawyer card component
│       ├── RatingBar.tsx       # Rating bar component
│       └── SearchBar.tsx       # Search & filter component
│
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

## Components

### LawyerCard

Displays lawyer information with FIFA-style ratings.

```tsx
import LawyerCard from '@/components/LawyerCard';

<LawyerCard lawyer={lawyer} />
```

### RatingBar

Horizontal bar displaying a rating value (0-100).

```tsx
import RatingBar from '@/components/RatingBar';

<RatingBar
  label="Professionalism"
  value={95}
  color="#10b981"
  showValue={true}
/>
```

### SearchBar

Search and filter interface.

```tsx
import SearchBar from '@/components/SearchBar';

<SearchBar
  onSearch={(query) => console.log(query)}
  onFilterSpecialty={(specialty) => console.log(specialty)}
  onFilterCity={(city) => console.log(city)}
/>
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
```

## Styling

### TailwindCSS

The project uses TailwindCSS for styling. Custom theme configuration is in `tailwind.config.js`.

#### Primary Colors

```javascript
colors: {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    // ... more shades
    900: '#14532d',
  },
}
```

### Global Styles

Global styles are defined in `src/app/globals.css`.

## API Integration

The web app fetches data from the API:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';
const response = await fetch(`${apiUrl}/lawyers`);
const lawyers = await response.json();
```

## Docker

```bash
# Build image
docker build -t dingo-web .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001/v1" \
  dingo-web
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Docker

```bash
docker-compose up web
```

### Kubernetes

```bash
helm upgrade --install dingo-web ./charts/dingo-web
```

## Performance

- Server Components for optimal performance
- Automatic code splitting
- Image optimization
- CSS optimization with TailwindCSS

## SEO

- Metadata in `layout.tsx`
- Semantic HTML
- Accessible components
