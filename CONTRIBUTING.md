# Contributing to Travel Journal

First off, thank you for considering contributing to Travel Journal! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

##  Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. By participating, you are expected to uphold this standard.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Setting Up the Development Environment

1. **Fork the repository**
   
   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/travel-journal-react.git
   cd travel-journal-react
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/travel-journal-react.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Process

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-map-view`)
- `fix/` - Bug fixes (e.g., `fix/modal-scroll-issue`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/trip-card-component`)
- `style/` - Style/UI changes (e.g., `style/dark-mode-improvements`)

### Workflow

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(trip-card): add image zoom functionality
fix(modal): prevent background scrolling when open
docs(readme): update installation instructions
style(buttons): improve hover states consistency
```

## Pull Request Process

1. **Ensure your PR:**
   - Has a clear title and description
   - References any related issues
   - Includes screenshots for UI changes
   - Passes all linting checks (`npm run lint`)
   - Has been tested on multiple browsers

2. **PR Title Format:**
   ```
   [Type] Brief description of changes
   ```
   Examples:
   - `[Feature] Add trip export functionality`
   - `[Fix] Resolve carousel height inconsistency`
   - `[Docs] Update contributing guidelines`

3. **PR Description Template:**
   ```markdown
   ## Description
   Brief description of what this PR does.

   ## Related Issue
   Fixes #123

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Screenshots (if applicable)
   Add screenshots here.

   ## Checklist
   - [ ] I have tested my changes
   - [ ] I have updated documentation (if needed)
   - [ ] My code follows the project style guidelines
   - [ ] I have added comments where necessary
   ```

4. **Review Process:**
   - At least one maintainer review is required
   - Address all review comments
   - Keep the PR updated with the main branch

## Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use meaningful variable and function names
- Prefer `const` over `let`, avoid `var`
- Use destructuring where appropriate
- Keep components small and focused (single responsibility)
- Use PropTypes or JSDoc for component documentation

### CSS/Tailwind

- Use Tailwind utility classes primarily
- Custom CSS goes in `src/styles/TravelJournal.css`
- Follow mobile-first responsive design
- Maintain consistent spacing and sizing
- Use CSS variables for theme colors

### File Organization

- One component per file
- Keep related files close together
- Use index.js files for clean exports
- Name files using PascalCase for components

### Code Example

```jsx
/**
 * ExampleComponent - Brief description
 * 
 * @param {Object} props
 * @param {string} props.title - The title to display
 * @param {boolean} props.darkMode - Theme mode
 * @param {Function} props.onClick - Click handler
 */
const ExampleComponent = ({ title, darkMode, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = useCallback(() => {
    setIsActive(prev => !prev);
    onClick?.();
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
        darkMode 
          ? "bg-gray-800 text-white" 
          : "bg-white text-gray-800"
      }`}
    >
      {title}
    </button>
  );
};

export default ExampleComponent;
```

##  Reporting Bugs

### Before Submitting

1. Check if the issue already exists
2. Try to reproduce the bug
3. Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other context about the problem.
```

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or screenshots.
```

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

Thank you for contributing to Travel Journal! 

