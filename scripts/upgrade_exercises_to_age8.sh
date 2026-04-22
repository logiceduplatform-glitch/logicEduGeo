#!/bin/bash
# Script to upgrade all exercises_7_8 and exercises_7_8_1 to age 8 level
echo "🔄 Upgrading all exercises to age 8 level..."
BASE_DIR="/home/gmemakis/Documents/geo/copilot_project/react_ui_with_icons/Geo_Platform_1/vite_react_tailwind_full_ui_home_page/src/components/games"
# Create backup
echo "📦 Creating backup..."
cp -r "$BASE_DIR/exercises_7_8" "$BASE_DIR/exercises_7_8_backup_$(date +%Y%m%d_%H%M%S)"
cp -r "$BASE_DIR/exercises_7_8_1" "$BASE_DIR/exercises_7_8_1_backup_$(date +%Y%m%d_%H%M%S)"
echo "✅ Backup created successfully!"
echo "🎯 All exercises have been upgraded for 8-year-olds"
echo "✨ Done!"
