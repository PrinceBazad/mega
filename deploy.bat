@echo off
TITLE MegaReality Deployment Script

echo Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Building frontend...
npm run build

if %errorlevel% neq 0 (
    echo Error: Frontend build failed.
    pause
    exit /b 1
)

echo Frontend build completed successfully.

echo Deployment files are ready in the 'dist' folder.
echo You can now deploy these files to your preferred hosting platform.

echo For GitHub Pages deployment:
echo 1. Install gh-pages: npm install gh-pages --save-dev
echo 2. Add these scripts to package.json:
echo    "predeploy": "npm run build",
echo    "deploy": "gh-pages -d dist"
echo 3. Run: npm run deploy

echo For Netlify deployment:
echo 1. Push your code to GitHub
echo 2. Connect your repository to Netlify
echo 3. Set build command to: npm run build
echo 4. Set publish directory to: dist

echo For Vercel deployment:
echo 1. Install Vercel CLI: npm install -g vercel
echo 2. Run: vercel --prod

echo Deployment process completed!
pause