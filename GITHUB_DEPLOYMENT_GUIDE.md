# GitHub Deployment Guide for MegaReality

This guide will help you deploy your MegaReality real estate website to GitHub Pages.

## Prerequisites

1. GitHub account
2. Git installed on your computer
3. Node.js installed on your computer
4. This project cloned to your local machine

## Deployment Steps

### 1. Prepare Your Repository

If you haven't already, create a new repository on GitHub named `mega` (or any name you prefer).

### 2. Install GitHub Pages Deployment Package

Navigate to your project directory and install the gh-pages package:

```bash
npm install gh-pages --save-dev
```

### 3. Update package.json

Add the following scripts to your `package.json` file:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Also, add the homepage field to your package.json (replace `PrinceBazad` with your GitHub username):

```json
{
  "homepage": "https://PrinceBazad.github.io/mega"
}
```

### 4. Commit and Push Your Changes

```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

### 5. Deploy to GitHub Pages

Run the deploy command:

```bash
npm run deploy
```

This will:

- Build your project (`npm run build`)
- Deploy the `dist` folder to the `gh-pages` branch

### 6. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch and "/ (root)" folder
6. Click "Save"

### 7. Access Your Deployed Site

After a few minutes, your site will be available at:
`https://PrinceBazad.github.io/mega`

## Alternative: Manual Deployment

If you prefer to deploy manually:

1. Build your project:

```bash
npm run build
```

2. Copy the contents of the `dist` folder

3. Create a new branch named `gh-pages` or use the existing one

4. Paste the contents of the `dist` folder into the root of the `gh-pages` branch

5. Commit and push the changes

## Backend Deployment

Since GitHub Pages only serves static files, you'll need to deploy the backend separately. Consider these options:

1. **Render** (Free tier available)
2. **Railway** (Free tier available)
3. **Heroku** (Free tier available)

### Backend Deployment Steps (Using Render as example):

1. Create an account at render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Set the build command to `pip install -r requirements.txt`
6. Set the start command to `python app.py`
7. Add environment variables if needed
8. Deploy!

## Updating Your Site

To update your deployed site:

1. Make changes to your code
2. Commit and push to the main branch:

```bash
git add .
git commit -m "Update site"
git push origin main
```

3. Redeploy to GitHub Pages:

```bash
npm run deploy
```

## Troubleshooting

### Common Issues:

1. **Site not showing up**:

   - Check that GitHub Pages is enabled in repository settings
   - Ensure the `gh-pages` branch has content

2. **CSS/Images not loading**:

   - Verify the `homepage` field in `package.json` is correct
   - Check browser console for 404 errors

3. **Backend API not working**:
   - Make sure your backend is deployed separately
   - Update API URLs in your frontend code if needed

### Need Help?

If you encounter any issues, check the browser console and terminal output for error messages. You can also refer to the [GitHub Pages documentation](https://docs.github.com/en/pages) for more information.
