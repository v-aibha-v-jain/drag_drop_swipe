# 🎃 Hacktoberfest 2025 - DragDropSwipe.js

Welcome to the DragDropSwipe.js Hacktoberfest contribution guide! We're excited to have you contribute to our lightweight JavaScript drag-and-drop library.

## 🌟 About This Project

**DragDropSwipe.js** is a dependency-free JavaScript module that provides:

- Drag and drop functionality for any HTML elements
- Touch/mobile swipe detection
- Grid-based positioning system
- Configurable callbacks and selectors
- Easy integration with just one import line

The library is designed to be lightweight, fast, and easy to use in both modern web applications and simple HTML pages.

## ⭐ Please Star This Repository!

If you find this project useful, please give it a star! ⭐ It helps us grow and shows your support for the project.

**[Click here to star the repository](https://github.com/v-aibha-v-jain/drag_drop_swipe)** 🌟

## 🎯 How to Contribute

### Step 1: Fork the Repository

1. Visit the [DragDropSwipe.js repository](https://github.com/v-aibha-v-jain/drag_drop_swipe)
2. Click the **"Fork"** button in the top-right corner
3. This creates a copy of the repository in your GitHub account

### Step 2: Clone Your Fork

```bash
# Clone your forked repository
git clone https://github.com/YOUR_USERNAME/drag_drop_swipe.git

# Navigate to the project directory
cd drag_drop_swipe

# Add the original repository as upstream
git remote add upstream https://github.com/v-aibha-v-jain/drag_drop_swipe.git
```

### Step 3: Create a New Branch

```bash
# Create and switch to a new branch for your feature/fix
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-name
```

### Step 4: Make Your Changes

Work on the issues mentioned in the **Issues** section below. Make sure to:

- Follow the existing code style
- Test your changes with the provided `index.html` demo
- Write clear, descriptive commit messages

### Step 5: Test Your Changes

```bash
# Open the demo file in your browser to test
# You can use a simple HTTP server like:
npx serve .
# Or
python -m http.server 8000
```

### Step 6: Commit and Push

```bash
# Add your changes
git add .

# Commit with a descriptive message
git commit -m "Add: Description of your changes"

# Push to your fork
git push origin feature/your-feature-name
```

### Step 7: Sync with Main Repository (Important!)

**Before creating your PR, always sync with the main repository to prevent conflicts:**

```bash
# Switch to your main branch
git checkout main

# Pull latest changes from the original repository
git pull upstream main

# Switch back to your feature branch
git checkout feature/your-feature-name

# Merge or rebase the latest changes
git merge main
# OR use rebase for a cleaner history:
# git rebase main

# If there are conflicts, resolve them and commit
# Then push the updated branch
git push origin feature/your-feature-name
```

### Step 8: Create a Pull Request

1. Go to your forked repository on GitHub
2. Click **"Compare & pull request"**
3. Fill out the PR template with:
   - Clear description of changes
   - Which issue you're solving
   - Screenshots/GIFs if UI changes
4. Submit the pull request

## 🐛 Issues to Solve

We have several issues available for contribution! Please check the **[Issues tab](https://github.com/v-aibha-v-jain/drag_drop_swipe/issues)** on GitHub to see the current list of:

- 🚀 **Enhancement requests** - New features and improvements
- 🐞 **Bug fixes** - Issues that need to be resolved
- � **Documentation** - Help improve docs and examples
- 🧪 **Testing** - Add tests and improve code quality

**[👉 View all available issues here](https://github.com/v-aibha-v-jain/drag_drop_swipe/issues)**

## 📋 Contribution Guidelines

### Code Style

- Use ES6+ features
- Follow existing indentation (2 spaces)
- Use descriptive variable and function names
- Add comments for complex logic

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues: "Fix #123: Description"

### Pull Request Requirements

- Link to the issue you're solving
- Include screenshots for UI changes
- Test your changes thoroughly
- Update documentation if needed

## 🏆 Recognition

All contributors will be:

- Added to the contributors list in README.md
- Mentioned in the project's acknowledgments
- Eligible for Hacktoberfest swag (if participating in official event)

## 💬 Getting Help

- **Questions?** Open a discussion or comment on issues
- **Stuck?** Tag `@v-aibha-v-jain` in your PR for help
- **Ideas?** Open a new issue to discuss features

## 🎉 Thank You!

Thank you for contributing to DragDropSwipe.js! Your contributions help make this library better for everyone.

Happy coding and Happy Hacktoberfest! 🎃👨‍💻👩‍💻

---

**Remember to star the repository ⭐ and share it with others who might be interested!**
