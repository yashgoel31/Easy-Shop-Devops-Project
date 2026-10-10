# Contributing to EasyShop

Thank you for your interest in contributing to EasyShop!

## Development Setup
1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start local development server:
   ```bash
   npm run dev
   ```

## Commit Guidelines
- Use conventional commits format:
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation updates
  - `chore:` Tooling or maintenance
  - `ci:` CI/CD pipeline changes

## Pull Request Process
1. Create a feature branch (`git checkout -b feat/my-feature`).
2. Ensure tests and linter pass (`npm run lint`).
3. Submit PR with detailed description of changes.
