
# Contributing to File Upload Server

Thank you for your interest in contributing to **File Upload Server**!
Your contributions help make this project better for everyone. Whether it's fixing bugs, improving documentation, or adding new features — we’re excited to collaborate with you.

---

## How to Contribute

### Fork the Repository

Click the **Fork** button at the top right of this repo to create your own copy.

### Clone Your Fork

```bash
git clone https://github.com/Harshsharma1712/file-upload-server.git
cd file-upload-server
```

### Create a New Branch

Before making any changes, create a separate branch:

```bash
git checkout -b feature/your-feature-name
```

Example:

```bash
git checkout -b fix/image-upload-bug
```

### Make Your Changes

Now make your improvements in the codebase.
Please follow the project’s existing **code style** and **folder structure**.

### Test Your Changes

Before pushing, make sure everything works as expected:

```bash
npm run dev
```

Then test your endpoints using Postman or any API client.

### Commit Your Changes

Use a **clear and descriptive** commit message:

```bash
git add .
git commit -m "Add feature: support for PDF uploads"
```

### Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### Create a Pull Request (PR)

Go to your forked repository on GitHub and click **“Compare & pull request”**.
Provide:

* A clear description of your changes
* The reason or issue it solves (if applicable)
* Screenshots (if the change affects output or API responses)

---

## Pull Request Guidelines

To ensure smooth collaboration, please follow these rules before submitting your PR:

* Your code must run without errors.
* Lint and format your code (follow the existing code style).
* Make sure all environment variables are secure and not hardcoded.
* Add meaningful commit messages and PR titles.
* Keep changes **focused and minimal** — one feature or fix per PR.

---

## Issue Reporting

Found a bug or want to request a feature?
Please **open an issue** with these details:

* **Description**: what went wrong or what you want to add
* **Steps to Reproduce** (for bugs)
* **Expected Behavior**
* **Environment Info** (Node.js version, OS, etc.)

Example:

```md
### Bug Report
**Issue:** File upload fails for images > 5MB  
**Steps to Reproduce:**
1. Login using valid JWT
2. Try uploading a 10MB image
3. Receive 400 Bad Request
**Expected Result:** File should upload or show user-friendly error message.
```

---

## Development Guidelines

* Use **ES Modules (import/export)** syntax.
* Follow naming conventions:

  * `camelCase` for variables and functions
  * `PascalCase` for classes and components
* Keep routes modular under `/routes` folder.
* Add comments for complex logic or API flows.

---

##  Suggestions

If you’re unsure about a change or feature, feel free to:

* Start a **discussion** in the Issues tab
* Or draft a PR and mark it as “Work in Progress (WIP)”

We’ll be happy to review it and help you move forward.

---

## License

By contributing, you agree that your contributions will be licensed under the **MIT License** of this project.

---

## Need Help?

If you have any questions or need guidance:

* Open an **issue** on GitHub, or
* Contact the maintainer directly via GitHub

---

### Thank You for Contributing!

Your time and effort make open-source better.
Let’s build a secure and powerful file-sharing server together! 

---