export const questionsAdventures = [
  // === Geography (5) ===
  {
    id: 'geo-1',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the capital of Australia?', el: 'Ποια είναι η πρωτεύουσα της Αυστραλίας;' },
    options: { en: ['Sydney', 'Canberra', 'Melbourne'], el: ['Σίδνεϊ', 'Καμπέρα', 'Μελβούρνη'] },
    correct: { en: 'Canberra', el: 'Καμπέρα' },
    explanation: { en: 'Canberra was deliberately chosen as the capital in 1908 to resolve rivalry between Sydney and Melbourne, and became the seat of government in 1927.', el: 'Η Καμπέρα επιλέχθηκε σκόπιμα ως πρωτεύουσα το 1908 για να λυθεί ο ανταγωνισμός μεταξύ Σίδνεϊ και Μελβούρνης, και έγινε έδρα της κυβέρνησης το 1927.' }
  },
  {
    id: 'geo-2',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which is the longest river in the world?', el: 'Ποιο είναι το μακρύτερο ποτάμι στον κόσμο;' },
    options: { en: ['Amazon', 'Nile', 'Yangtze'], el: ['Αμαζόνιος', 'Νείλος', 'Γιανγκτσέ'] },
    correct: { en: 'Nile', el: 'Νείλος' },
    explanation: { en: 'The Nile is approximately 6,650 km long from its source to the Mediterranean, making it traditionally the longest river on Earth.', el: 'Ο Νείλος έχει μήκος περίπου 6.650 χλμ από την πηγή του ως τη Μεσόγειο, πράγμα που τον καθιστά παραδοσιακά το μακρύτερο ποτάμι στη Γη.' }
  },
  {
    id: 'geo-3',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'Which country has the most time zones?', el: 'Ποια χώρα έχει τις περισσότερες ζώνες ώρας;' },
    options: { en: ['Russia', 'USA', 'France'], el: ['Ρωσία', 'ΗΠΑ', 'Γαλλία'] },
    correct: { en: 'France', el: 'Γαλλία' },
    explanation: { en: 'France has 12 time zones due to its overseas territories across the Caribbean, South America, Indian Ocean, and Pacific.', el: 'Η Γαλλία έχει 12 ζώνες ώρας λόγω των υπερπόντιων εδαφών της στην Καραϊβική, Νότια Αμερική, Ινδικό Ωκεανό και Ειρηνικό.' }
  },
  {
    id: 'geo-4',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'On which continent is the Sahara Desert?', el: 'Σε ποια ήπειρο βρίσκεται η Σαχάρα;' },
    options: { en: ['Asia', 'Africa', 'South America'], el: ['Ασία', 'Αφρική', 'Νότια Αμερική'] },
    correct: { en: 'Africa', el: 'Αφρική' },
    explanation: { en: 'The Sahara spans much of North Africa and is the world\'s largest hot desert, covering about 9.2 million km².', el: 'Η Σαχάρα εκτείνεται σε μεγάλο μέρος της Βόρειας Αφρικής και είναι η μεγαλύτερη ζεστή έρημος στον κόσμο, με έκταση περίπου 9,2 εκατομμύρια km².' }
  },
  {
    id: 'geo-5',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'What is the smallest country in the world by area?', el: 'Ποια είναι η μικρότερη χώρα στον κόσμο σε έκταση;' },
    options: { en: ['Monaco', 'Vatican City', 'San Marino'], el: ['Μονακό', 'Βατικανό', 'Σαν Μαρίνο'] },
    correct: { en: 'Vatican City', el: 'Βατικανό' },
    explanation: { en: 'Vatican City is the smallest sovereign state at about 0.44 km²; it is the papal residence and headquarters of the Catholic Church.', el: 'Το Βατικανό είναι το μικρότερο κυρίαρχο κράτος με έκταση περίπου 0,44 km²· είναι η παπική κατοικία και η έδρα της Ρωμαιοκαθολικής Εκκλησίας.' }
  },

  // === History (5) ===
  {
    id: 'hist-1',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'In which year did World War II end?', el: 'Ποια χρονιά τελείωσε ο Β\' Παγκόσμιος Πόλεμος;' },
    options: [1943, 1945, 1948],
    correct: 1945,
    explanation: { en: 'World War II ended in 1945 when Japan formally surrendered on September 2, after Germany had surrendered in May.', el: 'Ο Β\' Παγκόσμιος Πόλεμος τελείωσε το 1945 όταν η Ιαπωνία υπέγραψε επίσημα την παράδοσή της στις 2 Σεπτεμβρίου, μετά την παράδοση της Γερμανίας τον Μάιο.' }
  },
  {
    id: 'hist-2',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Who was the first Emperor of Rome?', el: 'Ποιος ήταν ο πρώτος Αυτοκράτορας της Ρώμης;' },
    options: { en: ['Julius Caesar', 'Augustus', 'Nero'], el: ['Ιούλιος Καίσαρας', 'Αύγουστος', 'Νέρωνας'] },
    correct: { en: 'Augustus', el: 'Αύγουστος' },
    explanation: { en: 'Augustus (born Octavian) became the first Roman Emperor in 27 BC; Julius Caesar was dictator but died before the imperial title existed.', el: 'Ο Αύγουστος (γεννημένος Οκταβιανός) έγινε ο πρώτος Ρωμαίος Αυτοκράτορας το 27 π.Χ.· ο Ιούλιος Καίσαρας ήταν δικτάτορας αλλά πέθανε πριν εμφανιστεί ο τίτλος του αυτοκράτορα.' }
  },
  {
    id: 'hist-3',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'The Battle of Thermopylae took place in which year?', el: 'Η μάχη των Θερμοπυλών έγινε ποιο έτος;' },
    options: { en: ['480 BC', '490 BC', '431 BC'], el: ['480 π.Χ.', '490 π.Χ.', '431 π.Χ.'] },
    correct: { en: '480 BC', el: '480 π.Χ.' },
    explanation: { en: 'The Battle of Thermopylae occurred in 480 BC during Xerxes I\'s Persian invasion of Greece; it was part of the Greco-Persian Wars.', el: 'Η μάχη των Θερμοπυλών έγινε το 480 π.Χ. κατά την εισβολή του Ξέρξη στην Ελλάδα· ήταν μέρος των Ελληνοπερσικών Πολέμων.' }
  },
  {
    id: 'hist-4',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Who painted the ceiling of the Sistine Chapel?', el: 'Ποιος ζωγράφισε την οροφή της Καπέλα Σιστίνα;' },
    options: { en: ['Da Vinci', 'Michelangelo', 'Raphael'], el: ['Ντα Βίντσι', 'Μιχαήλ Άγγελος', 'Ραφαήλ'] },
    correct: { en: 'Michelangelo', el: 'Μιχαήλ Άγγελος' },
    explanation: { en: 'Michelangelo Buonarroti painted the Sistine Chapel ceiling between 1508 and 1512, including the iconic Creation of Adam.', el: 'Ο Μιχαήλ Άγγελος Μπουονarroti ζωγράφισε την οροφή της Καπέλα Σιστίνα μεταξύ 1508 και 1512, συμπεριλαμβανομένης της εμβληματικής Δημιουργίας του Αδάμ.' }
  },
  {
    id: 'hist-5',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Which ancient wonder was located in Alexandria?', el: 'Ποιο αρχαίο θαύμα βρισκόταν στην Αλεξάνδρεια;' },
    options: {
      en: ['Colossus of Rhodes', 'Lighthouse of Alexandria', 'Hanging Gardens'],
      el: ['Κολοσσός της Ρόδου', 'Φάρος της Αλεξάνδρειας', 'Κρεμαστοί Κήποι']
    },
    correct: { en: 'Lighthouse of Alexandria', el: 'Φάρος της Αλεξάνδρειας' },
    explanation: { en: 'The Lighthouse (Pharos) of Alexandria was built in the 3rd century BC and was one of the Seven Wonders of the Ancient World.', el: 'Ο Φάρος της Αλεξάνδρειας χτίστηκε τον 3ο αιώνα π.Χ. και ήταν ένα από τα Επτά Θαύματα του Αρχαίου Κόσμου.' }
  },

  // === Exploration (5) ===
  {
    id: 'expl-1',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which ocean is the largest?', el: 'Ποιος ωκεανός είναι ο μεγαλύτερος;' },
    options: { en: ['Atlantic', 'Pacific', 'Indian'], el: ['Ατλαντικός', 'Ειρηνικός', 'Ινδικός'] },
    correct: { en: 'Pacific', el: 'Ειρηνικός' },
    explanation: { en: 'The Pacific Ocean covers about 165 million km², more than all the other oceans combined, and contains roughly half of Earth\'s water.', el: 'Ο Ειρηνικός Ωκεανός καλύπτει περίπου 165 εκατομμύρια km², περισσότερο από όλους τους άλλους ωκεανούς μαζί, και περιέχει περίπου το μισό νερό της Γης.' }
  },
  {
    id: 'expl-2',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'What is the deepest point in the ocean?', el: 'Ποιο είναι το βαθύτερο σημείο στον ωκεανό;' },
    options: {
      en: ['Tonga Trench', 'Mariana Trench', 'Java Trench'],
      el: ['Τάφρος Τόνγκα', 'Τάφρος Μαριανών', 'Τάφρος Ιάβας']
    },
    correct: { en: 'Mariana Trench', el: 'Τάφρος Μαριανών' },
    explanation: { en: 'The Challenger Deep in the Mariana Trench reaches about 10,935 m below sea level, making it the deepest known point on Earth.', el: 'Το Challenger Deep στην Τάφρο των Μαριανών φτάνει σε βάθος περίπου 10.935 m κάτω από την επιφάνεια της θάλασσας, καθιστώντας το το βαθύτερο γνωστό σημείο στη Γη.' }
  },
  {
    id: 'expl-3',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'Who was the first person to reach the South Pole?', el: 'Ποιος έφτασε πρώτος στο Νότιο Πόλο;' },
    options: { en: ['Scott', 'Amundsen', 'Shackleton'], el: ['Σκοτ', 'Άμουντσεν', 'Ντρέικ'] },
    correct: { en: 'Amundsen', el: 'Άμουντσεν' },
    explanation: { en: 'Roald Amundsen and his Norwegian expedition reached the South Pole on December 14, 1911, beating Robert Scott\'s British team by about a month.', el: 'Ο Ρόαλντ Άμουντσεν και η νορβηγική αποστολή του έφτασαν στο Νότιο Πόλο στις 14 Δεκεμβρίου 1911, νικώντας την βρετανική ομάδα του Ρόμπερτ Σκοτ κατά περίπου έναν μήνα.' }
  },
  {
    id: 'expl-4',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'What is the highest mountain on Earth?', el: 'Ποιο είναι το ψηλότερο βουνό στη Γη;' },
    options: { en: ['K2', 'Mount Everest', 'Kangchenjunga'], el: ['K2', 'Έβερεστ', 'Κάντσενγκτζουνγκα'] },
    correct: { en: 'Mount Everest', el: 'Έβερεστ' },
    explanation: { en: 'Mount Everest reaches 8,849 m above sea level (as of 2020 survey), making it the highest point on Earth\'s surface.', el: 'Το Έβερεστ φτάνει σε ύψος 8.849 m από την επιφάνεια της θάλασσας (σύμφωνα με έρευνα 2020), καθιστώντας το το ψηλότερο σημείο στην επιφάνεια της Γης.' }
  },
  {
    id: 'expl-5',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'In which year did humans first land on the Moon?', el: 'Ποια χρονιά πάτησε ο άνθρωπος πρώτη φορά στη Σελήνη;' },
    options: [1965, 1969, 1972],
    correct: 1969,
    explanation: { en: 'Apollo 11 landed on the Moon on July 20, 1969; Neil Armstrong and Buzz Aldrin were the first humans to walk on the lunar surface.', el: 'Το Apollo 11 προσεδαφίστηκε στη Σελήνη στις 20 Ιουλίου 1969· οι Νιλ Άρμστρονγκ και Μπαζ Όλντριν ήταν οι πρώτοι άνθρωποι που περπάτησαν στην επιφάνεια της Σελήνης.' }
  },

  // === Extra Geography (5) ===
  {
    id: 'geo-6',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which country has the most islands in the world?', el: 'Ποια χώρα έχει τα περισσότερα νησιά στον κόσμο;' },
    options: { en: ['Philippines', 'Indonesia', 'Sweden', 'Greece'], el: ['Φιλιππίνες', 'Ινδονησία', 'Σουηδία', 'Ελλάδα'] },
    correct: { en: 'Sweden', el: 'Σουηδία' },
    explanation: { en: 'Sweden has over 267,000 islands, mostly in the Baltic Sea and along its coastline, more than any other country.', el: 'Η Σουηδία έχει πάνω από 267.000 νησιά, κυρίως στη Βαλτική Θάλασσα και κατά μήκος της ακτογραμμής της, περισσότερα από οποιαδήποτε άλλη χώρα.' }
  },
  {
    id: 'geo-7',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the largest continent by area?', el: 'Ποια είναι η μεγαλύτερη ήπειρος σε έκταση;' },
    options: { en: ['Africa', 'North America', 'Asia', 'Europe'], el: ['Αφρική', 'Βόρεια Αμερική', 'Ασία', 'Ευρώπη'] },
    correct: { en: 'Asia', el: 'Ασία' },
    explanation: { en: 'Asia covers about 44.6 million km², roughly 30% of Earth\'s land area, making it the largest continent by far.', el: 'Η Ασία καλύπτει περίπου 44,6 εκατομμύρια km², περίπου το 30% της ξηράς της Γης, καθιστώντας την τη μεγαλύτερη ήπειρο.' }
  },
  {
    id: 'geo-8',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'Which strait separates Europe from Asia?', el: 'Ποιο στενό χωρίζει την Ευρώπη από την Ασία;' },
    options: { en: ['Gibraltar', 'Bosporus', 'Hormuz', 'Malacca'], el: ['Γιβραλτάρ', 'Βόσπορος', 'Ορμούζ', 'Μαλάκα'] },
    correct: { en: 'Bosporus', el: 'Βόσπορος' },
    explanation: { en: 'The Bosporus connects the Black Sea to the Sea of Marmara and runs through Istanbul, forming the traditional boundary between Europe and Asia.', el: 'Ο Βόσπορος συνδέει τη Μαύρη Θάλασσα με τη Θάλασσα του Μαρμαρά και διασχίζει την Κωνσταντινούπολη, αποτελώντας το παραδοσιακό όριο μεταξύ Ευρώπης και Ασίας.' }
  },
  {
    id: 'geo-9',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the capital of Japan?', el: 'Ποια είναι η πρωτεύουσα της Ιαπωνίας;' },
    options: { en: ['Osaka', 'Kyoto', 'Tokyo', 'Yokohama'], el: ['Οσάκα', 'Κιότο', 'Τόκιο', 'Γιοκοχάμα'] },
    correct: { en: 'Tokyo', el: 'Τόκιο' },
    explanation: { en: 'Tokyo has been Japan\'s capital since 1868 when the Emperor moved there from Kyoto; it is the world\'s most populous metropolitan area.', el: 'Το Τόκιο είναι πρωτεύουσα της Ιαπωνίας από το 1868 όταν ο Αυτοκράτορας μετακόμισε εκεί από το Κιότο· είναι η πιο πυκνοκατοικημένη μητροπολιτική περιοχή στον κόσμο.' }
  },
  {
    id: 'geo-10',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which river flows through Paris?', el: 'Ποιο ποτάμι διασχίζει το Παρίσι;' },
    options: { en: ['Rhine', 'Thames', 'Seine', 'Danube'], el: ['Ρήνος', 'Τάμεσης', 'Σηκουάνας', 'Δούναβης'] },
    correct: { en: 'Seine', el: 'Σηκουάνας' },
    explanation: { en: 'The Seine flows through Paris for about 13 km and has been central to the city\'s history, commerce, and iconic landmarks.', el: 'Η Σηκουάνας διασχίζει το Παρίσι για περίπου 13 km και ήταν κεντρική στην ιστορία, το εμπόριο και τα εμβληματικά μνημεία της πόλης.' }
  },

  // === Extra History (5) ===
  {
    id: 'hist-6',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Which ancient civilization built Machu Picchu?', el: 'Ποιος αρχαίος πολιτισμός έχτισε το Μάτσου Πίτσου;' },
    options: { en: ['Maya', 'Aztec', 'Inca', 'Olmec'], el: ['Μάγια', 'Αζτέκοι', 'Ίνκα', 'Ολμέκ'] },
    correct: { en: 'Inca', el: 'Ίνκα' },
    explanation: { en: 'The Inca built Machu Picchu in the 15th century as an imperial estate high in the Peruvian Andes; it was never discovered by the Spanish.', el: 'Οι Ίνκα έχτισαν το Μάτσου Πίτσου τον 15ο αιώνα ως αυτοκρατορική κατοικία στα ψηλά των Περιναϊνών Άνδεων του Περού· δεν το ανακάλυψαν ποτέ οι Ισπανοί.' }
  },
  {
    id: 'hist-6b',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'What was the Renaissance?', el: 'Τι ήταν η Αναγέννηση;' },
    options: {
      en: ['A military campaign', 'A cultural rebirth in Europe', 'A religious reform', 'A scientific revolution'],
      el: ['Στρατιωτική εκστρατεία', 'Πολιτιστική αναγέννηση στην Ευρώπη', 'Θρησκευτική μεταρρύθμιση', 'Επιστημονική επανάσταση']
    },
    correct: { en: 'A cultural rebirth in Europe', el: 'Πολιτιστική αναγέννηση στην Ευρώπη' },
    explanation: { en: 'The Renaissance was a period of revived interest in classical art, literature, and learning in Europe from the 14th to 17th centuries.', el: 'Η Αναγέννηση ήταν περίοδος αναζωπύρωσης του ενδιαφέροντος για την κλασική τέχνη, τη λογοτεχνία και τη μάθηση στην Ευρώπη από τον 14ο ως τον 17ο αιώνα.' }
  },
  {
    id: 'hist-7',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'Which treaty ended the Napoleonic Wars in 1815?', el: 'Ποια συνθήκη τερμάτισε τους Ναπολεόντειους Πολέμους το 1815;' },
    options: {
      en: ['Treaty of Versailles', 'Congress of Vienna', 'Treaty of Westphalia', 'Treaty of Paris'],
      el: ['Συνθήκη Βερσαλλιών', 'Συνέδριο Βιέννης', 'Συνθήκη Βεστφαλίας', 'Συνθήκη Παρισίων']
    },
    correct: { en: 'Congress of Vienna', el: 'Συνέδριο Βιέννης' },
    explanation: { en: 'The Congress of Vienna (1814–1815) redrew Europe\'s borders after Napoleon\'s defeat and established a balance of power that lasted decades.', el: 'Το Συνέδριο της Βιέννης (1814–1815) ξανασχεδίασε τα σύνορα της Ευρώπης μετά την ήττα του Ναπολέοντα και καθιέρωσε μια ισορροπία δυνάμεων που διήρκεσε δεκαετίες.' }
  },
  {
    id: 'hist-8',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Who discovered America in 1492?', el: 'Ποιος ανακάλυψε την Αμερική το 1492;' },
    options: { en: ['Magellan', 'Columbus', 'Vasco da Gama', 'Drake'], el: ['Μαγγελάνος', 'Κολόμβος', 'Βάσκο ντα Γκάμα', 'Ντρέικ'] },
    correct: { en: 'Columbus', el: 'Κολόμβος' },
    explanation: { en: 'Christopher Columbus reached the Americas in 1492 under Spanish sponsorship, beginning sustained European contact with the New World.', el: 'Ο Χριστόφορος Κολόμβος έφτασε στην Αμερική το 1492 με ισπανική υποστήριξη, ξεκινώντας τη διαρκή ευρωπαϊκή επαφή με τον Νέο Κόσμο.' }
  },
  {
    id: 'hist-9',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'What empire was ruled by Genghis Khan?', el: 'Ποια αυτοκρατορία κυβέρνησε ο Τζένγκις Χαν;' },
    options: { en: ['Ottoman', 'Mongol', 'Persian', 'Roman'], el: ['Οθωμανική', 'Μογγολική', 'Περσική', 'Ρωμαϊκή'] },
    correct: { en: 'Mongol', el: 'Μογγολική' },
    explanation: { en: 'Genghis Khan united the Mongol tribes and founded the Mongol Empire in 1206, which became the largest contiguous land empire in history.', el: 'Ο Τζένγκις Χαν ένωσε τις μογγολικές φυλές και ίδρυσε τη Μογγολική Αυτοκρατορία το 1206, που έγινε η μεγαλύτερη συνεχόμενη χερσαία αυτοκρατορία στην ιστορία.' }
  },

  // === Extra Exploration (5) ===
  {
    id: 'expl-6',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which is the largest island in the world?', el: 'Ποιο είναι το μεγαλύτερο νησί στον κόσμο;' },
    options: { en: ['Madagascar', 'Greenland', 'Borneo', 'Iceland'], el: ['Μαδαγασκάρη', 'Γροιλανδία', 'Βόρνεο', 'Ισλανδία'] },
    correct: { en: 'Greenland', el: 'Γροιλανδία' },
    explanation: { en: 'Greenland covers about 2.16 million km²; Australia is larger but is considered a continent rather than an island.', el: 'Η Γροιλανδία καλύπτει περίπου 2,16 εκατομμύρια km²· η Αυστραλία είναι μεγαλύτερη αλλά θεωρείται ήπειρος παρά νησί.' }
  },
  {
    id: 'expl-7',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'What is the driest desert on Earth?', el: 'Ποια είναι η πιο ξηρή έρημος στη Γη;' },
    options: { en: ['Sahara', 'Atacama', 'Gobi', 'Kalahari'], el: ['Σαχάρα', 'Ατακάμα', 'Γκόμπι', 'Καλαχάρι'] },
    correct: { en: 'Atacama', el: 'Ατακάμα' },
    explanation: { en: 'The Atacama Desert in Chile receives almost no rainfall; some areas have not seen rain in decades, making it the driest non-polar place on Earth.', el: 'Η Έρημος Ατακάμα στη Χιλή δέχεται σχεδόν καμία βροχόπτωση· ορισμένες περιοχές δεν έχουν δει βροχή για δεκαετίες, καθιστώντας την το πιο ξηρό μη πολικό μέρος στη Γη.' }
  },
  {
    id: 'expl-8',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'Which explorer was the first to circumnavigate the globe?', el: 'Ποιος εξερευνητής ήταν ο πρώτος που ολοκλήρωσε τον περίπλου της Γης;' },
    options: { en: ['Columbus', 'Cook', 'Magellan\'s expedition', 'Drake'], el: ['Κολόμβος', 'Κουκ', 'Εκστρατεία Μαγγελάνου', 'Ντρέικ'] },
    correct: { en: 'Magellan\'s expedition', el: 'Εκστρατεία Μαγγελάνου' },
    explanation: { en: 'Ferdinand Magellan\'s expedition (1519–1522) completed the first circumnavigation; Magellan died in the Philippines, but his crew finished the voyage.', el: 'Η εκστρατεία του Φερδινάνδου Μαγγελάνου (1519–1522) ολοκλήρωσε τον πρώτο περίπλου· ο Μαγγελάνος πέθανε στις Φιλιππίνες, αλλά το πλήρωμά του ολοκλήρωσε το ταξίδι.' }
  },
  {
    id: 'expl-9',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'What is the longest mountain range in the world?', el: 'Ποια είναι η μακρύτερη οροσειρά στον κόσμο;' },
    options: { en: ['Himalayas', 'Andes', 'Rocky Mountains', 'Alps'], el: ['Ιμαλάια', 'Άνδεις', 'Βραχώδη Όρη', 'Άλπεις'] },
    correct: { en: 'Andes', el: 'Άνδεις' },
    explanation: { en: 'The Andes stretch about 7,000 km along the western coast of South America, making them the world\'s longest continental mountain range.', el: 'Οι Άνδεις εκτείνονται περίπου 7.000 km κατά μήκος της δυτικής ακτής της Νότιας Αμερικής, καθιστώντας τις τη μακρύτερη ηπειρωτική οροσειρά στον κόσμο.' }
  },
  {
    id: 'expl-10',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which lake is the deepest in the world?', el: 'Ποια λίμνη είναι η βαθύτερη στον κόσμο;' },
    options: { en: ['Lake Victoria', 'Lake Baikal', 'Caspian Sea', 'Lake Superior'], el: ['Λίμνη Βικτώρια', 'Λίμνη Βαϊκάλη', 'Κασπία Θάλασσα', 'Λίμνη Σουπίριορ'] },
    correct: { en: 'Lake Baikal', el: 'Λίμνη Βαϊκάλη' },
    explanation: { en: 'Lake Baikal in Siberia reaches a depth of about 1,642 m and holds roughly 20% of the world\'s unfrozen fresh surface water.', el: 'Η Λίμνη Βαϊκάλη στη Σιβηρία φτάνει σε βάθος περίπου 1.642 m και περιέχει περίπου το 20% του παγκόσμιου απαλάχριστου γλυκού επιφανειακού νερού.' }
  },

  // === New Questions (70) ===
  {
    id: 'geo-11',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the capital of Egypt?', el: 'Ποια είναι η πρωτεύουσα της Αιγύπτου;' },
    options: { en: ['Alexandria', 'Cairo', 'Luxor', 'Giza'], el: ['Αλεξάνδρεια', 'Κάιρο', 'Λούξορ', 'Γκίζα'] },
    correct: { en: 'Cairo', el: 'Κάιρο' },
    explanation: { en: 'Cairo has been Egypt\'s capital since 969 AD and is the largest city in Africa and the Arab world.', el: 'Το Κάιρο είναι πρωτεύουσα της Αιγύπτου από το 969 μ.Χ. και είναι η μεγαλύτερη πόλη της Αφρικής και του αραβικού κόσμου.' }
  },
  {
    id: 'geo-12',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which European capital is built on two continents?', el: 'Ποια ευρωπαϊκή πρωτεύουσα είναι χτισμένη σε δύο ηπείρους;' },
    options: { en: ['Rome', 'Istanbul', 'Athens', 'Lisbon'], el: ['Ρώμη', 'Κωνσταντινούπολη', 'Αθήνα', 'Λισσαβόνα'] },
    correct: { en: 'Istanbul', el: 'Κωνσταντινούπολη' },
    explanation: { en: 'Istanbul spans both Europe and Asia, with the Bosporus Strait dividing the city between the two continents.', el: 'Η Κωνσταντινούπολη εκτείνεται και στην Ευρώπη και στην Ασία, με το Στενό του Βόσπορου να χωρίζει την πόλη μεταξύ των δύο ηπείρων.' }
  },
  {
    id: 'geo-13',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'Which country is home to the world\'s largest salt flat?', el: 'Ποια χώρα φιλοξενεί την μεγαλύτερη αλμυρή λίμνη στον κόσμο;' },
    options: { en: ['Chile', 'Argentina', 'Bolivia', 'Peru'], el: ['Χιλή', 'Αργεντινή', 'Βολιβία', 'Περού'] },
    correct: { en: 'Bolivia', el: 'Βολιβία' },
    explanation: { en: 'Salar de Uyuni in Bolivia covers about 10,582 km² and is the world\'s largest salt flat, formed from prehistoric lakes.', el: 'Το Salar de Uyuni στη Βολιβία καλύπτει περίπου 10.582 km² και είναι η μεγαλύτερη αλμυρή λίμνη στον κόσμο, που σχηματίστηκε από προϊστορικές λίμνες.' }
  },
  {
    id: 'geo-14',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'Which river forms part of the border between the USA and Mexico?', el: 'Ποιο ποτάμι σχηματίζει μέρος των συνόρων μεταξύ ΗΠΑ και Μεξικού;' },
    options: { en: ['Colorado', 'Rio Grande', 'Mississippi', 'Columbia'], el: ['Κολοράντο', 'Ρίο Γκράντε', 'Μισισιπής', 'Κολούμπια'] },
    correct: { en: 'Rio Grande', el: 'Ρίο Γκράντε' },
    explanation: { en: 'The Rio Grande flows about 3,051 km and forms a significant part of the border between the United States and Mexico.', el: 'Το Ρίο Γκράντε ρέει περίπου 3.051 χλμ και σχηματίζει σημαντικό μέρος των συνόρων μεταξύ Ηνωμένων Πολιτειών και Μεξικού.' }
  },
  {
    id: 'geo-15',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'What is the highest waterfall in the world?', el: 'Ποιος είναι ο ψηλότερος καταρράκτης στον κόσμο;' },
    options: { en: ['Niagara Falls', 'Victoria Falls', 'Angel Falls', 'Iguazu Falls'], el: ['Καταρράκτες Νιαγάρα', 'Καταρράκτες Βικτώρια', 'Καταρράκτης Άγγελος', 'Καταρράκτες Ιγκουασού'] },
    correct: { en: 'Angel Falls', el: 'Καταρράκτης Άγγελος' },
    explanation: { en: 'Angel Falls in Venezuela drops 979 m and is the world\'s tallest uninterrupted waterfall.', el: 'Ο Καταρράκτης του Αγγέλου στη Βενεζουέλα πέφτει 979 m και είναι ο ψηλότερος αδιάσπαστος καταρράκτης στον κόσμο.' }
  },
  {
    id: 'geo-16',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'Which sea is the saltiest natural body of water on Earth?', el: 'Ποια θάλασσα είναι το πιο αλμυρό φυσικό νερό στη Γη;' },
    options: { en: ['Red Sea', 'Dead Sea', 'Caspian Sea', 'Mediterranean'], el: ['Ερυθρά Θάλασσα', 'Νεκρή Θάλασσα', 'Κασπία Θάλασσα', 'Μεσόγειος'] },
    correct: { en: 'Dead Sea', el: 'Νεκρή Θάλασσα' },
    explanation: { en: 'The Dead Sea has a salinity of about 34%, nearly 10 times that of the ocean, due to high evaporation and no outflow.', el: 'Η Νεκρή Θάλασσα έχει αλατότητα περίπου 34%, σχεδόν 10 φορές μεγαλύτερη από τον ωκεανό, λόγω της υψηλής εξάτμισης και απουσίας εκροής.' }
  },
  {
    id: 'geo-17',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the capital of Brazil?', el: 'Ποια είναι η πρωτεύουσα της Βραζιλίας;' },
    options: { en: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], el: ['Ρίο ντε Τζανέιρο', 'Σάο Πάουλο', 'Μπραζίλια', 'Σαλβαδόρ'] },
    correct: { en: 'Brasília', el: 'Μπραζίλια' },
    explanation: { en: 'Brasília became Brazil\'s capital in 1960, a planned city built in the interior to develop the country\'s hinterland.', el: 'Η Μπραζίλια έγινε πρωτεύουσα της Βραζιλίας το 1960, μια σχεδιασμένη πόλη που χτίστηκε στο εσωτερικό για την ανάπτυξη του ενδοχώρου της χώρας.' }
  },
  {
    id: 'geo-18',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which mountain range contains Mount Everest?', el: 'Ποια οροσειρά περιέχει το Έβερεστ;' },
    options: { en: ['Andes', 'Rocky Mountains', 'Himalayas', 'Alps'], el: ['Άνδεις', 'Βραχώδη Όρη', 'Ιμαλάια', 'Άλπεις'] },
    correct: { en: 'Himalayas', el: 'Ιμαλάια' },
    explanation: { en: 'Mount Everest lies in the Mahalangur sub-range of the Himalayas on the border between Nepal and Tibet.', el: 'Το Έβερεστ βρίσκεται στην υποοροσειρά Mahalangur των Ιμαλαΐων στα σύνορα μεταξύ Νεπάλ και Θιβέτ.' }
  },
  {
    id: 'geo-19',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'Which country has the longest coastline in the world?', el: 'Ποια χώρα έχει την μεγαλύτερη ακτογραμμή στον κόσμο;' },
    options: { en: ['Russia', 'Canada', 'Indonesia', 'Australia'], el: ['Ρωσία', 'Καναδάς', 'Ινδονησία', 'Αυστραλία'] },
    correct: { en: 'Canada', el: 'Καναδάς' },
    explanation: { en: 'Canada has approximately 243,042 km of coastline, the longest of any country, due to its many islands and complex shorelines.', el: 'Ο Καναδάς έχει περίπου 243.042 χλμ ακτογραμμής, τη μεγαλύτερη από οποιαδήποτε χώρα, λόγω των πολλών νησιών και των πολύπλοκων ακτών του.' }
  },
  {
    id: 'geo-20',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'What is the world\'s largest coral reef system?', el: 'Ποιο είναι το μεγαλύτερο σύστημα κοραλλιογενών υφάλων στον κόσμο;' },
    options: { en: ['Maldives Reef', 'Great Barrier Reef', 'Red Sea Reef', 'Belize Barrier Reef'], el: ['Υφάλιοι Μαλδίβων', 'Μεγάλο Κοραλλιογενές Φράγμα', 'Υφάλιοι Ερυθράς Θάλασσας', 'Φράγμα Μπελίζ'] },
    correct: { en: 'Great Barrier Reef', el: 'Μεγάλο Κοραλλιογενές Φράγμα' },
    explanation: { en: 'The Great Barrier Reef off Australia spans about 2,300 km and is composed of over 2,900 individual reefs.', el: 'Το Μεγάλο Κοραλλιογενές Φράγμα απέναντι από την Αυστραλία εκτείνεται περίπου 2.300 χλμ και αποτελείται από πάνω από 2.900 ξεχωριστά υφάλια.' }
  },
  {
    id: 'geo-21',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'Which continent has no deserts?', el: 'Ποια ήπειρος δεν έχει ερήμους;' },
    options: { en: ['Africa', 'Asia', 'Europe', 'Australia'], el: ['Αφρική', 'Ασία', 'Ευρώπη', 'Αυστραλία'] },
    correct: { en: 'Europe', el: 'Ευρώπη' },
    explanation: { en: 'Europe is the only continent without a true desert; its driest areas are semi-arid rather than desert.', el: 'Η Ευρώπη είναι η μόνη ήπειρος χωρίς αληθινή έρημο· οι πιο ξηρές περιοχές της είναι ημι-άγονες παρά ερημικές.' }
  },
  {
    id: 'geo-22',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which country is both in Europe and Asia?', el: 'Ποια χώρα βρίσκεται τόσο στην Ευρώπη όσο και στην Ασία;' },
    options: { en: ['Turkey', 'Georgia', 'Russia', 'Egypt'], el: ['Τουρκία', 'Γεωργία', 'Ρωσία', 'Αίγυπτος'] },
    correct: { en: 'Turkey', el: 'Τουρκία' },
    explanation: { en: 'Turkey straddles Europe and Asia, with Istanbul and western Turkey in Europe and Anatolia in Asia.', el: 'Η Τουρκία εκτείνεται στην Ευρώπη και την Ασία, με την Κωνσταντινούπολη και τη δυτική Τουρκία στην Ευρώπη και την Ανατολία στην Ασία.' }
  },
  {
    id: 'geo-23',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the capital of South Africa?', el: 'Ποια είναι η πρωτεύουσα της Νότιας Αφρικής;' },
    options: { en: ['Johannesburg', 'Cape Town', 'Pretoria', 'Durban'], el: ['Γιοχάνεσμπουργκ', 'Κέιπ Τάουν', 'Πρετόρια', 'Ντάρμπαν'] },
    correct: { en: 'Pretoria', el: 'Πρετόρια' },
    explanation: { en: 'South Africa has three capitals: Pretoria (administrative), Cape Town (legislative), and Bloemfontein (judicial). Pretoria is the executive capital.', el: 'Η Νότια Αφρική έχει τρεις πρωτεύουσες: Πρετόρια (διοικητική), Κέιπ Τάουν (νομοθετική) και Μπλοέμφοντεϊν (δικαστική). Η Πρετόρια είναι η εκτελεστική πρωτεύουσα.' }
  },
  {
    id: 'geo-24',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'Which river delta is the largest in the world?', el: 'Ποια ποτάμια δέλτα είναι η μεγαλύτερη στον κόσμο;' },
    options: { en: ['Mississippi Delta', 'Nile Delta', 'Ganges-Brahmaputra Delta', 'Amazon Delta'], el: ['Δέλτα Μισισιπή', 'Δέλτα Νείλου', 'Δέλτα Γάγγη-Βραχμαπούτρα', 'Δέλτα Αμαζονίου'] },
    correct: { en: 'Ganges-Brahmaputra Delta', el: 'Δέλτα Γάγγη-Βραχμαπούτρα' },
    explanation: { en: 'The Ganges-Brahmaputra Delta in Bangladesh and India covers about 105,000 km² and is the world\'s largest river delta.', el: 'Η Δέλτα Γάγγη-Βραχμαπούτρα στο Μπαγκλαντές και την Ινδία καλύπτει περίπου 105.000 km² και είναι η μεγαλύτερη ποτάμια δέλτα στον κόσμο.' }
  },
  {
    id: 'geo-25',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which strait connects the Mediterranean to the Atlantic?', el: 'Ποιο στενό συνδέει τη Μεσόγειο με τον Ατλαντικό;' },
    options: { en: ['Bosporus', 'Suez Canal', 'Gibraltar', 'Dardanelles'], el: ['Βόσπορος', 'Διώρυγα Σουέζ', 'Γιβραλτάρ', 'Δαρδανέλλια'] },
    correct: { en: 'Gibraltar', el: 'Γιβραλτάρ' },
    explanation: { en: 'The Strait of Gibraltar separates Spain from Morocco and connects the Mediterranean Sea to the Atlantic Ocean.', el: 'Το Στενό του Γιβραλτάρ χωρίζει την Ισπαβία από το Μαρόκο και συνδέει τη Μεσόγειο Θάλασσα με τον Ατλαντικό Ωκεανό.' }
  },
  {
    id: 'geo-26',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the largest country in Africa by area?', el: 'Ποια είναι η μεγαλύτερη χώρα της Αφρικής σε έκταση;' },
    options: { en: ['Nigeria', 'Egypt', 'Algeria', 'Sudan'], el: ['Νιγηρία', 'Αίγυπτος', 'Αλγερία', 'Σουδάν'] },
    correct: { en: 'Algeria', el: 'Αλγερία' },
    explanation: { en: 'Algeria covers about 2.38 million km², making it the largest country in Africa and the 10th largest in the world.', el: 'Η Αλγερία καλύπτει περίπου 2,38 εκατομμύρια km², καθιστώντας την τη μεγαλύτερη χώρα της Αφρικής και τη 10η μεγαλύτερη στον κόσμο.' }
  },
  {
    id: 'geo-27',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which lake is shared by the United States and Canada?', el: 'Ποια λίμνη μοιράζονται οι ΗΠΑ και ο Καναδάς;' },
    options: { en: ['Lake Michigan', 'Lake Erie', 'Great Salt Lake', 'Lake Ontario'], el: ['Λίμνη Μίσιγκαν', 'Λίμνη Erie', 'Μεγάλη Αλμυρή Λίμνη', 'Λίμνη Οντάριο'] },
    correct: { en: 'Lake Erie', el: 'Λίμνη Erie' },
    explanation: { en: 'Lake Erie is one of the five Great Lakes and forms part of the border between the United States and Canada.', el: 'Η Λίμνη Erie είναι μία από τις πέντε Μεγάλες Λίμνες και σχηματίζει μέρος των συνόρων μεταξύ Ηνωμένων Πολιτειών και Καναδά.' }
  },
  {
    id: 'geo-28',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'Which country has the most UNESCO World Heritage Sites?', el: 'Ποια χώρα έχει τις περισσότερες θέσεις Μνημείων Παγκόσμιας Κληρονομιάς της UNESCO;' },
    options: { en: ['France', 'Italy', 'China', 'Spain'], el: ['Γαλλία', 'Ιταλία', 'Κίνα', 'Ισπανία'] },
    correct: { en: 'Italy', el: 'Ιταλία' },
    explanation: { en: 'Italy has 59 UNESCO World Heritage Sites, the most of any country, reflecting its rich cultural and natural heritage.', el: 'Η Ιταλία έχει 59 μνημεία παγκόσμιας κληρονομιάς UNESCO, τα περισσότερα από οποιαδήποτε χώρα, αντικατοπτρίζοντας την πλούσια πολιτιστική και φυσική κληρονομιά της.' }
  },
  {
    id: 'geo-29',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'What is the capital of India?', el: 'Ποια είναι η πρωτεύουσα της Ινδίας;' },
    options: { en: ['Mumbai', 'Kolkata', 'New Delhi', 'Bangalore'], el: ['Μουμπάι', 'Καλκούτα', 'Νέο Δελχί', 'Μπανγκαλόρ'] },
    correct: { en: 'New Delhi', el: 'Νέο Δελχί' },
    explanation: { en: 'New Delhi became India\'s capital in 1911 when the British moved the capital from Kolkata; it remains the seat of government today.', el: 'Το Νέο Δελχί έγινε πρωτεύουσα της Ινδίας το 1911 όταν οι Βρετανοί μετακόμισαν την πρωτεύουσα από την Καλκούτα· παραμένει έδρα της κυβέρνησης σήμερα.' }
  },
  {
    id: 'geo-30',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'Which ocean is the smallest?', el: 'Ποιος ωκεανός είναι ο μικρότερος;' },
    options: { en: ['Atlantic', 'Indian', 'Arctic', 'Southern'], el: ['Ατλαντικός', 'Ινδικός', 'Αρκτικός', 'Νοτιός'] },
    correct: { en: 'Arctic', el: 'Αρκτικός' },
    explanation: { en: 'The Arctic Ocean is the smallest and shallowest of the five oceans, covering about 14 million km², mostly covered by sea ice.', el: 'Ο Αρκτικός Ωκεανός είναι ο μικρότερος και πιο ρηχός από τους πέντε ωκεανούς, καλύπτοντας περίπου 14 εκατομμύρια km², κυρίως καλυμμένο από θαλάσσιο πάγο.' }
  },
  {
    id: 'geo-31',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'Which mountain is the highest in Africa?', el: 'Ποιο βουνό είναι το ψηλότερο στην Αφρική;' },
    options: { en: ['Atlas Mountains', 'Mount Kenya', 'Kilimanjaro', 'Drakensberg'], el: ['Όρη Άτλαντας', 'Όρος Κένυα', 'Κιλιμάντζαρο', 'Ντρακενσμπέργκ'] },
    correct: { en: 'Kilimanjaro', el: 'Κιλιμάντζαρο' },
    explanation: { en: 'Mount Kilimanjaro in Tanzania rises 5,895 m and is Africa\'s highest peak; it is a dormant volcano with three volcanic cones.', el: 'Το Όρος Κιλιμάντζαρο στην Τανζανία υψώνεται 5.895 m και είναι η ψηλότερη κορυφή της Αφρικής· είναι ένα αδρανές ηφαίστειο με τρεις ηφαιστειακούς κώνους.' }
  },
  {
    id: 'geo-32',
    category: 'Geography',
    difficulty: 'hard',
    question: { en: 'Which country contains the geographic center of Europe?', el: 'Ποια χώρα περιέχει το γεωγραφικό κέντρο της Ευρώπης;' },
    options: { en: ['Germany', 'Poland', 'Lithuania', 'Austria'], el: ['Γερμανία', 'Πολωνία', 'Λιθουανία', 'Αυστρία'] },
    correct: { en: 'Lithuania', el: 'Λιθουανία' },
    explanation: { en: 'A 1989 study by the French National Geographic Institute placed Europe\'s geographical centre near Vilnius, Lithuania.', el: 'Μια μελέτη του 1989 του Γαλλικού Εθνικού Γεωγραφικού Ινστιτούτου τοποθέτησε το γεωγραφικό κέντρο της Ευρώπης κοντά στη Βίλνιους, Λιθουανία.' }
  },
  {
    id: 'geo-33',
    category: 'Geography',
    difficulty: 'medium',
    question: { en: 'What is the largest lake entirely within one country?', el: 'Ποια είναι η μεγαλύτερη λίμνη εξ ολοκλήρου σε μία χώρα;' },
    options: { en: ['Lake Victoria', 'Lake Superior', 'Lake Michigan', 'Great Bear Lake'], el: ['Λίμνη Βικτώρια', 'Λίμνη Σουπίριορ', 'Λίμνη Μίσιγκαν', 'Λίμνη Great Bear'] },
    correct: { en: 'Lake Michigan', el: 'Λίμνη Μίσιγκαν' },
    explanation: { en: 'Lake Michigan is the only Great Lake entirely within the United States, covering about 58,000 km².', el: 'Η Λίμνη Μίσιγκαν είναι η μόνη Μεγάλη Λίμνη εξ ολοκλήρου στις Ηνωμένες Πολιτείες, καλύπτοντας περίπου 58.000 km².' }
  },
  {
    id: 'geo-34',
    category: 'Geography',
    difficulty: 'easy',
    question: { en: 'Which river flows through London?', el: 'Ποιο ποτάμι διασχίζει το Λονδίνο;' },
    options: { en: ['Seine', 'Rhine', 'Thames', 'Elbe'], el: ['Σηκουάνας', 'Ρήνος', 'Τάμεσης', 'Έλβα'] },
    correct: { en: 'Thames', el: 'Τάμεσης' },
    explanation: { en: 'The River Thames flows through southern England and London for 346 km; it has been central to the city\'s development for centuries.', el: 'Ο Τάμεσης ρέει από τη νότια Αγγλία και το Λονδίνο για 346 χλμ· ήταν κεντρικός στην ανάπτυξη της πόλης για αιώνες.' }
  },

  // === New History (23) ===
  {
    id: 'hist-10',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Who was the first person to sail around the Cape of Good Hope?', el: 'Ποιος ήταν ο πρώτος που πέρασε από το Ακρωτήριο της Καλής Ελπίδος;' },
    options: { en: ['Columbus', 'Vasco da Gama', 'Magellan', 'Dias'], el: ['Κολόμβος', 'Βάσκο ντα Γκάμα', 'Μαγγελάνος', 'Ντιάζ'] },
    correct: { en: 'Dias', el: 'Ντιάζ' },
    explanation: { en: 'Bartolomeu Dias rounded the Cape of Good Hope in 1488, proving that the Atlantic and Indian Oceans were connected.', el: 'Ο Bartolomeu Dias διέσχισε το Ακρωτήριο της Καλής Ελπίδος το 1488, αποδεικνύοντας ότι ο Ατλαντικός και ο Ινδικός Ωκεανός ήταν συνδεδεμένοι.' }
  },
  {
    id: 'hist-11',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Which ancient trade route connected China with the Mediterranean?', el: 'Ποιο αρχαίο εμπορικό δρόμο συνέδεε την Κίνα με τη Μεσόγειο;' },
    options: { en: ['Spice Route', 'Silk Road', 'Amber Road', 'Incense Route'], el: ['Δρόμος των Μπαχαρικών', 'Μεταξοδρομός', 'Δρόμος του Κεχριμπαριού', 'Δρόμος του Λιβανιού'] },
    correct: { en: 'Silk Road', el: 'Μεταξοδρομός' },
    explanation: { en: 'The Silk Road was a network of trade routes linking East and West from the 2nd century BC, facilitating cultural and commercial exchange.', el: 'Ο Μεταξοδρομός ήταν δίκτυο εμπορικών οδών που συνέδεε την Ανατολή και τη Δύση από τον 2ο αιώνα π.Χ., διευκολύνοντας την πολιτιστική και εμπορική ανταλλαγή.' }
  },
  {
    id: 'hist-12',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'In which year did the Berlin Wall fall?', el: 'Ποιο έτος έπεσε το Τείχος του Βερολίνου;' },
    options: { en: ['1987', '1988', '1989', '1990'], el: ['1987', '1988', '1989', '1990'] },
    correct: { en: '1989', el: '1989' },
    explanation: { en: 'The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War division of Europe.', el: 'Το Τείχος του Βερολίνου έπεσε στις 9 Νοεμβρίου 1989, συμβολίζοντας το τέλος του ψυχρού πολέμου και τη διαίρεση της Ευρώπης.' }
  },
  {
    id: 'hist-13',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Which explorer reached India by sea in 1498?', el: 'Ποιος εξερευνητής έφτασε στην Ινδία με πλοίο το 1498;' },
    options: { en: ['Columbus', 'Magellan', 'Vasco da Gama', 'Cabot'], el: ['Κολόμβος', 'Μαγγελάνος', 'Βάσκο ντα Γκάμα', 'Καμπότ'] },
    correct: { en: 'Vasco da Gama', el: 'Βάσκο ντα Γκάμα' },
    explanation: { en: 'Vasco da Gama landed at Calicut, India, in May 1498, establishing the first direct sea route from Europe to Asia.', el: 'Ο Βάσκο ντα Γκάμα προσγειώθηκε στο Calicut της Ινδίας τον Μάιο του 1498, καθιερώνοντας τη πρώτη απευθείας θαλάσσια διαδρομή από την Ευρώπη στην Ασία.' }
  },
  {
    id: 'hist-14',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Which empire built the famous road system connecting Cusco to its territories?', el: 'Ποια αυτοκρατορία έχτισε το διάσημο οδικό δίκτυο που συνέδεε το Κούσκο με τα εδάφη της;' },
    options: { en: ['Aztec', 'Maya', 'Inca', 'Olmec'], el: ['Αζτέκοι', 'Μάγια', 'Ίνκα', 'Ολμέκ'] },
    correct: { en: 'Inca', el: 'Ίνκα' },
    explanation: { en: 'The Inca built an extensive network of roads spanning over 40,000 km, including the famous Qhapaq Ñan, connecting their vast empire.', el: 'Οι Ίνκα έχτισαν ένα εκτεταμένο δίκτυο δρόμων πάνω από 40.000 χλμ, συμπεριλαμβανομένου του διάσημου Qhapaq Ñan, συνδέοντας την τεράστια αυτοκρατορία τους.' }
  },
  {
    id: 'hist-15',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Who led the first expedition to reach the North Pole?', el: 'Ποιος ηγήθηκε της πρώτης αποστολής που έφτασε στον Βόρειο Πόλο;' },
    options: { en: ['Amundsen', 'Peary', 'Scott', 'Shackleton'], el: ['Άμουντσεν', 'Πίρυ', 'Σκοτ', 'Σάκλετον'] },
    correct: { en: 'Peary', el: 'Πίρυ' },
    explanation: { en: 'Robert Peary claimed to have reached the North Pole on April 6, 1909, though the claim has been debated.', el: 'Ο Robert Peary ισχυρίστηκε ότι έφτασε στον Βόρειο Πόλο στις 6 Απριλίου 1909, αν και ο ισχυρισμός του έχει αμφισβητηθεί.' }
  },
  {
    id: 'hist-16',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'Which ancient city was buried by the eruption of Mount Vesuvius?', el: 'Ποια αρχαία πόλη θάφτηκε από την έκρηξη του Βεζούβιου;' },
    options: { en: ['Herculaneum only', 'Pompeii', 'Rome', 'Naples'], el: ['Μόνο Ερκουλάνο', 'Πομπηία', 'Ρώμη', 'Νάπολη'] },
    correct: { en: 'Pompeii', el: 'Πομπηία' },
    explanation: { en: 'Pompeii and Herculaneum were buried by the 79 AD eruption; Pompeii is the more famous site preserved under volcanic ash.', el: 'Η Πομπηία και η Ερκουλάνο θάφτηκαν από την έκρηξη του 79 μ.Χ.· η Πομπηία είναι ο πιο διάσημος τόπος που διασώθηκε κάτω από ηφαιστειακή στάχτη.' }
  },
  {
    id: 'hist-17',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Which civilization invented the concept of zero?', el: 'Ποιος πολιτισμός εφηύρε την έννοια του μηδενός;' },
    options: { en: ['Greeks', 'Romans', 'Indian/Maya', 'Egyptians'], el: ['Έλληνες', 'Ρωμαίοι', 'Ινδικό/Μάγια', 'Αιγύπτιοι'] },
    correct: { en: 'Indian/Maya', el: 'Ινδικό/Μάγια' },
    explanation: { en: 'The concept of zero as a number was developed independently in India (around 5th century AD) and by the Maya civilization.', el: 'Η έννοια του μηδενός ως αριθμού αναπτύχθηκε ανεξάρτητα στην Ινδία (περίπου 5ος αιώνας μ.Χ.) και από τον πολιτισμό των Μάγια.' }
  },
  {
    id: 'hist-18',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Which country did Marco Polo travel from to reach China?', el: 'Από ποια χώρα ταξίδεψε ο Marco Polo για να φτάσει στην Κίνα;' },
    options: { en: ['Spain', 'Portugal', 'Italy', 'France'], el: ['Ισπανία', 'Πορτογαλία', 'Ιταλία', 'Γαλλία'] },
    correct: { en: 'Italy', el: 'Ιταλία' },
    explanation: { en: 'Marco Polo left Venice, Italy, in 1271 and spent about 17 years in Asia, including service under Kublai Khan.', el: 'Ο Marco Polo έφυγε από τη Βενετία της Ιταλίας το 1271 και πέρασε περίπου 17 χρόνια στην Ασία, συμπεριλαμβανομένης της υπηρεσίας υπό τον Κουμπλάι Χαν.' }
  },
  {
    id: 'hist-19',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'What was the name of the ship that brought the Mayflower Pilgrims to America?', el: 'Ποιο ήταν το όνομα του πλοίου που έφερε τους Προσκυνητές του Mayflower στην Αμερική;' },
    options: { en: ['Santa Maria', 'Mayflower', 'Speedwell', 'Endeavour'], el: ['Santa Maria', 'Mayflower', 'Speedwell', 'Endeavour'] },
    correct: { en: 'Mayflower', el: 'Mayflower' },
    explanation: { en: 'The Mayflower carried 102 Pilgrims from Plymouth, England, to Cape Cod in 1620, founding Plymouth Colony.', el: 'Το Mayflower μετέφερε 102 Προσκυνητές από το Plymouth της Αγγλίας στο Cape Cod το 1620, ιδρύοντας την αποικία Plymouth.' }
  },
  {
    id: 'hist-20',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'Which ancient library was one of the largest and most significant in the ancient world?', el: 'Ποια αρχαία βιβλιοθήκη ήταν μία από τις μεγαλύτερες και πιο σημαντικές στον αρχαίο κόσμο;' },
    options: { en: ['Library of Alexandria', 'Library of Pergamum', 'Vatican Library', 'Library of Athens'], el: ['Βιβλιοθήκη της Αλεξάνδρειας', 'Βιβλιοθήκη Περγάμου', 'Βατική Βιβλιοθήκη', 'Βιβλιοθήκη Αθηνών'] },
    correct: { en: 'Library of Alexandria', el: 'Βιβλιοθήκη της Αλεξάνδρειας' },
    explanation: { en: 'The Library of Alexandria, founded in the 3rd century BC, was a major center of scholarship and held hundreds of thousands of scrolls.', el: 'Η Βιβλιοθήκη της Αλεξάνδρειας, ιδρυμένη τον 3ο αιώνα π.Χ., ήταν κύριο κέντρο ακαδημαϊκών σπουδών και περιείχε εκατοντάδες χιλιάδες πάπυρους.' }
  },
  {
    id: 'hist-21',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Which continent did Portuguese explorer Pedro Álvares Cabral claim for Portugal in 1500?', el: 'Ποια ήπειρο διεκδίκησε ο Πορτογάλος εξερευνητής Pedro Álvares Cabral για την Πορτογαλία το 1500;' },
    options: { en: ['Africa', 'Asia', 'South America', 'Australia'], el: ['Αφρική', 'Ασία', 'Νότια Αμερική', 'Αυστραλία'] },
    correct: { en: 'South America', el: 'Νότια Αμερική' },
    explanation: { en: 'Cabral landed in Brazil in 1500, establishing the Portuguese claim that led to Brazil becoming a Portuguese colony.', el: 'Ο Cabral προσγειώθηκε στη Βραζιλία το 1500, καθιερώνοντας το πορτογαλικό αξίωμα που οδήγησε στη Βραζιλία να γίνει πορτογαλική αποικία.' }
  },
  {
    id: 'hist-22',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Who was the British explorer that mapped much of the Pacific and Australia?', el: 'Ποιος ήταν ο Βρετανός εξερευνητής που χαρτογράφησε μεγάλο μέρος του Ειρηνικού και της Αυστραλίας;' },
    options: { en: ['Drake', 'Cook', 'Raleigh', 'Hudson'], el: ['Ντρέικ', 'Κουκ', 'Ράλεϊ', 'Χάντσον'] },
    correct: { en: 'Cook', el: 'Κουκ' },
    explanation: { en: 'Captain James Cook made three voyages to the Pacific (1768–1779), mapping coastlines and making significant discoveries including parts of Australia.', el: 'Ο Λοχαγός James Cook έκανε τρεις ταξίδια στον Ειρηνικό (1768–1779), χαρτογραφώντας ακτογραμμές και κάνοντας σημαντικές ανακαλύψεις συμπεριλαμβανομένων τμημάτων της Αυστραλίας.' }
  },
  {
    id: 'hist-23',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'Which ancient civilization built the city of Petra?', el: 'Ποιος αρχαίος πολιτισμός έχτισε την πόλη της Πέτρας;' },
    options: { en: ['Romans', 'Egyptians', 'Nabataeans', 'Greeks'], el: ['Ρωμαίοι', 'Αιγύπτιοι', 'Ναβαταίοι', 'Έλληνες'] },
    correct: { en: 'Nabataeans', el: 'Ναβαταίοι' },
    explanation: { en: 'The Nabataeans, an Arab people, carved Petra into rose-red sandstone cliffs around 300 BC; it became a major trading hub.', el: 'Οι Ναβαταίοι, αραβικό λαό, ξεσκάλισαν την Πέτρα σε βράχους από ροζ-κόκκινο αμμόλιθο περίπου το 300 π.Χ.· έγινε σημαντικό εμπορικό κέντρο.' }
  },
  {
    id: 'hist-24',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'In which century did the Age of Exploration begin?', el: 'Σε ποιον αιώνα ξεκίνησε η Εποχή των Ανακαλύψεων;' },
    options: { en: ['13th', '14th', '15th', '16th'], el: ['13ος', '14ος', '15ος', '16ος'] },
    correct: { en: '15th', el: '15ος' },
    explanation: { en: 'The Age of Exploration began in the 15th century with Portuguese and Spanish voyages, driven by trade and the search for new routes.', el: 'Η Εποχή των Ανακαλύψεων ξεκίνησε τον 15ο αιώνα με τα ταξίδια των Πορτογάλων και Ισπανών, προωθούμενα από το εμπόριο και την αναζήτηση νέων διαδρομών.' }
  },
  {
    id: 'hist-25',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Which mountain did Tenzing Norgay and Edmund Hillary first ascend in 1953?', el: 'Ποιο βουνό ανέβηκαν πρώτοι οι Tenzing Norgay και Edmund Hillary το 1953;' },
    options: { en: ['K2', 'Mount Everest', 'Kangchenjunga', 'Lhotse'], el: ['K2', 'Έβερεστ', 'Κάντσενγκτζουνγκα', 'Λχότσε'] },
    correct: { en: 'Mount Everest', el: 'Έβερεστ' },
    explanation: { en: 'Edmund Hillary and Tenzing Norgay became the first climbers confirmed to reach the summit of Everest on May 29, 1953.', el: 'Οι Edmund Hillary και Tenzing Norgay ήταν οι πρώτοι ορειβάτες που επιβεβαιώθηκε ότι έφτασαν στην κορυφή του Έβερεστ στις 29 Μάιου 1953.' }
  },
  {
    id: 'hist-26',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Which ocean did Ferdinand Magellan name "Pacific"?', el: 'Ποιος ωκεανός ονομάστηκε "Ειρηνικός" από τον Ferdinand Magellan;' },
    options: { en: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], el: ['Ατλαντικός', 'Ινδικός', 'Ειρηνικός', 'Αρκτικός'] },
    correct: { en: 'Pacific', el: 'Ειρηνικός' },
    explanation: { en: 'Magellan named the Pacific Ocean "Mar Pacifico" (peaceful sea) because of its calm waters compared to the stormy Atlantic.', el: 'Ο Μαγγελάνος ονόμασε τον Ειρηνικό Ωκεανό "Mar Pacifico" (ειρηνική θάλασσα) λόγω των ήρεμων νερών του σε σύγκριση με τον θυελλώδη Ατλαντικό.' }
  },
  {
    id: 'hist-27',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'What was the ancient name of Istanbul before it became Constantinople?', el: 'Ποιο ήταν το αρχαίο όνομα της Κωνσταντινούπολης πριν γίνει Κωνσταντινούπολη;' },
    options: { en: ['Athens', 'Byzantium', 'Rome', 'Troy'], el: ['Αθήνα', 'Βυζάντιο', 'Ρώμη', 'Τροία'] },
    correct: { en: 'Byzantium', el: 'Βυζάντιο' },
    explanation: { en: 'The city was founded as Byzantium by Greek colonists around 657 BC; it was renamed Constantinople in 330 AD by Constantine the Great.', el: 'Η πόλη ιδρύθηκε ως Βυζάντιο από ελληνικούς αποίκους περίπου το 657 π.Χ.· μετονομάστηκε σε Κωνσταντινούπολη το 330 μ.Χ. από τον Κωνσταντίνο τον Μεγάλο.' }
  },
  {
    id: 'hist-28',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Which European power dominated the spice trade in the 17th century?', el: 'Ποια ευρωπαϊκή δύναμη κυριαρχούσε στο εμπόριο μπαχαρικών τον 17ο αιώνα;' },
    options: { en: ['Portugal', 'Spain', 'Netherlands', 'Britain'], el: ['Πορτογαλία', 'Ισπανία', 'Ολλανδία', 'Βρετανία'] },
    correct: { en: 'Netherlands', el: 'Ολλανδία' },
    explanation: { en: 'The Dutch East India Company (VOC) dominated the spice trade in the 17th century, controlling key ports in the Indonesian archipelago.', el: 'Η Ολλανδική Εταιρεία Ανατολικής Ινδίας (VOC) κυριαρχούσε στο εμπόριο μπαχαρικών τον 17ο αιώνα, ελέγχοντας βασικά λιμάνια στο ινδονησιακό αρχιπέλαγος.' }
  },
  {
    id: 'hist-29',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Who wrote "The Travels of Marco Polo"?', el: 'Ποιος έγραψε τα "Ταξίδια του Marco Polo";' },
    options: { en: ['Marco Polo', 'Rustichello', 'Columbus', 'Marco Polo with Rustichello'], el: ['Marco Polo', 'Rustichello', 'Κολόμβος', 'Marco Polo με τον Rustichello'] },
    correct: { en: 'Marco Polo with Rustichello', el: 'Marco Polo με τον Rustichello' },
    explanation: { en: 'Marco Polo dictated his travels to Rustichello da Pisa while imprisoned in Genoa; the book became one of the most influential travel accounts.', el: 'Ο Marco Polo διέταξε τα ταξίδια του στον Rustichello da Pisa ενώ ήταν φυλακισμένος στη Γένοβα· το βιβλίο έγινε μία από τις πιο επιδραστικές αφηγήσεις ταξιδιών.' }
  },
  {
    id: 'hist-30',
    category: 'History',
    difficulty: 'hard',
    question: { en: 'Which ancient civilization constructed the Great Wall of China?', el: 'Ποιος αρχαίος πολιτισμός έχτισε το Μεγάλο Τείχος της Κίνας;' },
    options: { en: ['Ming Dynasty only', 'Multiple dynasties over centuries', 'Qin Dynasty only', 'Han Dynasty only'], el: ['Μόνο Δυναστεία Ming', 'Πολλές δυναστείες επί αιώνες', 'Μόνο Δυναστεία Qin', 'Μόνο Δυναστεία Han'] },
    correct: { en: 'Multiple dynasties over centuries', el: 'Πολλές δυναστείες επί αιώνες' },
    explanation: { en: 'The Great Wall was built by multiple Chinese dynasties over many centuries, with the most famous sections built during the Ming Dynasty.', el: 'Το Μεγάλο Τείχος χτίστηκε από πολλές κινεζικές δυναστείες επί πολλούς αιώνες, με τα πιο διάσημα τμήματα να χτίστηκαν κατά τη Δυναστεία Ming.' }
  },
  {
    id: 'hist-31',
    category: 'History',
    difficulty: 'medium',
    question: { en: 'Which sea did the ancient Phoenicians dominate for trade?', el: 'Ποια θάλασσα κυριαρχούσαν οι αρχαίοι Φοίνικες στο εμπόριο;' },
    options: { en: ['Atlantic', 'Red Sea', 'Mediterranean', 'Black Sea'], el: ['Ατλαντικός', 'Ερυθρά Θάλασσα', 'Μεσόγειος', 'Μαύρη Θάλασσα'] },
    correct: { en: 'Mediterranean', el: 'Μεσόγειος' },
    explanation: { en: 'The Phoenicians were master sailors and traders who dominated Mediterranean commerce from their cities like Tyre and Carthage.', el: 'Οι Φοίνικες ήταν άριστου ναυτικούς και εμπόρους που κυριαρχούσαν στο εμπόριο της Μεσογείου από πόλεις όπως η Τύρος και η Καρχηδόνα.' }
  },
  {
    id: 'hist-32',
    category: 'History',
    difficulty: 'easy',
    question: { en: 'Which explorer is credited with naming America?', el: 'Ποιος εξερευνητής πιστώνεται με την ονομασία της Αμερικής;' },
    options: { en: ['Columbus', 'Amerigo Vespucci', 'Cabot', 'Magellan'], el: ['Κολόμβος', 'Amerigo Vespucci', 'Cabot', 'Μαγγελάνος'] },
    correct: { en: 'Amerigo Vespucci', el: 'Amerigo Vespucci' },
    explanation: { en: 'Amerigo Vespucci realized the lands were a new continent, not Asia; the name America derives from the Latin form of his first name.', el: 'Ο Amerigo Vespucci συνειδητοποίησε ότι τα εδάφη ήταν νέα ήπειρος, όχι Ασία· το όνομα Αμερική προέρχεται από τη λατινική μορφή του πρώτου του ονόματος.' }
  },

  // === New Exploration (23) ===
  {
    id: 'expl-11',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which continent is Antarctica?', el: 'Ποια ήπειρος είναι η Ανταρκτική;' },
    options: { en: ['An ice-covered southern continent', 'An island', 'Part of South America', 'Part of Australia'], el: ['Νότια ηπειρωτική χώρα με πάγο', 'Νησί', 'Μέρος της Νότιας Αμερικής', 'Μέρος της Αυστραλίας'] },
    correct: { en: 'An ice-covered southern continent', el: 'Νότια ηπειρωτική χώρα με πάγο' },
    explanation: { en: 'Antarctica is Earth\'s southernmost continent, almost entirely covered by ice and containing the South Pole.', el: 'Η Ανταρκτική είναι η νοτιότερη ήπειρος της Γης, σχεδόν εξ ολοκλήρου καλυμμένη από πάγο και περιέχει τον Νότιο Πόλο.' }
  },
  {
    id: 'expl-12',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'What is the name of the sea between Africa and the Arabian Peninsula?', el: 'Ποια είναι η ονομασία της θάλασσας μεταξύ Αφρικής και Αραβικής Χερσονήσου;' },
    options: { en: ['Mediterranean', 'Red Sea', 'Persian Gulf', 'Arabian Sea'], el: ['Μεσόγειος', 'Ερυθρά Θάλασσα', 'Περσικός Κόλπος', 'Αραβική Θάλασσα'] },
    correct: { en: 'Red Sea', el: 'Ερυθρά Θάλασσα' },
    explanation: { en: 'The Red Sea lies between Africa and the Arabian Peninsula and connects to the Mediterranean via the Suez Canal.', el: 'Η Ερυθρά Θάλασσα βρίσκεται μεταξύ Αφρικής και Αραβικής Χερσονήσου και συνδέεται με τη Μεσόγειο μέσω της Διώρυγας του Σουέζ.' }
  },
  {
    id: 'expl-13',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'Which is the second highest mountain in the world?', el: 'Ποιο είναι το δεύτερο ψηλότερο βουνό στον κόσμο;' },
    options: { en: ['K2', 'Kangchenjunga', 'Lhotse', 'Makalu'], el: ['K2', 'Κάντσενγκτζουνγκα', 'Λχότσε', 'Μακαλού'] },
    correct: { en: 'K2', el: 'K2' },
    explanation: { en: 'K2 in the Karakoram range stands at 8,611 m and is considered one of the most dangerous mountains to climb.', el: 'Το K2 στην οροσειρά Καρακορούμ υψώνεται σε 8.611 m και θεωρείται ένα από τα πιο επικίνδυνα βουνά για αναρρίχηση.' }
  },
  {
    id: 'expl-14',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which canal connects the Pacific and Atlantic Oceans?', el: 'Ποια διώρυγα συνδέει τον Ειρηνικό και τον Ατλαντικό Ωκεανό;' },
    options: { en: ['Suez Canal', 'Panama Canal', 'Kiel Canal', 'Corinth Canal'], el: ['Διώρυγα Σουέζ', 'Διώρυγα Παναμά', 'Διώρυγα Κιέλου', 'Διώρυγα Κορίνθου'] },
    correct: { en: 'Panama Canal', el: 'Διώρυγα Παναμά' },
    explanation: { en: 'The Panama Canal crosses the Isthmus of Panama, connecting the Pacific and Atlantic and saving ships thousands of miles of travel.', el: 'Η Διώρυγα του Παναμά διασχίζει τον Ισθμό του Παναμά, συνδέοντας τον Ειρηνικό και τον Ατλαντικό και εξοικονομώντας στα πλοία χιλιάδες μίλια ταξιδιού.' }
  },
  {
    id: 'expl-15',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which river is the largest by discharge volume in the world?', el: 'Ποιο ποτάμι έχει τη μεγαλύτερη εκροή νερού στον κόσμο;' },
    options: { en: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], el: ['Νείλος', 'Αμαζόνιος', 'Γιανγκτσέ', 'Μισισιπής'] },
    correct: { en: 'Amazon', el: 'Αμαζόνιος' },
    explanation: { en: 'The Amazon discharges about 209,000 m³/s of water—more than the next seven largest rivers combined.', el: 'Ο Αμαζόνιος εκβάλλει περίπου 209.000 m³/s νερού—περισσότερο από τις επόμενες επτά μεγαλύτερες ποτάμιες εκροές μαζί.' }
  },
  {
    id: 'expl-16',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'What is the largest country by land area?', el: 'Ποια είναι η μεγαλύτερη χώρα σε έκταση ξηράς;' },
    options: { en: ['Canada', 'China', 'Russia', 'United States'], el: ['Καναδάς', 'Κίνα', 'Ρωσία', 'Ηνωμένες Πολιτείες'] },
    correct: { en: 'Russia', el: 'Ρωσία' },
    explanation: { en: 'Russia covers about 17.1 million km², making it the largest country by land area—roughly twice the size of the United States.', el: 'Η Ρωσία καλύπτει περίπου 17,1 εκατομμύρια km², καθιστώντας την τη μεγαλύτερη χώρα σε έκταση ξηράς—περίπου διπλάσια από τις Ηνωμένες Πολιτείες.' }
  },
  {
    id: 'expl-17',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'Which country has the most active volcanoes?', el: 'Ποια χώρα έχει τα περισσότερα ενεργά ηφαίστεια;' },
    options: { en: ['Japan', 'Indonesia', 'Philippines', 'United States'], el: ['Ιαπωνία', 'Ινδονησία', 'Φιλιππίνες', 'Ηνωμένες Πολιτείες'] },
    correct: { en: 'Indonesia', el: 'Ινδονησία' },
    explanation: { en: 'Indonesia has about 127 active volcanoes, more than any other country, due to its location on the Pacific Ring of Fire.', el: 'Η Ινδονησία έχει περίπου 127 ενεργά ηφαίστεια, περισσότερα από οποιαδήποτε άλλη χώρα, λόγω της θέσης της στον Ειρηνικό Δακτύλιο της Φωτιάς.' }
  },
  {
    id: 'expl-18',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which waterfall has the greatest flow rate in the world?', el: 'Ποιος καταρράκτης έχει τη μεγαλύτερη παροχή νερού στον κόσμο;' },
    options: { en: ['Niagara Falls', 'Victoria Falls', 'Angel Falls', 'Iguazu Falls'], el: ['Νιαγάρα', 'Βικτώρια', 'Άγγελος', 'Ιγκουασού'] },
    correct: { en: 'Niagara Falls', el: 'Νιαγάρα' },
    explanation: { en: 'Niagara Falls has one of the highest flow rates among major waterfalls, with over 2,400 m³/s during peak flow.', el: 'Οι καταρράκτες της Νιαγάρας έχουν μία από τις υψηλότερες παροχές μεταξύ των μεγάλων καταρρακτών, με πάνω από 2.400 m³/s κατά τη μέγιστη ροή.' }
  },
  {
    id: 'expl-19',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which desert is the largest hot desert in the world?', el: 'Ποια έρημος είναι η μεγαλύτερη ζεστή έρημος στον κόσμο;' },
    options: { en: ['Gobi', 'Arabian', 'Sahara', 'Kalahari'], el: ['Γκόμπι', 'Αραβική', 'Σαχάρα', 'Καλαχάρι'] },
    correct: { en: 'Sahara', el: 'Σαχάρα' },
    explanation: { en: 'The Sahara covers about 9.2 million km² across North Africa, making it the world\'s largest hot desert.', el: 'Η Σαχάρα καλύπτει περίπου 9,2 εκατομμύρια km² σε ολόκληρη τη Βόρεια Αφρική, καθιστώντας την τη μεγαλύτερη ζεστή έρημο στον κόσμο.' }
  },
  {
    id: 'expl-20',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which sea is the largest enclosed inland body of water?', el: 'Ποια θάλασσα είναι η μεγαλύτερη κλειστή ενδοχωρική μάζα νερού;' },
    options: { en: ['Mediterranean', 'Caspian Sea', 'Black Sea', 'Aral Sea'], el: ['Μεσόγειος', 'Κασπία Θάλασσα', 'Μαύρη Θάλασσα', 'Θάλασσα Αράλ'] },
    correct: { en: 'Caspian Sea', el: 'Κασπία Θάλασσα' },
    explanation: { en: 'The Caspian Sea covers about 371,000 km² and is the world\'s largest inland body of water, bordered by five countries.', el: 'Η Κασπία Θάλασσα καλύπτει περίπου 371.000 km² και είναι η μεγαλύτερη ενδοχωρική μάζα νερού στον κόσμο, συνορεύει με πέντε χώρες.' }
  },
  {
    id: 'expl-21',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'Which mountain range runs along the western coast of South America?', el: 'Ποια οροσειρά εκτείνεται κατά μήκος της δυτικής ακτής της Νότιας Αμερικής;' },
    options: { en: ['Rocky Mountains', 'Himalayas', 'Andes', 'Sierra Madre'], el: ['Βραχώδη Όρη', 'Ιμαλάια', 'Άνδεις', 'Sierra Madre'] },
    correct: { en: 'Andes', el: 'Άνδεις' },
    explanation: { en: 'The Andes extend about 7,000 km along the Pacific coast of South America and include many of the continent\'s highest peaks.', el: 'Οι Άνδεις εκτείνονται περίπου 7.000 χλμ κατά μήκος της ακτής του Ειρηνικού στη Νότια Αμερική και περιλαμβάνουν πολλές από τις ψηλότερες κορυφές της ηπείρου.' }
  },
  {
    id: 'expl-22',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which ocean surrounds the Hawaiian Islands?', el: 'Ποιος ωκεανός περιβάλλει τα Νησιά Χαβάη;' },
    options: { en: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], el: ['Ατλαντικός', 'Ινδικός', 'Ειρηνικός', 'Αρκτικός'] },
    correct: { en: 'Pacific', el: 'Ειρηνικός' },
    explanation: { en: 'Hawaii is located in the central Pacific Ocean, approximately 3,200 km from the nearest continent.', el: 'Η Χαβάη βρίσκεται στον κεντρικό Ειρηνικό Ωκεανό, περίπου 3.200 χλμ από την πλησιέστερη ήπειρο.' }
  },
  {
    id: 'expl-23',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which country has the most borders with other countries?', el: 'Ποια χώρα έχει τα περισσότερα σύνορα με άλλες χώρες;' },
    options: { en: ['Russia', 'China', 'Brazil', 'Germany'], el: ['Ρωσία', 'Κίνα', 'Βραζιλία', 'Γερμανία'] },
    correct: { en: 'China', el: 'Κίνα' },
    explanation: { en: 'China shares borders with 14 countries—the most of any nation—including Russia, India, and several Central Asian states.', el: 'Η Κίνα συνορεύει με 14 χώρες—τις περισσότερες από οποιαδήποτε χώρα—συμπεριλαμβανομένων Ρωσίας, Ινδίας και πολλών χωρών της Κεντρικής Ασίας.' }
  },
  {
    id: 'expl-24',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'What is the name of the deepest trench in the Atlantic Ocean?', el: 'Ποιο είναι το όνομα της βαθύτερης τάφρου στον Ατλαντικό Ωκεανό;' },
    options: { en: ['Puerto Rico Trench', 'Romanche Trench', 'South Sandwich Trench', 'Cayman Trench'], el: ['Τάφρος Πουέρτο Ρίκο', 'Τάφρος Ρομάνς', 'Τάφρος South Sandwich', 'Τάφρος Κέιμαν'] },
    correct: { en: 'Puerto Rico Trench', el: 'Τάφρος Πουέρτο Ρίκο' },
    explanation: { en: 'The Puerto Rico Trench reaches about 8,376 m and is the deepest point in the Atlantic Ocean.', el: 'Η Τάφρος του Πουέρτο Ρίκο φτάνει σε βάθος περίπου 8.376 m και είναι το βαθύτερο σημείο στον Ατλαντικό Ωκεανό.' }
  },
  {
    id: 'expl-25',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which continent has the most countries?', el: 'Ποια ήπειρος έχει τις περισσότερες χώρες;' },
    options: { en: ['Asia', 'Europe', 'Africa', 'South America'], el: ['Ασία', 'Ευρώπη', 'Αφρική', 'Νότια Αμερική'] },
    correct: { en: 'Africa', el: 'Αφρική' },
    explanation: { en: 'Africa has 54 internationally recognized countries, the most of any continent.', el: 'Η Αφρική έχει 54 διεθνώς αναγνωρισμένες χώρες, τις περισσότερες από οποιαδήποτε ήπειρο.' }
  },
  {
    id: 'expl-26',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which river flows through the most countries?', el: 'Ποιο ποτάμι διασχίζει τις περισσότερες χώρες;' },
    options: { en: ['Amazon', 'Nile', 'Danube', 'Rhine'], el: ['Αμαζόνιος', 'Νείλος', 'Δούναβης', 'Ρήνος'] },
    correct: { en: 'Danube', el: 'Δούναβης' },
    explanation: { en: 'The Danube flows through or borders 10 countries—more than any other river—from Germany to the Black Sea.', el: 'Ο Δούναβης διασχίζει ή συνορεύει με 10 χώρες—περισσότερες από οποιοδήποτε άλλο ποτάμι—από τη Γερμανία ως τη Μαύρη Θάλασσα.' }
  },
  {
    id: 'expl-27',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'What is the capital of New Zealand?', el: 'Ποια είναι η πρωτεύουσα της Νέας Ζηλανδίας;' },
    options: { en: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'], el: ['Όκλαντ', 'Γουελλίνγκτον', 'Κράισττσερτς', 'Χάμιλτον'] },
    correct: { en: 'Wellington', el: 'Γουελλίνγκτον' },
    explanation: { en: 'Wellington became New Zealand\'s capital in 1865; it is the southernmost national capital in the world.', el: 'Το Wellington έγινε πρωτεύουσα της Νέας Ζηλανδίας το 1865· είναι η νοτιότερη εθνική πρωτεύουσα στον κόσμο.' }
  },
  {
    id: 'expl-28',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'Which African lake is the second largest by area and second deepest?', el: 'Ποια αφρικανική λίμνη είναι η δεύτερη μεγαλύτερη σε έκταση και η δεύτερη βαθύτερη;' },
    options: { en: ['Lake Victoria', 'Lake Tanganyika', 'Lake Malawi', 'Lake Chad'], el: ['Λίμνη Βικτώρια', 'Λίμνη Τανγκανίκα', 'Λίμνη Μαλάουι', 'Λίμνη Τσαντ'] },
    correct: { en: 'Lake Tanganyika', el: 'Λίμνη Τανγκανίκα' },
    explanation: { en: 'Lake Tanganyika is Africa\'s second largest by area and the world\'s second deepest at 1,470 m, after Lake Baikal.', el: 'Η Λίμνη Τανγκανίκα είναι η δεύτερη μεγαλύτερη της Αφρικής σε έκταση και η δεύτερη βαθύτερη στον κόσμο με 1.470 m, μετά τη Λίμνη Βαϊκάλη.' }
  },
  {
    id: 'expl-29',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which strait separates the UK from mainland Europe?', el: 'Ποιο στενό χωρίζει το Ηνωμένο Βασίλειο από την ηπειρωτική Ευρώπη;' },
    options: { en: ['Gibraltar', 'Dover', 'English Channel', 'Bosporus'], el: ['Γιβραλτάρ', 'Dover', 'Κανάλι της Μάγχης', 'Βόσπορος'] },
    correct: { en: 'English Channel', el: 'Κανάλι της Μάγχης' },
    explanation: { en: 'The English Channel (La Manche) separates southern England from northern France; the Strait of Dover is its narrowest point.', el: 'Το Κανάλι της Μάγχης χωρίζει τη νότια Αγγλία από τη βόρεια Γαλλία· το Στενό του Dover είναι το πιο στενό σημείο του.' }
  },
  {
    id: 'expl-30',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which country is known as the Land of the Rising Sun?', el: 'Ποια χώρα είναι γνωστή ως η Χώρα του Ανατέλλοντος Ηλίου;' },
    options: { en: ['China', 'Korea', 'Japan', 'Vietnam'], el: ['Κίνα', 'Κορέα', 'Ιαπωνία', 'Βιετνάμ'] },
    correct: { en: 'Japan', el: 'Ιαπωνία' },
    explanation: { en: 'Japan is called "Land of the Rising Sun" because it lies east of China, from where the sun appears to rise.', el: 'Η Ιαπωνία ονομάζεται "Χώρα του Ανατέλλοντος Ηλίου" επειδή βρίσκεται ανατολικά της Κίνας, από όπου φαίνεται να ανατέλλει ο ήλιος.' }
  },
  {
    id: 'expl-31',
    category: 'Exploration',
    difficulty: 'medium',
    question: { en: 'Which mountain is sacred in both Hinduism and Buddhism?', el: 'Ποιο βουνό είναι ιερό και στον Ινδουισμό και στον Βουδισμό;' },
    options: { en: ['Mount Everest', 'Mount Kailash', 'Mount Fuji', 'Mount Sinai'], el: ['Έβερεστ', 'Καϊλάς', 'Φουτζι', 'Σινά'] },
    correct: { en: 'Mount Kailash', el: 'Καϊλάς' },
    explanation: { en: 'Mount Kailash in Tibet is considered sacred in Hinduism, Buddhism, Jainism, and Bon; pilgrims circumambulate it rather than climb.', el: 'Το Όρος Καϊλάς στο Θιβέτ θεωρείται ιερό στον Ινδουισμό, Βουδισμό, Τζαϊνισμό και Μπον· οι προσκυνητές το περιφέρουν αντί να το ανεβαίνουν.' }
  },
  {
    id: 'expl-32',
    category: 'Exploration',
    difficulty: 'hard',
    question: { en: 'Which country contains both the highest and lowest points in the Western Hemisphere?', el: 'Ποια χώρα περιέχει και το ψηλότερο και το χαμηλότερο σημείο στο Δυτικό Ημισφαίριο;' },
    options: { en: ['United States', 'Chile', 'Argentina', 'Peru'], el: ['Ηνωμένες Πολιτείες', 'Χιλή', 'Αργεντινή', 'Περού'] },
    correct: { en: 'United States', el: 'Ηνωμένες Πολιτείες' },
    explanation: { en: 'Mount Whitney (4,421 m) and Death Valley\'s Badwater Basin (-86 m) are both in California, USA.', el: 'Το Όρος Whitney (4.421 m) και το Badwater Basin της Death Valley (-86 m) βρίσκονται και τα δύο στην Καλιφόρνια των ΗΠΑ.' }
  },
  {
    id: 'expl-33',
    category: 'Exploration',
    difficulty: 'easy',
    question: { en: 'Which sea is sometimes called an ocean?', el: 'Ποια θάλασσα ονομάζεται μερικές φορές ωκεανός;' },
    options: { en: ['Mediterranean', 'Caspian Sea', 'Black Sea', 'Red Sea'], el: ['Μεσόγειος', 'Κασπία Θάλασσα', 'Μαύρη Θάλασσα', 'Ερυθρά Θάλασσα'] },
    correct: { en: 'Caspian Sea', el: 'Κασπία Θάλασσα' },
    explanation: { en: 'The Caspian Sea is often called the world\'s largest lake or a "sea" due to its size; it has no connection to the ocean.', el: 'Η Κασπία Θάλασσα συχνά καλείται η μεγαλύτερη λίμνη του κόσμου ή "θάλασσα" λόγω του μεγέθους της· δεν έχει σύνδεση με τον ωκεανό.' }
  }
];
