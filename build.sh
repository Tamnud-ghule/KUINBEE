#!/bin/bash
set -e

# Install and build shared dependencies
echo "Building shared package..."
cd shared
npm install
npm run build

# Install and build server
echo "Building server..."
cd ../server
npm install
npm run build

echo "Build completed successfully!"
