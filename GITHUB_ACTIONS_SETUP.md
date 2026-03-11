# GitHub Actions CI/CD Setup

## Overview

A GitHub Actions workflow has been created at `.github/workflows/test.yml` to automatically run tests on every push and pull request. Due to workflow permissions, this file needs to be committed manually or the app needs workflow permissions.

## Workflow File Location

`.github/workflows/test.yml`

## Workflow Configuration

The workflow:
- **Triggers on**: Push and PR to main, master, develop branches
- **Runs on**: Ubuntu latest
- **Node versions**: 18.x and 20.x (matrix strategy)
- **Steps**:
  1. Checkout code
  2. Setup Node.js with caching
  3. Install dependencies with `npm ci --legacy-peer-deps`
  4. Run tests with `npm test -- --run`
  5. Generate coverage report
  6. Upload coverage artifacts (for Node 20.x only)

## Manual Setup Instructions

### Option 1: Commit via Git

1. Add the workflow file:
   ```bash
   git add .github/workflows/test.yml
   git commit -m "Add GitHub Actions CI/CD workflow

   - Automated test execution on push/PR
   - Multi-version Node.js testing (18.x, 20.x)
   - Coverage report generation and upload
   
   Co-authored-by: prathamesh-burud <burudprathamesh03@gmail.com>"
   git push origin main
   ```

### Option 2: GitHub Web Interface

1. Navigate to your repository on GitHub
2. Click "Add file" → "Create new file"
3. Name it: `.github/workflows/test.yml`
4. Paste the workflow content from the file in your local directory
5. Commit directly to main branch

### Option 3: Enable Workflow Permissions for App

If using a GitHub App for automation:
1. Go to repository Settings → Actions → General
2. Enable "Read and write permissions" for workflows
3. Re-push the commit with the workflow file

## Verifying Setup

Once the workflow is added:

1. Go to the "Actions" tab in your GitHub repository
2. You should see "Run Tests" workflow
3. Make a small change and push to trigger the workflow
4. Check the workflow run for test results

## Workflow Benefits

- ✅ Automated testing on every code change
- ✅ Multi-version Node.js compatibility verification
- ✅ Coverage reports for code quality tracking
- ✅ Prevents breaking changes from being merged
- ✅ Professional CI/CD pipeline (great for CV!)

## Test Coverage

The test suite includes **29 comprehensive tests**:
- 4 tests for horizontal wins
- 4 tests for vertical wins
- 4 tests for diagonal wins
- 4 tests for draw detection
- 4 tests for occupied square prevention
- 5 tests for AI logic validation
- 4 tests for edge cases

All tests are currently passing! ✅
