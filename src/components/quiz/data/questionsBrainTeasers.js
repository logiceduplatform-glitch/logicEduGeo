export const questionsBrainTeasers = [
  // === Riddles (5) ===
  {
    id: 'riddle-1',
    category: 'Riddles',
    difficulty: 'easy',
    question: {
      en: 'I have cities, but no houses. I have mountains, but no trees. What am I?',
      el: 'Έχω πόλεις, αλλά όχι σπίτια. Έχω βουνά, αλλά όχι δέντρα. Τι είμαι;'
    },
    options: { en: ['A globe', 'A map', 'A dream'], el: ['Μια υδρόγειος', 'Ένας χάρτης', 'Ένα όνειρο'] },
    correct: { en: 'A map', el: 'Ένας χάρτης' },
    explanation: {
      en: 'A map depicts cities, mountains, and terrain as symbols and labels, but it is a flat representation—it has no actual houses, trees, or three-dimensional features.',
      el: 'Ο χάρτης απεικονίζει πόλεις, βουνά και έδαφος με σύμβολα και ετικέτες, αλλά είναι επίπεδη αναπαράσταση—δεν έχει πραγματικά σπίτια, δέντρα ή τρισδιάστατα στοιχεία.'
    }
  },
  {
    id: 'riddle-2',
    category: 'Riddles',
    difficulty: 'medium',
    question: {
      en: 'The more you take, the more you leave behind. What are they?',
      el: 'Όσο περισσότερα παίρνεις, τόσα περισσότερα αφήνεις πίσω. Τι είναι;'
    },
    options: { en: ['Footsteps', 'Memories', 'Breaths'], el: ['Βήματα', 'Αναμνήσεις', 'Ανάσες'] },
    correct: { en: 'Footsteps', el: 'Βήματα' },
    explanation: {
      en: 'When you walk, you "take" steps forward; each step you take leaves a footprint behind you. The more you walk, the more footsteps you leave.',
      el: 'Όταν περπατάς, "παίρνεις" βήματα μπροστά· κάθε βήμα αφήνει ένα αποτύπωμα πίσω σου. Όσο περισσότερο περπατάς, τόσα περισσότερα βήματα αφήνεις.'
    }
  },
  {
    id: 'riddle-3',
    category: 'Riddles',
    difficulty: 'hard',
    question: {
      en: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
      el: 'Μιλάω χωρίς στόμα και ακούω χωρίς αυτιά. Δεν έχω σώμα, αλλά ζωντανεύω με τον αέρα. Τι είμαι;'
    },
    options: { en: ['An echo', 'A shadow', 'A whisper'], el: ['Μια ηχώ', 'Μια σκιά', 'Ένα ψίθυρο'] },
    correct: { en: 'An echo', el: 'Μια ηχώ' },
    explanation: {
      en: 'An echo is reflected sound: it "speaks" by bouncing your voice back, "hears" by receiving that sound, has no physical form, and needs air to carry sound waves.',
      el: 'Η ηχώ είναι ανακλώμενος ήχος· "μιλά" αντανακλώντας τη φωνή σου πίσω, "ακούει" λαμβάνοντας αυτόν τον ήχο, δεν έχει φυσική μορφή και χρειάζεται αέρα για να μεταφέρει τις ηχητικές ακτίνες.'
    }
  },
  {
    id: 'riddle-4',
    category: 'Riddles',
    difficulty: 'easy',
    question: {
      en: 'What has keys but can\'t open locks?',
      el: 'Τι έχει πλήκτρα αλλά δεν ανοίγει κλειδαριές;'
    },
    options: { en: ['A piano', 'A phone', 'A calculator'], el: ['Ένα πιάνο', 'Ένα τηλέφωνο', 'Ένα κομπιουτεράκι'] },
    correct: { en: 'A piano', el: 'Ένα πιάνο' },
    explanation: {
      en: 'A piano has keys (the black and white keys you press to make music), but these are musical keys, not keys that open locks.',
      el: 'Το πιάνο έχει πλήκτρα (τα μαύρα και άσπρα που πατάς για μουσική), αλλά αυτά είναι μουσικά πλήκτρα, όχι κλειδιά για κλειδαριές.'
    }
  },
  {
    id: 'riddle-5',
    category: 'Riddles',
    difficulty: 'medium',
    question: {
      en: 'What can travel around the world while staying in a corner?',
      el: 'Τι μπορεί να ταξιδέψει σε όλο τον κόσμο ενώ μένει σε μια γωνία;'
    },
    options: { en: ['A stamp', 'A spider', 'Wi-Fi'], el: ['Ένα γραμματόσημο', 'Μια αράχνη', 'Wi-Fi'] },
    correct: { en: 'A stamp', el: 'Ένα γραμματόσημο' },
    explanation: {
      en: 'A postage stamp is placed in the corner of an envelope and travels with the mail around the world, yet it remains fixed in that corner.',
      el: 'Το γραμματόσημο τοποθετείται στη γωνία του φακέλου και ταξιδεύει με την αλληλογραφία σε όλο τον κόσμο, ενώ παραμένει στη γωνία του.'
    }
  },

  // === Lateral thinking (5) ===
  {
    id: 'lateral-1',
    category: 'Lateral',
    difficulty: 'medium',
    question: {
      en: 'A man pushes his car to a hotel and tells the owner he\'s bankrupt. Why?',
      el: 'Ένας άνδρας σπρώχνει το αυτοκίνητό του σε ένα ξενοδοχείο και λέει ότι χρεοκόπησε. Γιατί;'
    },
    options: {
      en: ['He ran out of gas', 'He\'s playing Monopoly', 'His car broke down'],
      el: ['Τελείωσε η βενζίνη', 'Παίζει Monopoly', 'Χάλασε το αυτοκίνητο']
    },
    correct: { en: 'He\'s playing Monopoly', el: 'Παίζει Monopoly' },
    explanation: {
      en: 'In the board game Monopoly, players push a car token around the board, land on "Hotel" spaces, and go "bankrupt" when they run out of money—it\'s game play, not real life.',
      el: 'Στο επιτραπέζιο Monopoly, οι παίκτες σπρώχνουν ένα πιόνι αυτοκινήτου στο ταμπλό, προσγειώνονται σε ξενοδοχεία και "χρεοκοπούν" όταν τελειώσουν τα χρήματα—είναι παιχνίδι, όχι πραγματικότητα.'
    }
  },
  {
    id: 'lateral-2',
    category: 'Lateral',
    difficulty: 'hard',
    question: {
      en: 'A woman shoots her husband, holds him under water, then hangs him. They go to dinner. How?',
      el: 'Μια γυναίκα πυροβολεί τον άνδρα της, τον κρατά κάτω από νερό, τον κρεμά. Μετά πάνε για φαγητό. Πώς;'
    },
    options: {
      en: ['She\'s a photographer', 'She\'s a magician', 'It was a dream'],
      el: ['Είναι φωτογράφος', 'Είναι μάγισσα', 'Ήταν όνειρο']
    },
    correct: { en: 'She\'s a photographer', el: 'Είναι φωτογράφος' },
    explanation: {
      en: 'She "shoots" him with a camera, "holds him under water" while developing the photo in chemicals, and "hangs him" to dry. After the photo session, they go to dinner.',
      el: 'Τον "πυροβολεί" με την κάμερα, τον "κρατά κάτω από νερό" κατά το developer της φωτογραφίας και τον "κρεμά" για να στεγνώσει. Μετά την φωτοσέσια πάνε για φαγητό.'
    }
  },
  {
    id: 'lateral-3',
    category: 'Lateral',
    difficulty: 'easy',
    question: {
      en: 'How many months have 28 days?',
      el: 'Πόσοι μήνες έχουν 28 μέρες;'
    },
    options: [1, 6, 12],
    correct: 12,
    explanation: {
      en: 'All 12 months have at least 28 days. February has 28 (or 29), and every other month has 30 or 31. The trick is expecting only February.',
      el: 'Όλοι οι 12 μήνες έχουν τουλάχιστον 28 μέρες. Ο Φεβρουάριος έχει 28 (ή 29), και κάθε άλλος μήνας έχει 30 ή 31. Το κόλπο είναι να περιμένεις μόνο τον Φεβρουάριο.'
    }
  },
  {
    id: 'lateral-4',
    category: 'Lateral',
    difficulty: 'medium',
    question: {
      en: 'What is always coming but never arrives?',
      el: 'Τι έρχεται πάντα αλλά δεν φτάνει ποτέ;'
    },
    options: { en: ['Tomorrow', 'Wind', 'Hope'], el: ['Το αύριο', 'Ο άνεμος', 'Η ελπίδα'] },
    correct: { en: 'Tomorrow', el: 'Το αύριο' },
    explanation: {
      en: 'Tomorrow is always one day away. When it arrives, it becomes today, so tomorrow never actually arrives—it is perpetually in the future.',
      el: 'Το αύριο είναι πάντα μία μέρα μακριά. Όταν φτάσει, γίνεται σήμερα, οπότε το αύριο δεν φτάνει ποτέ—παραμένει για πάντα στο μέλλον.'
    }
  },
  {
    id: 'lateral-5',
    category: 'Lateral',
    difficulty: 'hard',
    question: {
      en: 'A rooster sits on the peak of a barn roof. It lays an egg. Which side does it roll down?',
      el: 'Ένας κόκορας κάθεται στη κορυφή μιας στέγης. Γεννάει ένα αυγό. Από ποια πλευρά πέφτει;'
    },
    options: {
      en: ['Left side', 'Right side', 'Roosters don\'t lay eggs'],
      el: ['Αριστερή', 'Δεξιά', 'Οι κόκοροι δεν γεννούν αυγά']
    },
    correct: { en: 'Roosters don\'t lay eggs', el: 'Οι κόκοροι δεν γεννούν αυγά' },
    explanation: {
      en: 'Roosters are male chickens; only hens (females) lay eggs. The puzzle tricks you into overthinking a question that has no real answer.',
      el: 'Οι κόκορες είναι αρσενικά κοτόπουλα· μόνο οι κότες (θηλυκά) γεννούν αυγά. Το παζλ σε παραπλανά να σκεφτείς υπερβολικά μια ερώτηση χωρίς πραγματική απάντηση.'
    }
  },

  // === Word puzzles (5) ===
  {
    id: 'word-1',
    category: 'WordPuzzle',
    difficulty: 'easy',
    question: { en: 'What 5-letter word becomes shorter when you add two letters to it?', el: 'Ποια αγγλική λέξη 5 γραμμάτων γίνεται μικρότερη (shorter) αν προσθέσεις 2 γράμματα;' },
    options: { en: ['Short', 'Small', 'Tiny'], el: ['Short', 'Small', 'Tiny'] },
    correct: { en: 'Short', el: 'Short' },
    explanation: {
      en: 'Adding "er" to "short" gives "shorter"—a word that means "more short." So the word literally becomes "shorter" in meaning.',
      el: 'Προσθέτοντας "er" στο "short" παίρνεις "shorter"—μία λέξη που σημαίνει "πιο κοντά." Άρα η λέξη κυριολεκτικά γίνεται "shorter" σε νόημα.'
    }
  },
  {
    id: 'word-2',
    category: 'WordPuzzle',
    difficulty: 'medium',
    question: { en: 'Rearrange: EPSLE → a word meaning "asleep"', el: 'Αναγράμματα: ΝΥΠΣΟ → ένα σημείο πάνω στο σώμα' },
    options: { en: ['Sleep', 'Spell', 'Speed'], el: ['Ύπνος', 'Πόνος', 'Νύχτα'] },
    correct: { en: 'Sleep', el: 'Πόνος' },
    explanation: {
      en: 'The letters E-P-S-L-E rearrange to form SLEEP, which means "asleep" or the state of sleeping.',
      el: 'Τα γράμματα Ν-Υ-Π-Σ-Ο αναδιατάσσονται σε Πόνος—ο πόνος είναι αίσθηση σε συγκεκριμένο σημείο του σώματος.'
    }
  },
  {
    id: 'word-3',
    category: 'WordPuzzle',
    difficulty: 'hard',
    question: {
      en: 'What word in the English language is always spelled incorrectly?',
      el: 'Ποια λέξη στα Αγγλικά γράφεται πάντα "incorrectly" (λανθασμένα);'
    },
    options: {
      en: ['Incorrectly', 'Misspelled', 'Wrong'],
      el: ['Incorrectly', 'Misspelled', 'Wrong']
    },
    correct: { en: 'Incorrectly', el: 'Incorrectly' },
    explanation: {
      en: 'The word "incorrectly" is self-referential: when you say it is "spelled incorrectly," you use that exact spelling. The word is spelled I-N-C-O-R-R-E-C-T-L-Y, which is correct—but the phrase creates a paradox.',
      el: 'Η λέξη "incorrectly" είναι αυτοαναφορική: όταν λες ότι γράφεται "incorrectly", χρησιμοποιείς ακριβώς αυτή τη γραφή. Η λέξη γράφεται σωστά, αλλά η φράση δημιουργεί παράδοξο.'
    }
  },
  {
    id: 'word-4',
    category: 'WordPuzzle',
    difficulty: 'easy',
    question: { en: 'Which word contains 26 letters but only has three syllables?', el: 'Ποια λέξη περιέχει 26 γράμματα αλλά έχει μόνο 3 συλλαβές;' },
    options: { en: ['Alphabet', 'Antidisestablishment', 'Encyclopedia'], el: ['Alphabet', 'Antidisestablishment', 'Encyclopedia'] },
    correct: { en: 'Alphabet', el: 'Alphabet' },
    explanation: {
      en: 'The word "alphabet" refers to the set of letters (A–Z), which contains 26 letters. The word itself has only three syllables: al-pha-bet.',
      el: 'Η λέξη "alphabet" αναφέρεται στο αγγλικό αλφάβητο (Α–Ζ) που περιέχει 26 γράμματα. Η ίδια η λέξη έχει μόνο τρεις συλλαβές: al-pha-bet.'
    }
  },
  {
    id: 'word-5',
    category: 'WordPuzzle',
    difficulty: 'medium',
    question: { en: 'Remove one letter from "stone" and you get a musical note. Which letter?', el: 'Αφαίρεσε ένα γράμμα από το "stone" και παίρνεις μουσική νότα. Ποιο γράμμα;' },
    options: { en: ['s', 'e', 'n'], el: ['s', 'e', 'n'] },
    correct: { en: 's', el: 's' },
    explanation: {
      en: 'Removing "s" from "stone" leaves "tone"—a musical term for a single pitch or note.',
      el: 'Αφαιρώντας το "s" από το "stone" μένει "tone"—μουσικός όρος για έναν τόνο ή νότα.'
    }
  },

  // === Riddles (6-10) ===
  {
    id: 'riddle-6',
    category: 'Riddles',
    difficulty: 'easy',
    question: { en: 'What has a head, a tail, but no body?', el: 'Τι έχει κεφάλι, ουρά, αλλά όχι σώμα;' },
    options: { en: ['A coin', 'A snake', 'A river', 'A comet'], el: ['Ένα νόμισμα', 'Ένα φίδι', 'Ένας ποταμός', 'Ένας κομήτης'] },
    correct: { en: 'A coin', el: 'Ένα νόμισμα' },
    explanation: {
      en: 'A coin has a "head" (the side with a face or design) and a "tail" (the reverse side), but no physical body—it\'s flat.',
      el: 'Το νόμισμα έχει "κεφάλι" (η πλευρά με το πρόσωπο ή το σχέδιο) και "ουρά" (η άλλη πλευρά), αλλά όχι σώμα—είναι επίπεδο.'
    }
  },
  {
    id: 'riddle-7',
    category: 'Riddles',
    difficulty: 'medium',
    question: { en: 'I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I?', el: 'Μπορώ να πετάξω χωρίς φτερά. Μπορώ να κλαίω χωρίς μάτια. Όπου πάω, το σκοτάδι με ακολουθεί. Τι είμαι;' },
    options: { en: ['A cloud', 'A shadow', 'A bird', 'The wind'], el: ['Ένα σύννεφο', 'Μια σκιά', 'Ένα πουλί', 'Ο άνεμος'] },
    correct: { en: 'A cloud', el: 'Ένα σύννεφο' },
    explanation: {
      en: 'Clouds float ("fly") across the sky, produce rain ("cry"), and block sunlight, casting shade ("darkness follows") wherever they pass.',
      el: 'Τα σύννεφα αιωρούνται ("πετάνε") στον ουρανό, παράγουν βροχή ("κλαίνε") και μπλοκάρουν το ηλιακό φως, ρίχνοντας σκιά ("σκοτάδι ακολουθεί") όπου περνούν.'
    }
  },
  {
    id: 'riddle-8',
    category: 'Riddles',
    difficulty: 'hard',
    question: { en: 'What disappears as soon as you say its name?', el: 'Τι εξαφανίζεται μόλις πεις το όνομά του;' },
    options: { en: ['Silence', 'Echo', 'Nothing', 'Time'], el: ['Η σιωπή', 'Η ηχώ', 'Το τίποτα', 'Ο χρόνος'] },
    correct: { en: 'Silence', el: 'Η σιωπή' },
    explanation: {
      en: 'Silence is the absence of sound. The moment you say "silence," you make a sound, and the silence is broken—it disappears.',
      el: 'Η σιωπή είναι η απουσία ήχου. Μόλις πεις "σιωπή", κάνεις ήχο και η σιωπή σπάει—εξαφανίζεται.'
    }
  },
  {
    id: 'riddle-9',
    category: 'Riddles',
    difficulty: 'easy',
    question: { en: 'What has hands but cannot clap?', el: 'Τι έχει χέρια αλλά δεν μπορεί να χειροκροτήσει;' },
    options: { en: ['A clock', 'A robot', 'A statue', 'A puppet'], el: ['Ένα ρολόι', 'Ένα ρομπότ', 'Ένα άγαλμα', 'Μια μαριονέτα'] },
    correct: { en: 'A clock', el: 'Ένα ρολόι' },
    explanation: {
      en: 'A clock has hands (the hour, minute, and second hands) that indicate time, but they cannot physically clap like human hands.',
      el: 'Το ρολόι έχει χέρια (τα δεικτικά των ωρών, λεπτών και δευτερολέπτων) που δείχνουν την ώρα, αλλά δεν μπορούν να χειροκροτήσουν σωματικά.'
    }
  },
  {
    id: 'riddle-10',
    category: 'Riddles',
    difficulty: 'medium',
    question: { en: 'I have branches but no fruit, trunk, or leaves. What am I?', el: 'Έχω κλαδιά αλλά όχι φρούτα, κορμό ή φύλλα. Τι είμαι;' },
    options: { en: ['A bank', 'A river', 'A ladder', 'A family tree'], el: ['Η τράπεζα', 'Ένας ποταμός', 'Μια σκάλα', 'Το οικογενειακό δέντρο'] },
    correct: { en: 'A bank', el: 'Η τράπεζα' },
    explanation: {
      en: 'A bank has branches (local offices), but unlike a tree, it has no fruit, trunk, or leaves. The word "branch" has a double meaning.',
      el: 'Η τράπεζα έχει κλάδους (τοπικά καταστήματα), αλλά σε αντίθεση με το δέντρο δεν έχει φρούτα, κορμό ή φύλλα. Η λέξη "κλάδος" έχει διπλή σημασία.'
    }
  },

  // === Lateral (6-10) ===
  {
    id: 'lat-6',
    category: 'Lateral',
    difficulty: 'easy',
    question: { en: 'A cowboy rides into town on Friday, stays three days, and leaves on Friday. How?', el: 'Ένας καουμπόι μπαίνει στο χωριό την Παρασκευή, μένει τρεις μέρες και φεύγει την Παρασκευή. Πώς;' },
    options: { en: ['His horse is named Friday', 'He time-traveled', 'He stayed overnight only', 'Friday is a place'], el: ['Το άλογό του λέγεται Friday', 'Ταξίδεψε στο χρόνο', 'Μέτρησε τις νύχτες', 'Το Friday είναι τόπος'] },
    correct: { en: 'His horse is named Friday', el: 'Το άλογό του λέγεται Friday' },
    explanation: {
      en: 'His horse is named Friday. He rides into town on his horse (Friday), stays three days, and leaves on his horse (Friday)—"on Friday" refers to the horse, not the day.',
      el: 'Το άλογό του λέγεται Friday. Μπαίνει στο χωριό πάνω στο άλογό του (Friday), μένει τρεις μέρες και φεύγει πάνω στο άλογό του (Friday)—το "Friday" αναφέρεται στο άλογο, όχι στην ημέρα.'
    }
  },
  {
    id: 'lat-7',
    category: 'Lateral',
    difficulty: 'medium',
    question: { en: 'A man lives on the 10th floor. Each morning he takes the elevator to the 1st floor and goes to work. In the evening he takes the elevator to the 7th floor and walks the rest. Why?', el: 'Ένας άνδρας μένει στον 10ο όροφο. Κάθε πρωί παίρνει το ασανσέρ στον 1ο και πάει στη δουλειά. Το βράδυ ανεβαίνει στον 7ο και περπατά το υπόλοιπο. Γιατί;' },
    options: { en: ['He is short', 'He cannot reach higher buttons', 'He exercises', 'The elevator is broken'], el: ['Είναι κοντός', 'Δεν φτάνει τα κουμπιά', 'Κάνει άσκηση', 'Το ασανσέρ είναι χαλασμένο'] },
    correct: { en: 'He is short', el: 'Είναι κοντός' },
    explanation: {
      en: 'He is too short to reach the elevator button for the 10th floor. He can only reach up to the 7th floor button, so he rides to 7 and walks the last 3 floors. In the morning, he goes to 1st (lobby), which he can reach.',
      el: 'Είναι πολύ κοντός για να φτάσει το κουμπί του 10ου ορόφου. Φτάνει μόνο μέχρι το κουμπί του 7ου, οπότε ανεβαίνει στον 7ο και περπατά τους τελευταίους 3 ορόφους. Το πρωί πηγαίνει στον 1ο (ρουαία) που μπορεί να φτάσει.'
    }
  },
  {
    id: 'lat-8',
    category: 'Lateral',
    difficulty: 'hard',
    question: { en: 'A man is found dead in a field with an unopened package next to him. How did he die?', el: 'Ένας άνδρας βρίσκεται νεκρός σε ένα λιβάδι με ένα αδιάβαστο πακέτο δίπλα του. Πώς πέθανε;' },
    options: { en: ['He fell from a parachute that did not open', 'He was poisoned', 'Someone killed him', 'Heart attack'], el: ['Έπεσε από αλεξίπτωτο που δεν άνοιξε', 'Δηλητηριάστηκε', 'Τον σκότωσε κάποιος', 'Καρδιακό'] },
    correct: { en: 'He fell from a parachute that did not open', el: 'Έπεσε από αλεξίπτωτο που δεν άνοιξε' },
    explanation: {
      en: 'The "unopened package" was his parachute. He jumped from a plane, the parachute failed to open, and he fell to his death. The parachute remained unopened next to him.',
      el: 'Το "αδιάβαστο πακέτο" ήταν το αλεξίπτωτό του. Πήδηξε από αεροπλάνο, το αλεξίπτωτο δεν άνοιξε ποτέ και έπεσε θανάσιμα. Το αλεξίπτωτο παρέμεινε κλειστό δίπλα του.'
    }
  },
  {
    id: 'lat-9',
    category: 'Lateral',
    difficulty: 'easy',
    question: { en: 'What can you catch but not throw?', el: 'Τι μπορείς να πιάσεις αλλά όχι να ρίξεις;' },
    options: { en: ['A cold', 'A ball', 'A fish', 'A wave'], el: ['Κρυολόγημα', 'Μία μπάλα', 'Ένα ψάρι', 'Ένα κύμα'] },
    correct: { en: 'A cold', el: 'Κρυολόγημα' },
    explanation: {
      en: 'You "catch" a cold (get infected with a virus), but you cannot physically "throw" a cold to someone—it\'s an idiomatic expression for becoming sick.',
      el: '"Κατεβάζεις" κρυολόγημα (να αρρωστήσεις), αλλά δεν μπορείς να το "πετάξεις" σωματικά σε κάποιον—είναι ιδιωματική έκφραση.'
    }
  },
  {
    id: 'lat-10',
    category: 'Lateral',
    difficulty: 'medium',
    question: { en: 'Two fathers and two sons go fishing. They each catch one fish. They bring home only three fish. Why?', el: 'Δύο πατέρες και δύο γιοι πάνε ψάρεμα. Κάθε ένας πιάνει ένα ψάρι. Φέρνουν σπίτι μόνο τρία ψάρια. Γιατί;' },
    options: { en: ['One fish was released', 'One is grandfather, father, son', 'They shared one', 'One fish escaped'], el: ['Ένα ψάρι απελευθερώθηκε', 'Είναι παππούς, πατέρας, γιος', 'Μοιράστηκαν ένα', 'Ένα ψάρι ξέφυγε'] },
    correct: { en: 'One is grandfather, father, son', el: 'Είναι παππούς, πατέρας, γιος' },
    explanation: {
      en: 'There are only three people: grandfather (father of the father), father (son of grandfather, father of the boy), and son. The grandfather and father count as two fathers; the father and son count as two sons. Each catches one fish = three fish total.',
      el: 'Υπάρχουν μόνο τρεις άνθρωποι: παππούς (πατέρας του πατέρα), πατέρας (γιος του παππού, πατέρας του παιδιού) και γιος. Ο παππούς και ο πατέρας μετριούνται ως δύο πατέρες· ο πατέρας και ο γιος ως δύο γιοι. Κάθε ένας πιάνει ένα ψάρι = τρία ψάρια συνολικά.'
    }
  },

  // === Word puzzles (6-10) ===
  {
    id: 'wp-6',
    category: 'WordPuzzle',
    difficulty: 'easy',
    question: { en: 'What common word becomes a palindrome when you add one letter? (e.g., add N to make it read the same forwards and backwards)', el: 'Ποια συνήθη λέξη γίνεται παλίνδρομο αν προσθέσεις ένα γράμμα;' },
    options: { en: ['No → Non', 'Pie → Pies', 'Pal → Pals', 'Eve → Eves'], el: ['No → Non', 'Pie → Pies', 'Pal → Pals', 'Eve → Eves'] },
    correct: { en: 'No → Non', el: 'No → Non' },
    explanation: {
      en: 'Adding "n" to "no" gives "non," which reads the same forwards and backwards—a palindrome.',
      el: 'Προσθέτοντας "n" στο "no" παίρνεις "non," που διαβάζεται το ίδιο από τις δύο πλευρές—παλίνδρομο.'
    }
  },
  {
    id: 'wp-7',
    category: 'WordPuzzle',
    difficulty: 'medium',
    question: { en: 'Rearrange the letters of "LISTEN" to form another word. What is it?', el: 'Αναδιατάξτε τα γράμματα του "LISTEN". Ποια άλλη λέξη σχηματίζεται;' },
    options: { en: ['Silent', 'Listen', 'Tinsel', 'Enlist'], el: ['Silent', 'Listen', 'Tinsel', 'Enlist'] },
    correct: { en: 'Silent', el: 'Silent' },
    explanation: {
      en: 'The letters L-I-S-T-E-N can be rearranged to form SILENT—an anagram with the opposite meaning (listen vs. silent).',
      el: 'Τα γράμματα L-I-S-T-E-N αναδιατάσσονται σε SILENT—ανάγραμμα με αντίθετη σημασία (listen = άκου, silent = σιωπηλός).'
    }
  },
  {
    id: 'wp-8',
    category: 'WordPuzzle',
    difficulty: 'hard',
    question: { en: 'What word becomes shorter when you add "er" to it?', el: 'Ποια λέξη γίνεται μικρότερη όταν προσθέσεις "er";' },
    options: { en: ['Short', 'Long', 'Brief', 'Small'], el: ['Short', 'Long', 'Brief', 'Small'] },
    correct: { en: 'Short', el: 'Short' },
    explanation: {
      en: 'Adding "er" to "short" gives "shorter"—a word meaning "more short." So the concept becomes "shorter" in meaning, even though the word has more letters.',
      el: 'Προσθέτοντας "er" στο "short" παίρνεις "shorter"—λέξη που σημαίνει "πιο κοντό." Άρα η έννοια γίνεται "πιο μικρή" σε νόημα.'
    }
  },
  {
    id: 'wp-9',
    category: 'WordPuzzle',
    difficulty: 'easy',
    question: { en: 'What 8-letter word can have a letter taken away and still make a word? Repeat until one letter remains.', el: 'Ποια αγγλική λέξη 8 γραμμάτων παραμένει έγκυρη λέξη αν αφαιρέσεις γράμματα; (π.χ. STARTLING → STARLING → ...)' },
    options: { en: ['Starting', 'Starling', 'Staring', 'String'], el: ['Starting', 'Starling', 'Staring', 'String'] },
    correct: { en: 'Starting', el: 'Starting' },
    explanation: {
      en: 'Starting → Starling → Staring → String → Sting → Sing → Sin → In → I. Each step removes one letter and leaves a valid English word.',
      el: 'Starting → Starling → Staring → String → Sting → Sing → Sin → In → I. Κάθε βήμα αφαιρεί ένα γράμμα και αφήνει έγκυρη αγγλική λέξη.'
    }
  },
  {
    id: 'wp-10',
    category: 'WordPuzzle',
    difficulty: 'medium',
    question: { en: 'I am a word of 5 letters. Take away 2 and I sound the same. What am I?', el: 'Είμαι λέξη 5 γραμμάτων. Αφαίρεσε 2 και ακούγομαι το ίδιο. Τι είμαι;' },
    options: { en: ['Queue', 'Peace', 'Phone', 'Stone'], el: ['Queue', 'Peace', 'Phone', 'Stone'] },
    correct: { en: 'Queue', el: 'Queue' },
    explanation: {
      en: '"Queue" (5 letters) pronounced sounds like "Q." Remove the last two letters "ue" and you get "Que," which is also pronounced like "Q"—so it sounds the same.',
      el: 'Το "Queue" (5 γράμματα) προφέρεται σαν "Q." Αφαιρώντας τα "ue" μένει "Que," που επίσης προφέρεται σαν "Q"—ακούγεται το ίδιο.'
    }
  },

  // === 70 NEW questions ===
  { id: 'riddle-11', category: 'Riddles', difficulty: 'easy', question: { en: 'What has a neck but no head?', el: 'Τι έχει λαιμό αλλά όχι κεφάλι;' }, options: { en: ['A bottle', 'A giraffe', 'A shirt', 'A violin'], el: ['Ένα μπουκάλι', 'Μια καμηλοπάρδαλη', 'Ένα πουκάμισο', 'Ένα βιολί'] }, correct: { en: 'A bottle', el: 'Ένα μπουκάλι' }, explanation: { en: 'A bottle has a narrow "neck" (the slender part between the body and the opening) but no head.', el: 'Το μπουκάλι έχει στενό "λαιμό" αλλά όχι κεφάλι.' } },
  { id: 'riddle-12', category: 'Riddles', difficulty: 'medium', question: { en: 'I have teeth but cannot bite. What am I?', el: 'Έχω δόντια αλλά δεν μπορώ να δαγκώσω. Τι είμαι;' }, options: { en: ['A comb', 'A saw', 'A zipper', 'A gear'], el: ['Μια χτένα', 'Ένα πριόνι', 'Ένα φερμουάρ', 'Ένα γρανάζι'] }, correct: { en: 'A comb', el: 'Μια χτένα' }, explanation: { en: 'A comb has teeth (the pointed prongs) but it cannot bite.', el: 'Η χτένα έχει δόντια αλλά δεν μπορεί να δαγκώσει.' } },
  { id: 'riddle-13', category: 'Riddles', difficulty: 'hard', question: { en: 'What can run but never walks, has a mouth but never talks, has a bed but never sleeps, has a head but never weeps?', el: 'Τι τρέχει αλλά δεν περπατά, έχει στόμα αλλά δεν μιλά, έχει κρεβάτι αλλά δεν κοιμάται, έχει κεφάλι αλλά δεν κλαίει;' }, options: { en: ['A river', 'A train', 'A highway', 'A clock'], el: ['Ένας ποταμός', 'Ένα τρένο', 'Εθνική οδός', 'Ένα ρολόι'] }, correct: { en: 'A river', el: 'Ένας ποταμός' }, explanation: { en: 'A river runs (flows); has a mouth (where it meets the sea); has a riverbed; has a head (the source).', el: 'Ο ποταμός ρέει, έχει στόμα (εκβολές), κοιτάδα και κεφάλι (πηγές).' } },
  { id: 'riddle-14', category: 'Riddles', difficulty: 'easy', question: { en: 'What gets wetter the more it dries?', el: 'Τι γίνεται πιο υγρό όσο περισσότερο στεγνώνει;' }, options: { en: ['A towel', 'A sponge', 'Paper', 'Cloth'], el: ['Μια πετσέτα', 'Ένα σφουγγάρι', 'Χαρτί', 'Υφασμάτινο'] }, correct: { en: 'A towel', el: 'Μια πετσέτα' }, explanation: { en: 'A towel "dries" you—the more you dry yourself, the wetter the towel becomes.', el: 'Η πετσέτα σε στεγνώνει—όσο περισσότερο στεγνώνεις, τόσο πιο υγρή γίνεται.' } },
  { id: 'riddle-15', category: 'Riddles', difficulty: 'medium', question: { en: 'I am not alive, but I grow. I need air but have no lungs. Water kills me. What am I?', el: 'Δεν είμαι ζωντανό αλλά μεγαλώνω. Χρειάζομαι αέρα αλλά δεν έχω πνεύμονες. Το νερό με σκοτώνει. Τι είμαι;' }, options: { en: ['Fire', 'A plant', 'A balloon', 'Ice'], el: ['Φωτιά', 'Φυτό', 'Μπαλόνι', 'Πάγος'] }, correct: { en: 'Fire', el: 'Φωτιά' }, explanation: { en: 'Fire grows when fed, needs oxygen, and is extinguished by water.', el: 'Η φωτιά μεγαλώνει, χρειάζεται οξυγόνο και το νερό τη σβήνει.' } },
  { id: 'riddle-16', category: 'Riddles', difficulty: 'hard', question: { en: 'What has 13 hearts but no other organs?', el: 'Τι έχει 13 καρδιές αλλά κανένα άλλο όργανο;' }, options: { en: ['A deck of cards', 'A hospital', 'A clock', 'A book'], el: ['Τραπουλόχαρτα', 'Νοσοκομείο', 'Ρολόι', 'Βιβλίο'] }, correct: { en: 'A deck of cards', el: 'Τραπουλόχαρτα' }, explanation: { en: 'A deck has 13 hearts (the suit).', el: 'Η τράπουλα έχει 13 φύλλα με καρδιές.' } },
  { id: 'riddle-17', category: 'Riddles', difficulty: 'easy', question: { en: 'What breaks yet never falls, and what falls yet never breaks?', el: 'Τι σπάει αλλά δεν πέφτει, και τι πέφτει αλλά δεν σπάει;' }, options: { en: ['Day breaks, night falls', 'Glass breaks, rain falls', 'Bone breaks, leaf falls', 'Wave breaks, snow falls'], el: ['Ξημερώνει, νυχτώνει', 'Ποτήρι σπάει, βροχή πέφτει', 'Κόκαλο σπάει, φύλλο πέφτει', 'Κύμα σπάει, χιόνι πέφτει'] }, correct: { en: 'Day breaks, night falls', el: 'Ξημερώνει, νυχτώνει' }, explanation: { en: '"Day breaks" at dawn; "night falls" at dusk—idiomatic phrases.', el: 'Ξημερώνει και νυχτώνει—ιδιωματικές εκφράσεις.' } },
  { id: 'riddle-18', category: 'Riddles', difficulty: 'medium', question: { en: 'What word becomes shorter when you add two letters?', el: 'Ποια λέξη γίνεται πιο σύντομη όταν προσθέσεις δύο γράμματα;' }, options: { en: ['Short', 'Brief', 'Small', 'Little'], el: ['Short', 'Brief', 'Small', 'Little'] }, correct: { en: 'Short', el: 'Short' }, explanation: { en: 'Short + er = shorter—meaning "more short."', el: 'Short + er = shorter—σημαίνει πιο κοντό.' } },
  { id: 'riddle-19', category: 'Riddles', difficulty: 'easy', question: { en: 'What has one eye but cannot see?', el: 'Τι έχει ένα μάτι αλλά δεν μπορεί να δει;' }, options: { en: ['A needle', 'A hurricane', 'A potato', 'A cyclops'], el: ['Μια βελόνα', 'Ένας τυφώνας', 'Μια πατάτα', 'Κύκλωψ'] }, correct: { en: 'A needle', el: 'Μια βελόνα' }, explanation: { en: 'A needle has an eye (the hole for thread) but no ability to see.', el: 'Η βελόνα έχει μάτι (τρύπα για νήμα) αλλά δεν βλέπει.' } },
  { id: 'riddle-20', category: 'Riddles', difficulty: 'hard', question: { en: 'I have legs but cannot walk, wings but cannot fly, a tail but no body. What am I?', el: 'Έχω πόδια αλλά δεν περπατάω, φτερά αλλά δεν πετάω, ουρά αλλά όχι σώμα. Τι είμαι;' }, options: { en: ['A kite', 'A windmill', 'A weathervane', 'A flag'], el: ['Χαρταετός', 'Ανεμόμυλος', 'Ηλιοτρόπιο', 'Σημαία'] }, correct: { en: 'A kite', el: 'Χαρταετός' }, explanation: { en: 'A kite has legs (frame), wings, and a tail, but needs wind.', el: 'Ο χαρταετός έχει πλαίσιο, φτερά και ουρά.' } },
  { id: 'riddle-21', category: 'Riddles', difficulty: 'medium', question: { en: 'The person who makes it has no need of it. The person who buys it has no use for it. The person who uses it neither sees nor feels it. What is it?', el: 'Αυτός που το φτιάχνει δεν το χρειάζεται. Αυτός που το αγοράζει δεν το χρησιμοποιεί. Αυτός που το χρησιμοποιεί δεν το βλέπει ούτε το νιώθει. Τι είναι;' }, options: { en: ['A coffin', 'A mirror', 'A blindfold', 'A gift'], el: ['Φέρετρο', 'Καθρέφτης', 'Προσωπίδα', 'Δώρο'] }, correct: { en: 'A coffin', el: 'Φέρετρο' }, explanation: { en: 'The undertaker makes it; the family buys it; the deceased is inside.', el: 'Ο τεχνίτης το φτιάχνει, η οικογένεια το αγοράζει, ο νεκρός είναι μέσα.' } },
  { id: 'riddle-22', category: 'Riddles', difficulty: 'easy', question: { en: 'What goes up but never comes down?', el: 'Τι ανεβαίνει αλλά δεν κατεβαίνει ποτέ;' }, options: { en: ['Your age', 'A balloon', 'Smoke', 'A rocket'], el: ['Η ηλικία σου', 'Μπαλόνι', 'Καπνός', 'Ρόκετ'] }, correct: { en: 'Your age', el: 'Η ηλικία σου' }, explanation: { en: 'Your age constantly increases and never decreases.', el: 'Η ηλικία σου αυξάνει συνεχώς.' } },
  { id: 'riddle-23', category: 'Riddles', difficulty: 'medium', question: { en: 'I am taken from a mine and shut in a wooden case. When used, I am thrown away. What am I?', el: 'Με παίρνουν από ορυχείο και με κλείνουν σε ξύλινο κουτί. Όταν με χρησιμοποιούν με πετούν. Τι είμαι;' }, options: { en: ['Pencil lead (graphite)', 'Coal', 'Diamond', 'Gold'], el: ['Μολύβι γραφίτη', 'Άνθρακας', 'Διαμάντι', 'Χρυσός'] }, correct: { en: 'Pencil lead (graphite)', el: 'Μολύβι γραφίτη' }, explanation: { en: 'Graphite comes from mines, is enclosed in wood (pencil), and the stub is thrown away.', el: 'Ο γραφίτης προέρχεται από ορυχεία και περικλείεται σε ξύλο (μολύβι).' } },
  { id: 'riddle-24', category: 'Riddles', difficulty: 'hard', question: { en: 'What can fill a room but takes up no space?', el: 'Τι μπορεί να γεμίσει δωμάτιο αλλά δεν καταλαμβάνει χώρο;' }, options: { en: ['Light', 'Sound', 'Smell', 'Darkness'], el: ['Φως', 'Ήχος', 'Μυρωδιά', 'Σκοτάδι'] }, correct: { en: 'Light', el: 'Φως' }, explanation: { en: 'Light fills a room yet has no mass and takes no physical space.', el: 'Το φως γεμίζει το δωμάτιο αλλά δεν έχει μάζα.' } },
  { id: 'riddle-25', category: 'Riddles', difficulty: 'easy', question: { en: 'What has a thumb and four fingers but is not alive?', el: 'Τι έχει αντίχειρα και τέσσερα δάχτυλα αλλά δεν είναι ζωντανό;' }, options: { en: ['A glove', 'A mannequin', 'A statue', 'A puppet'], el: ['Γάντι', 'Ανδρείκελο', 'Άγαλμα', 'Μαριονέτα'] }, correct: { en: 'A glove', el: 'Γάντι' }, explanation: { en: 'A glove has a thumb and four finger compartments.', el: 'Το γάντι έχει θήκες για αντίχειρα και δάχτυλα.' } },
  { id: 'riddle-26', category: 'Riddles', difficulty: 'medium', question: { en: 'What belongs to you but others use it more than you?', el: 'Τι σου ανήκει αλλά οι άλλοι το χρησιμοποιούν περισσότερο;' }, options: { en: ['Your name', 'Your phone', 'Your car', 'Your house'], el: ['Το όνομά σου', 'Το τηλέφωνό σου', 'Το αυτοκίνητό σου', 'Το σπίτι σου'] }, correct: { en: 'Your name', el: 'Το όνομά σου' }, explanation: { en: 'Your name is yours, but others say it when addressing you.', el: 'Το όνομά σου είναι δικό σου, αλλά οι άλλοι το λένε συχνότερα.' } },
  { id: 'riddle-27', category: 'Riddles', difficulty: 'hard', question: { en: 'I have no life, but I can die. What am I?', el: 'Δεν έχω ζωή αλλά μπορώ να πεθάνω. Τι είμαι;' }, options: { en: ['A battery', 'A candle', 'A computer', 'A plant'], el: ['Μπαταρία', 'Κερί', 'Υπολογιστής', 'Φυτό'] }, correct: { en: 'A battery', el: 'Μπαταρία' }, explanation: { en: 'A battery is not alive, but we say it "dies" when it runs out.', el: 'Η μπαταρία δεν είναι ζωντανή αλλά "πεθαίνει" όταν ξεφορτώνει.' } },
  { id: 'riddle-28', category: 'Riddles', difficulty: 'easy', question: { en: 'What has rings but no fingers?', el: 'Τι έχει δαχτυλίδια αλλά όχι δάχτυλα;' }, options: { en: ['Saturn', 'A tree trunk', 'A telephone', 'A boxing ring'], el: ['Ο Κρόνος', 'Κορμός δέντρου', 'Τηλέφωνο', 'Ρινγκ πυγμαχίας'] }, correct: { en: 'Saturn', el: 'Ο Κρόνος' }, explanation: { en: 'Saturn has planetary rings but no fingers.', el: 'Ο Κρόνος έχει δακτύλια αλλά όχι δάχτυλα.' } },
  { id: 'riddle-29', category: 'Riddles', difficulty: 'medium', question: { en: 'I am always in front of you but you can never see me. What am I?', el: 'Είμαι πάντα μπροστά σου αλλά δεν μπορείς να με δεις. Τι είμαι;' }, options: { en: ['The future', 'Your nose', 'Your shadow', 'The air'], el: ['Το μέλλον', 'Η μύτη σου', 'Η σκιά σου', 'Ο αέρας'] }, correct: { en: 'The future', el: 'Το μέλλον' }, explanation: { en: 'The future is always ahead in time but cannot be seen until it becomes present.', el: 'Το μέλλον είναι πάντα μπροστά αλλά δεν φαίνεται μέχρι να γίνει παρόν.' } },
  { id: 'riddle-30', category: 'Riddles', difficulty: 'hard', question: { en: 'What can you hold without ever touching it?', el: 'Τι μπορείς να κρατήσεις χωρίς να το αγγίξεις;' }, options: { en: ['A conversation', 'Your breath', 'A grudge', 'A secret'], el: ['Συζήτηση', 'Την ανάσα σου', 'Πικρία', 'Μυστικό'] }, correct: { en: 'A conversation', el: 'Συζήτηση' }, explanation: { en: 'You "hold" a conversation—idiomatic expression.', el: '"Κρατάς" συζήτηση—ιδιωματική έκφραση.' } },
  { id: 'riddle-31', category: 'Riddles', difficulty: 'easy', question: { en: 'What has a face and two hands but no arms or legs?', el: 'Τι έχει πρόσωπο και δύο χέρια αλλά όχι χέρια ή πόδια;' }, options: { en: ['A clock', 'A person', 'A mirror', 'A mask'], el: ['Ρολόι', 'Άνθρωπος', 'Καθρέφτης', 'Μάσκα'] }, correct: { en: 'A clock', el: 'Ρολόι' }, explanation: { en: 'A clock has a face (dial) and hands (hour, minute).', el: 'Το ρολόι έχει πρόσωπο και χέρια.' } },
  { id: 'riddle-32', category: 'Riddles', difficulty: 'medium', question: { en: 'What is so fragile that saying its name breaks it?', el: 'Τι είναι τόσο εύθραυστο ώστε να σπάει λέγοντας το όνομά του;' }, options: { en: ['Silence', 'Glass', 'Trust', 'Ice'], el: ['Σιωπή', 'Γυαλί', 'Εμπιστοσύνη', 'Πάγος'] }, correct: { en: 'Silence', el: 'Σιωπή' }, explanation: { en: 'Silence is broken the moment you speak.', el: 'Η σιωπή σπάει μόλις μιλήσεις.' } },
  { id: 'riddle-33', category: 'Riddles', difficulty: 'hard', question: { en: 'I can be cracked, made, told, and played. What am I?', el: 'Μπορώ να σπάσω, να γίνω, να ειπωθώ και να παιχτώ. Τι είμαι;' }, options: { en: ['A joke', 'An egg', 'A record', 'A game'], el: ['Αστείο', 'Αβγό', 'Ένα ρεκόρντ', 'Παιχνίδι'] }, correct: { en: 'A joke', el: 'Αστείο' }, explanation: { en: 'You crack a joke, make a joke, tell a joke, and play a joke on someone.', el: 'Σπας αστείο, κάνεις αστείο, λες αστείο, παίζεις αστείο σε κάποιον.' } },
  { id: 'riddle-34', category: 'Riddles', difficulty: 'easy', question: { en: 'What has four legs in the morning, two at noon, and three in the evening?', el: 'Τι έχει τέσσερα πόδια το πρωί, δύο το μεσημέρι και τρία το βράδυ;' }, options: { en: ['A human', 'A dog', 'A chair', 'A table'], el: ['Άνθρωπος', 'Σκύλος', 'Καρέκλα', 'Τραπέζι'] }, correct: { en: 'A human', el: 'Άνθρωπος' }, explanation: { en: 'Classic Sphinx riddle: baby crawls (4), adult walks (2), elderly uses cane (3).', el: 'Κλασικό αίνιγμα: μωρό (4), ενήλικας (2), γέρος με μπαστούνι (3).' } },

  { id: 'lat-11', category: 'Lateral', difficulty: 'easy', question: { en: 'How can a man go eight days without sleep?', el: 'Πώς μπορεί κάποιος να μείνει οκτώ μέρες χωρίς ύπνο;' }, options: { en: ['He sleeps at night', 'He takes naps', 'He sleeps during the day', 'He is a robot'], el: ['Κοιμάται τη νύχτα', 'Κάνει υπνάκους', 'Κοιμάται τη μέρα', 'Είναι ρομπότ'] }, correct: { en: 'He sleeps at night', el: 'Κοιμάται τη νύχτα' }, explanation: { en: 'He sleeps at night—awake during the day for eight days.', el: 'Κοιμάται τη νύχτα—ξύπνιος τη μέρα για 8 μέρες.' } },
  { id: 'lat-12', category: 'Lateral', difficulty: 'medium', question: { en: 'A man asks for water. The bartender pulls a gun. The man says "thank you" and leaves. Why?', el: 'Ένας άνδρας ζητάει νερό. Ο μπάρμαν τραβάει όπλο. Λέει "ευχαριστώ" και φεύγει. Γιατί;' }, options: { en: ['He had hiccups', 'The bartender was crazy', 'It was a joke', 'The gun was a toy'], el: ['Είχε λόξυγγα', 'Ο μπάρμαν ήταν τρελός', 'Ήταν αστείο', 'Το όπλο ήταν παιχνίδι'] }, correct: { en: 'He had hiccups', el: 'Είχε λόξυγγα' }, explanation: { en: 'He had hiccups. The bartender startled him with the gun—surprise can cure hiccups.', el: 'Είχε λόξυγγα· το ξάφνιασμα με το όπλο τη σταμάτησε.' } },
  { id: 'lat-13', category: 'Lateral', difficulty: 'hard', question: { en: 'Two sons born same hour, same day, same year—but not twins. How?', el: 'Δύο γιοι γεννήθηκαν την ίδια ώρα, μέρα, χρόνο—αλλά όχι δίδυμοι. Πώς;' }, options: { en: ['They are two of triplets', 'Different fathers', 'One adopted', 'Different time zones'], el: ['Είναι δύο από τρίδυμα', 'Διαφορετικοί πατέρες', 'Ένας υιοθετήθηκε', 'Διαφορετικές ζώνες'] }, correct: { en: 'They are two of triplets', el: 'Είναι δύο από τρίδυμα' }, explanation: { en: 'They are two of triplets (or more)—same birth, not "twins."', el: 'Είναι δύο από τρίδυμα—ίδια γέννα, όχι δίδυμοι.' } },
  { id: 'lat-14', category: 'Lateral', difficulty: 'easy', question: { en: 'What can you put in a wooden barrel to make it lighter?', el: 'Τι βάζεις σε ξύλινο βαρέλι για να το κάνεις ελαφρύτερο;' }, options: { en: ['A hole', 'Helium', 'Nothing', 'Feathers'], el: ['Τρύπα', 'Ήλιο', 'Τίποτα', 'Φτερά'] }, correct: { en: 'A hole', el: 'Τρύπα' }, explanation: { en: 'A hole adds no weight—it removes material.', el: 'Η τρύπα δεν προσθέτει βάρος.' } },
  { id: 'lat-15', category: 'Lateral', difficulty: 'medium', question: { en: 'Brothers and sisters I have none, but that man\'s father is my father\'s son. Who is in the photo?', el: 'Αδέλφια δεν έχω, αλλά ο πατέρας εκείνου είναι ο γιος του πατέρα μου. Ποιος στη φωτογραφία;' }, options: { en: ['His son', 'His father', 'Himself', 'His nephew'], el: ['Ο γιος του', 'Ο πατέρας του', 'Ο ίδιος', 'Ο ανιψιός του'] }, correct: { en: 'His son', el: 'Ο γιος του' }, explanation: { en: '"My father\'s son" = himself. So "that man\'s father" = himself. The man in the photo is his son.', el: 'Ο γιος του πατέρα μου = εγώ. Άρα στη φωτογραφία είναι ο γιος μου.' } },
  { id: 'lat-16', category: 'Lateral', difficulty: 'hard', question: { en: 'A man dies of thirst in the desert. Next to him are unopened cans of water. How?', el: 'Πεθαίνει από δίψα στην έρημο. Δίπλα του κουτιά νερού. Πώς;' }, options: { en: ['No can opener', 'Poisoned', 'Empty cans', 'Allergic'], el: ['Χωρίς ανοιχτήρα', 'Δηλητηριασμένο', 'Άδεια κουτιά', 'Αλλεργία'] }, correct: { en: 'No can opener', el: 'Χωρίς ανοιχτήρα' }, explanation: { en: 'He had cans of water but no tool to open them.', el: 'Είχε κουτιά αλλά όχι ανοιχτήρα.' } },
  { id: 'lat-17', category: 'Lateral', difficulty: 'easy', question: { en: 'What has to be broken before you can use it?', el: 'Τι πρέπει να σπάσει πριν το χρησιμοποιήσεις;' }, options: { en: ['An egg', 'A seal', 'A nut', 'A piñata'], el: ['Αβγό', 'Σφραγίδα', 'Καρύδι', 'Piñata'] }, correct: { en: 'An egg', el: 'Αβγό' }, explanation: { en: 'An egg must be cracked before use.', el: 'Το αβγό πρέπει να σπάσει πριν το χρησιμοποιήσεις.' } },
  { id: 'lat-18', category: 'Lateral', difficulty: 'medium', question: { en: 'A boat full of people. You look away, look back—boat is empty. Boat did not sink. What happened?', el: 'Σκάφος γεμάτο ανθρώπους. Γυρνάς, ξανακοιτάς—άδειο. Δεν βυθίστηκε. Τι έγινε;' }, options: { en: ['All married (no singles)', 'They jumped', 'They flew', 'Submarine'], el: ['Όλοι παντρεμένοι', 'Πήδηξαν', 'Πετάξαν', 'Υποβρύχιο'] }, correct: { en: 'All married (no singles)', el: 'Όλοι παντρεμένοι' }, explanation: { en: '"No one" = no single person—everyone is married.', el: '"Κανείς" = κανένας ελεύθερος.' } },
  { id: 'lat-19', category: 'Lateral', difficulty: 'hard', question: { en: 'A house with all walls facing south. A bear walks by. What color is the bear?', el: 'Σπίτι με όλους τους τοίχους προς νότο. Περπατά αρκούδα. Τι χρώμα;' }, options: { en: ['White (polar bear)', 'Brown', 'Black', 'No bear there'], el: ['Λευκό (πολική)', 'Καφέ', 'Μαύρο', 'Δεν υπάρχει'] }, correct: { en: 'White (polar bear)', el: 'Λευκό (πολική)' }, explanation: { en: 'Only at the North Pole can all walls face south. Polar bears are white.', el: 'Μόνο στον Βόρειο Πόλο. Πολικές αρκούδες είναι λευκές.' } },
  { id: 'lat-20', category: 'Lateral', difficulty: 'easy', question: { en: 'What 5-letter word reads the same upside down?', el: 'Ποια αγγλική λέξη 5 γραμμάτων διαβάζεται ίδια ανάποδα;' }, options: { en: ['SWIMS', 'HELLO', 'WORDS', 'PIZZA'], el: ['SWIMS', 'HELLO', 'WORDS', 'PIZZA'] }, correct: { en: 'SWIMS', el: 'SWIMS' }, explanation: { en: 'SWIMS reads the same when rotated 180°.', el: 'Το SWIMS διαβάζεται ίδιο περιστραφμένο.' } },
  { id: 'lat-21', category: 'Lateral', difficulty: 'medium', question: { en: 'Three pills, take one every half hour. How long do they last?', el: 'Τρία χάπια, ένα κάθε μισή ώρα. Πόσο κρατούν;' }, options: { en: ['One hour', '1.5 hours', '2 hours', '2.5 hours'], el: ['Μία ώρα', '1,5 ώρες', '2 ώρες', '2,5 ώρες'] }, correct: { en: 'One hour', el: 'Μία ώρα' }, explanation: { en: 'First at 0:00, second at 0:30, third at 1:00.', el: '1ο στις 0:00, 2ο στις 0:30, 3ο στην 1:00.' } },
  { id: 'lat-22', category: 'Lateral', difficulty: 'hard', question: { en: 'Two sons born at same time, same room—not twins. How?', el: 'Δύο γιοι ίδια στιγμή, ίδιο δωμάτιο—όχι δίδυμοι. Πώς;' }, options: { en: ['Two of triplets', 'Stepson', 'Different moms', 'Different pregnancies'], el: ['Δύο από τρίδυμα', 'Θετός γιος', 'Διαφορετικές μητέρες', 'Διαφορετικές εγκυμοσύνες'] }, correct: { en: 'Two of triplets', el: 'Δύο από τρίδυμα' }, explanation: { en: 'Two of a set of triplets or more.', el: 'Δύο από τρίδυμα.' } },
  { id: 'lat-23', category: 'Lateral', difficulty: 'easy', question: { en: 'What gets bigger the more you take away?', el: 'Τι μεγαλώνει όσο περισσότερα αφαιρείς;' }, options: { en: ['A hole', 'A debt', 'A fire', 'A pile'], el: ['Τρύπα', 'Χρέος', 'Φωτιά', 'Σωρός'] }, correct: { en: 'A hole', el: 'Τρύπα' }, explanation: { en: 'A hole grows as you remove more material.', el: 'Η τρύπα μεγαλώνει όσο σκάβεις.' } },
  { id: 'lat-24', category: 'Lateral', difficulty: 'medium', question: { en: 'I have no doors or windows but if I had a room I would have one. What am I?', el: 'Δεν έχω πόρτες ή παράθυρα αλλά αν είχα δωμάτιο θα είχα ένα. Τι είμαι;' }, options: { en: ['A mushroom', 'A book', 'A nut', 'An egg'], el: ['Μανιτάρι', 'Βιβλίο', 'Καρύδι', 'Αβγό'] }, correct: { en: 'A mushroom', el: 'Μανιτάρι' }, explanation: { en: 'Mushroom contains "room"—wordplay.', el: 'Μανιτάρι (mush-room) παίζει με τη λέξη room.' } },
  { id: 'lat-25', category: 'Lateral', difficulty: 'hard', question: { en: 'A man dead in a room with 53 bicycles. How did he die?', el: 'Άνδρας νεκρός σε δωμάτιο με 53 ποδήλατα. Πώς πέθανε;' }, options: { en: ['Cheating at cards', 'Run over', 'Crushed', 'Poison'], el: ['Κλέβει στα χαρτιά', 'Τον πέτυχε', 'Συντρίφτηκε', 'Δηλητήριο'] }, correct: { en: 'Cheating at cards', el: 'Κλέβει στα χαρτιά' }, explanation: { en: '53 = deck has 52, he had extra card. Caught cheating, killed.', el: '53 = τράπουλα έχει 52, είχε επιπλέον φύλλο.' } },
  { id: 'lat-26', category: 'Lateral', difficulty: 'easy', question: { en: 'What has many keys but opens no locks?', el: 'Τι έχει πολλά κλειδιά αλλά δεν ανοίγει κλειδαριές;' }, options: { en: ['A piano', 'A keyboard', 'A keychain', 'A map'], el: ['Πιάνο', 'Πληκτρολόγιο', 'Κλειδοθήκη', 'Χάρτης'] }, correct: { en: 'A piano', el: 'Πιάνο' }, explanation: { en: 'A piano has many keys for music.', el: 'Το πιάνο έχει πολλά μουσικά πλήκτρα.' } },
  { id: 'lat-27', category: 'Lateral', difficulty: 'medium', question: { en: 'What travels the world while staying in a corner?', el: 'Τι ταξιδεύει τον κόσμο μένοντας στη γωνία;' }, options: { en: ['A stamp', 'A corner shop', 'A globe', 'A photo'], el: ['Γραμματόσημο', 'Παντοπωλείο', 'Υδρόγειος', 'Φωτογραφία'] }, correct: { en: 'A stamp', el: 'Γραμματόσημο' }, explanation: { en: 'A stamp sits in the corner of an envelope and travels with mail.', el: 'Το γραμματόσημο είναι στη γωνία του φακέλου.' } },
  { id: 'lat-28', category: 'Lateral', difficulty: 'hard', question: { en: 'What disappears as soon as you say its name?', el: 'Τι εξαφανίζεται μόλις πεις το όνομά του;' }, options: { en: ['Silence', 'Secret', 'Shadow', 'Smoke'], el: ['Σιωπή', 'Μυστικό', 'Σκιά', 'Καπνός'] }, correct: { en: 'Silence', el: 'Σιωπή' }, explanation: { en: 'Saying "silence" produces sound—silence is broken.', el: 'Λέγοντας σιωπή κάνεις ήχο—η σιωπή σπάει.' } },
  { id: 'lat-29', category: 'Lateral', difficulty: 'easy', question: { en: 'What do you break when you say its name?', el: 'Τι σπας όταν λες το όνομά του;' }, options: { en: ['Silence', 'A promise', 'Glass', 'Ice'], el: ['Σιωπή', 'Υπόσχεση', 'Γυαλί', 'Πάγος'] }, correct: { en: 'Silence', el: 'Σιωπή' }, explanation: { en: 'You break the silence by speaking.', el: 'Σπας τη σιωπή μιλώντας.' } },
  { id: 'lat-30', category: 'Lateral', difficulty: 'medium', question: { en: 'I shrink every time I take a bath. What am I?', el: 'Μικραίνω κάθε φορά που κάνω μπάνιο. Τι είμαι;' }, options: { en: ['Soap', 'A towel', 'A sponge', 'A washcloth'], el: ['Σαπούνι', 'Πετσέτα', 'Σφουγγάρι', 'Πανί'] }, correct: { en: 'Soap', el: 'Σαπούνι' }, explanation: { en: 'A bar of soap shrinks with each use.', el: 'Η σαπούνα μικραίνει κάθε φορά.' } },
  { id: 'lat-31', category: 'Lateral', difficulty: 'hard', question: { en: 'A man makes three left turns and returns home. He sees two men wearing masks. Who are they?', el: 'Άνδρας κάνει τρεις αριστερούς και επιστρέφει. Βλέπει δύο με μάσκες. Ποιοι;' }, options: { en: ['Catcher and umpire (baseball)', 'Robbers', 'Doctors', 'Actors'], el: ['Catcher και umpire (μπέιζμπολ)', 'Ληστές', 'Γιάτροι', 'Ηθοποιοί'] }, correct: { en: 'Catcher and umpire (baseball)', el: 'Catcher και umpire (μπέιζμπολ)' }, explanation: { en: 'Three left turns around a block. He is at a baseball game—catcher and umpire wear masks.', el: 'Τρεις αριστεροί σε τετράγωνο. Είναι σε μπέιζμπολ—catcher και umpire φορούν μάσκες.' } },
  { id: 'lat-32', category: 'Lateral', difficulty: 'easy', question: { en: 'What kind of room has no doors or windows?', el: 'Τι είδους δωμάτιο δεν έχει πόρτες ή παράθυρα;' }, options: { en: ['A mushroom', 'A closet', 'A cave', 'A box'], el: ['Μανιτάρι', 'Ντουλάπα', 'Σπηλιά', 'Κουτί'] }, correct: { en: 'A mushroom', el: 'Μανιτάρι' }, explanation: { en: 'Mushroom (mush-room) is a play on "room."', el: 'Μανιτάρι (mush-room) παίζει με τη λέξη room.' } },
  { id: 'lat-33', category: 'Lateral', difficulty: 'medium', question: { en: 'What word looks the same upside down and backwards?', el: 'Ποια αγγλική λέξη φαίνεται ίδια ανάποδα και αντιστρόφως;' }, options: { en: ['NOON', 'MOM', 'DAD', 'SWIMS'], el: ['NOON', 'MOM', 'DAD', 'SWIMS'] }, correct: { en: 'NOON', el: 'NOON' }, explanation: { en: 'NOON is a palindrome with vertical symmetry.', el: 'Το NOON είναι παλίνδρομο και συμμετρικό.' } },

  { id: 'wp-11', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What word contains all 26 letters?', el: 'Ποια αγγλική λέξη περιέχει όλα τα 26 γράμματα;' }, options: { en: ['Alphabet', 'The quick brown fox...', 'Dictionary', 'Abcedarian'], el: ['Alphabet', 'The quick brown fox...', 'Dictionary', 'Abcedarian'] }, correct: { en: 'Alphabet', el: 'Alphabet' }, explanation: { en: 'The word "alphabet" refers to the 26 letters A–Z.', el: 'Η λέξη alphabet αναφέρεται στα 26 γράμματα.' } },
  { id: 'wp-12', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'What common word has 4 letters, 3 syllables, and only one vowel letter?', el: 'Ποια κοινή λέξη έχει 4 γράμματα, 3 συλλαβές και 1 φωνήεν;' }, options: { en: ['Area', 'Idea', 'Queue', 'Aria'], el: ['Area', 'Idea', 'Queue', 'Aria'] }, correct: { en: 'Idea', el: 'Idea' }, explanation: { en: 'Idea: 4 letters, 3 syllables (i-de-a).', el: 'Η idea έχει 4 γράμματα και 3 συλλαβές.' } },
  { id: 'wp-13', category: 'WordPuzzle', difficulty: 'hard', question: { en: 'Add one letter to "berry" for a new word. Add one to that for another. What are they?', el: 'Πρόσθεσε γράμμα στο "berry" για νέα λέξη. Μετά ένα στην νέα. Ποια είναι;' }, options: { en: ['Cherry, Sherry', 'Ferry, Berry', 'Merry, Berry', 'Derry, Cherry'], el: ['Cherry, Sherry', 'Ferry, Berry', 'Merry, Berry', 'Derry, Cherry'] }, correct: { en: 'Cherry, Sherry', el: 'Cherry, Sherry' }, explanation: { en: 'C+berry=cherry. S+cherry=sherry.', el: 'C+berry=cherry. S+cherry=sherry.' } },
  { id: 'wp-14', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What 3-letter word reads the same forwards, backwards, and upside down?', el: 'Ποια λέξη 3 γραμμάτων διαβάζεται ίδια μπροστά, πίσω, ανάποδα;' }, options: { en: ['MOM', 'DAD', 'NUN', 'TOT'], el: ['MOM', 'DAD', 'NUN', 'TOT'] }, correct: { en: 'MOM', el: 'MOM' }, explanation: { en: 'MOM is a 3-letter palindrome with symmetry.', el: 'Η MOM είναι παλίνδρομο 3 γραμμάτων.' } },
  { id: 'wp-15', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'Change one letter in "CORRECT" to make it incorrect.', el: 'Άλλαξε ένα γράμμα στο CORRECT για να γίνει λάθος.' }, options: { en: ['Remove one R → CORECT', 'Change C to E', 'Change R to W', 'Add letter'], el: ['Αφαίρεσε R → CORECT', 'Άλλαξε C σε E', 'Άλλαξε R σε W', 'Πρόσθεσε γράμμα'] }, correct: { en: 'Remove one R → CORECT', el: 'Αφαίρεσε R → CORECT' }, explanation: { en: 'Removing one R gives CORECT—a misspelling (incorrect).', el: 'Αφαιρώντας το R μένει CORECT—ορθογραφικό λάθος.' } },
  { id: 'wp-16', category: 'WordPuzzle', difficulty: 'hard', question: { en: 'What English word has three consecutive double letters?', el: 'Ποια αγγλική λέξη έχει τρία διαδοχικά ζευγάρια διπλών γραμμάτων;' }, options: { en: ['Bookkeeper', 'Mississippi', 'Possession', 'Committee'], el: ['Bookkeeper', 'Mississippi', 'Possession', 'Committee'] }, correct: { en: 'Bookkeeper', el: 'Bookkeeper' }, explanation: { en: 'Bookkeeper: oo, kk, ee.', el: 'Bookkeeper: oo, kk, ee.' } },
  { id: 'wp-17', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What word becomes a compound when you add "eye" to the end?', el: 'Ποια λέξη γίνεται σύνθετη με "eye" στο τέλος;' }, options: { en: ['Bull', 'Cat', 'Dog', 'Bird'], el: ['Bull', 'Cat', 'Dog', 'Bird'] }, correct: { en: 'Bull', el: 'Bull' }, explanation: { en: 'Bull + eye = bullseye.', el: 'Bull + eye = bullseye.' } },
  { id: 'wp-18', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'Take away my first letter, last letter, all letters—I remain the same. What am I?', el: 'Αφαίρεσε πρώτο, τελευταίο, όλα—μένω το ίδιο. Τι είμαι;' }, options: { en: ['Envelope with "THE"', 'Empty', 'The word same', 'A mirror'], el: ['Φάκελος με "THE"', 'Άδειο', 'Η λέξη same', 'Καθρέφτης'] }, correct: { en: 'Envelope with "THE"', el: 'Φάκελος με "THE"' }, explanation: { en: 'Envelope with "the" inside. Remove letters from "the"—envelope remains.', el: 'Φάκελος με "the" μέσα. Ο φάκελος παραμένει.' } },
  { id: 'wp-19', category: 'WordPuzzle', difficulty: 'hard', question: { en: 'Remove one letter from "spear" to get a type of fruit. Which letter?', el: 'Αφαίρεσε ένα γράμμα από το spear για φρούτο. Ποιο;' }, options: { en: ['S → pear', 'P → ear', 'E → spar', 'R → spea'], el: ['S → pear', 'P → ear', 'E → spar', 'R → spea'] }, correct: { en: 'S → pear', el: 'S → pear' }, explanation: { en: 'Spear minus S = pear (fruit).', el: 'Spear μείον S = pear (φρούτο).' } },
  { id: 'wp-20', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What word sounds the same when you remove four of its five letters?', el: 'Ποια λέξη ακούγεται ίδια με 4 από 5 γράμματα αφαιρεμένα;' }, options: { en: ['Queue', 'Aria', 'Ewe', 'Eye'], el: ['Queue', 'Aria', 'Ewe', 'Eye'] }, correct: { en: 'Queue', el: 'Queue' }, explanation: { en: 'Queue sounds like Q. Remove 4 letters, Q remains—same sound.', el: 'Queue ακούγεται Q. Αφαίρεσε 4, μένει Q.' } },
  { id: 'wp-21', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'What 5-letter word has 6 left when you take 2 away?', el: 'Ποια λέξη 5 γραμμάτων έχει 6 αριστερά όταν αφαιρέσεις 2;' }, options: { en: ['Sixty', 'Sixte', 'Sixth', 'Sixes'], el: ['Sixty', 'Sixte', 'Sixth', 'Sixes'] }, correct: { en: 'Sixty', el: 'Sixty' }, explanation: { en: 'SIXTY minus "ty" (2 letters) = SIX (6).', el: 'SIXTY μείον ty = SIX (6).' } },
  { id: 'wp-22', category: 'WordPuzzle', difficulty: 'hard', question: { en: 'What word begins and ends with "e" but only contains one letter?', el: 'Ποια λέξη ξεκινά και τελειώνει με e αλλά περιέχει μόνο ένα γράμμα;' }, options: { en: ['Envelope', 'Eye', 'Ewe', 'Eve'], el: ['Envelope', 'Eye', 'Ewe', 'Eve'] }, correct: { en: 'Envelope', el: 'Envelope' }, explanation: { en: 'Envelope begins and ends with "e." It "contains" one letter (mail).', el: 'Ο φάκελος ξεκινά και τελειώνει με e. Περιέχει γράμμα.' } },
  { id: 'wp-23', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What do "madam" and "radar" have in common?', el: 'Τι κοινό έχουν το madam και radar;' }, options: { en: ['Palindromes', 'They rhyme', '5 letters', 'Start with consonant'], el: ['Παλίνδρομα', 'Ομοιοκαταληκτούν', '5 γράμματα', 'Ξεκινούν με σύμφωνο'] }, correct: { en: 'Palindromes', el: 'Παλίνδρομα' }, explanation: { en: 'Both read the same forwards and backwards.', el: 'Και τα δύο διαβάζονται ίδιο μπροστά-πίσω.' } },
  { id: 'wp-24', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'What word has 5 consecutive vowels?', el: 'Ποια αγγλική λέξη έχει 5 συνεχόμενα φωνήεντα;' }, options: { en: ['Queueing', 'Beautiful', 'Beautician', 'Aeonium'], el: ['Queueing', 'Beautiful', 'Beautician', 'Aeonium'] }, correct: { en: 'Queueing', el: 'Queueing' }, explanation: { en: 'Queueing has u-e-u-e-i (5 vowels in a row).', el: 'Queueing έχει 5 συνεχόμενα φωνήεντα.' } },
  { id: 'wp-25', category: 'WordPuzzle', difficulty: 'hard', question: { en: 'Remove one letter from "spear" to get a fruit. Which letter?', el: 'Αφαίρεσε ένα γράμμα από spear για φρούτο. Ποιο γράμμα;' }, options: { en: ['S → pear', 'P → ear', 'E → spar', 'A → sper'], el: ['S → pear', 'P → ear', 'E → spar', 'A → sper'] }, correct: { en: 'S → pear', el: 'S → pear' }, explanation: { en: 'Spear - S = pear.', el: 'Spear - S = pear.' } },
  { id: 'wp-26', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What word becomes shorter when you add "er"?', el: 'Ποια λέξη γίνεται μικρότερη με "er";' }, options: { en: ['Short', 'Long', 'Small', 'Brief'], el: ['Short', 'Long', 'Small', 'Brief'] }, correct: { en: 'Short', el: 'Short' }, explanation: { en: 'Short + er = shorter.', el: 'Short + er = shorter.' } },
  { id: 'wp-27', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'What 9-letter word remains a word each time you remove a letter?', el: 'Ποια λέξη 9 γραμμάτων παραμένει λέξη κάθε φορά που αφαιρείς γράμμα;' }, options: { en: ['Startling', 'Strengths', 'Spongeing', 'Spreading'], el: ['Startling', 'Strengths', 'Spongeing', 'Spreading'] }, correct: { en: 'Startling', el: 'Startling' }, explanation: { en: 'Startling→Starling→Staring→String→Sting→Sing→Sin→In→I.', el: 'Startling→Starling→...→I.' } },
  { id: 'wp-28', category: 'WordPuzzle', difficulty: 'hard', question: { en: 'What is the only common English word ending in "-mt"?', el: 'Ποια είναι η μόνη κοινή αγγλική λέξη που τελειώνει σε -mt;' }, options: { en: ['Dreamt', 'Amount', 'Diamount', 'Comfort'], el: ['Dreamt', 'Amount', 'Diamount', 'Comfort'] }, correct: { en: 'Dreamt', el: 'Dreamt' }, explanation: { en: 'Dreamt (past of dream) ends in -mt. Amount ends in -nt.', el: 'Dreamt τελειώνει σε -mt.' } },
  { id: 'wp-29', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What word reads the same forwards and backwards?', el: 'Ποια λέξη διαβάζεται ίδια μπροστά και πίσω;' }, options: { en: ['Level', 'Civic', 'Radar', 'Stats'], el: ['Level', 'Civic', 'Radar', 'Stats'] }, correct: { en: 'Level', el: 'Level' }, explanation: { en: 'Level is a palindrome.', el: 'Το level είναι παλίνδρομο.' } },
  { id: 'wp-30', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'Fill in: The _ of the _ is the _ of the _.', el: 'Συμπλήρωσε: The _ of the _ is the _ of the _.' }, options: { en: ['Beginning, end, end, beginning', 'Start, finish, finish, start', 'First, last, last, first', 'Alpha, omega, omega, alpha'], el: ['Beginning, end, end, beginning', 'Start, finish, finish, start', 'First, last, last, first', 'Alpha, omega, omega, alpha'] }, correct: { en: 'Beginning, end, end, beginning', el: 'Beginning, end, end, beginning' }, explanation: { en: 'The beginning of the end is the end of the beginning.', el: 'The beginning of the end is the end of the beginning.' } },
  { id: 'wp-31', category: 'WordPuzzle', difficulty: 'hard', question: { en: 'What two words contain the letters "gty" in that order?', el: 'Ποιες δύο λέξεις περιέχουν gty με αυτή τη σειρά;' }, options: { en: ['Eighty, naughty', 'Flighty, weighty', 'Mighty, brightly', 'Lightly, tightly'], el: ['Eighty, naughty', 'Flighty, weighty', 'Mighty, brightly', 'Lightly, tightly'] }, correct: { en: 'Eighty, naughty', el: 'Eighty, naughty' }, explanation: { en: 'Eighty and naughty both contain "gty."', el: 'Eighty και naughty περιέχουν gty.' } },
  { id: 'wp-32', category: 'WordPuzzle', difficulty: 'easy', question: { en: 'What word in capitals is same forwards, backwards, and upside down?', el: 'Ποια λέξη με κεφαλαία είναι ίδια μπροστά, πίσω, ανάποδα;' }, options: { en: ['NOON', 'SWIMS', 'OTTO', 'HOOH'], el: ['NOON', 'SWIMS', 'OTTO', 'HOOH'] }, correct: { en: 'NOON', el: 'NOON' }, explanation: { en: 'NOON is a palindrome with vertical symmetry.', el: 'Το NOON είναι παλίνδρομο και συμμετρικό.' } },
  { id: 'wp-33', category: 'WordPuzzle', difficulty: 'medium', question: { en: 'Rearrange "PRESBYTERIANS" to spell a famous name.', el: 'Αναδιατάξτε PRESBYTERIANS για διάσημο όνομα.' }, options: { en: ['Britney Spears', 'Root beer', 'Persians', 'Espresso'], el: ['Britney Spears', 'Root beer', 'Persians', 'Espresso'] }, correct: { en: 'Britney Spears', el: 'Britney Spears' }, explanation: { en: 'PRESBYTERIANS anagrams to BRITNEY SPEARS.', el: 'Τα γράμματα δίνουν BRITNEY SPEARS.' } }
];
