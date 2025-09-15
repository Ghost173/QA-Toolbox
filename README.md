# QA Toolbox

Professional tools for QA Engineers.

## GitHub Pages Deployment

This repository is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"
   - Save the configuration

2. **Deployment Process**:
   - The workflow automatically triggers on pushes to the `main` branch
   - It can also be manually triggered from the Actions tab
   - The site will be available at: `https://ghost173.github.io/QA-Toolbox/`

### Workflow Details

The deployment workflow (`.github/workflows/deploy-pages.yml`) handles:
- Setting up the GitHub Pages environment
- Uploading all repository files as static assets
- Deploying to GitHub Pages with proper permissions

### Local Development

To test the site locally:
```bash
python3 -m http.server 8000
# Visit http://localhost:8000 in your browser
```

The application is a pre-built React app optimized for production deployment.