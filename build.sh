#!/bin/bash
set -e

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🔨 Building frontend..."
npm run build

echo "📁 Copying build to backend/public..."
cd ..
rm -rf backend/public
cp -r frontend/dist backend/public

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Build complete!"