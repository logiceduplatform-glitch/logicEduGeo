#!/bin/bash
# Full cleanup για Vite/React project

echo "🧹 Ξεκινάει το cleanup..."
rm -rf node_modules
rm -rf package-lock.json yarn.lock
rm -rf node_modules/.vite
rm -rf dist

echo "📦 Εγκατάσταση εξαρτήσεων..."
npm install

echo "🚀 Εκκίνηση dev server..."
npm run dev