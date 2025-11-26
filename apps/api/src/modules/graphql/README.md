# GraphQL API Module

This module provides a complete GraphQL API implementation for the Dingo application, allowing flexible querying and mutations for lawyers and cases without needing to create separate REST endpoints for every filter combination.

## Features

- **Full GraphQL Support**: Query and mutate lawyers and cases data
- **Flexible Filtering**: Apply complex filters without creating new REST endpoints
- **Nested Queries**: Fetch related data (city, profile cases, reviews) in a single query
- **Type Safety**: Full TypeScript support with auto-generated schema
- **GraphQL Playground**: Interactive API explorer at `/graphql`
- **Comprehensive Tests**: Unit and E2E tests for all resolvers

## Architecture

```
graphql/
├── models/           # GraphQL object types (Lawyer, Case, City, etc.)
├── inputs/           # GraphQL input types for filters and mutations
├── resolvers/        # GraphQL resolvers (queries and mutations)
├── tests/            # Unit tests for resolvers
└── graphql.module.ts # Module configuration
```

## GraphQL Schema

### Object Types

- **Lawyer**: Full lawyer information with nested relations
- **Case**: Court case data
- **City**: City information
- **ProfileCase**: Lawyer showcase cases
- **Review**: Lawyer reviews
- **RatingVector**: Lawyer rating breakdown

### Queries

#### Lawyers

```graphql
# Get all lawyers with optional filters
query {
  lawyers(filter: {
    specialties: ["CRIMINAL", "CIVIL"]
    city: "Tel Aviv"
    minYearsOfExperience: 5
    minRating: 80
  }) {
    id
    fullNameEn
    fullNameHe
    specialties
    yearsOfExperience
    ratingVector {
      professionalism
      availability
      empathy
      cost
    }
    city {
      nameEn
      nameHe
    }
    profileCases {
      titleEn
      outcome
      year
    }
    reviews {
      reviewerName
      rating
      commentEn
    }
  }
}

# Get single lawyer by ID
query {
  lawyer(id: "lawyer-id") {
    id
    fullNameEn
    city {
      nameEn
    }
  }
}

# Search lawyers by name (fuzzy match)
query {
  searchLawyers(name: "John") {
    id
    fullNameEn
    fullNameHe
  }
}
```

#### Cases

```graphql
# Get all cases with optional filters
query {
  cases(filter: {
    specialty: "CRIMINAL"
    year: 2023
    status: "DEFENCE_WON"
    search: "contract"
  }) {
    id
    externalId
    title
    specialty
    result
    complexityScore
    plaintiffLawyerIds
    defendantLawyerIds
  }
}

# Get single case by external ID
query {
  case(externalId: "ext-123") {
    id
    title
    result
  }
}
```

### Mutations

#### Create Lawyer

```graphql
mutation {
  createLawyer(input: {
    fullNameEn: "John Doe"
    fullNameHe: "ג'ון דו"
    bioEn: "Experienced criminal lawyer"
    bioHe: "עורך דין פלילי מנוסה"
    cityId: "city-id"
    specialties: ["CRIMINAL", "CIVIL"]
    yearsOfExperience: 10
    ratingVector: {
      professionalism: 90
      availability: 85
      empathy: 88
      cost: 75
    }
  }) {
    id
    fullNameEn
    city {
      nameEn
    }
  }
}
```

#### Create/Update Case

```graphql
mutation {
  createCase(input: {
    externalId: "ext-123"
    title: "Criminal Case Title"
    specialty: "CRIMINAL"
    result: "DEFENCE_WON"
    judgeName: "Judge Smith"
    complexityScore: 0.75
    rawText: "Full case text..."
    plaintiffLawyerIds: ["lawyer-1"]
    defendantLawyerIds: ["lawyer-2"]
    associatedLawyerIds: ["lawyer-3"]
  }) {
    id
    title
    result
  }
}
```

## Usage Examples

### Complex Nested Query

Fetch lawyers with all their related data in a single query:

```graphql
query GetLawyersWithDetails {
  lawyers(filter: { city: "Tel Aviv", minYearsOfExperience: 5 }) {
    id
    fullNameEn
    fullNameHe
    bioEn
    specialties
    yearsOfExperience

    # Nested city data
    city {
      nameEn
      nameHe
      slug
    }

    # Nested profile cases
    profileCases {
      titleEn
      descriptionEn
      outcome
      year
      isFeatured
    }

    # Nested reviews
    reviews {
      reviewerName
      rating
      commentEn
      createdAt
    }

    # Rating breakdown
    ratingVector {
      professionalism
      availability
      empathy
      cost
    }
  }
}
```

