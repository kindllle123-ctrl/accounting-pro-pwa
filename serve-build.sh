#!/bin/bash
# Build and serve locally
# Useful for testing production build before deployment

echo "Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Build successful! ✅"
echo ""
echo "Starting production server..."
echo "Visit: http://localhost:5000"
echo ""

npm install -g serve
serve -s build -l 5000
