// Script to analyze and provide upgrade recommendations for exercises_7_8 and exercises_7_8_1
const fs = require('fs');
const path = require('path');

const exercisesDir = path.join(__dirname, '../src/components/games/exercises_7_8');
const exercisesDir2 = path.join(__dirname, '../src/components/games/exercises_7_8_1');

console.log('\n📊 EXERCISE UPGRADE ANALYSIS FOR AGE 8\n');
console.log('=' .repeat(60));

const upgradeGuidelines = {
  'LetterSound.jsx': 'UPGRADED ✅ - Now includes word reading, syllable counting, and phonics',
  'CountApples.jsx': 'UPGRADED ✅ - Now has addition/subtraction up to 20',
  'BreakWord.jsx': 'NEEDS UPGRADE - Make words longer (3-4 syllables)',
  'ColorSorter.jsx': 'NEEDS UPGRADE - Add more complex sorting (by 2 attributes)',
  'MemoryCards.jsx': 'NEEDS UPGRADE - Increase from 6 pairs to 10 pairs',
  'SpotTheDifference.jsx': 'NEEDS UPGRADE - More subtle differences, smaller details',
  'StoryChoices.jsx': 'NEEDS UPGRADE - Longer stories with inference questions',
  'FindRhyme.jsx': 'GOOD FOR AGE 8 ✅ - Keep as is',
  'PatternBuilder.jsx': 'NEEDS UPGRADE - More complex patterns (ABC patterns)',
  'NumberRecognition.jsx': 'NEEDS UPGRADE - Numbers up to 100, tens and ones',
  'LineTracing.jsx': 'NEEDS UPGRADE - More complex cursive-style lines',
  'ConnectDots.jsx': 'NEEDS UPGRADE - More dots (20-30), harder shapes',
  'ColorInBounds.jsx': 'GOOD FOR AGE 8 ✅ - Keep as is',
  'LetterTracing.jsx': 'NEEDS UPGRADE - Full lowercase alphabet, not just tracing',
  'FreeLetterWriting.jsx': 'NEEDS UPGRADE - Write full words, not just letters',
  'WhatsMissing.jsx': 'NEEDS UPGRADE - More complex scenes',
  'MatchPairs.jsx': 'NEEDS UPGRADE - More abstract relationships',
  'HowDoTheyFeel.jsx': 'NEEDS UPGRADE - More complex emotional scenarios',
  'ClassroomRules.jsx': 'NEEDS UPGRADE - More nuanced social situations',
  'EmotionalStories.jsx': 'NEEDS UPGRADE - Longer scenarios, multiple emotions',
  'FollowInstructions.jsx': 'NEEDS UPGRADE - 3-4 step instructions',
  'DailyRoutine.jsx': 'GOOD FOR AGE 8 ✅ - Keep as is',
  'IntroduceYourself.jsx': 'NEEDS UPGRADE - More complex self-expression',
  'GettingDressed.jsx': 'TOO SIMPLE - Replace with time management',
  'HandWashing.jsx': 'TOO SIMPLE - Replace with hygiene awareness',
  'ClassroomTidying.jsx': 'NEEDS UPGRADE - More complex organization',
  'ExpressingNeeds.jsx': 'NEEDS UPGRADE - More nuanced communication',
  'SizeSequence.jsx': 'NEEDS UPGRADE - More items, measurements',
  'WhichHasMore.jsx': 'NEEDS UPGRADE - Add fractions concepts',
};

const priority = {
  high: [
    'BreakWord.jsx',
    'MemoryCards.jsx',
    'NumberRecognition.jsx',
    'LetterTracing.jsx',
    'FreeLetterWriting.jsx',
    'PatternBuilder.jsx',
    'StoryChoices.jsx',
  ],
  medium: [
    'ColorSorter.jsx',
    'SpotTheDifference.jsx',
    'ConnectDots.jsx',
    'LineTracing.jsx',
    'MatchPairs.jsx',
    'HowDoTheyFeel.jsx',
    'ClassroomRules.jsx',
  ],
  low: [
    'EmotionalStories.jsx',
    'FollowInstructions.jsx',
    'IntroduceYourself.jsx',
    'ClassroomTidying.jsx',
    'ExpressingNeeds.jsx',
    'SizeSequence.jsx',
    'WhichHasMore.jsx',
  ],
  replace: [
    'GettingDressed.jsx',
    'HandWashing.jsx',
  ]
};

console.log('\n🔴 HIGH PRIORITY UPGRADES (Core Academic Skills):');
priority.high.forEach(file => {
  console.log(`   • ${file}: ${upgradeGuidelines[file] || 'Needs review'}`);
});

console.log('\n🟡 MEDIUM PRIORITY UPGRADES (Important Skills):');
priority.medium.forEach(file => {
  console.log(`   • ${file}: ${upgradeGuidelines[file] || 'Needs review'}`);
});

console.log('\n🟢 LOW PRIORITY UPGRADES (Fine-tuning):');
priority.low.forEach(file => {
  console.log(`   • ${file}: ${upgradeGuidelines[file] || 'Needs review'}`);
});

console.log('\n❌ SHOULD BE REPLACED (Too Simple for Age 8):');
priority.replace.forEach(file => {
  console.log(`   • ${file}: ${upgradeGuidelines[file] || 'Needs review'}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n📋 SUMMARY OF CHANGES FOR AGE 8:');
console.log('   • Language: Word reading → Sentence reading');
console.log('   • Math: Counting → Addition/Subtraction up to 20');
console.log('   • Writing: Tracing → Actual writing');
console.log('   • Memory: 6 pairs → 10-12 pairs');
console.log('   • Logic: Simple patterns → Complex patterns');
console.log('   • Social: Basic emotions → Complex scenarios');
console.log('   • Motor: Large shapes → Detailed work\n');

module.exports = { upgradeGuidelines, priority };
