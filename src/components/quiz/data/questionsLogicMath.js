export const questionsLogicMath = [
  // === Math (5) ===
  {
    id: 'math-1',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'What is 15% of 200?', el: 'Πόσο είναι το 15% του 200;' },
    options: [25, 30, 35],
    correct: 30,
    explanation: { en: '15% means 15/100, so 15/100 × 200 = 30.', el: 'Το 15% σημαίνει 15/100, άρα 15/100 × 200 = 30.' },
    points: 10
  },
  {
    id: 'math-2',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'If x² = 144, what is x?', el: 'Αν x² = 144, πόσο είναι το x;' },
    options: [10, 12, 14],
    correct: 12,
    explanation: { en: 'The square root of 144 is 12, since 12 × 12 = 144.', el: 'Η τετραγωνική ρίζα του 144 είναι 12, αφού 12 × 12 = 144.' },
    points: 15
  },
  {
    id: 'math-3',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is the sum of the interior angles of a hexagon?', el: 'Πόσο είναι το άθροισμα των εσωτερικών γωνιών ενός εξαγώνου;' },
    options: { en: ['540°', '720°', '900°'], el: ['540°', '720°', '900°'] },
    correct: { en: '720°', el: '720°' },
    explanation: { en: 'The formula (n − 2) × 180° gives the sum for an n-sided polygon. For a hexagon: (6 − 2) × 180° = 720°.', el: 'Ο τύπος (n − 2) × 180° δίνει το άθροισμα για n-πλευρο πολύγωνο. Για εξάγωνο: (6 − 2) × 180° = 720°.' },
    points: 20
  },
  {
    id: 'math-4',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'What is the value of √(169)?', el: 'Πόσο είναι η √(169);' },
    options: [11, 13, 15],
    correct: 13,
    explanation: { en: 'The square root of 169 is 13, because 13 × 13 = 169.', el: 'Η τετραγωνική ρίζα του 169 είναι 13, αφού 13 × 13 = 169.' }
  },
  {
    id: 'math-5',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is log₂(64)?', el: 'Πόσο είναι το log₂(64);' },
    options: [4, 6, 8],
    correct: 6,
    explanation: { en: 'log₂(64) asks how many times we multiply 2 to get 64. Since 2⁶ = 64, the answer is 6.', el: 'Το log₂(64) ρωτάει πόσες φορές πολλαπλασιάζουμε το 2 για να πάρουμε 64. Αφού 2⁶ = 64, η απάντηση είναι 6.' }
  },

  // === Geometry (5) ===
  {
    id: 'geom-1',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'How many degrees are in a right angle?', el: 'Πόσες μοίρες έχει μια ορθή γωνία;' },
    options: [45, 90, 180],
    correct: 90,
    explanation: { en: 'A right angle is defined as exactly 90°, forming a perfect L shape.', el: 'Μια ορθή γωνία ορίζεται ως ακριβώς 90°, σχηματίζοντας ένα τέλειο σχήμα L.' }
  },
  {
    id: 'geom-2',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'What is the area of a circle with radius 5? (use π ≈ 3.14)', el: 'Ποιο είναι το εμβαδόν κύκλου με ακτίνα 5; (π ≈ 3,14)' },
    options: { en: ['31.4', '78.5', '157'], el: ['31,4', '78,5', '157'] },
    correct: { en: '78.5', el: '78,5' },
    explanation: { en: 'Area = πr² = 3.14 × 5² = 3.14 × 25 = 78.5.', el: 'Εμβαδόν = πr² = 3,14 × 5² = 3,14 × 25 = 78,5.' }
  },
  {
    id: 'geom-3',
    category: 'Geometry',
    difficulty: 'hard',
    question: { en: 'How many faces does a dodecahedron have?', el: 'Πόσες έδρες έχει ένα δωδεκάεδρο;' },
    options: [10, 12, 20],
    correct: 12,
    explanation: { en: 'Dodecahedron comes from Greek "dodeca" (twelve) and "hedron" (face). It has 12 pentagonal faces.', el: 'Το δωδεκάεδρο προέρχεται από το «δωδεκα» (δώδεκα) και «εδρα» (έδρα). Έχει 12 πενταγωνικές έδρες.' }
  },
  {
    id: 'geom-4',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'What is the Pythagorean theorem formula?', el: 'Ποιος είναι ο τύπος του Πυθαγόρειου θεωρήματος;' },
    options: { en: ['a² + b² = c²', 'a + b = c', 'a² × b² = c²'], el: ['a² + b² = c²', 'a + b = c', 'a² × b² = c²'] },
    correct: { en: 'a² + b² = c²', el: 'a² + b² = c²' },
    explanation: { en: 'In a right triangle, the square of the hypotenuse (c) equals the sum of the squares of the other two sides (a and b).', el: 'Σε ορθογώνιο τρίγωνο, το τετράγωνο της υποτείνουσας (c) ισούται με το άθροισμα των τετραγώνων των άλλων δύο πλευρών (a και b).' }
  },
  {
    id: 'geom-5',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'What is the perimeter of a square with side 9?', el: 'Ποια είναι η περίμετρος ενός τετραγώνου με πλευρά 9;' },
    options: [27, 36, 81],
    correct: 36,
    explanation: { en: 'The perimeter of a square is 4 × side. So 4 × 9 = 36.', el: 'Η περίμετρος τετραγώνου είναι 4 × πλευρά. Άρα 4 × 9 = 36.' }
  },

  // === Logic (5) ===
  {
    id: 'logic-1',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'What comes next: 1, 1, 2, 3, 5, 8, ?', el: 'Τι ακολουθεί: 1, 1, 2, 3, 5, 8, ;' },
    options: [10, 11, 13],
    correct: 13,
    explanation: { en: 'This is the Fibonacci sequence. Each number is the sum of the two before it: 5 + 8 = 13.', el: 'Αυτή είναι η ακολουθία Fibonacci. Κάθε αριθμός είναι το άθροισμα των δύο προηγούμενων: 5 + 8 = 13.' }
  },
  {
    id: 'logic-2',
    category: 'Logic',
    difficulty: 'hard',
    question: {
      en: 'All roses are flowers. Some flowers fade quickly. Which is necessarily true?',
      el: 'Όλα τα τριαντάφυλλα είναι λουλούδια. Μερικά λουλούδια μαραίνονται γρήγορα. Ποιο ισχύει αναγκαστικά;'
    },
    options: {
      en: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade'],
      el: ['Όλα τα τριαντάφυλλα μαραίνονται γρήγορα', 'Κάποια τριαντάφυλλα μπορεί να μαραίνονται γρήγορα', 'Κανένα τριαντάφυλλο δεν μαραίνεται']
    },
    correct: {
      en: 'Some roses may fade quickly',
      el: 'Κάποια τριαντάφυλλα μπορεί να μαραίνονται γρήγορα'
    },
    explanation: { en: 'Roses are a subset of flowers, and some flowers fade quickly. The overlap could include roses, so some roses may fade quickly.', el: 'Τα τριαντάφυλλα είναι υποσύνολο λουλούδιων και μερικά λουλούδια μαραίνονται γρήγορα. Η τομή μπορεί να περιλαμβάνει τριαντάφυλλα.' }
  },
  {
    id: 'logic-3',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'Which number does not belong: 2, 4, 7, 8, 10?', el: 'Ποιος αριθμός δεν ταιριάζει: 2, 4, 7, 8, 10;' },
    options: [4, 7, 10],
    correct: 7,
    explanation: { en: '2, 4, 8, and 10 are all even numbers. 7 is the only odd number in the list.', el: 'Τα 2, 4, 8 και 10 είναι όλα ζυγοί αριθμοί. Το 7 είναι ο μόνος περιττός στη λίστα.' }
  },
  {
    id: 'logic-4',
    category: 'Logic',
    difficulty: 'medium',
    question: {
      en: 'A is taller than B. C is shorter than B. Who is the shortest?',
      el: 'Ο Α είναι ψηλότερος από τον Β. Ο Γ είναι κοντύτερος από τον Β. Ποιος είναι ο πιο κοντός;'
    },
    options: { en: ['A', 'B', 'C'], el: ['Α', 'Β', 'Γ'] },
    correct: { en: 'C', el: 'Γ' },
    explanation: { en: 'From the given info: A > B and C < B, so the order is C < B < A. C is the shortest.', el: 'Από τα δεδομένα: Α > Β και Γ < Β, άρα η σειρά είναι Γ < Β < Α. Ο Γ είναι ο πιο κοντός.' }
  },
  {
    id: 'logic-5',
    category: 'Logic',
    difficulty: 'hard',
    question: {
      en: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
      el: 'Αν 5 μηχανές φτιάχνουν 5 αντικείμενα σε 5 λεπτά, πόσο χρόνο χρειάζονται 100 μηχανές για 100 αντικείμενα;'
    },
    options: {
      en: ['5 minutes', '100 minutes', '20 minutes'],
      el: ['5 λεπτά', '100 λεπτά', '20 λεπτά']
    },
    correct: { en: '5 minutes', el: '5 λεπτά' },
    explanation: { en: 'Each machine makes 1 widget in 5 minutes. So 100 machines each making 1 widget still take 5 minutes.', el: 'Κάθε μηχανή φτιάχνει 1 αντικείμενο σε 5 λεπτά. Οι 100 μηχανές, κάθε μια 1 αντικείμενο, χρειάζονται ακόμα 5 λεπτά.' }
  },

  // === Vocabulary / Language (5) ===
  {
    id: 'vocab-1',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What is the synonym of "ubiquitous"?', el: 'Ποιο είναι το συνώνυμο του «πανταχού παρών»;' },
    options: {
      en: ['Rare', 'Omnipresent', 'Invisible'],
      el: ['Σπάνιος', 'Πανταχού παρών', 'Αόρατος']
    },
    correct: { en: 'Omnipresent', el: 'Πανταχού παρών' },
    explanation: { en: 'Ubiquitous and omnipresent both mean "present everywhere" or "found in all places."', el: 'Το ubiquitous και το omnipresent σημαίνουν «παρόν παντού» ή «ευρεθέν παντού».' }
  },
  {
    id: 'vocab-2',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What does "ephemeral" mean?', el: 'Τι σημαίνει «εφήμερος»;' },
    options: {
      en: ['Eternal', 'Short-lived', 'Ancient'],
      el: ['Αιώνιος', 'Βραχύβιος', 'Αρχαίος']
    },
    correct: { en: 'Short-lived', el: 'Βραχύβιος' },
    explanation: { en: 'Ephemeral comes from Greek "ephemeros" (lasting a day) and means lasting for a very short time.', el: 'Το ephemeral προέρχεται από το ελληνικό «εφήμερος» (διαρκών μία μέρα) και σημαίνει βραχύβιο.' }
  },
  {
    id: 'vocab-3',
    category: 'Vocabulary',
    difficulty: 'hard',
    question: { en: 'Which word means "a strong dislike"?', el: 'Ποια λέξη σημαίνει «ισχυρή αντιπάθεια»;' },
    options: {
      en: ['Antipathy', 'Empathy', 'Apathy'],
      el: ['Αντιπάθεια', 'Ενσυναίσθηση', 'Απάθεια']
    },
    correct: { en: 'Antipathy', el: 'Αντιπάθεια' },
    explanation: { en: 'Antipathy (from Greek anti- against, pathos feeling) means a strong feeling of dislike or aversion.', el: 'Η αντιπάθεια (από anti- ενάντια, pathos συναίσθημα) σημαίνει ισχυρή αντιπάθεια ή απέχθεια.' }
  },
  {
    id: 'vocab-4',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What is the antonym of "verbose"?', el: 'Ποιο είναι το αντίθετο του «πολύλογος»;' },
    options: {
      en: ['Concise', 'Lengthy', 'Eloquent'],
      el: ['Λακωνικός', 'Μακρόσυρτος', 'Εύγλωττος']
    },
    correct: { en: 'Concise', el: 'Λακωνικός' },
    explanation: { en: 'Verbose means using more words than needed. Concise means brief and to the point—the opposite.', el: 'Το verbose σημαίνει χρήση περισσότερων λέξεων από τις απαραίτητες. Το concise σημαίνει σύντομο και ακριβές.' }
  },
  {
    id: 'vocab-5',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What does "pragmatic" mean?', el: 'Τι σημαίνει «πραγματιστής»;' },
    options: {
      en: ['Idealistic', 'Practical', 'Dramatic'],
      el: ['Ιδεαλιστής', 'Πρακτικός', 'Δραματικός']
    },
    correct: { en: 'Practical', el: 'Πρακτικός' },
    explanation: { en: 'Pragmatic means focused on practical results and what works in reality, rather than theory.', el: 'Το pragmatic σημαίνει επικεντρωμένο σε πρακτικά αποτελέσματα και σε αυτό που λειτουργεί στην πράξη.' }
  },

  // === Extra Math (3) ===
  {
    id: 'math-6',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'What is 3/4 expressed as a decimal?', el: 'Πόσο είναι το 3/4 σε δεκαδική μορφή;' },
    options: { en: ['0.25', '0.5', '0.75', '0.80'], el: ['0,25', '0,5', '0,75', '0,80'] },
    correct: { en: '0.75', el: '0,75' },
    explanation: { en: '3 ÷ 4 = 0.75. You can also think of it as 3/4 = 75/100 = 0.75.', el: '3 ÷ 4 = 0,75. Μπορείτε να το σκεφτείτε ως 3/4 = 75/100 = 0,75.' }
  },
  {
    id: 'math-7',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is the value of 2^10?', el: 'Πόσο είναι το 2^10;' },
    options: [512, 1024, 2048, 4096],
    correct: 1024,
    explanation: { en: '2^10 means 2 multiplied by itself 10 times. 2^10 = 1024.', el: 'Το 2^10 σημαίνει 2 πολλαπλασιασμένο επί τον εαυτό του 10 φορές. 2^10 = 1024.' }
  },
  {
    id: 'math-8',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'What is the result of 15 × 15?', el: 'Πόσο κάνει 15 × 15;' },
    options: [200, 225, 250, 215],
    correct: 225,
    explanation: { en: '15 × 15 = 225. This is 15², and 15² = 225.', el: '15 × 15 = 225. Είναι το 15², και 15² = 225.' }
  },

  // === Extra Geometry (2) ===
  {
    id: 'geom-6',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'How many sides does a hexagon have?', el: 'Πόσες πλευρές έχει ένα εξάγωνο;' },
    options: [5, 6, 7, 8],
    correct: 6,
    explanation: { en: 'Hexagon comes from Greek "hex" (six) and "gonia" (angle). A hexagon has 6 sides.', el: 'Το εξάγωνο προέρχεται από το «έξι» και «γωνία». Ένα εξάγωνο έχει 6 πλευρές.' }
  },
  {
    id: 'geom-7',
    category: 'Geometry',
    difficulty: 'hard',
    question: { en: 'What is the sum of interior angles of a pentagon?', el: 'Πόσο είναι το άθροισμα των εσωτερικών γωνιών ενός πενταγώνου;' },
    options: { en: ['360°', '540°', '720°', '480°'], el: ['360°', '540°', '720°', '480°'] },
    correct: { en: '540°', el: '540°' },
    explanation: { en: 'For a pentagon (n=5): (5 − 2) × 180° = 3 × 180° = 540°.', el: 'Για πεντάγωνο (n=5): (5 − 2) × 180° = 3 × 180° = 540°.' }
  },

  // === Extra Logic (3) ===
  {
    id: 'logic-6',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'If all roses are flowers, and some flowers are red, which is true?', el: 'Αν όλα τα τριαντάφυλλα είναι λουλούδια και μερικά λουλούδια είναι κόκκινα, τι ισχύει;' },
    options: {
      en: ['All roses are red', 'Some roses may be red', 'No roses are red', 'All flowers are roses'],
      el: ['Όλα τα τριαντάφυλλα είναι κόκκινα', 'Μερικά τριαντάφυλλα μπορεί να είναι κόκκινα', 'Κανένα τριαντάφυλλο δεν είναι κόκκινο', 'Όλα τα λουλούδια είναι τριαντάφυλλα']
    },
    correct: { en: 'Some roses may be red', el: 'Μερικά τριαντάφυλλα μπορεί να είναι κόκκινα' },
    explanation: { en: 'Roses are a subset of flowers. Some flowers are red, and roses could be in that group, so some roses may be red.', el: 'Τα τριαντάφυλλα είναι υποσύνολο λουλούδιων. Μερικά λουλούδια είναι κόκκινα και τα τριαντάφυλλα μπορεί να ανήκουν σ’ αυτή την ομάδα.' }
  },
  {
    id: 'logic-7',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'What comes next: 2, 6, 18, 54, ...?', el: 'Τι ακολουθεί: 2, 6, 18, 54, ...;' },
    options: [108, 162, 216, 72],
    correct: 162,
    explanation: { en: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, so 54×3=162.', el: 'Κάθε αριθμός πολλαπλασιάζεται επί 3: 2×3=6, 6×3=18, 18×3=54, άρα 54×3=162.' }
  },
  {
    id: 'logic-8',
    category: 'Logic',
    difficulty: 'hard',
    question: { en: 'A statement says: "This sentence is false." What type of problem is this?', el: 'Μια πρόταση λέει: «Αυτή η πρόταση είναι ψευδής.» Τι πρόβλημα είναι αυτό;' },
    options: {
      en: ['A tautology', 'A paradox', 'A syllogism', 'An axiom'],
      el: ['Ταυτολογία', 'Παράδοξο', 'Συλλογισμός', 'Αξίωμα']
    },
    correct: { en: 'A paradox', el: 'Παράδοξο' },
    explanation: { en: 'If the sentence is true, it says it is false. If it is false, then it would be true. This self-contradiction is a paradox.', el: 'Αν η πρόταση είναι αληθής, λέει ότι είναι ψευδής. Αν είναι ψευδής, τότε θα ήταν αληθής. Αυτή η αυτοαντίφαση είναι παράδοξο.' }
  },

  // === Extra Vocabulary (2) ===
  {
    id: 'vocab-6',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What is an antonym of "generous"?', el: 'Ποιο είναι αντώνυμο του "γενναιόδωρος";' },
    options: { en: ['Kind', 'Stingy', 'Brave', 'Gentle'], el: ['Ευγενικός', 'Τσιγκούνης', 'Γενναίος', 'Ήπιος'] },
    correct: { en: 'Stingy', el: 'Τσιγκούνης' },
    explanation: { en: 'Generous means giving freely. Stingy means unwilling to give or share—the opposite.', el: 'Το generous σημαίνει να δίνεις ελεύθερα. Το stingy (τσιγκούνης) σημαίνει απρόθυμος να δώσει ή να μοιραστεί.' }
  },
  {
    id: 'vocab-7',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What does "ephemeral" mean?', el: 'Τι σημαίνει "εφήμερος";' },
    options: {
      en: ['Eternal', 'Short-lived', 'Important', 'Ancient'],
      el: ['Αιώνιος', 'Βραχύβιος', 'Σημαντικός', 'Αρχαίος']
    },
    correct: { en: 'Short-lived', el: 'Βραχύβιος' },
    explanation: { en: 'Ephemeral means lasting for a very short time—like ephemeral flowers that bloom and wither quickly.', el: 'Το ephemeral (εφήμερος) σημαίνει διαρκεί πολύ λίγο—όπως τα εφήμερα λουλούδια που ανθίζουν και μαραίνονται γρήγορα.' }
  },

  // === 70 NEW BILINGUAL QUESTIONS ===
  {
    id: 'math-9',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'What is 1/3 + 1/6 in lowest terms?', el: 'Πόσο κάνει 1/3 + 1/6 σε απλοποιημένα κλάσματα;' },
    options: { en: ['1/2', '2/9', '1/4', '2/6'], el: ['1/2', '2/9', '1/4', '2/6'] },
    correct: { en: '1/2', el: '1/2' },
    explanation: { en: '1/3 = 2/6, so 2/6 + 1/6 = 3/6 = 1/2.', el: '1/3 = 2/6, άρα 2/6 + 1/6 = 3/6 = 1/2.' }
  },
  {
    id: 'math-10',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'If a shirt costs €40 after a 20% discount, what was the original price?', el: 'Αν μια μπλούζα κοστίζει €40 με 20% έκπτωση, ποια ήταν η αρχική τιμή;' },
    options: { en: ['€48', '€50', '€52', '€45'], el: ['€48', '€50', '€52', '€45'] },
    correct: { en: '€50', el: '€50' },
    explanation: { en: 'Original × 0.80 = 40, so original = 40/0.80 = 50.', el: 'Αρχική × 0,80 = 40, άρα αρχική = 40/0,80 = 50.' }
  },
  {
    id: 'math-11',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is the probability of rolling two fair dice and getting a sum of 7?', el: 'Ποια είναι η πιθανότητα να ρίξετε δύο ζάρια και να πάρετε άθροισμα 7;' },
    options: { en: ['1/6', '1/9', '1/12', '5/36'], el: ['1/6', '1/9', '1/12', '5/36'] },
    correct: { en: '1/6', el: '1/6' },
    explanation: { en: 'There are 6 combinations (1-6,2-5,3-4,4-3,5-2,6-1) out of 36 total. 6/36 = 1/6.', el: 'Υπάρχουν 6 συνδυασμοί από 36 συνολικά. 6/36 = 1/6.' }
  },
  {
    id: 'math-12',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'What is 25% of 80?', el: 'Πόσο είναι το 25% του 80;' },
    options: { en: ['15', '20', '25', '30'], el: ['15', '20', '25', '30'] },
    correct: { en: '20', el: '20' },
    explanation: { en: '25/100 × 80 = 0.25 × 80 = 20.', el: '25/100 × 80 = 0,25 × 80 = 20.' }
  },
  {
    id: 'math-13',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'Solve for x: 2x + 7 = 21', el: 'Λύστε ως προς x: 2x + 7 = 21' },
    options: { en: ['x = 5', 'x = 6', 'x = 7', 'x = 8'], el: ['x = 5', 'x = 6', 'x = 7', 'x = 8'] },
    correct: { en: 'x = 7', el: 'x = 7' },
    explanation: { en: '2x = 21 − 7 = 14, so x = 14/2 = 7.', el: '2x = 21 − 7 = 14, άρα x = 14/2 = 7.' }
  },
  {
    id: 'math-14',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is the median of the set {3, 7, 9, 14, 22}?', el: 'Ποια είναι η διάμεσος του συνόλου {3, 7, 9, 14, 22};' },
    options: { en: ['7', '9', '11', '14'], el: ['7', '9', '11', '14'] },
    correct: { en: '9', el: '9' },
    explanation: { en: 'The median is the middle value when ordered. For 5 values, the 3rd is 9.', el: 'Η διάμεσος είναι η μεσαία τιμή όταν ταξινομηθεί. Για 5 τιμές, η 3η είναι το 9.' }
  },
  {
    id: 'math-15',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'How many prime numbers are between 1 and 10?', el: 'Πόσοι πρώτοι αριθμοί υπάρχουν μεταξύ 1 και 10;' },
    options: { en: ['3', '4', '5', '6'], el: ['3', '4', '5', '6'] },
    correct: { en: '4', el: '4' },
    explanation: { en: 'The primes are 2, 3, 5, and 7. That is 4 numbers.', el: 'Οι πρώτοι είναι 2, 3, 5 και 7. Αυτό είναι 4 αριθμοί.' }
  },
  {
    id: 'math-16',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'What is the greatest common divisor (GCD) of 48 and 18?', el: 'Ποιος είναι ο μέγιστος κοινός διαιρέτης (ΜΚΔ) των 48 και 18;' },
    options: { en: ['4', '6', '8', '12'], el: ['4', '6', '8', '12'] },
    correct: { en: '6', el: '6' },
    explanation: { en: '48 = 2⁴×3, 18 = 2×3². GCD = 2×3 = 6.', el: '48 = 2⁴×3, 18 = 2×3². ΜΚΔ = 2×3 = 6.' }
  },
  {
    id: 'math-17',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is the value of 5! (5 factorial)?', el: 'Πόσο είναι το 5! (5 παραγοντικό);' },
    options: { en: ['100', '120', '60', '24'], el: ['100', '120', '60', '24'] },
    correct: { en: '120', el: '120' },
    explanation: { en: '5! = 5×4×3×2×1 = 120.', el: '5! = 5×4×3×2×1 = 120.' }
  },
  {
    id: 'math-18',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'What is 3/5 expressed as a percentage?', el: 'Πόσο είναι το 3/5 ως ποσοστό;' },
    options: { en: ['50%', '55%', '60%', '65%'], el: ['50%', '55%', '60%', '65%'] },
    correct: { en: '60%', el: '60%' },
    explanation: { en: '3/5 = 0.6 = 60%.', el: '3/5 = 0,6 = 60%.' }
  },
  {
    id: 'math-19',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'If the mean of five numbers is 20, what is their sum?', el: 'Αν ο μέσος όρος πέντε αριθμών είναι 20, πόσο είναι το άθροισμά τους;' },
    options: { en: ['80', '100', '120', '90'], el: ['80', '100', '120', '90'] },
    correct: { en: '100', el: '100' },
    explanation: { en: 'Mean = sum/n, so sum = mean × n = 20 × 5 = 100.', el: 'Μέσος = άθροισμα/n, άρα άθροισμα = 20 × 5 = 100.' }
  },
  {
    id: 'math-20',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is the next number: 1, 4, 9, 16, 25, ?', el: 'Ποιος είναι ο επόμενος αριθμός: 1, 4, 9, 16, 25, ;' },
    options: { en: ['30', '32', '36', '40'], el: ['30', '32', '36', '40'] },
    correct: { en: '36', el: '36' },
    explanation: { en: 'These are perfect squares: 1², 2², 3², 4², 5². Next is 6² = 36.', el: 'Είναι τέλεια τετράγωνα: 1², 2², 3², 4², 5². Επόμενο είναι 6² = 36.' }
  },
  {
    id: 'math-21',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'What is 7 × 8?', el: 'Πόσο κάνει 7 × 8;' },
    options: { en: ['54', '56', '58', '60'], el: ['54', '56', '58', '60'] },
    correct: { en: '56', el: '56' },
    explanation: { en: '7 × 8 = 56.', el: '7 × 8 = 56.' }
  },
  {
    id: 'math-22',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'A store raises a price by 25% then lowers it by 20%. Compared to the original, the final price is:', el: 'Ένα μαγαζί αυξάνει την τιμή 25% και μετά την μειώνει 20%. Σε σχέση με την αρχική, η τελική τιμή είναι:' },
    options: { en: ['Higher', 'Lower', 'The same', 'Cannot determine'], el: ['Υψηλότερη', 'Χαμηλότερη', 'Ίδια', 'Αδύνατον να οριστεί'] },
    correct: { en: 'The same', el: 'Ίδια' },
    explanation: { en: '1.25 × 0.80 = 1.00. The original price returns.', el: '1,25 × 0,80 = 1,00. Η αρχική τιμή επιστρέφει.' }
  },
  {
    id: 'math-23',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'What is the least common multiple (LCM) of 12 and 18?', el: 'Ποιο είναι το ελάχιστο κοινό πολλαπλάσιο (ΕΚΠ) των 12 και 18;' },
    options: { en: ['36', '54', '72', '108'], el: ['36', '54', '72', '108'] },
    correct: { en: '36', el: '36' },
    explanation: { en: '12 = 2²×3, 18 = 2×3². LCM = 2²×3² = 4×9 = 36.', el: '12 = 2²×3, 18 = 2×3². ΕΚΠ = 2²×3² = 4×9 = 36.' }
  },
  {
    id: 'math-24',
    category: 'Math',
    difficulty: 'easy',
    question: { en: 'What is 100 − 37?', el: 'Πόσο κάνει 100 − 37;' },
    options: { en: ['62', '63', '64', '65'], el: ['62', '63', '64', '65'] },
    correct: { en: '63', el: '63' },
    explanation: { en: '100 − 37 = 63.', el: '100 − 37 = 63.' }
  },
  {
    id: 'math-25',
    category: 'Math',
    difficulty: 'medium',
    question: { en: 'If 3x − 4 = 11, what is x?', el: 'Αν 3x − 4 = 11, πόσο είναι το x;' },
    options: { en: ['3', '4', '5', '6'], el: ['3', '4', '5', '6'] },
    correct: { en: '5', el: '5' },
    explanation: { en: '3x = 11 + 4 = 15, so x = 15/3 = 5.', el: '3x = 11 + 4 = 15, άρα x = 15/3 = 5.' }
  },
  {
    id: 'math-26',
    category: 'Math',
    difficulty: 'hard',
    question: { en: 'In how many ways can you arrange 4 books on a shelf?', el: 'Με πόσους τρόπους μπορείτε να τοποθετήσετε 4 βιβλία σε ένα ράφι;' },
    options: { en: ['16', '12', '24', '8'], el: ['16', '12', '24', '8'] },
    correct: { en: '24', el: '24' },
    explanation: { en: '4! = 4×3×2×1 = 24 permutations.', el: '4! = 4×3×2×1 = 24 μεταθέσεις.' }
  },

  {
    id: 'geom-8',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'How many sides does a triangle have?', el: 'Πόσες πλευρές έχει ένα τρίγωνο;' },
    options: { en: ['2', '3', '4', '5'], el: ['2', '3', '4', '5'] },
    correct: { en: '3', el: '3' },
    explanation: { en: 'Triangle means "three angles" and has 3 sides.', el: 'Το τρίγωνο σημαίνει «τρεις γωνίες» και έχει 3 πλευρές.' }
  },
  {
    id: 'geom-9',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'What is the circumference of a circle with radius 7? (π ≈ 3.14)', el: 'Ποια είναι η περιφέρεια κύκλου με ακτίνα 7; (π ≈ 3,14)' },
    options: { en: ['21.98', '43.96', '153.86', '14'], el: ['21,98', '43,96', '153,86', '14'] },
    correct: { en: '43.96', el: '43,96' },
    explanation: { en: 'C = 2πr = 2 × 3.14 × 7 = 43.96.', el: 'Π = 2πr = 2 × 3,14 × 7 = 43,96.' }
  },
  {
    id: 'geom-10',
    category: 'Geometry',
    difficulty: 'hard',
    question: { en: 'How many edges does a cube have?', el: 'Πόσες ακμές έχει ένας κύβος;' },
    options: { en: ['6', '8', '12', '10'], el: ['6', '8', '12', '10'] },
    correct: { en: '12', el: '12' },
    explanation: { en: 'A cube has 12 edges—four around each of the top and bottom faces, plus four vertical.', el: 'Ένας κύβος έχει 12 ακμές.' }
  },
  {
    id: 'geom-11',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'What is the area of a rectangle with length 8 and width 5?', el: 'Ποιο είναι το εμβαδόν ορθογωνίου με μήκος 8 και πλάτος 5;' },
    options: { en: ['26', '40', '13', '20'], el: ['26', '40', '13', '20'] },
    correct: { en: '40', el: '40' },
    explanation: { en: 'Area = length × width = 8 × 5 = 40.', el: 'Εμβαδόν = μήκος × πλάτος = 8 × 5 = 40.' }
  },
  {
    id: 'geom-12',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'In a right triangle with legs 3 and 4, what is the hypotenuse?', el: 'Σε ορθογώνιο τρίγωνο με κάθετες 3 και 4, πόσο είναι η υποτείνουσα;' },
    options: { en: ['5', '6', '7', '√7'], el: ['5', '6', '7', '√7'] },
    correct: { en: '5', el: '5' },
    explanation: { en: 'By Pythagorean theorem: 3² + 4² = 9 + 16 = 25 = 5².', el: 'Πυθαγόρειο: 3² + 4² = 9 + 16 = 25 = 5².' }
  },
  {
    id: 'geom-13',
    category: 'Geometry',
    difficulty: 'hard',
    question: { en: 'What is the sum of exterior angles of any convex polygon?', el: 'Πόσο είναι το άθροισμα των εξωτερικών γωνιών κάθε κυρτού πολυγώνου;' },
    options: { en: ['180°', '360°', '540°', 'Depends on sides'], el: ['180°', '360°', '540°', 'Εξαρτάται από τις πλευρές'] },
    correct: { en: '360°', el: '360°' },
    explanation: { en: 'The sum of exterior angles of any convex polygon is always 360°.', el: 'Το άθροισμα των εξωτερικών γωνιών κάθε κυρτού πολυγώνου είναι πάντα 360°.' }
  },
  {
    id: 'geom-14',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'How many vertices does a square have?', el: 'Πόσες κορυφές έχει ένα τετράγωνο;' },
    options: { en: ['2', '3', '4', '5'], el: ['2', '3', '4', '5'] },
    correct: { en: '4', el: '4' },
    explanation: { en: 'A square has 4 corners (vertices).', el: 'Ένα τετράγωνο έχει 4 κορυφές.' }
  },
  {
    id: 'geom-15',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'What is the volume of a cube with side length 4?', el: 'Ποιος είναι ο όγκος κύβου με ακμή 4;' },
    options: { en: ['12', '16', '64', '48'], el: ['12', '16', '64', '48'] },
    correct: { en: '64', el: '64' },
    explanation: { en: 'Volume = side³ = 4³ = 64.', el: 'Όγκος = ακμή³ = 4³ = 64.' }
  },
  {
    id: 'geom-16',
    category: 'Geometry',
    difficulty: 'hard',
    question: { en: 'How many faces does an icosahedron have?', el: 'Πόσες έδρες έχει ένα εικοσάεδρο;' },
    options: { en: ['12', '16', '20', '24'], el: ['12', '16', '20', '24'] },
    correct: { en: '20', el: '20' },
    explanation: { en: 'Icosahedron means "twenty faces"—it has 20 triangular faces.', el: 'Το εικοσάεδρο σημαίνει «είκοσι έδρες»—έχει 20 τριγωνικές έδρες.' }
  },
  {
    id: 'geom-17',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'What shape has all sides equal and all angles 90°?', el: 'Ποιο σχήμα έχει όλες τις πλευρές ίσες και όλες τις γωνίες 90°;' },
    options: { en: ['Rectangle', 'Rhombus', 'Square', 'Parallelogram'], el: ['Ορθογώνιο', 'Ρόμβος', 'Τετράγωνο', 'Παραλληλόγραμμο'] },
    correct: { en: 'Square', el: 'Τετράγωνο' },
    explanation: { en: 'A square has 4 equal sides and 4 right angles.', el: 'Το τετράγωνο έχει 4 ίσες πλευρές και 4 ορθές γωνίες.' }
  },
  {
    id: 'geom-18',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'What is the area of a triangle with base 10 and height 6?', el: 'Ποιο είναι το εμβαδόν τριγώνου με βάση 10 και ύψος 6;' },
    options: { en: ['16', '30', '60', '32'], el: ['16', '30', '60', '32'] },
    correct: { en: '30', el: '30' },
    explanation: { en: 'Area = (1/2) × base × height = 0.5 × 10 × 6 = 30.', el: 'Εμβαδόν = (1/2) × βάση × ύψος = 0,5 × 10 × 6 = 30.' }
  },
  {
    id: 'geom-19',
    category: 'Geometry',
    difficulty: 'hard',
    question: { en: 'Two similar triangles have corresponding sides in ratio 2:3. If the smaller area is 12, what is the larger?', el: 'Δύο όμοια τρίγωνα έχουν λόγο πλευρών 2:3. Αν το μικρότερο εμβαδόν είναι 12, πόσο είναι το μεγαλύτερο;' },
    options: { en: ['18', '24', '27', '36'], el: ['18', '24', '27', '36'] },
    correct: { en: '27', el: '27' },
    explanation: { en: 'Area scales as the square of the ratio. (3/2)² = 9/4. 12 × (9/4) = 27.', el: 'Το εμβαδόν μεταβάλλεται με το τετράγωνο του λόγου. (3/2)² = 9/4. 12 × (9/4) = 27.' }
  },
  {
    id: 'geom-20',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'How many degrees are in a straight angle?', el: 'Πόσες μοίρες έχει μια ευθεία γωνία;' },
    options: { en: ['90°', '120°', '180°', '360°'], el: ['90°', '120°', '180°', '360°'] },
    correct: { en: '180°', el: '180°' },
    explanation: { en: 'A straight angle forms a line and equals 180°.', el: 'Μια ευθεία γωνία σχηματίζει ευθεία και ισούται με 180°.' }
  },
  {
    id: 'geom-21',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'What is the perimeter of a rectangle 12 by 8?', el: 'Ποια είναι η περίμετρος ορθογωνίου 12 επί 8;' },
    options: { en: ['96', '40', '20', '48'], el: ['96', '40', '20', '48'] },
    correct: { en: '40', el: '40' },
    explanation: { en: 'Perimeter = 2(length + width) = 2(12 + 8) = 40.', el: 'Περίμετρος = 2(μήκος + πλάτος) = 2(12 + 8) = 40.' }
  },
  {
    id: 'geom-22',
    category: 'Geometry',
    difficulty: 'hard',
    question: { en: 'A regular octagon has each interior angle equal to:', el: 'Ένα κανονικό οκτάγωνο έχει κάθε εσωτερική γωνία ίση με:' },
    options: { en: ['120°', '135°', '140°', '150°'], el: ['120°', '135°', '140°', '150°'] },
    correct: { en: '135°', el: '135°' },
    explanation: { en: 'Sum = (8−2)×180° = 1080°. Each angle = 1080°/8 = 135°.', el: 'Άθροισμα = (8−2)×180° = 1080°. Κάθε γωνία = 1080°/8 = 135°.' }
  },
  {
    id: 'geom-23',
    category: 'Geometry',
    difficulty: 'easy',
    question: { en: 'What is the diameter of a circle with radius 6?', el: 'Ποια είναι η διάμετρος κύκλου με ακτίνα 6;' },
    options: { en: ['3', '6', '12', '36'], el: ['3', '6', '12', '36'] },
    correct: { en: '12', el: '12' },
    explanation: { en: 'Diameter = 2 × radius = 2 × 6 = 12.', el: 'Διάμετρος = 2 × ακτίνα = 2 × 6 = 12.' }
  },
  {
    id: 'geom-24',
    category: 'Geometry',
    difficulty: 'medium',
    question: { en: 'How many sides does an octagon have?', el: 'Πόσες πλευρές έχει ένα οκτάγωνο;' },
    options: { en: ['6', '7', '8', '9'], el: ['6', '7', '8', '9'] },
    correct: { en: '8', el: '8' },
    explanation: { en: 'Octagon = "octa" (eight) + "gon" (angle). It has 8 sides.', el: 'Το οκτάγωνο προέρχεται από «οκτώ» και «γωνία». Έχει 8 πλευρές.' }
  },

  {
    id: 'logic-9',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'What comes next: 10, 20, 30, 40, ?', el: 'Τι ακολουθεί: 10, 20, 30, 40, ;' },
    options: { en: ['45', '50', '55', '60'], el: ['45', '50', '55', '60'] },
    correct: { en: '50', el: '50' },
    explanation: { en: 'Add 10 each time: 40 + 10 = 50.', el: 'Προσθέτουμε 10 κάθε φορά: 40 + 10 = 50.' }
  },
  {
    id: 'logic-10',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'All cats are animals. Fluffy is a cat. Therefore:', el: 'Όλες οι γάτες είναι ζώα. Η Φλάφι είναι γάτα. Επομένως:' },
    options: {
      en: ['Fluffy might be an animal', 'Fluffy is an animal', 'Fluffy is not an animal', 'Cannot conclude'],
      el: ['Η Φλάφι μπορεί να είναι ζώο', 'Η Φλάφι είναι ζώο', 'Η Φλάφι δεν είναι ζώο', 'Αδύνατο συμπέρασμα']
    },
    correct: { en: 'Fluffy is an animal', el: 'Η Φλάφι είναι ζώο' },
    explanation: { en: 'Valid syllogism: All A are B, X is A, therefore X is B.', el: 'Έγκυρος συλλογισμός: Όλα τα Α είναι Β, το Χ είναι Α, άρα το Χ είναι Β.' }
  },
  {
    id: 'logic-11',
    category: 'Logic',
    difficulty: 'hard',
    question: { en: 'You have 3 boxes: one has 2 gold coins, one has 2 silver, one has 1 of each. You pick a gold coin from a random box. What is the probability the other coin in that box is gold?', el: 'Έχετε 3 κουτιά: ένα με 2 χρυσά, ένα με 2 ασημένια, ένα με 1 από κάθε. Παίρνετε χρυσό από τυχαίο κουτί. Ποια η πιθανότητα το άλλο νόμισμα στο ίδιο κουτί να είναι χρυσό;' },
    options: { en: ['1/2', '1/3', '2/3', '1/4'], el: ['1/2', '1/3', '2/3', '1/4'] },
    correct: { en: '2/3', el: '2/3' },
    explanation: { en: 'You picked from either the GG or GS box with equal chance. Given gold, 2 of 3 golds come from GG. P = 2/3.', el: 'Πήρατε από ΧΧ ή ΧΑ με ίση πιθανότητα. Δεδομένου του χρυσού, 2 από 3 χρυσά έρχονται από ΧΧ. P = 2/3.' }
  },
  {
    id: 'logic-12',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'Which is the odd one out: circle, square, triangle, rectangle?', el: 'Ποιο ξεχωρίζει: κύκλος, τετράγωνο, τρίγωνο, ορθογώνιο;' },
    options: { en: ['Circle', 'Square', 'Triangle', 'Rectangle'], el: ['Κύκλος', 'Τετράγωνο', 'Τρίγωνο', 'Ορθογώνιο'] },
    correct: { en: 'Circle', el: 'Κύκλος' },
    explanation: { en: 'Circle has no straight sides; the others are polygons.', el: 'Ο κύκλος δεν έχει ευθείες πλευρές· τα άλλα είναι πολύγωνα.' }
  },
  {
    id: 'logic-13',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'What comes next: 1, 3, 6, 10, 15, ?', el: 'Τι ακολουθεί: 1, 3, 6, 10, 15, ;' },
    options: { en: ['18', '20', '21', '22'], el: ['18', '20', '21', '22'] },
    correct: { en: '21', el: '21' },
    explanation: { en: 'Triangular numbers: +2, +3, +4, +5, +6. 15 + 6 = 21.', el: 'Τριγωνικοί αριθμοί: +2, +3, +4, +5, +6. 15 + 6 = 21.' }
  },
  {
    id: 'logic-14',
    category: 'Logic',
    difficulty: 'hard',
    question: { en: '"If it rains, the ground is wet. The ground is wet." Can we conclude it rained?', el: '"Αν βρέχει, το έδαφος είναι υγρό. Το έδαφος είναι υγρό." Μπορούμε να συμπεράνουμε ότι έβρεξε;' },
    options: {
      en: ['Yes, necessarily', 'No, not necessarily', 'Yes, probably', 'Impossible to say'],
      el: ['Ναι, αναγκαστικά', 'Όχι, όχι αναγκαστικά', 'Ναι, πιθανότατα', 'Αδύνατο να πούμε']
    },
    correct: { en: 'No, not necessarily', el: 'Όχι, όχι αναγκαστικά' },
    explanation: { en: 'Affirming the consequent is a fallacy. The ground could be wet from sprinklers, etc.', el: 'Η επιβεβαίωση του συνεπακόλουθου είναι πλάνη. Το έδαφος μπορεί να είναι υγρό από ποτίστρες κλπ.' }
  },
  {
    id: 'logic-15',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'True or false: If A implies B, and B is true, then A must be true.', el: 'Σωστό ή λάθος: Αν το Α συνεπάγεται το Β και το Β είναι αληθές, τότε το Α πρέπει να είναι αληθές.' },
    options: { en: ['True', 'False', 'Sometimes', 'Only if A=B'], el: ['Σωστό', 'Λάθος', 'Μερικές φορές', 'Μόνο αν Α=Β'] },
    correct: { en: 'False', el: 'Λάθος' },
    explanation: { en: 'B can be true for other reasons. This is the "affirming the consequent" fallacy.', el: 'Το Β μπορεί να είναι αληθές για άλλους λόγους. Είναι η πλάνη «επιβεβαίωση συνεπακόλουθου».' }
  },
  {
    id: 'logic-16',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'What comes next: 1, 2, 4, 8, 16, ?', el: 'Τι ακολουθεί: 1, 2, 4, 8, 16, ;' },
    options: { en: ['24', '28', '32', '36'], el: ['24', '28', '32', '36'] },
    correct: { en: '32', el: '32' },
    explanation: { en: 'Powers of 2: 2⁰, 2¹, 2², 2³, 2⁴. Next is 2⁵ = 32.', el: 'Δυνάμεις του 2: 2⁰, 2¹, 2², 2³, 2⁴. Επόμενο είναι 2⁵ = 32.' }
  },
  {
    id: 'logic-17',
    category: 'Logic',
    difficulty: 'hard',
    question: { en: 'A farmer has 17 sheep. All but 9 die. How many remain?', el: 'Ένας αγρότης έχει 17 πρόβατα. Όλα πεθαίνουν εκτός από 9. Πόσα μένουν;' },
    options: { en: ['8', '9', '17', '26'], el: ['8', '9', '17', '26'] },
    correct: { en: '9', el: '9' },
    explanation: { en: '"All but 9 die" means 9 survive. The rest perish.', el: '"Όλα πεθαίνουν εκτός από 9" σημαίνει ότι 9 επιβιώνουν.' }
  },
  {
    id: 'logic-18',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'If today is Monday, what day is it in 6 days?', el: 'Αν σήμερα είναι Δευτέρα, ποια μέρα είναι σε 6 ημέρες;' },
    options: { en: ['Friday', 'Saturday', 'Sunday', 'Monday'], el: ['Παρασκευή', 'Σάββατο', 'Κυριακή', 'Δευτέρα'] },
    correct: { en: 'Sunday', el: 'Κυριακή' },
    explanation: { en: 'Mon + 6 = Sun (Mon, Tue, Wed, Thu, Fri, Sat, Sun).', el: 'Δευ + 6 = Κυρ.' }
  },
  {
    id: 'logic-19',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'X is older than Y. Z is younger than X. Who could be the oldest?', el: 'Ο Χ είναι μεγαλύτερος από τον Ψ. Ο Ζ είναι μικρότερος από τον Χ. Ποιος μπορεί να είναι ο μεγαλύτερος;' },
    options: { en: ['Only X', 'Only Y', 'X or Y', 'Cannot determine'], el: ['Μόνο Χ', 'Μόνο Ψ', 'Χ ή Ψ', 'Αδύνατον να οριστεί'] },
    correct: { en: 'Only X', el: 'Μόνο Χ' },
    explanation: { en: 'X > Y and Z < X, so X is greater than both. X is the oldest.', el: 'Χ > Ψ και Ζ < Χ, άρα ο Χ είναι μεγαλύτερος και από τους δύο.' }
  },
  {
    id: 'logic-20',
    category: 'Logic',
    difficulty: 'hard',
    question: { en: 'What number should replace the ? in: 2, 6, 12, 20, 30, ?', el: 'Ποιος αριθμός αντικαθιστά το ; σε: 2, 6, 12, 20, 30, ;' },
    options: { en: ['38', '40', '42', '44'], el: ['38', '40', '42', '44'] },
    correct: { en: '42', el: '42' },
    explanation: { en: '2=1×2, 6=2×3, 12=3×4, 20=4×5, 30=5×6. Next: 6×7=42.', el: '2=1×2, 6=2×3, 12=3×4, 20=4×5, 30=5×6. Επόμενο: 6×7=42.' }
  },
  {
    id: 'logic-21',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'Which number is prime: 27, 29, 33, 35?', el: 'Ποιος αριθμός είναι πρώτος: 27, 29, 33, 35;' },
    options: { en: ['27', '29', '33', '35'], el: ['27', '29', '33', '35'] },
    correct: { en: '29', el: '29' },
    explanation: { en: '29 has no divisors other than 1 and itself. 27=3³, 33=3×11, 35=5×7.', el: 'Το 29 δεν έχει διαιρέτες εκτός από 1 και τον εαυτό του.' }
  },
  {
    id: 'logic-22',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'Complete: 5, 11, 17, 23, 29, ?', el: 'Συμπληρώστε: 5, 11, 17, 23, 29, ;' },
    options: { en: ['33', '34', '35', '36'], el: ['33', '34', '35', '36'] },
    correct: { en: '35', el: '35' },
    explanation: { en: 'Add 6 each time: 29 + 6 = 35.', el: 'Προσθέτουμε 6 κάθε φορά: 29 + 6 = 35.' }
  },
  {
    id: 'logic-23',
    category: 'Logic',
    difficulty: 'hard',
    question: { en: 'A bat and ball cost €1.10 total. The bat costs €1 more than the ball. How much does the ball cost?', el: 'Ρόπαλο και μπάλα κοστίζουν συνολικά €1,10. Το ρόπαλο κοστίζει €1 περισσότερο από τη μπάλα. Πόσο κοστίζει η μπάλα;' },
    options: { en: ['€0.05', '€0.10', '€0.15', '€0.20'], el: ['€0,05', '€0,10', '€0,15', '€0,20'] },
    correct: { en: '€0.05', el: '€0,05' },
    explanation: { en: 'Ball = x, Bat = x+1. 2x+1 = 1.10, so x = 0.05.', el: 'Μπάλα = x, Ρόπαλο = x+1. 2x+1 = 1,10, άρα x = 0,05.' }
  },
  {
    id: 'logic-24',
    category: 'Logic',
    difficulty: 'easy',
    question: { en: 'What comes next: A, C, E, G, ?', el: 'Τι ακολουθεί: A, C, E, G, ;' },
    options: { en: ['H', 'I', 'J', 'K'], el: ['H', 'I', 'J', 'K'] },
    correct: { en: 'I', el: 'I' },
    explanation: { en: 'Skip one letter each time: A, (B), C, (D), E, (F), G, (H), I.', el: 'Παραλείπουμε ένα γράμμα κάθε φορά.' }
  },
  {
    id: 'logic-25',
    category: 'Logic',
    difficulty: 'medium',
    question: { en: 'If NOVEMBER is coded as 12345678, what number represents M?', el: 'Αν το NOVEMBER κωδικοποιείται ως 12345678, ποιος αριθμός αντιπροσωπεύει το M;' },
    options: { en: ['3', '4', '5', '6'], el: ['3', '4', '5', '6'] },
    correct: { en: '4', el: '4' },
    explanation: { en: 'N=1,O=2,V=3,M=4,E=5,B=6,E=7,R=8. Each letter gets its position.', el: 'Κάθε γράμμα παίρνει τη θέση του στη λέξη.' }
  },
  {
    id: 'logic-26',
    category: 'Logic',
    difficulty: 'hard',
    question: { en: 'You are in a room with 3 switches. One controls a light in another room. You can only check once. How do you determine which switch?', el: 'Είστε σε δωμάτιο με 3 διακόπτες. Ένας ελέγχει φως σε άλλο δωμάτιο. Μπορείτε να ελέγξετε μία φορά. Πώς διαπιστώνετε ποιος;' },
    options: {
      en: ['Turn all on, check', 'Turn one on 10 min, one on 1 min, check', 'Turn two on, check', 'Cannot determine'],
      el: ['Ανοίξτε όλα, ελέγξτε', 'Ανοίξτε ένα 10 λεπτά, ένα 1 λεπτό, ελέγξτε', 'Ανοίξτε δύο, ελέγξτε', 'Αδύνατον']
    },
    correct: { en: 'Turn one on 10 min, one on 1 min, check', el: 'Ανοίξτε ένα 10 λεπτά, ένα 1 λεπτό, ελέγξτε' },
    explanation: { en: 'Switch A on 10 min, B on 1 min, C off. Light on + hot = A. On + warm = B. Off or cold = C.', el: 'Διακόπτης Α 10 λεπτά, Β 1 λεπτό, Γ κλειστός. Φως αναμμένο + ζεστό = Α. Ζεστό = Β. Σβηστό ή κρύο = Γ.' }
  },

  {
    id: 'vocab-8',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What does "benevolent" mean?', el: 'Τι σημαίνει «ευγενής / φιλάνθρωπος»;' },
    options: { en: ['Evil', 'Kind', 'Strict', 'Silent'], el: ['Κακός', 'Καλόκαρδος', 'Αυστηρός', 'Σιωπηλός'] },
    correct: { en: 'Kind', el: 'Καλόκαρδος' },
    explanation: { en: 'Benevolent (from Latin bene "well" + volens "wishing") means well-meaning and kind.', el: 'Το benevolent σημαίνει καλοπροαίρετο και καλόκαρδο.' }
  },
  {
    id: 'vocab-9',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'Which word means "excessive concern with minor details"?', el: 'Ποια λέξη σημαίνει «υπερβολική ενασχόληση με μικρές λεπτομέρειες»;' },
    options: { en: ['Negligence', 'Pedantry', 'Generosity', 'Simplicity'], el: ['Αμέλεια', 'Σχολαστικότητα', 'Γενναιοδωρία', 'Απλότητα'] },
    correct: { en: 'Pedantry', el: 'Σχολαστικότητα' },
    explanation: { en: 'Pedantry is excessive attention to formal rules and trivial details.', el: 'Η σχολαστικότητα είναι υπερβολική προσοχή σε τυπικούς κανόνες και ασήμαντες λεπτομέρειες.' }
  },
  {
    id: 'vocab-10',
    category: 'Vocabulary',
    difficulty: 'hard',
    question: { en: 'What does "sycophant" mean?', el: 'Τι σημαίνει «κολακευτικός»;' },
    options: { en: ['Critic', 'Flatterer', 'Leader', 'Scholar'], el: ['Κριτικός', 'Κολακευτής', 'Ηγέτης', 'Λόγιος'] },
    correct: { en: 'Flatterer', el: 'Κολακευτής' },
    explanation: { en: 'A sycophant is someone who flatters people in power to gain favor.', el: 'Ο κολακευτικός είναι εκείνος που κολακεύει ανθρώπους με εξουσία για να κερδίσει εύνοια.' }
  },
  {
    id: 'vocab-11',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What is the antonym of "temporary"?', el: 'Ποιο είναι το αντίθετο του «προσωρινός»;' },
    options: { en: ['Brief', 'Permanent', 'Short', 'Quick'], el: ['Σύντομος', 'Μόνιμος', 'Κοντός', 'Γρήγορος'] },
    correct: { en: 'Permanent', el: 'Μόνιμος' },
    explanation: { en: 'Temporary means lasting for a limited time. Permanent means lasting indefinitely.', el: 'Το temporary σημαίνει προσωρινό. Το permanent σημαίνει μόνιμο.' }
  },
  {
    id: 'vocab-12',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What does "paradigm" mean?', el: 'Τι σημαίνει «πρότυπο / παράδειγμα»;' },
    options: { en: ['Mistake', 'Model or pattern', 'Paradox', 'Parade'], el: ['Λάθος', 'Πρότυπο ή μοντέλο', 'Παράδοξο', 'Παρέλαση'] },
    correct: { en: 'Model or pattern', el: 'Πρότυπο ή μοντέλο' },
    explanation: { en: 'A paradigm is a typical example or pattern that serves as a model.', el: 'Το πρότυπο είναι τυπικό παράδειγμα ή μοντέλο αναφοράς.' }
  },
  {
    id: 'vocab-13',
    category: 'Vocabulary',
    difficulty: 'hard',
    question: { en: 'Which word means "fear of long words"?', el: 'Ποια λέξη σημαίνει «φόβος για μεγάλες λέξεις»;' },
    options: { en: ['Hippopotomonstrosesquipedaliophobia', 'Claustrophobia', 'Agoraphobia', 'Arachnophobia'], el: ['Φόβος μεγάλων λέξεων', 'Κλειστοφοβία', 'Αγοραφοβία', 'Αραχνοφοβία'] },
    correct: { en: 'Hippopotomonstrosesquipedaliophobia', el: 'Φόβος μεγάλων λέξεων' },
    explanation: { en: 'Hippopotomonstrosesquipedaliophobia is ironically the fear of long words.', el: 'Είναι ειρωνικά ο φόβος για τις μακριές λέξεις.' }
  },
  {
    id: 'vocab-14',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What does "ambiguous" mean?', el: 'Τι σημαίνει «αμφίσημος»;' },
    options: { en: ['Clear', 'Unclear or having multiple meanings', 'Obvious', 'Simple'], el: ['Σαφής', 'Αμφίσημος ή πολλαπλών σημασιών', 'Προφανής', 'Απλός'] },
    correct: { en: 'Unclear or having multiple meanings', el: 'Αμφίσημος ή πολλαπλών σημασιών' },
    explanation: { en: 'Ambiguous means open to more than one interpretation.', el: 'Το αμφίσημο σημαίνει που δέχεται περισσότερες από μία ερμηνείες.' }
  },
  {
    id: 'vocab-15',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What is a "euphemism"?', el: 'Τι είναι μια «ευφημισμός»;' },
    options: {
      en: ['A harsh insult', 'A mild substitute for harsh term', 'A scientific term', 'A foreign word'],
      el: ['Δριμύ προσβολή', 'Ηπιότερη αντικατάσταση για σκληρό όρο', 'Επιστημονικός όρος', 'Ξένη λέξη']
    },
    correct: { en: 'A mild substitute for harsh term', el: 'Ηπιότερη αντικατάσταση για σκληρό όρο' },
    explanation: { en: 'A euphemism softens harsh or unpleasant expressions, e.g., "passed away" for "died".', el: 'Ο ευφημισμός μετριάζει σκληρές εκφράσεις, π.χ. «έφυγε» αντί «πέθανε».' }
  },
  {
    id: 'vocab-16',
    category: 'Vocabulary',
    difficulty: 'hard',
    question: { en: 'What does "obfuscate" mean?', el: 'Τι σημαίνει «θολώνω / συγχέω»;' },
    options: { en: ['Clarify', 'Confuse or obscure', 'Observe', 'Obey'], el: ['Διασαφηνίζω', 'Συγχέω ή θολώνω', 'Παρατηρώ', 'Υπακούω'] },
    correct: { en: 'Confuse or obscure', el: 'Συγχέω ή θολώνω' },
    explanation: { en: 'To obfuscate is to make something unclear or difficult to understand.', el: 'Το obfuscate σημαίνει να κάνεις κάτι ασαφή ή δύσκολο να γίνει κατανοητό.' }
  },
  {
    id: 'vocab-17',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What is the synonym of "magnificent"?', el: 'Ποιο είναι το συνώνυμο του «μεγαλοπρεπές»;' },
    options: { en: ['Small', 'Splendid', 'Ugly', 'Plain'], el: ['Μικρό', 'Υπέροχο', 'Άσχημο', 'Απλό'] },
    correct: { en: 'Splendid', el: 'Υπέροχο' },
    explanation: { en: 'Magnificent and splendid both mean impressively beautiful or grand.', el: 'Το magnificent και το splendid σημαίνουν εντυπωσιακά όμορφο ή μεγαλοπρεπές.' }
  },
  {
    id: 'vocab-18',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What does "resilient" mean?', el: 'Τι σημαίνει «ανθεκτικός / ευέλικτος»;' },
    options: { en: ['Fragile', 'Able to recover quickly', 'Rigid', 'Resistant to change'], el: ['Εύθραυστο', 'Ικανό να ανακάμπτει γρήγορα', 'Άκαμπτο', 'Ανθεκτικό στην αλλαγή'] },
    correct: { en: 'Able to recover quickly', el: 'Ικανό να ανακάμπτει γρήγορα' },
    explanation: { en: 'Resilient means able to withstand or recover quickly from difficulty.', el: 'Το resilient σημαίνει ικανό να αντέχει ή να ανακάμπτει γρήγορα από δυσκολία.' }
  },
  {
    id: 'vocab-19',
    category: 'Vocabulary',
    difficulty: 'hard',
    question: { en: 'Which word means "existing from the beginning of time"?', el: 'Ποια λέξη σημαίνει «υπάρχων από την αρχή του χρόνου»;' },
    options: { en: ['Contemporary', 'Eternal', 'Primeval', 'Modern'], el: ['Σύγχρονο', 'Αιώνιο', 'Πρωτόγονο', 'Νεοτερικό'] },
    correct: { en: 'Primeval', el: 'Πρωτόγονο' },
    explanation: { en: 'Primeval means of the earliest age; existing from the beginning.', el: 'Το primeval σημαίνει της αρχαιότερης εποχής· που υπάρχει από την αρχή.' }
  },
  {
    id: 'vocab-20',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What is the antonym of "ancient"?', el: 'Ποιο είναι το αντίθετο του «αρχαίος»;' },
    options: { en: ['Old', 'Modern', 'Medieval', 'Classical'], el: ['Παλιό', 'Σύγχρονο', 'Μεσαιωνικό', 'Κλασικό'] },
    correct: { en: 'Modern', el: 'Σύγχρονο' },
    explanation: { en: 'Ancient means very old. Modern means relating to the present or recent times.', el: 'Το αρχαίο σημαίνει πολύ παλιό. Το σύγχρονο σημαίνει σχετικό με το παρόν ή τις πρόσφατες εποχές.' }
  },
  {
    id: 'vocab-21',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What does "ubiquitous" mean?', el: 'Τι σημαίνει «πανταχού παρών»;' },
    options: { en: ['Rare', 'Present everywhere', 'Invisible', 'Unique'], el: ['Σπάνιος', 'Πανταχού παρών', 'Αόρατος', 'Μοναδικός'] },
    correct: { en: 'Present everywhere', el: 'Πανταχού παρών' },
    explanation: { en: 'Ubiquitous means present, appearing, or found everywhere.', el: 'Το ubiquitous σημαίνει παρόν, εμφανιζόμενο ή ευρισκόμενο παντού.' }
  },
  {
    id: 'vocab-22',
    category: 'Vocabulary',
    difficulty: 'hard',
    question: { en: 'What does "superfluous" mean?', el: 'Τι σημαίνει «περιττός»;' },
    options: { en: ['Necessary', 'Excessive or unnecessary', 'Superficial', 'Superior'], el: ['Απαραίτητο', 'Υπερβολικό ή περιττό', 'Επιφανειακό', 'Υπέρτερο'] },
    correct: { en: 'Excessive or unnecessary', el: 'Υπερβολικό ή περιττό' },
    explanation: { en: 'Superfluous means more than needed; unnecessary.', el: 'Το superfluous σημαίνει περισσότερο από τα απαραίτητα· περιττό.' }
  },
  {
    id: 'vocab-23',
    category: 'Vocabulary',
    difficulty: 'easy',
    question: { en: 'What does "predict" mean?', el: 'Τι σημαίνει «προβλέπω»;' },
    options: { en: ['Forget', 'Foretell or foresee', 'Prevent', 'Prefer'], el: ['Ξεχνάω', 'Προλέγω ή προβλέπω', 'Αποτρέπω', 'Προτιμώ'] },
    correct: { en: 'Foretell or foresee', el: 'Προλέγω ή προβλέπω' },
    explanation: { en: 'To predict is to say or estimate that something will happen in the future.', el: 'Να προβλέπεις είναι να λες ή να εκτιμάς ότι κάτι θα συμβεί στο μέλλον.' }
  },
  {
    id: 'vocab-24',
    category: 'Vocabulary',
    difficulty: 'medium',
    question: { en: 'What is an "oxymoron"?', el: 'Τι είναι ένα «οξύμωρο»;' },
    options: {
      en: ['A logical argument', 'Contradictory terms combined', 'A type of poem', 'A mathematical proof'],
      el: ['Λογικό επιχείρημα', 'Συνδυασμός αντιθετικών όρων', 'Είδος ποιήματος', 'Μαθηματική απόδειξη']
    },
    correct: { en: 'Contradictory terms combined', el: 'Συνδυασμός αντιθετικών όρων' },
    explanation: { en: 'An oxymoron combines contradictory terms, e.g., "jumbo shrimp" or "deafening silence".', el: 'Το οξύμωρο συνδυάζει αντιφατικούς όρους, π.χ. «βαθιά σιωπή».' }
  }
];