### Dynamic Filtering

Filter cases by multiple criteria without creating new REST endpoints:

```graphql
query FilterCases {
  cases(filter: {
    specialty: "CRIMINAL"
    year: 2023
    search: "contract dispute"
  }) {
    id
    title
    specialty
    result
    judgeName
    complexityScore
    openedAt
    closedAt
  }
}
```

## Accessing GraphQL Playground

When the API is running in development mode, you can access the GraphQL Playground at:

```
http://localhost:3001/graphql
```

The playground provides:
- Interactive query builder
- Auto-completion
- Schema documentation
- Query history
- Variable support

## Benefits Over REST

### Before (REST API)
To get lawyers with filters, you'd need:
- `GET /v1/lawyers?city=TelAviv`
- `GET /v1/lawyers?specialties=CRIMINAL,CIVIL`
- `GET /v1/lawyers?minYearsOfExperience=5`
- Multiple requests to get related data

Each new filter combination might require a new REST endpoint or complex query parameter handling.

### After (GraphQL)
Single query with any combination of filters and nested data:

```graphql
query {
  lawyers(filter: {
    city: "Tel Aviv"
    specialties: ["CRIMINAL", "CIVIL"]
    minYearsOfExperience: 5
    minRating: 80
  }) {
    id
    fullNameEn
    city { nameEn }
    profileCases { titleEn }
    reviews { rating }
  }
}
```

## Running Tests

### Unit Tests
```bash
cd apps/api
pnpm test
```

### E2E Tests
```bash
cd apps/api
pnpm test:e2e
```

### Specific GraphQL Tests
```bash
cd apps/api
pnpm test graphql
```

## Schema Generation

The GraphQL schema is automatically generated from TypeScript decorators and saved to `src/schema.gql`. To regenerate:

```bash
cd apps/api
pnpm dev  # Schema regenerates on startup
```

## Type Safety

All GraphQL types are automatically validated against TypeScript types, ensuring:
- Query arguments match expected types
- Return values are type-safe
- Nested relations are properly typed
- Input validation is enforced

## Field Resolvers

Field resolvers allow lazy loading of related data:

- **city**: Loads city data only when requested
- **profileCases**: Loads lawyer's showcase cases only when needed
- **reviews**: Loads reviews only when included in query

This prevents over-fetching and improves performance.

## Authentication & Authorization

To add authentication to GraphQL:

1. Add guards to resolvers:
```typescript
@UseGuards(JwtAuthGuard)
@Query(() => [Lawyer])
async lawyers() { ... }
```

2. Add field-level authorization:
```typescript
@ResolveField()
@Roles('admin')
async sensitiveData() { ... }
```

## Performance Optimization

### DataLoader (Future Enhancement)

To prevent N+1 queries when fetching nested data, consider implementing DataLoader:

```typescript
@ResolveField(() => City)
async city(@Parent() lawyer: Lawyer) {
  return this.cityLoader.load(lawyer.cityId);
}
```

### Query Complexity

Prevent expensive queries by adding complexity analysis:

```typescript
GraphQLModule.forRoot({
  validationRules: [depthLimit(5)],
  plugins: [
    ApolloServerPluginLandingPageLocalDefault(),
    ComplexityPlugin(app.get(ComplexityPluginOptions)),
  ],
})
```

## Error Handling

GraphQL automatically handles errors and returns them in a structured format:

```json
{
  "errors": [
    {
      "message": "Lawyer with ID xxx not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ],
  "data": null
}
```

## Next Steps

1. **Add Pagination**: Implement cursor-based pagination for large datasets
2. **Add Subscriptions**: Real-time updates using GraphQL subscriptions
3. **Add DataLoader**: Batch and cache database requests
4. **Add Authentication**: Secure queries with JWT guards
5. **Add Query Complexity Limits**: Prevent expensive queries
6. **Add Rate Limiting**: Protect against abuse

## Resources

- [NestJS GraphQL Docs](https://docs.nestjs.com/graphql/quick-start)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
