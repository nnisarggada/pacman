# Contributing to PACMAN - Private Alternative for Contact Management And Networking

Thank you for your interest in contributing to **PACMAN**! We're excited to collaborate with you to improve our contact management web application. This document outlines guidelines for contributing to the project. Please take a moment to read through this to ensure a smooth and productive collaboration.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Submitting Changes](#submitting-changes)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)

---

## Code of Conduct

We adhere to a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for all contributors. Please make sure to read and respect the guidelines before contributing to PACMAN.

---

## How Can I Contribute?

### Reporting Bugs

Found a bug? We would love to know about it! Please [open a new issue](https://github.com/yourusername/pacman/issues/new) in the repository. When reporting bugs, make sure to include:

- A clear and descriptive title.
- Detailed steps to reproduce the bug.
- Expected and actual results.
- Any relevant error messages or logs.

### Suggesting Enhancements

Have a great idea for a new feature or enhancement? Feel free to [create an enhancement request](https://github.com/yourusername/pacman/issues/new). Please include:

- A clear and detailed description of the feature.
- Why this feature would be beneficial for PACMAN.
- Any additional context or examples that could help implement the idea.

### Submitting Changes

If you're ready to contribute code to PACMAN, here's how to do it:

1. **Fork the repository**:  
   Fork PACMAN on GitHub and clone it to your local machine.

2. **Create a new branch**:  
   Always work on a separate branch. You can name it after the feature or bug you're addressing (e.g., `feature-add-contact-group`).

3. **Make changes**:  
   Implement your changes following PACMAN's coding standards and test your modifications.

4. **Test your code**:  
   Ensure your code is thoroughly tested, and any new features or bug fixes are working as expected.

5. **Submit a pull request (PR)**:  
   Once your changes are complete and tested, create a pull request from your branch into the `main` branch. In the PR description, include:

   - A summary of the changes.
   - The purpose of the changes.
   - Any specific steps for testing the changes.

---

## Development Setup

To set up PACMAN for local development, follow these steps:

### Prerequisites

- [Go (Golang)](https://golang.org/) installed on your system.
- Basic understanding of Go web applications.

### Installation

1. **Clone the Repository**:  
   Clone the PACMAN repository to your local machine:

   ```bash
   git clone https://github.com/nnisarggada/pacman
   cd pacman
   ```

2. **Install Dependencies**:  
   If the project has any dependencies, you can use `go mod` to install them:

   ```bash
   go mod tidy
   ```

### Running the App

Run the app locally by executing the following command:

```bash
go run main.go
```

The application will be available at `http://localhost:8080`.
