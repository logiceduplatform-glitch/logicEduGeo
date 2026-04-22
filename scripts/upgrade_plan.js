// Comprehensive Exercise Upgrader for Age 8
// This script generates upgraded versions of all exercises

const fs = require('fs');
const path = require('path');

const templates = {
  // Template for upgraded exercises with common structure
  base: (title, targetQuestions, colorScheme) => `
  const TARGET_QUESTIONS = ${targetQuestions};
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
  `
};

// Key upgrades to implement
const upgradeList = {
  'exercises_7_8': {
    priority: 'high',
    files: [
      {
        name: 'BreakWord.jsx',
        changes: '3-4 syllable words, more complex vocabulary',
        targetQuestions: 10
      },
      {
        name: 'MemoryCards.jsx',
        changes: 'Increase to 10-12 pairs, add categories',
        targetQuestions: 12
      },
      {
        name: 'NumberRecognition.jsx',
        changes: 'Numbers 1-100, tens and ones concept',
        targetQuestions: 10
      },
      {
        name: 'StoryChoices.jsx',
        changes: 'Longer stories, inference questions, cause-effect',
        targetQuestions: 8
      },
      {
        name: 'PatternBuilder.jsx',
        changes: 'ABC, AABB, ABCD patterns',
        targetQuestions: 10
      }
    ]
  },
  'exercises_7_8_1': {
    priority: 'medium',
    files: [
      {
        name: 'FindMissingNumberGame.jsx',
        changes: 'Sequences up to 50, skip counting',
        targetQuestions: 10
      },
      {
        name: 'SpellingGame.jsx',
        changes: 'Longer words (5-7 letters), silent letters',
        targetQuestions: 10
      }
    ]
  }
};

console.log('\n📝 EXERCISE UPGRADE PLAN FOR AGE 8\n');
console.log('='.repeat(70));

Object.entries(upgradeList).forEach(([folder, data]) => {
  console.log(`\n📁 Folder: ${folder} (Priority: ${data.priority.toUpperCase()})`);
  console.log('-'.repeat(70));

  data.files.forEach((file, index) => {
    console.log(`\n${index + 1}. ${file.name}`);
    console.log(`   Changes: ${file.changes}`);
    console.log(`   Target Questions: ${file.targetQuestions}`);
  });
});

console.log('\n' + '='.repeat(70));
console.log('\n✅ Total files to upgrade:',
  Object.values(upgradeList).reduce((sum, folder) => sum + folder.files.length, 0));
console.log('\n');

module.exports = { upgradeList, templates };
