#!/bin/bash

# MegaReality Deployment Script

echo "Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "Error: Frontend build failed."
    exit 1
fi

echo "Frontend build completed successfully."

echo "Deployment files are ready in the 'dist' folder."
echo "You can now deploy these files to Vercel."

echo "For Vercel deployment:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Run: vercel --prod"

echo "Deployment process completed!"