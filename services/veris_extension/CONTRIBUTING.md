# Contributing Guide

Thank you for your interest in improving this Chrome Extension Boilerplate!

## 🎯 Project Goals

This boilerplate aims to be:
- **Simple**: Easy to understand and get started
- **Modern**: Using latest tools and best practices
- **Well-documented**: Clear examples and explanations
- **Flexible**: Adaptable to various use cases

## 🛠️ Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/chrome-extension-boilerplate.git
cd chrome-extension-boilerplate

# Install dependencies
npm install

# Start development
npm run dev
```

## 📝 Making Changes

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Add comments for complex logic
- Keep functions small and focused

### File Organization

```
src/
├── popup/          # React components for popup UI
├── content/        # Content scripts (page interaction)
├── background/     # Service worker (background tasks)
├── shared/         # Shared utilities
├── types/          # TypeScript types
└── styles/         # Global styles
```

### Commit Messages

Use clear, descriptive commit messages:

```
✅ Good:
- "Add dark mode toggle feature"
- "Fix message passing in content script"
- "Update documentation for storage API"

❌ Bad:
- "Update"
- "Fix bug"
- "Changes"
```

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run typecheck

# Build to verify
npm run build
```

## 📚 Documentation

When adding features:
1. Update relevant .md files
2. Add code comments
3. Include usage examples
4. Update API.md if adding new utilities

## 🐛 Reporting Issues

When reporting bugs, include:
- Chrome version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## 💡 Suggesting Features

For feature requests:
- Explain the use case
- Describe expected behavior
- Consider if it fits the "simple boilerplate" goal

## 🚀 Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes
6. Push to your fork
7. Open a Pull Request

### PR Checklist

- [ ] Code follows existing style
- [ ] Tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Documentation updated
- [ ] Examples added (if applicable)
- [ ] Tested in Chrome

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution helps make this boilerplate better for everyone!
