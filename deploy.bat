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
echo You can now deploy these files to Vercel.

echo For Vercel deployment:
echo 1. Install Vercel CLI: npm install -g vercel
echo 2. Run: vercel --prod

echo Deployment process completed!
pause