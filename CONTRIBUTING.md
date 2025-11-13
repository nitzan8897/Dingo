# Contributing to Dingo

Thank you for your interest in contributing to Dingo! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   git clone https://github.com/YOUR_USERNAME/dingo.git
   cd dingo
   ```

2. **Set up development environment**
   ```bash
   pnpm install
   docker-compose up -d postgres
   pnpm db:push
   pnpm db:seed
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Making Changes

1. **Write clean, maintainable code**
   - Follow SOLID principles
   - Use TypeScript types
   - Add comments for complex logic
   - Keep functions small and focused

2. **Follow the architecture**
   - **API**: Controller → Service → Repository → Database
   - Maintain separation of concerns
   - Use DTOs for validation
   - Keep business logic in services

3. **Code style**
   ```bash
   # Lint your code
   pnpm lint

   # Format your code
   pnpm format

   # Type check
   cd apps/api && pnpm tsc --noEmit
   ```

### Testing

1. **Write tests for new features**
   ```bash
   # Run tests
   pnpm test

   # Run tests in watch mode
   pnpm test:watch

   # Run tests with coverage
   pnpm test:cov
   ```

2. **Test coverage**
   - Aim for 80%+ coverage for new code
   - Write unit tests for services
   - Write integration tests for controllers

3. **Example test**
   ```typescript
   describe('LawyersService', () => {
     it('should return all lawyers', async () => {
       const lawyers = await service.findAll({});
       expect(lawyers).toBeDefined();
       expect(Array.isArray(lawyers)).toBe(true);
     });
   });
   ```

### Committing

1. **Commit message format**
   ```
   type(scope): subject

   body (optional)

   footer (optional)
   ```

   **Types:**
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

   **Examples:**
   ```
   feat(api): add lawyer search endpoint
   fix(web): resolve rating bar overflow issue
   docs(readme): update setup instructions
   refactor(api): simplify lawyer service logic
   ```

2. **Commit best practices**
   - Write clear, descriptive commit messages
   - Make atomic commits (one logical change per commit)
   - Reference issue numbers when applicable

### Pull Requests

1. **Before submitting**
   - Run all tests: `pnpm test`
   - Run linter: `pnpm lint`
   - Build the project: `pnpm build`
   - Update documentation if needed

2. **PR description template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests
   - [ ] Updated existing tests

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   ```

3. **PR review process**
   - Wait for CI checks to pass
   - Address reviewer feedback
   - Keep PR focused and small
   - Be responsive to comments

## Project Structure

### Adding a New API Module

1. **Create module structure**
   ```
   apps/api/src/modules/your-module/
   ├── your-module.controller.ts
   ├── your-module.service.ts
   ├── your-module.repository.ts
   ├── your-module.module.ts
   └── dto/
       ├── create-your-entity.dto.ts
       └── your-entity-filter.dto.ts
   ```

2. **Follow Clean Architecture**
   - Controller handles HTTP
   - Service handles business logic
   - Repository handles data access
   - Use DTOs for validation

3. **Register in AppModule**
   ```typescript
   @Module({
     imports: [YourModule],
   })
   export class AppModule {}
   ```

### Adding a New Web Component

1. **Create component**
   ```typescript
   // apps/web/src/components/YourComponent.tsx
   export const YourComponent = () => {
     return <div>Your component</div>;
   };
   ```

2. **Use TypeScript**
   ```typescript
   interface YourComponentProps {
     title: string;
     onClick?: () => void;
   }

   export const YourComponent: React.FC<YourComponentProps> = ({
     title,
     onClick,
   }) => {
     return <button onClick={onClick}>{title}</button>;
   };
   ```

3. **Style with Tailwind**
   ```tsx
   <div className="bg-white rounded-lg shadow-md p-6">
     <h2 className="text-xl font-bold">{title}</h2>
   </div>
   ```

### Adding Shared Types

1. **Add to packages/types**
   ```typescript
   // packages/types/src/your-entity.types.ts
   export interface YourEntity {
     id: string;
     name: string;
     createdAt: Date;
   }

   export interface CreateYourEntityDTO {
     name: string;
   }
   ```

2. **Export from index**
   ```typescript
   // packages/types/src/index.ts
   export * from './your-entity.types';
   ```

## Database Changes

### Adding a New Model

1. **Update Prisma schema**
   ```prisma
   // apps/api/prisma/schema.prisma
   model YourModel {
     id        String   @id @default(uuid())
     name      String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Push schema changes**
   ```bash
   pnpm db:push
   ```

3. **Update seed file**
   ```typescript
   // apps/api/prisma/seed.ts
   await prisma.yourModel.create({
     data: { name: 'Sample' },
   });
   ```

## Documentation

### Update Documentation

- Update README.md for major features
- Add JSDoc comments to functions
- Update API documentation
- Add examples for new features

### Documentation Style

```typescript
/**
 * Creates a new lawyer in the system
 *
 * @param createLawyerDto - Lawyer creation data
 * @returns The created lawyer with generated ID
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const lawyer = await service.create({
 *   fullName: 'John Doe',
 *   city: 'New York',
 *   specialties: ['CRIMINAL'],
 *   yearsOfExperience: 10,
 *   ratingVector: { ... }
 * });
 * ```
 */
async create(createLawyerDto: CreateLawyerDto): Promise<Lawyer> {
  // ...
}
```

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Review existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to Dingo! 🦴
