# Contributing to @giof-se/umami

Thank you for considering contributing to this project! We welcome contributions of all kinds.

## 🚀 Quick Start

1. **Fork and clone** the repository
2. **Install dependencies**: `pnpm install`
3. **Make your changes** and ensure they follow our guidelines
4. **Test your changes**: `pnpm validate`
5. **Submit a pull request**

## 📋 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/umami.git
cd umami

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build the package
pnpm build

# Run full validation (lint + typecheck + test)
pnpm validate
```

## 🧪 Testing

- Write tests for new features and bug fixes
- Ensure all tests pass: `pnpm test`
- Run tests with coverage: `pnpm test:coverage`
- Tests use Vitest with happy-dom environment

## 📝 Code Style

We use Biome for formatting and linting:

- **Format code**: `pnpm fmt`
- **Lint code**: `pnpm lint`
- **Auto-fix linting issues**: `pnpm lint:write`

### Code Style Guidelines

- Use TypeScript for all code
- Follow existing patterns and conventions
- Use descriptive variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## 🔄 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature (triggers minor version bump)
- **fix**: Bug fix (triggers patch version bump)
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# New feature
feat: add support for custom data attributes

# Bug fix
fix: prevent duplicate script injection

# Breaking change
feat: redesign component API

BREAKING CHANGE: The `autoTrack` prop now defaults to false instead of true
```

## 📦 Release Process

Our release process is fully automated:

1. **Push to main** with conventional commit messages
2. **Autoversion workflow** runs automatically
3. **Version is bumped** based on commit types
4. **Package is published** to GitHub Packages
5. **GitHub release** is created

### Manual Versioning

If needed, you can manually bump versions:

```bash
pnpm version:patch  # 1.0.0 → 1.0.1
pnpm version:minor  # 1.0.0 → 1.1.0
pnpm version:major  # 1.0.0 → 2.0.0
```

## 🐛 Bug Reports

When filing bug reports, please include:

- **Description**: Clear description of the issue
- **Reproduction**: Steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Environment**: React version, framework (Next.js, CRA, etc.)
- **Code example**: Minimal code that demonstrates the issue

## 💡 Feature Requests

We welcome feature requests! Please:

- Check existing issues to avoid duplicates
- Describe the problem you're trying to solve
- Explain why this feature would be useful
- Consider implementation approaches

## 📋 Pull Request Process

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our guidelines
4. **Run validation**: `pnpm validate`
5. **Commit** using conventional commit format
6. **Push** to your fork: `git push origin feature/amazing-feature`
7. **Open a pull request** with a clear description

### Pull Request Guidelines

- Keep PRs focused and atomic
- Include tests for new functionality
- Update documentation if needed
- Ensure CI passes
- Use descriptive PR titles
- Reference related issues

## 🤝 Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Assume good intentions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to open an issue for questions about contributing!