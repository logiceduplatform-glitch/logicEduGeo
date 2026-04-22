#!/bin/bash

# Automated Exercise Upgrader for Age 8
# This script provides templates and guidance for upgrading remaining exercises

BASE_DIR="/home/gmemakis/Documents/geo/copilot_project/react_ui_with_icons/Geo_Platform_1/vite_react_tailwind_full_ui_home_page"

echo "🎓 EXERCISE UPGRADE ASSISTANT FOR AGE 8"
echo "========================================"
echo ""
echo "✅ COMPLETED:"
echo "   1. LetterSound.jsx - Word reading & phonics"
echo "   2. CountApples.jsx - Addition/Subtraction to 20"
echo "   3. MemoryCards.jsx - 10 pairs with math"
echo ""
echo "📋 REMAINING UPGRADES:"
echo ""
echo "🔴 HIGH PRIORITY (Core Academic):"
echo "   • BreakWord.jsx - 3-4 syllable words"
echo "   • NumberRecognition.jsx - Numbers to 100"
echo "   • StoryChoices.jsx - Longer stories"
echo "   • PatternBuilder.jsx - Complex patterns (ABC)"
echo "   • LetterTracing.jsx - Full words"
echo "   • FreeLetterWriting.jsx - Sentences"
echo ""
echo "🟡 MEDIUM PRIORITY:"
echo "   • ColorSorter.jsx - 2 attribute sorting"
echo "   • SpotTheDifference.jsx - Subtle differences"
echo "   • ConnectDots.jsx - 20-30 dots"
echo "   • LineTracing.jsx - Cursive patterns"
echo "   • MatchPairs.jsx - Abstract relationships"
echo "   • HowDoTheyFeel.jsx - Complex emotions"
echo "   • ClassroomRules.jsx - Nuanced situations"
echo ""
echo "🟢 LOW PRIORITY:"
echo "   • EmotionalStories.jsx - Multiple emotions"
echo "   • FollowInstructions.jsx - 3-4 steps"
echo "   • IntroduceYourself.jsx - Complex expression"
echo "   • ClassroomTidying.jsx - Organization"
echo "   • ExpressingNeeds.jsx - Nuanced communication"
echo "   • SizeSequence.jsx - Measurements"
echo "   • WhichHasMore.jsx - Fractions intro"
echo ""
echo "❌ REPLACE (Too Simple for Age 8):"
echo "   • GettingDressed.jsx → TimeManagement.jsx"
echo "   • HandWashing.jsx → HygieneAwareness.jsx"
echo "   • TableSetting.jsx → MealPlanning.jsx"
echo ""
echo "=========================================="
echo ""
echo "📝 UPGRADE CHECKLIST FOR EACH EXERCISE:"
echo ""
echo "   1. Increase TARGET_QUESTIONS (8-12 for age 8)"
echo "   2. Make content more complex"
echo "   3. Add more answer options (3-4 choices)"
echo "   4. Ensure bilingual support (el/en)"
echo "   5. Keep score popup animations"
echo "   6. Maintain progress bar to 100%"
echo "   7. Test both languages"
echo ""
echo "📚 AGE 8 CAPABILITIES:"
echo ""
echo "   Language: Read sentences, write words, 2000+ word vocabulary"
echo "   Math: Add/subtract to 20, beginning multiplication, place value"
echo "   Memory: Remember 7-8 items vs 5-6 for age 6"
echo "   Logic: Multi-step problems, cause-effect reasoning"
echo "   Social: Complex emotions, perspective-taking"
echo ""
echo "=========================================="
echo ""
echo "🔧 QUICK START COMMANDS:"
echo ""
echo "   View this summary:"
echo "   $ cat UPGRADE_SUMMARY.md"
echo ""
echo "   Check upgrade progress:"
echo "   $ node scripts/analyze_exercises.js"
echo ""
echo "   Test specific exercise:"
echo "   $ npm run dev"
echo "   (Navigate to ages 7-8 → School Prep category)"
echo ""
echo "=========================================="
echo ""
echo "✨ CURRENT PROGRESS: 3/40 exercises (7.5%)"
echo ""

# Create quick reference file
cat > "$BASE_DIR/UPGRADE_QUICK_REF.md" << 'EOF'
# Quick Reference: Upgrading to Age 8

## Template Structure (All Exercises)

```jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ExerciseName({ lang = "el", onComplete }) {
  const TARGET_QUESTIONS = 10; // Age 8: 8-12 questions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  // Question data structure
  const questionsData = {
    el: [/* Greek questions */],
    en: [/* English questions */]
  };

  // ... rest of component
}
```

## Key Changes for Age 8

### Language Exercises:
- **Age 6**: Single letters, 3-letter words
- **Age 8**: Full sentences, 5-7 letter words, comprehension

### Math Exercises:
- **Age 6**: Counting to 10
- **Age 8**: Addition/subtraction to 20, place value, beginning multiplication

### Memory Exercises:
- **Age 6**: 6 pairs
- **Age 8**: 10-12 pairs

### Logic Exercises:
- **Age 6**: Simple AB patterns
- **Age 8**: ABC, AABB, ABCD patterns

## Common Pitfalls

1. ❌ Too many questions (>15)
2. ❌ Too difficult vocabulary
3. ❌ Missing bilingual support
4. ❌ Progress bar not reaching 100%
5. ❌ No score animations
6. ❌ Inconsistent emoji usage

## Testing Checklist

- [ ] Exercise loads without errors
- [ ] Both languages work correctly
- [ ] Progress bar reaches 100%
- [ ] Score popup appears
- [ ] Celebration shows at end
- [ ] Sounds play correctly
- [ ] Completion callback works
- [ ] Content is age-appropriate
EOF

echo "📄 Created UPGRADE_QUICK_REF.md"
echo ""
echo "Done! Use these resources to continue upgrading exercises."
echo ""
