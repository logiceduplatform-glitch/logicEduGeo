export const questionsEdutainment = [
  // === Technology (5) ===
  {
    id: 'tech-1',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What does "HTML" stand for?', el: 'Τι σημαίνει «HTML»;' },
    options: {
      en: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
      el: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language']
    },
    correct: { en: 'HyperText Markup Language', el: 'HyperText Markup Language' },
    explanation: { en: 'HTML is the standard markup language for creating web pages. The name describes its purpose: it uses hypertext to link documents together and mark up content with tags.', el: 'Το HTML είναι η τυπική γλώσσα σήμανσης για τη δημιουργία ιστοσελίδων. Το όνομα περιγράφει τον σκοπό της: χρησιμοποιεί υπερκείμενο για να συνδέει έγγραφα και να σηματοδοτεί περιεχόμενο με ετικέτες.' }
  },
  {
    id: 'tech-2',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'In what year was the first iPhone released?', el: 'Ποια χρονιά κυκλοφόρησε το πρώτο iPhone;' },
    options: [2005, 2007, 2009],
    correct: 2007,
    explanation: { en: 'Apple announced the iPhone in January 2007 and released it in June 2007. It revolutionized the smartphone industry by introducing a touchscreen interface and combining phone, music player, and internet in one device.', el: 'Η Apple ανακοίνωσε το iPhone τον Ιανουάριο του 2007 και το κυκλοφόρησε τον Ιούνιο του 2007. Επανάντρεψε τη βιομηχανία smartphone εισάγοντας διεπαφή αφής και συνδυάζοντας τηλέφωνο, αναπαραγωγέα μουσικής και διαδίκτυο σε μία συσκευή.' }
  },
  {
    id: 'tech-3',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What does "CPU" stand for?', el: 'Τι σημαίνει «CPU»;' },
    options: {
      en: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility'],
      el: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility']
    },
    correct: { en: 'Central Processing Unit', el: 'Central Processing Unit' },
    explanation: { en: 'The CPU is the main processor of a computer that executes program instructions and performs calculations. It is often called the "brain" of the computer.', el: 'Η CPU είναι ο κύριος επεξεργαστής ενός υπολογιστή που εκτελεί οδηγίες προγραμμάτων και πραγματοποιεί υπολογισμούς. Συχνά αποκαλείται το "εγκέφαλο" του υπολογιστή.' }
  },
  {
    id: 'tech-4',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'Who co-founded Apple Inc.?', el: 'Ποιος συνίδρυσε την Apple;' },
    options: { en: ['Bill Gates', 'Steve Jobs', 'Elon Musk'], el: ['Bill Gates', 'Steve Jobs', 'Elon Musk'] },
    correct: { en: 'Steve Jobs', el: 'Steve Jobs' },
    explanation: { en: 'Steve Jobs co-founded Apple with Steve Wozniak and Ronald Wayne in 1976. He led the company to create revolutionary products like the Macintosh, iPod, iPhone, and iPad.', el: 'Ο Στιβ Τζομπς συνίδρυσε την Apple με τον Steve Wozniak και τον Ronald Wayne το 1976. Ηγήθηκε της εταιρείας στη δημιουργία επαναστατικών προϊόντων όπως το Macintosh, το iPod, το iPhone και το iPad.' }
  },
  {
    id: 'tech-5',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What programming language is known as the "language of the web"?', el: 'Ποια γλώσσα προγραμματισμού είναι γνωστή ως «γλώσσα του web»;' },
    options: { en: ['Python', 'JavaScript', 'C++'], el: ['Python', 'JavaScript', 'C++'] },
    correct: { en: 'JavaScript', el: 'JavaScript' },
    explanation: { en: 'JavaScript runs natively in web browsers and powers interactive features on almost every website. Together with HTML and CSS, it forms the core of modern web development.', el: 'Η JavaScript τρέχει εγγενώς στα προγράμματα περιήγησης και τροφοδοτεί διαδραστικές λειτουργίες σχεδόν σε κάθε ιστοσελίδα. Μαζί με το HTML και το CSS, αποτελεί τον πυρήνα της σύγχρονης ανάπτυξης web.' }
  },

  // === Culture & Arts (5) ===
  {
    id: 'culture-1',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Who wrote "Romeo and Juliet"?', el: 'Ποιος έγραψε τον «Ρωμαίο και Ιουλιέτα»;' },
    options: { en: ['Dickens', 'Shakespeare', 'Hemingway'], el: ['Ντίκενς', 'Σαίξπηρ', 'Χέμινγουεϊ'] },
    correct: { en: 'Shakespeare', el: 'Σαίξπηρ' },
    explanation: { en: 'William Shakespeare wrote "Romeo and Juliet" in the 1590s. It is one of his most famous tragedies, telling the story of two young lovers from feuding families in Verona.', el: 'Ο Ουίλλιαμ Σαίξπηρ έγραψε τον «Ρωμαίο και Ιουλιέτα» τη δεκαετία του 1590. Είναι μια από τις πιο διάσημες τραγωδίες του, που αφηγείται την ιστορία δύο νέων ερωτευμένων από εχθρικές οικογένειες στη Βερόνα.' }
  },
  {
    id: 'culture-2',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'In which city is the Louvre Museum?', el: 'Σε ποια πόλη βρίσκεται το Μουσείο του Λούβρου;' },
    options: { en: ['London', 'Paris', 'Rome'], el: ['Λονδίνο', 'Παρίσι', 'Ρώμη'] },
    correct: { en: 'Paris', el: 'Παρίσι' },
    explanation: { en: 'The Louvre Museum is located in Paris, France. It is one of the world\'s largest art museums and houses masterpieces like the Mona Lisa.', el: 'Το Μουσείο του Λούβρου βρίσκεται στο Παρίσι της Γαλλίας. Είναι ένα από τα μεγαλύτερα μουσεία τέχνης στον κόσμο και φιλοξενεί αριστουργήματα όπως τη Μόνα Λίζα.' }
  },
  {
    id: 'culture-3',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Who composed "The Four Seasons"?', el: 'Ποιος συνέθεσε τις «Τέσσερις Εποχές»;' },
    options: { en: ['Bach', 'Vivaldi', 'Mozart'], el: ['Μπαχ', 'Βιβάλντι', 'Μότσαρτ'] },
    correct: { en: 'Vivaldi', el: 'Βιβάλντι' },
    explanation: { en: 'Antonio Vivaldi composed "The Four Seasons" in 1723. It is a set of four violin concertos, each representing one season of the year through music.', el: 'Ο Αντόνιο Βιβάλντι συνέθεσε τις «Τέσσερις Εποχές» το 1723. Είναι μια σειρά τεσσάρων κονσέρτων για βιολί, καθένα εκπροσωπώντας μία εποχή του χρόνου μέσω της μουσικής.' }
  },
  {
    id: 'culture-4',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'What is the Mona Lisa famous for?', el: 'Για τι είναι φημισμένη η Μόνα Λίζα;' },
    options: {
      en: ['Her mysterious smile', 'Her blue eyes', 'The landscape behind her'],
      el: ['Το μυστηριώδες χαμόγελό της', 'Τα μπλε μάτια της', 'Το τοπίο πίσω της']
    },
    correct: { en: 'Her mysterious smile', el: 'Το μυστηριώδες χαμόγελό της' },
    explanation: { en: 'Leonardo da Vinci\'s Mona Lisa is famous for its subject\'s enigmatic smile, which seems to change when viewed from different angles—a technique called sfumato that Da Vinci mastered.', el: 'Η Μόνα Λίζα του Λεονάρντο ντα Βίντσι είναι διάσημη για το μυστηριώδες χαμόγελο του θέματος, που φαίνεται να αλλάζει όταν παρατηρείται από διαφορετικές γωνίες—μια τεχνική που ονομάζεται sfumato την οποία κυριαρχούσε ο Ντα Βίντσι.' }
  },
  {
    id: 'culture-5',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'Which Greek philosopher was Plato\'s teacher?', el: 'Ποιος Έλληνας φιλόσοφος ήταν δάσκαλος του Πλάτωνα;' },
    options: { en: ['Aristotle', 'Socrates', 'Epicurus'], el: ['Αριστοτέλης', 'Σωκράτης', 'Επίκουρος'] },
    correct: { en: 'Socrates', el: 'Σωκράτης' },
    explanation: { en: 'Socrates was Plato\'s teacher in Athens. This teaching chain—Socrates taught Plato, who taught Aristotle—forms the foundation of Western philosophy.', el: 'Ο Σωκράτης ήταν δάσκαλος του Πλάτωνα στην Αθήνα. Αυτή η αλυσίδα διδασκαλίας—ο Σωκράτης δίδαξε τον Πλάτωνα, που δίδαξε τον Αριστοτέλη—αποτελεί τη βάση της Δυτικής φιλοσοφίας.' }
  },

  // === Sports & Entertainment (5) ===
  {
    id: 'sport-1',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'How many players are on a football (soccer) team on the field?', el: 'Πόσοι παίκτες έχει μια ποδοσφαιρική ομάδα στο γήπεδο;' },
    options: [9, 11, 13],
    correct: 11,
    explanation: { en: 'According to FIFA rules, each team fields 11 players on the pitch at any time, including one goalkeeper. This has been the standard since the modern rules were codified.', el: 'Σύμφωνα με τους κανόνες της FIFA, κάθε ομάδα έχει 11 παίκτες στο γήπεδο ανά πάσα στιγμή, συμπεριλαμβανομένου ενός τερματοφύλακα. Αυτό είναι το πρότυπο από τότε που καταγράφηκαν οι σύγχρονοι κανόνες.' }
  },
  {
    id: 'sport-2',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'In which country did the Olympic Games originate?', el: 'Σε ποια χώρα ξεκίνησαν οι Ολυμπιακοί Αγώνες;' },
    options: { en: ['Italy', 'Greece', 'Egypt'], el: ['Ιταλία', 'Ελλάδα', 'Αίγυπτος'] },
    correct: { en: 'Greece', el: 'Ελλάδα' },
    explanation: { en: 'The ancient Olympic Games began in Olympia, Greece in 776 BC. The modern Olympic Games were revived in Athens in 1896 to honor this Greek tradition.', el: 'Οι αρχαίοι Ολυμπιακοί Αγώνες ξεκίνησαν στην Ολυμπία της Ελλάδας το 776 π.Χ. Οι σύγχρονοι Ολυμπιακοί Αγώνες αναβιώθηκαν στην Αθήνα το 1896 προς τιμήν αυτής της ελληνικής παράδοσης.' }
  },
  {
    id: 'sport-3',
    category: 'Sports',
    difficulty: 'hard',
    question: { en: 'How long is a marathon in kilometers?', el: 'Πόσα χιλιόμετρα είναι ένας μαραθώνιος;' },
    options: { en: ['38.195 km', '42.195 km', '45.195 km'], el: ['38,195 χλμ', '42,195 χλμ', '45,195 χλμ'] },
    correct: { en: '42.195 km', el: '42,195 χλμ' },
    explanation: { en: 'The marathon distance was standardized at 42.195 km (26.2 miles) in 1921. This distance comes from the 1908 London Olympics route from Windsor Castle to the stadium.', el: 'Η απόσταση του μαραθωνίου ορίστηκε στα 42,195 χλμ (26,2 μίλια) το 1921. Αυτή η απόσταση προέρχεται από τη διαδρομή των Ολυμπιακών Αγώνων του Λονδίνου του 1908 από το κάστρο Windsor μέχρι το στάδιο.' }
  },
  {
    id: 'sport-4',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'Which planet is known as the Red Planet?', el: 'Ποιος πλανήτης είναι γνωστός ως Κόκκινος Πλανήτης;' },
    options: { en: ['Venus', 'Mars', 'Jupiter'], el: ['Αφροδίτη', 'Άρης', 'Δίας'] },
    correct: { en: 'Mars', el: 'Άρης' },
    explanation: { en: 'Mars appears red because its surface is rich in iron oxide (rust). The reddish dust and rocks give the planet its distinctive color visible from Earth.', el: 'Ο Άρης φαίνεται κόκκινος επειδή η επιφάνειά του είναι πλούσια σε οξείδιο του σιδήρου (σκουριά). Η κοκκινωπή σκόνη και οι βράχοι δίνουν στον πλανήτη το χαρακτηριστικό χρώμα που είναι ορατό από τη Γη.' }
  },
  {
    id: 'sport-5',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'Which movie won the first ever Academy Award for Best Picture?', el: 'Ποια ταινία κέρδισε το πρώτο Όσκαρ Καλύτερης Ταινίας;' },
    options: { en: ['Wings', 'Sunrise', 'The Jazz Singer'], el: ['Wings', 'Sunrise', 'The Jazz Singer'] },
    correct: { en: 'Wings', el: 'Wings' },
    explanation: { en: '"Wings" (1927), a World War I drama directed by William A. Wellman, won the first Academy Award for Best Picture at the inaugural Oscars ceremony in 1929.', el: 'Η ταινία «Wings» (1927), δράμα του Α΄ Παγκοσμίου Πόλεμου σε σκηνοθεσία του William A. Wellman, κέρδισε το πρώτο Όσκαρ Καλύτερης Ταινίας στην πρώτη τελετή των Oscars το 1929.' }
  },

  // === Technology (5 more) ===
  {
    id: 'tech-6',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What does "API" stand for in programming?', el: 'Τι σημαίνει «API» στον προγραμματισμό;' },
    options: { en: ['Application Programming Interface', 'Automated Protocol Integration', 'Advanced Program Instruction', 'Application Process Input'], el: ['Application Programming Interface', 'Automated Protocol Integration', 'Advanced Program Instruction', 'Application Process Input'] },
    correct: { en: 'Application Programming Interface', el: 'Application Programming Interface' },
    explanation: { en: 'An API defines how different software applications communicate with each other. It allows developers to integrate services and share data without knowing the internal implementation.', el: 'Ένα API ορίζει πώς διάφορες εφαρμογές λογισμικού επικοινωνούν μεταξύ τους. Επιτρέπει στους προγραμματιστές να ενσωματώσουν υπηρεσίες και να μοιράζονται δεδομένα χωρίς να γνωρίζουν την εσωτερική υλοποίηση.' }
  },
  {
    id: 'tech-7',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What AI technique enables machines to learn from data without explicit programming?', el: 'Ποια τεχνική AI επιτρέπει στα μηχανήματα να μαθαίνουν από δεδομένα χωρίς ρητό προγραμματισμό;' },
    options: { en: ['Machine Learning', 'Rule-based systems', 'Manual coding', 'Static databases'], el: ['Μηχανική Μάθηση', 'Κανόνα-βασισμένα συστήματα', 'Χειροκίνητη κωδικοποίηση', 'Στατικές βάσεις δεδομένων'] },
    correct: { en: 'Machine Learning', el: 'Μηχανική Μάθηση' },
    explanation: { en: 'Machine Learning enables computers to learn patterns from data and improve their performance over time without being explicitly programmed for each scenario.', el: 'Η Μηχανική Μάθηση επιτρέπει στους υπολογιστές να μαθαίνουν μοτίβα από δεδομένα και να βελτιώνουν την απόδοσή τους χωρίς να προγραμματίζονται ρητά για κάθε σενάριο.' }
  },
  {
    id: 'tech-8',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What does "HTTP" stand for in the context of the internet?', el: 'Τι σημαίνει «HTTP» στο πλαίσιο του διαδικτύου;' },
    options: { en: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Host Transfer Technology Protocol', 'Hyperlink Transmission Process'], el: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Host Transfer Technology Protocol', 'Hyperlink Transmission Process'] },
    correct: { en: 'HyperText Transfer Protocol', el: 'HyperText Transfer Protocol' },
    explanation: { en: 'HTTP is the protocol that governs how web browsers request and receive web pages from servers. It is the foundation of data exchange on the World Wide Web.', el: 'Το HTTP είναι το πρωτόκολλο που διέπει πώς τα προγράμματα περιήγησης ζητούν και λαμβάνουν ιστοσελίδες από διακομιστές. Είναι η βάση της ανταλλαγής δεδομένων στο Παγκόσμιο Ιστό.' }
  },
  {
    id: 'tech-9',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'Which company makes the Galaxy series of smartphones?', el: 'Ποια εταιρεία κατασκευάζει τη σειρά smartphones Galaxy;' },
    options: { en: ['Apple', 'Samsung', 'Google', 'Xiaomi'], el: ['Apple', 'Samsung', 'Google', 'Xiaomi'] },
    correct: { en: 'Samsung', el: 'Samsung' },
    explanation: { en: 'Samsung Electronics, a South Korean company, manufactures the Galaxy series—one of the world\'s best-selling smartphone lines competing directly with Apple\'s iPhone.', el: 'Η Samsung Electronics, νοτιοκορεατική εταιρεία, κατασκευάζει τη σειρά Galaxy—μια από τις πιο πωλούμενες σειρές smartphone στον κόσμο που ανταγωνίζεται απευθείας το iPhone της Apple.' }
  },
  {
    id: 'tech-10',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What is "blockchain" primarily used for in cryptocurrency?', el: 'Για τι χρησιμοποιείται κυρίως το «blockchain» στα κρυπτονομίσματα;' },
    options: { en: ['Decentralized ledger', 'Cloud storage', 'Email encryption', 'Video streaming'], el: ['Κατατεθειμένο καθολικό βιβλίο', 'Αποθήκευση cloud', 'Κρυπτογράφηση email', 'Streaming βίντεο'] },
    correct: { en: 'Decentralized ledger', el: 'Κατατεθειμένο καθολικό βιβλίο' },
    explanation: { en: 'Blockchain is a distributed ledger that records transactions across many computers. It enables transparency and security in cryptocurrencies like Bitcoin without a central authority.', el: 'Το blockchain είναι ένα διανεμημένο βιβλίο που καταγράφει συναλλαγές σε πολλούς υπολογιστές. Επιτρέπει διαφάνεια και ασφάλεια στα κρυπτονομίσματα όπως το Bitcoin χωρίς κεντρική αρχή.' }
  },

  // === Culture (5 more) ===
  {
    id: 'cult-6',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'Who painted "The Starry Night"?', el: 'Ποιος ζωγράφισε τη «Αστροφεγγιά»;' },
    options: { en: ['Picasso', 'Van Gogh', 'Monet', 'Rembrandt'], el: ['Πικάσο', 'Βαν Γκογκ', 'Μονέ', 'Ρέμπραντ'] },
    correct: { en: 'Van Gogh', el: 'Βαν Γκογκ' },
    explanation: { en: 'Vincent van Gogh painted "The Starry Night" in 1889 while in an asylum in Saint-Rémy, France. It is one of the most recognized works of Post-Impressionist art.', el: 'Ο Βίνσεντ βαν Γκογκ ζωγράφισε την «Αστροφεγγιά» το 1889 ενώ βρισκόταν σε άσυλο στο Saint-Rémy της Γαλλίας. Είναι ένα από τα πιο αναγνωρίσιμα έργα της μετα-ιμπρεσιονιστικής τέχνης.' }
  },
  {
    id: 'cult-7',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Which composer wrote the opera "Carmen"?', el: 'Ποιος συνθέτης έγραψε την όπερα «Κάρμεν»;' },
    options: { en: ['Verdi', 'Bizet', 'Puccini', 'Wagner'], el: ['Βέρντι', 'Μπιζέ', 'Πουτσίνι', 'Βάγκνερ'] },
    correct: { en: 'Bizet', el: 'Μπιζέ' },
    explanation: { en: 'Georges Bizet composed the opera "Carmen" in 1875. Although it initially received mixed reviews, it later became one of the most performed operas worldwide.', el: 'Ο Ζωρζ Μπιζέ συνέθεσε την όπερα «Κάρμεν» το 1875. Αν και αρχικά έλαβε ανάμικτες κριτικές, αργότερα έγινε μία από τις πιο ανεβασμένες όπερες παγκοσμίως.' }
  },
  {
    id: 'cult-8',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'In which year did the first "Star Wars" film premiere?', el: 'Ποια χρονιά έκανε πρεμιέρα η πρώτη ταινία «Star Wars»;' },
    options: { en: ['1975', '1977', '1979', '1981'], el: ['1975', '1977', '1979', '1981'] },
    correct: { en: '1977', el: '1977' },
    explanation: { en: '"Star Wars: Episode IV - A New Hope" premiered on May 25, 1977. It became a global phenomenon and launched one of the most successful film franchises in history.', el: 'Το «Star Wars: Episode IV - A New Hope» έκανε πρεμιέρα στις 25 Μαΐου 1977. Έγινε παγκόσμιο φαινόμενο και ξεκίνησε μία από τις πιο επιτυχημένες franchises ταινιών στην ιστορία.' }
  },
  {
    id: 'cult-9',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'Who wrote "1984"?', el: 'Ποιος έγραψε το «1984»;' },
    options: { en: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H.G. Wells'], el: ['Άλντους Χάξλεϋ', 'Τζορτζ Όργουελ', 'Ρέι Μπράντμπερι', 'H.G. Γουέλς'] },
    correct: { en: 'George Orwell', el: 'Τζορτζ Όργουελ' },
    explanation: { en: 'George Orwell wrote "1984" in 1949. The dystopian novel depicts totalitarian surveillance and remains a powerful commentary on authoritarianism and propaganda.', el: 'Ο Τζορτζ Όργουελ έγραψε το «1984» το 1949. Το dystopian μυθιστόρημα απεικονίζει την ολοκληρωτική παρακολούθηση και παραμένει ένα ισχυρό σχόλιο για τον αυταρχισμό και την προπαγάνδα.' }
  },
  {
    id: 'cult-10',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Which museum houses the Sistine Chapel ceiling painted by Michelangelo?', el: 'Ποιο μουσείο φιλοξενεί την οροφή της Σιστιναίνης Καπέλας που ζωγράφισε ο Μιχαήλ Άγγελος;' },
    options: { en: ['Uffizi Gallery', 'Vatican Museums', 'Louvre', 'British Museum'], el: ['Πινακοθήκη Ουφίτσι', 'Μουσεία του Βατικανού', 'Λούβρο', 'Βρετανικό Μουσείο'] },
    correct: { en: 'Vatican Museums', el: 'Μουσεία του Βατικανού' },
    explanation: { en: 'The Sistine Chapel is part of the Vatican Museums in Vatican City. Michelangelo painted its ceiling between 1508 and 1512, creating one of the greatest masterpieces of Renaissance art.', el: 'Η Σιστινή Καπέλα είναι τμήμα των Μουσείων του Βατικανού στην Πόλη του Βατικανού. Ο Μιχαήλ Άγγελος ζωγράφισε την οροφή της μεταξύ 1508 και 1512, δημιουργώντας ένα από τα μεγαλύτερα αριστουργήματα της τέχνης της Αναγέννησης.' }
  },

  // === Sports (5 more) ===
  {
    id: 'sport-6',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'How many rings are on the Olympic flag?', el: 'Πόσοι δακτύλιοι έχει η ολυμπιακή σημαία;' },
    options: { en: ['Three', 'Four', 'Five', 'Six'], el: ['Τρεις', 'Τέσσερις', 'Πέντε', 'Έξι'] },
    correct: { en: 'Five', el: 'Πέντε' },
    explanation: { en: 'The five rings represent the five continents and the unity of athletes worldwide. The Olympic flag was designed by Pierre de Coubertin in 1913.', el: 'Οι πέντε δακτύλιοι αντιπροσωπεύουν τις πέντε ηπείρους και την ενότητα των αθλητών παγκοσμίως. Η ολυμπιακή σημαία σχεδιάστηκε από τον Pierre de Coubertin το 1913.' }
  },
  {
    id: 'sport-7',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'What is the maximum number of players a football club can register for a Champions League match?', el: 'Ποιος είναι ο μέγιστος αριθμός παικτών που μπορεί μια ποδοσφαιρική ομάδα να δηλώσει σε αγώνα Champions League;' },
    options: { en: ['18', '20', '23', '25'], el: ['18', '20', '23', '25'] },
    correct: { en: '25', el: '25' },
    explanation: { en: 'UEFA Champions League rules allow each club to register a maximum of 25 players for the squad list. This includes both home-grown and foreign players within the registration limits.', el: 'Οι κανόνες του Champions League της UEFA επιτρέπουν σε κάθε ομάδα να δηλώσει μέγιστο 25 παίκτες στη λίστα. Αυτό περιλαμβάνει τόσο ντόπιους όσο και ξένους παίκτες στα όρια δήλωσης.' }
  },
  {
    id: 'sport-8',
    category: 'Sports',
    difficulty: 'hard',
    question: { en: 'Who holds the men\'s 100m world record (as of 2024)?', el: 'Ποιος κατέχει το παγκόσμιο ρεκόρ των ανδρών στα 100μ (έως 2024);' },
    options: { en: ['Usain Bolt', 'Tyson Gay', 'Asafa Powell', 'Justin Gatlin'], el: ['Γιουσεΐν Μπολτ', 'Τάισον Γκέι', 'Ασάφα Πάουελ', 'Τζάστιν Γκάτλιν'] },
    correct: { en: 'Usain Bolt', el: 'Γιουσεΐν Μπολτ' },
    explanation: { en: 'Usain Bolt set the men\'s 100m world record of 9.58 seconds at the 2009 World Championships in Berlin. This record still stood as of 2024.', el: 'Ο Γιουσεΐν Μπολτ σημείωσε το παγκόσμιο ρεκόρ ανδρών στα 100μ με 9,58 δευτερόλεπτα στα Παγκόσμια Πρωταθλήματα του 2009 στο Βερολίνο. Αυτό το ρεκόρ ισχύει ακόμα έως το 2024.' }
  },
  {
    id: 'sport-9',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'In which sport is the "Tour de France" held?', el: 'Σε ποιο άθλημα πραγματοποιείται το «Tour de France»;' },
    options: { en: ['Running', 'Swimming', 'Cycling', 'Triathlon'], el: ['Στίβος', 'Κολύμπι', 'Ποδηλασία', 'Τρίαθλο'] },
    correct: { en: 'Cycling', el: 'Ποδηλασία' },
    explanation: { en: 'The Tour de France is an annual men\'s multi-stage bicycle race held primarily in France. It is one of the three Grand Tours and the most prestigious cycling race in the world.', el: 'Το Tour de France είναι ετήσιος ποδηλατικός αγώνας ανδρών πολλών σταδίων που πραγματοποιείται κυρίως στη Γαλλία. Είναι ένας από τους τρεις Grand Tours και ο πιο διαπρεπής ποδηλατικός αγώνας στον κόσμο.' }
  },
  {
    id: 'sport-10',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'What is the world record for the men\'s long jump (athletics)?', el: 'Ποιο είναι το παγκόσμιο ρεκόρ στο άλμα εις μήκος ανδρών (στίβος);' },
    options: { en: ['8.90 m', '8.95 m', '9.00 m', '9.15 m'], el: ['8,90 μ', '8,95 μ', '9,00 μ', '9,15 μ'] },
    correct: { en: '8.95 m', el: '8,95 μ' },
    explanation: { en: 'Mike Powell set the men\'s long jump world record of 8.95 m at the 1991 World Championships in Tokyo. It broke Bob Beamon\'s legendary 8.90 m record from 1968.', el: 'Ο Mike Powell σημείωσε το παγκόσμιο ρεκόρ άλματος εις μήκος ανδρών με 8,95 μ στα Παγκόσμια Πρωταθλήματα του 1991 στο Τόκιο. Ξεπέρασε το θρυλικό ρεκόρ 8,90 μ του Bob Beamon από το 1968.' }
  },

  // === 70 NEW QUESTIONS ===
  {
    id: 'tech-11',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'Who founded Facebook?', el: 'Ποιος ίδρυσε το Facebook;' },
    options: { en: ['Mark Zuckerberg', 'Steve Jobs', 'Bill Gates', 'Elon Musk'], el: ['Μαρκ Ζάκερμπεργκ', 'Στιβ Τζομπς', 'Μπιλ Γκέιτς', 'Έλον Μασκ'] },
    correct: { en: 'Mark Zuckerberg', el: 'Μαρκ Ζάκερμπεργκ' },
    explanation: { en: 'Mark Zuckerberg founded Facebook in 2004 while a student at Harvard. It began as "TheFacebook" for Harvard students and expanded to become the world\'s largest social network.', el: 'Ο Μαρκ Ζάκερμπεργκ ίδρυσε το Facebook το 2004 όσο ήταν φοιτητής στο Harvard. Ξεκίνησε ως «TheFacebook» για φοιτητές του Harvard και εξελίχθηκε στη μεγαλύτερη κοινωνική δικτυακή πλατφόρμα στον κόσμο.' }
  },
  {
    id: 'tech-12',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What year was the World Wide Web made publicly available?', el: 'Ποια χρονιά το World Wide Web έγινε διαθέσιμο στο κοινό;' },
    options: { en: ['1989', '1991', '1993', '1995'], el: ['1989', '1991', '1993', '1995'] },
    correct: { en: '1991', el: '1991' },
    explanation: { en: 'Tim Berners-Lee invented the World Wide Web at CERN and made it publicly available in August 1991. The first website went live that year.', el: 'Ο Tim Berners-Lee εφηύρε το World Wide Web στο CERN και το έκανε διαθέσιμο στο κοινό τον Αύγουστο του 1991. Η πρώτη ιστοσελίδα ανέβηκε online την ίδια χρονιά.' }
  },
  {
    id: 'tech-13',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What does "VPN" stand for?', el: 'Τι σημαίνει «VPN»;' },
    options: { en: ['Virtual Private Network', 'Verified Protocol Node', 'Variable Processing Network', 'Video Port Navigator'], el: ['Virtual Private Network', 'Verified Protocol Node', 'Variable Processing Network', 'Video Port Navigator'] },
    correct: { en: 'Virtual Private Network', el: 'Virtual Private Network' },
    explanation: { en: 'A VPN creates an encrypted tunnel between your device and the internet, masking your IP address and allowing secure access to networks from remote locations.', el: 'Ένα VPN δημιουργεί κρυπτογραφημένη σύνδεση μεταξύ της συσκευής σας και του διαδικτύου, αποκρύπτοντας τη διεύθυνση IP σας και επιτρέποντας ασφαλή πρόσβαση σε δίκτυα από απομακρυσμένες τοποθεσίες.' }
  },
  {
    id: 'tech-14',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'Which company developed the Android operating system?', el: 'Ποια εταιρεία ανέπτυξε το λειτουργικό σύστημα Android;' },
    options: { en: ['Apple', 'Microsoft', 'Google', 'Samsung'], el: ['Apple', 'Microsoft', 'Google', 'Samsung'] },
    correct: { en: 'Google', el: 'Google' },
    explanation: { en: 'Google acquired Android Inc. in 2005 and developed it into the world\'s most used mobile operating system. The first Android phone launched in 2008.', el: 'Η Google απέκτησε την Android Inc. το 2005 και την ανέπτυξε στο πιο χρησιμοποιούμενο κινητό λειτουργικό σύστημα στον κόσμο. Το πρώτο τηλέφωνο Android κυκλοφόρησε το 2008.' }
  },
  {
    id: 'tech-15',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What technology do contactless credit cards use?', el: 'Ποια τεχνολογία χρησιμοποιούν οι χωρίς επαφή πιστωτικές κάρτες;' },
    options: { en: ['NFC', 'Bluetooth', 'Wi-Fi', 'RFID only'], el: ['NFC', 'Bluetooth', 'Wi-Fi', 'Μόνο RFID'] },
    correct: { en: 'NFC', el: 'NFC' },
    explanation: { en: 'Contactless cards use Near Field Communication (NFC), a short-range wireless technology that enables secure data transfer when the card is within a few centimeters of the reader.', el: 'Οι χωρίς επαφή κάρτες χρησιμοποιούν τη Near Field Communication (NFC), μια ασύρματη τεχνολογία μικρής εμβέλειας που επιτρέπει ασφαλή μεταφορά δεδομένων όταν η κάρτα είναι μέσα σε λίγα εκατοστά από τον αναγνώστη.' }
  },
  {
    id: 'tech-16',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'Who coined the term "artificial intelligence" in 1956?', el: 'Ποιος επινοήσε τον όρο «τεχνητή νοημοσύνη» το 1956;' },
    options: { en: ['Alan Turing', 'John McCarthy', 'Claude Shannon', 'Marvin Minsky'], el: ['Άλαν Τούρινγκ', 'Τζον Μακάρθι', 'Κλωντ Σάνον', 'Μάρβιν Μίνσκι'] },
    correct: { en: 'John McCarthy', el: 'Τζον Μακάρθι' },
    explanation: { en: 'John McCarthy coined the term "artificial intelligence" at the 1956 Dartmouth Conference, which is considered the birth of AI as a formal field of study.', el: 'Ο Τζον Μακάρθι επινοήσε τον όρο «τεχνητή νοημοσύνη» στη Διάσκεψη Dartmouth του 1956, η οποία θεωρείται η γέννηση της AI ως επίσημου πεδίου μελέτης.' }
  },
  {
    id: 'tech-17',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What does "URL" stand for?', el: 'Τι σημαίνει «URL»;' },
    options: { en: ['Uniform Resource Locator', 'Universal Reference Link', 'Unified Registry Location', 'User Request Locator'], el: ['Uniform Resource Locator', 'Universal Reference Link', 'Unified Registry Location', 'User Request Locator'] },
    correct: { en: 'Uniform Resource Locator', el: 'Uniform Resource Locator' },
    explanation: { en: 'A URL is the address used to access resources on the internet, such as web pages. It typically includes the protocol (http/https), domain name, and path.', el: 'Ένα URL είναι η διεύθυνση που χρησιμοποιείται για πρόσβαση σε πόρους στο διαδίκτυο, όπως ιστοσελίδες. Συνήθως περιλαμβάνει το πρωτόκολλο (http/https), το όνομα domain και τη διαδρομή.' }
  },
  {
    id: 'tech-18',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What was the first video ever uploaded to YouTube?', el: 'Ποιο ήταν το πρώτο βίντεο που ανέβηκε ποτέ στο YouTube;' },
    options: { en: ['A cat video', 'Me at the zoo', 'A music video', 'A news clip'], el: ['Βίντεο γάτας', 'Me at the zoo', 'Μουσικό βίντεο', 'Απόσπασμα ειδήσεων'] },
    correct: { en: 'Me at the zoo', el: 'Me at the zoo' },
    explanation: { en: 'The first YouTube video, "Me at the zoo," was uploaded by co-founder Jawed Karim on April 23, 2005. It shows him at the San Diego Zoo and is 19 seconds long.', el: 'Το πρώτο βίντεο στο YouTube, «Me at the zoo», ανέβηκε από τον συνιδρυτή Jawed Karim στις 23 Απριλίου 2005. Το δείχνει στο ζωολογικό κήπο του Σαν Ντιέγκο και διαρκεί 19 δευτερόλεπτα.' }
  },
  {
    id: 'tech-19',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What year did Amazon launch its first product sale?', el: 'Ποια χρονιά η Amazon πραγματοποίησε την πρώτη της πώληση προϊόντος;' },
    options: { en: ['1994', '1995', '1996', '1997'], el: ['1994', '1995', '1996', '1997'] },
    correct: { en: '1995', el: '1995' },
    explanation: { en: 'Amazon.com launched in July 1995. The first item ever sold was a book: "Fluid Concepts and Creative Analogies" by Douglas Hofstadter.', el: 'Η Amazon.com ξεκίνησε τον Ιούλιο του 1995. Το πρώτο αντικείμενο που πωλήθηκε ποτέ ήταν ένα βιβλίο: «Fluid Concepts and Creative Analogies» του Douglas Hofstadter.' }
  },
  {
    id: 'tech-20',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What does "Wi-Fi" stand for?', el: 'Τι σημαίνει «Wi-Fi»;' },
    options: { en: ['Wireless Fidelity', 'Wired Finder', 'Wave Integration', 'It doesn\'t stand for anything'], el: ['Wireless Fidelity', 'Wired Finder', 'Wave Integration', 'Δεν σημαίνει τίποτα'] },
    correct: { en: 'It doesn\'t stand for anything', el: 'Δεν σημαίνει τίποτα' },
    explanation: { en: 'Despite common belief, "Wi-Fi" does not stand for "Wireless Fidelity." It is a brand name coined by the Wi-Fi Alliance; the name was chosen for its catchy sound and similarity to "Hi-Fi."', el: 'Παρά τη διαδεδομένη πεποίθηση, το «Wi-Fi» δεν σημαίνει «Wireless Fidelity». Είναι εμπορικό σήμα της Wi-Fi Alliance· το όνομα επιλέχθηκε για τον ελκυστικό ήχο του και την ομοιότητα με το «Hi-Fi».' }
  },
  {
    id: 'tech-21',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'Which programming language was created by Guido van Rossum?', el: 'Ποια γλώσσα προγραμματισμού δημιουργήθηκε από τον Guido van Rossum;' },
    options: { en: ['JavaScript', 'Python', 'Ruby', 'Perl'], el: ['JavaScript', 'Python', 'Ruby', 'Perl'] },
    correct: { en: 'Python', el: 'Python' },
    explanation: { en: 'Guido van Rossum created Python and released it in 1991. He named it after Monty Python\'s Flying Circus, not the snake.', el: 'Ο Guido van Rossum δημιούργησε την Python και την κυκλοφόρησε το 1991. Την πήρε το όνομά της από το Monty Python\'s Flying Circus, όχι από το φίδι.' }
  },
  {
    id: 'tech-22',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What does "CAPTCHA" stand for?', el: 'Τι σημαίνει «CAPTCHA»;' },
    options: { en: ['Completely Automated Public Turing Test to Tell Computers and Humans Apart', 'Computer Access Protection Technology', 'Cybernetic Authentication Protocol', 'None of the above'], el: ['Completely Automated Public Turing Test to Tell Computers and Humans Apart', 'Computer Access Protection Technology', 'Cybernetic Authentication Protocol', 'Κανένα από τα παραπάνω'] },
    correct: { en: 'Completely Automated Public Turing Test to Tell Computers and Humans Apart', el: 'Completely Automated Public Turing Test to Tell Computers and Humans Apart' },
    explanation: { en: 'CAPTCHA is a challenge-response test designed to distinguish humans from bots. The acronym references Alan Turing\'s Turing Test concept.', el: 'Το CAPTCHA είναι τεστ ελέγχου που σχεδιάστηκε για να ξεχωρίζει ανθρώπους από bots. Το ακρωνύμιο αναφέρεται στην έννοια του Turing Test του Άλαν Τούρινγκ.' }
  },
  {
    id: 'tech-23',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'Who invented the first practical telephone?', el: 'Ποιος εφηύρε το πρώτο πρακτικό τηλέφωνο;' },
    options: { en: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Guglielmo Marconi'], el: ['Τόμας Έντισον', 'Αλεξάντερ Γκράχαμ Μπελ', 'Νίκολα Τέσλα', 'Γουγκλιέλμο Μάρκονι'] },
    correct: { en: 'Alexander Graham Bell', el: 'Αλεξάντερ Γκράχαμ Μπελ' },
    explanation: { en: 'Alexander Graham Bell patented the first practical telephone in 1876. The famous first words transmitted were "Mr. Watson, come here—I want to see you."', el: 'Ο Αλεξάντερ Γκράχαμ Μπελ κατοχύρωσε με δίπλωμα ευρεσιτεχνίας το πρώτο πρακτικό τηλέφωνο το 1876. Οι διάσημες πρώτες λέξεις που μεταδόθηκαν ήταν «Mr. Watson, come here—I want to see you».' }
  },
  {
    id: 'tech-24',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What is the name of the first electronic general-purpose computer?', el: 'Ποιο είναι το όνομα του πρώτου ηλεκτρονικού υπολογιστή γενικής χρήσης;' },
    options: { en: ['ENIAC', 'UNIVAC', 'Colossus', 'Z3'], el: ['ENIAC', 'UNIVAC', 'Colossus', 'Z3'] },
    correct: { en: 'ENIAC', el: 'ENIAC' },
    explanation: { en: 'ENIAC (Electronic Numerical Integrator and Computer) was completed in 1945 at the University of Pennsylvania. It was the first programmable, electronic, general-purpose digital computer.', el: 'Ο ENIAC (Electronic Numerical Integrator and Computer) ολοκληρώθηκε το 1945 στο Πανεπιστήμιο της Πενсиλβάνια. Ήταν ο πρώτος προγραμματιζόμενος, ηλεκτρονικός, ψηφιακός υπολογιστής γενικής χρήσης.' }
  },
  {
    id: 'tech-25',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'Which company created the first commercial microprocessor?', el: 'Ποια εταιρεία δημιούργησε τον πρώτο εμπορικό μικροεπεξεργαστή;' },
    options: { en: ['IBM', 'Intel', 'Motorola', 'AMD'], el: ['IBM', 'Intel', 'Motorola', 'AMD'] },
    correct: { en: 'Intel', el: 'Intel' },
    explanation: { en: 'Intel introduced the 4004, the first commercial microprocessor, in 1971. It had 2,300 transistors and was designed for calculators before becoming the foundation of personal computing.', el: 'Η Intel παρουσίασε το 4004, τον πρώτο εμπορικό μικροεπεξεργαστή, το 1971. Είχε 2.300 τρανζίστορ και σχεδιάστηκε για αριθμομηχανές πριν γίνει η βάση των προσωπικών υπολογιστών.' }
  },
  {
    id: 'tech-26',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What social media platform has a blue bird logo?', el: 'Ποια πλατφόρμα κοινωνικών δικτύων έχει λογότυπο μπλε πουλί;' },
    options: { en: ['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn'], el: ['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn'] },
    correct: { en: 'Twitter/X', el: 'Twitter/X' },
    explanation: { en: 'Twitter, now rebranded as X, famously used a blue bird (Larry the Bird) as its logo from 2012 until Elon Musk\'s rebrand in 2023. The bird symbolized freedom of expression.', el: 'Το Twitter, τώρα με επανασυμβολισμό ως X, χρησιμοποιούσε διάσημα μπλε πουλί (Larry the Bird) ως λογότυπο από το 2012 μέχρι το rebrand του Έλον Μασκ το 2023. Το πουλί συμβόλιζε την ελευθερία έκφρασης.' }
  },
  {
    id: 'tech-27',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What does "IoT" stand for?', el: 'Τι σημαίνει «IoT»;' },
    options: { en: ['Internet of Things', 'Internal Operation Technology', 'Integrated Online Transfer', 'Input Output Terminal'], el: ['Internet of Things', 'Internal Operation Technology', 'Integrated Online Transfer', 'Input Output Terminal'] },
    correct: { en: 'Internet of Things', el: 'Internet of Things' },
    explanation: { en: 'The Internet of Things refers to the network of physical objects embedded with sensors and software that connect and exchange data over the internet—from smart homes to industrial equipment.', el: 'Το Internet of Things αναφέρεται στο δίκτυο φυσικών αντικειμένων με ενσωματωμένους αισθητήρες και λογισμικό που συνδέονται και ανταλλάσσουν δεδομένα μέσω του διαδικτύου—από έξυπνα σπίτια μέχρι βιομηχανικό εξοπλισμό.' }
  },
  {
    id: 'tech-28',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'Who developed the first commercially successful graphical user interface?', el: 'Ποιος ανέπτυξε την πρώτη εμπορικά επιτυχημένη γραφική διεπαφή χρήστη;' },
    options: { en: ['Microsoft', 'Apple', 'Xerox', 'IBM'], el: ['Microsoft', 'Apple', 'Xerox', 'IBM'] },
    correct: { en: 'Xerox', el: 'Xerox' },
    explanation: { en: 'Xerox PARC developed the Alto in 1973 with a GUI featuring windows, menus, and a mouse. Apple and Microsoft later drew inspiration from Xerox\'s innovations for their own products.', el: 'Η Xerox PARC ανέπτυξε το Alto το 1973 με γραφική διεπαφή παραθύρων, μενού και ποντικιού. Η Apple και η Microsoft αργότερα εμπνεύστηκαν από τις καινοτομίες της Xerox για τα δικά τους προϊόντα.' }
  },
  {
    id: 'tech-29',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What company owns the search engine Bing?', el: 'Ποια εταιρεία κατέχει τη μηχανή αναζήτησης Bing;' },
    options: { en: ['Google', 'Yahoo', 'Microsoft', 'Amazon'], el: ['Google', 'Yahoo', 'Microsoft', 'Amazon'] },
    correct: { en: 'Microsoft', el: 'Microsoft' },
    explanation: { en: 'Microsoft launched Bing in 2009, replacing its previous Live Search. It powers search on Microsoft products and is the default for some browsers.', el: 'Η Microsoft κυκλοφόρησε το Bing το 2009, αντικαθιστώντας την προηγούμενη Live Search. Τροφοδοτεί την αναζήτηση στα προϊόντα της Microsoft και είναι η προεπιλογή σε ορισμένα προγράμματα περιήγησης.' }
  },
  {
    id: 'tech-30',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What year was the first tweet sent?', el: 'Ποια χρονιά στάλθηκε το πρώτο tweet;' },
    options: { en: ['2005', '2006', '2007', '2008'], el: ['2005', '2006', '2007', '2008'] },
    correct: { en: '2006', el: '2006' },
    explanation: { en: 'Jack Dorsey sent the first tweet on March 21, 2006. It read: "just setting up my twttr." The platform changed how news and conversation spread globally.', el: 'Ο Jack Dorsey έστειλε το πρώτο tweet στις 21 Μαρτίου 2006. Έλεγε: «just setting up my twttr». Η πλατφόρμα άλλαξε τον τρόπο που οι ειδήσεις και η συζήτηση διαδίδονται παγκοσμίως.' }
  },
  {
    id: 'tech-31',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What does "SSD" stand for in computing?', el: 'Τι σημαίνει «SSD» στους υπολογιστές;' },
    options: { en: ['Solid State Drive', 'Super Speed Disk', 'System Storage Device', 'Sequential Storage Drive'], el: ['Solid State Drive', 'Super Speed Disk', 'System Storage Device', 'Sequential Storage Drive'] },
    correct: { en: 'Solid State Drive', el: 'Solid State Drive' },
    explanation: { en: 'An SSD stores data on flash memory chips with no moving parts, making it faster and more durable than traditional hard disk drives (HDDs).', el: 'Ένα SSD αποθηκεύει δεδομένα σε τσιπ μνήμης flash χωρίς κινούμενα μέρη, κάνοντάς το ταχύτερο και πιο ανθεκτικό από τις παραδοσιακές σκληρές δίσκους (HDD).' }
  },
  {
    id: 'tech-32',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'Which streaming service released "Stranger Things"?', el: 'Ποια υπηρεσία streaming κυκλοφόρησε το «Stranger Things»;' },
    options: { en: ['Hulu', 'Amazon Prime', 'Netflix', 'Disney+'], el: ['Hulu', 'Amazon Prime', 'Netflix', 'Disney+'] },
    correct: { en: 'Netflix', el: 'Netflix' },
    explanation: { en: 'Netflix premiered "Stranger Things" in 2016. The sci-fi horror series became one of Netflix\'s most watched and culturally influential original shows.', el: 'Η Netflix παρουσίασε το «Stranger Things» το 2016. Η επιστημονική φαντασία / τρόμος έγινε μία από τις πιο δημοφιλείς και πολιτιστικά σημαντικές πρωτότυπες σειρές της Netflix.' }
  },
  {
    id: 'tech-33',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What does "USB" stand for?', el: 'Τι σημαίνει «USB»;' },
    options: { en: ['Universal Serial Bus', 'United System Buffer', 'Unified Signal Bridge', 'User Storage Block'], el: ['Universal Serial Bus', 'United System Buffer', 'Unified Signal Bridge', 'User Storage Block'] },
    correct: { en: 'Universal Serial Bus', el: 'Universal Serial Bus' },
    explanation: { en: 'USB is a standard for connecting peripherals to computers. Introduced in 1996, it simplified connecting devices like keyboards, printers, and storage drives.', el: 'Το USB είναι πρότυπο για σύνδεση περιφερειακών συσκευών σε υπολογιστές. Εισήχθη το 1996 και απλοποίησε τη σύνδεση συσκευών όπως πληκτρολόγια, εκτυπωτές και δίσκοι αποθήκευσης.' }
  },
  {
    id: 'tech-34',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'Who founded SpaceX?', el: 'Ποιος ίδρυσε την SpaceX;' },
    options: { en: ['Jeff Bezos', 'Elon Musk', 'Richard Branson', 'Robert Bigelow'], el: ['Τζεφ Μπέζος', 'Έλον Μασκ', 'Ρίτσαρντ Μπράνσον', 'Ρόμπερτ Μπίγκελοου'] },
    correct: { en: 'Elon Musk', el: 'Έλον Μασκ' },
    explanation: { en: 'Elon Musk founded SpaceX in 2002 to reduce space transportation costs and enable Mars colonization. It developed the first privately funded liquid-fueled rocket to reach orbit (Falcon 1, 2008).', el: 'Ο Έλον Μασκ ίδρυσε την SpaceX το 2002 για να μειώσει το κόστος διαστημικών μεταφορών και να ενεργοποιήσει την αποικιοποίηση του Άρη. Ανέπτυξε τον πρώτο ιδιωτικά χρηματοδοτούμενο πύραυλο υγρού καυσίμου που έφτασε σε τροχιά (Falcon 1, 2008).' }
  },
  {
    id: 'tech-35',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What company makes the PlayStation?', el: 'Ποια εταιρεία κατασκευάζει το PlayStation;' },
    options: { en: ['Microsoft', 'Nintendo', 'Sony', 'Sega'], el: ['Microsoft', 'Nintendo', 'Sony', 'Sega'] },
    correct: { en: 'Sony', el: 'Sony' },
    explanation: { en: 'Sony has manufactured the PlayStation since the original launched in 1994. It became a dominant force in gaming, competing with Nintendo and Microsoft\'s Xbox.', el: 'Η Sony κατασκευάζει το PlayStation από τότε που το πρωτότυπο κυκλοφόρησε το 1994. Έγινε κυρίαρχος παίκτης στα video games, ανταγωνιζόμενη τη Nintendo και το Xbox της Microsoft.' }
  },
  {
    id: 'tech-36',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'What does "LED" stand for?', el: 'Τι σημαίνει «LED»;' },
    options: { en: ['Light Emitting Diode', 'Low Energy Display', 'Luminous Electric Device', 'Linear Emission Detector'], el: ['Light Emitting Diode', 'Low Energy Display', 'Luminous Electric Device', 'Linear Emission Detector'] },
    correct: { en: 'Light Emitting Diode', el: 'Light Emitting Diode' },
    explanation: { en: 'An LED is a semiconductor that emits light when an electric current passes through it. LEDs are energy-efficient and used in displays, lighting, and indicators.', el: 'Ένα LED είναι ημιαγωγός που εκπέμπει φως όταν το διέρχεται ηλεκτρικό ρεύμα. Τα LED είναι ενεργειακά αποδοτικά και χρησιμοποιούνται σε οθόνες, φωτισμό και ενδείξεις.' }
  },
  {
    id: 'tech-37',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'In what year was the first SMS message sent?', el: 'Ποια χρονιά στάλθηκε το πρώτο μήνυμα SMS;' },
    options: { en: ['1989', '1991', '1992', '1995'], el: ['1989', '1991', '1992', '1995'] },
    correct: { en: '1992', el: '1992' },
    explanation: { en: 'The first SMS was sent on December 3, 1992, by Neil Papworth to Richard Jarvis at Vodafone. The message read "Merry Christmas."', el: 'Το πρώτο SMS στάλθηκε στις 3 Δεκεμβρίου 1992 από τον Neil Papworth στον Richard Jarvis της Vodafone. Το μήνυμα έλεγε «Merry Christmas».' }
  },
  {
    id: 'tech-38',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What does "GPS" stand for?', el: 'Τι σημαίνει «GPS»;' },
    options: { en: ['Global Positioning System', 'Geographic Protocol Satellite', 'General Packet Service', 'Ground Position Sensor'], el: ['Global Positioning System', 'Geographic Protocol Satellite', 'General Packet Service', 'Ground Position Sensor'] },
    correct: { en: 'Global Positioning System', el: 'Global Positioning System' },
    explanation: { en: 'GPS is a satellite-based navigation system operated by the U.S. government. It provides location and time information anywhere on Earth with a clear view of the sky.', el: 'Το GPS είναι δορυφορικό σύστημα πλοήγησης που λειτουργεί από την αμερικανική κυβέρνηση. Παρέχει πληροφορίες τοποθεσίας και ώρας οπουδήποτε στη Γη με καθαρή θέα στον ουρανό.' }
  },
  {
    id: 'tech-39',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'Who created the Linux kernel?', el: 'Ποιος δημιούργησε τον πυρήνα Linux;' },
    options: { en: ['Richard Stallman', 'Linus Torvalds', 'Dennis Ritchie', 'James Gosling'], el: ['Ρίτσαρντ Στάλμαν', 'Λίνους Τόρβαλντς', 'Ντένις Ρίτσι', 'Τζέιμς Γκόσλινγκ'] },
    correct: { en: 'Linus Torvalds', el: 'Λίνους Τόρβαλντς' },
    explanation: { en: 'Linus Torvalds created the Linux kernel in 1991 as a free, open-source alternative to Unix. Linux now powers most servers, Android, and countless embedded systems.', el: 'Ο Λίνους Τόρβαλντς δημιούργησε τον πυρήνα Linux το 1991 ως δωρεάν εναλλακτική ανοιχτού κώδικα στο Unix. Το Linux πλέον τροφοδοτεί τους περισσότερους διακομιστές, το Android και αμέτρητα ενσωματωμένα συστήματα.' }
  },
  {
    id: 'tech-40',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What was the first commercially available web browser with a graphical interface?', el: 'Ποιο ήταν το πρώτο εμπορικά διαθέσιμο πρόγραμμα περιήγησης με γραφική διεπαφή;' },
    options: { en: ['Netscape Navigator', 'Mosaic', 'Internet Explorer', 'Opera'], el: ['Netscape Navigator', 'Mosaic', 'Internet Explorer', 'Opera'] },
    correct: { en: 'Mosaic', el: 'Mosaic' },
    explanation: { en: 'NCSA Mosaic, released in 1993, was the first widely used graphical web browser. It popularized the World Wide Web and inspired Netscape and Internet Explorer.', el: 'Το NCSA Mosaic, που κυκλοφόρησε το 1993, ήταν το πρώτο ευρέως χρησιμοποιούμενο γραφικό πρόγραμμα περιήγησης. Δημοφίλησε το World Wide Web και ενέπνευσε τα Netscape και Internet Explorer.' }
  },
  {
    id: 'cult-11',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Who directed "Jurassic Park"?', el: 'Ποιος σκηνοθέτησε το «Jurassic Park»;' },
    options: { en: ['James Cameron', 'Steven Spielberg', 'George Lucas', 'Ridley Scott'], el: ['Τζέιμς Κάμερον', 'Στίβεν Σπίλμπεργκ', 'Τζορτζ Λούκας', 'Ρίντλεϊ Σκοτ'] },
    correct: { en: 'Steven Spielberg', el: 'Στίβεν Σπίλμπεργκ' },
    explanation: { en: 'Steven Spielberg directed "Jurassic Park" (1993), which revolutionized CGI in film. It became one of the highest-grossing movies of all time and spawned a major franchise.', el: 'Ο Στίβεν Σπίλμπεργκ σκηνοθέτησε το «Jurassic Park» (1993), που επανάντρεψε τα CGI στις ταινίες. Έγινε μία από τις πιο εμπορικές ταινίες όλων των εποχών και ξεκίνησε τεράστια franchise.' }
  },
  {
    id: 'cult-12',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'What year did MTV launch?', el: 'Ποια χρονιά ξεκίνησε το MTV;' },
    options: { en: ['1979', '1981', '1983', '1985'], el: ['1979', '1981', '1983', '1985'] },
    correct: { en: '1981', el: '1981' },
    explanation: { en: 'MTV launched on August 1, 1981, with the words "Ladies and gentlemen, rock and roll." The first video played was "Video Killed the Radio Star" by The Buggles.', el: 'Το MTV ξεκίνησε την 1η Αυγούστου 1981 με τις λέξεις «Ladies and gentlemen, rock and roll». Το πρώτο βίντεο που παίχτηκε ήταν το «Video Killed the Radio Star» των Buggles.' }
  },
  {
    id: 'cult-13',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Who wrote "Dune"?', el: 'Ποιος έγραψε το «Dune»;' },
    options: { en: ['Isaac Asimov', 'Frank Herbert', 'Arthur C. Clarke', 'Philip K. Dick'], el: ['Ίσαακ Ασίμοφ', 'Φρανκ Χέρμπερτ', 'Άρθουρ Κλαρκ', 'Φίλιπ Κ. Ντικ'] },
    correct: { en: 'Frank Herbert', el: 'Φρανκ Χέρμπερτ' },
    explanation: { en: 'Frank Herbert published "Dune" in 1965. The sci-fi novel is considered one of the greatest of the genre and has been adapted multiple times for film and TV.', el: 'Ο Φρανκ Χέρμπερτ δημοσίευσε το «Dune» το 1965. Το μυθιστόρημα επιστημονικής φαντασίας θεωρείται ένα από τα σπουδαιότερα του είδους και έχει προσαρμοστεί πολλές φορές για κινηματογράφο και τηλεόραση.' }
  },
  {
    id: 'cult-14',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Which band performed "Bohemian Rhapsody"?', el: 'Ποιο συγκρότημα εκτέλεσε το «Bohemian Rhapsody»;' },
    options: { en: ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'], el: ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'] },
    correct: { en: 'Queen', el: 'Queen' },
    explanation: { en: 'Queen released "Bohemian Rhapsody" in 1975. The six-minute epic fused rock, opera, and ballad and became one of the most iconic songs in music history.', el: 'Τα Queen κυκλοφόρησαν το «Bohemian Rhapsody» το 1975. Το επικό εξαλεπτειανό τραγούδι συνδύασε rock, όπερα και μπαλάντα και έγινε ένα από τα πιο εμβληματικά τραγούδια στην ιστορία της μουσικής.' }
  },
  {
    id: 'cult-15',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'What film won Best Picture at the 2020 Oscars?', el: 'Ποια ταινία κέρδισε το Όσκαρ Καλύτερης Ταινίας το 2020;' },
    options: { en: ['1917', 'Parasite', 'Joker', 'Once Upon a Time in Hollywood'], el: ['1917', 'Parasite', 'Joker', 'Once Upon a Time in Hollywood'] },
    correct: { en: 'Parasite', el: 'Parasite' },
    explanation: { en: '"Parasite" (2019) by Bong Joon-ho won Best Picture at the 92nd Academy Awards—the first non-English language film to win the top prize. It also won Best Director and Best Original Screenplay.', el: 'Η ταινία «Parasite» (2019) του Μπονγκ Τζουν-χο κέρδισε το Όσκαρ Καλύτερης Ταινίας στα 92α Academy Awards—η πρώτη μη αγγλόφωνη ταινία που κέρδισε το κορυφαίο βραβείο. Κέρδισε επίσης Καλύτερη Σκηνοθεσία και Καλύτερο Πρωτότυπο Σενάριο.' }
  },
  {
    id: 'cult-16',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Who created "The Simpsons"?', el: 'Ποιος δημιούργησε τα «Simpsons»;' },
    options: { en: ['Seth MacFarlane', 'Matt Groening', 'Mike Judge', 'Trey Parker'], el: ['Σεθ ΜακΦάρλεϊν', 'Ματ Γκρόενινγκ', 'Μάικ Τζαντς', 'Τρέι Πάρκερ'] },
    correct: { en: 'Matt Groening', el: 'Ματ Γκρόενινγκ' },
    explanation: { en: 'Matt Groening created "The Simpsons" for "The Tracey Ullman Show" in 1987. It became a standalone series in 1989 and is the longest-running American scripted primetime series.', el: 'Ο Ματ Γκρόενινγκ δημιούργησε τα «Simpsons» για το «The Tracey Ullman Show» το 1987. Έγινε αυτόνομη σειρά το 1989 και είναι η μακροβιότερη αμερικανική scripted σειρά prime time.' }
  },
  {
    id: 'cult-17',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Which TV series features Walter White?', el: 'Ποια τηλεοπτική σειρά διακρίνεται από τον Walter White;' },
    options: { en: ['The Wire', 'Breaking Bad', 'The Sopranos', 'Mad Men'], el: ['The Wire', 'Breaking Bad', 'The Sopranos', 'Mad Men'] },
    correct: { en: 'Breaking Bad', el: 'Breaking Bad' },
    explanation: { en: 'Walter White is the protagonist of "Breaking Bad" (2008–2013), a chemistry teacher who becomes a methamphetamine manufacturer. Bryan Cranston won multiple Emmys for the role.', el: 'Ο Walter White είναι ο κύριος protagonιστής του «Breaking Bad» (2008–2013), δάσκαλος χημείας που γίνεται παραγωγός μεθαμφεταμίνης. Ο Μπράιαν Κράνστον κέρδισε πολλά Emmy για τον ρόλο.' }
  },
  {
    id: 'cult-18',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'What video game franchise features a plumber named Mario?', el: 'Ποια franchise βιντεοπαιχνιδιών διακρίνεται από τον υδραυλικό Mario;' },
    options: { en: ['Sonic', 'Donkey Kong', 'Super Mario Bros', 'Crash Bandicoot'], el: ['Sonic', 'Donkey Kong', 'Super Mario Bros', 'Crash Bandicoot'] },
    correct: { en: 'Super Mario Bros', el: 'Super Mario Bros' },
    explanation: { en: 'Mario debuted in "Donkey Kong" (1981) but became iconic with "Super Mario Bros" (1985). He is Nintendo\'s mascot and one of gaming\'s most recognizable characters.', el: 'Ο Mario έκανε το ντεμπούτο του στο «Donkey Kong» (1981) αλλά έγινε εμβληματικός με το «Super Mario Bros» (1985). Είναι το mascot της Nintendo και ένας από τους πιο αναγνωρίσιμους χαρακτήρες στα παιχνίδια.' }
  },
  {
    id: 'cult-19',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Who directed "Blade Runner"?', el: 'Ποιος σκηνοθέτησε το «Blade Runner»;' },
    options: { en: ['James Cameron', 'Ridley Scott', 'Steven Spielberg', 'Stanley Kubrick'], el: ['Τζέιμς Κάμερον', 'Ρίντλεϊ Σκοτ', 'Στίβεν Σπίλμπεργκ', 'Στάνλεϊ Κουμπρίκ'] },
    correct: { en: 'Ridley Scott', el: 'Ρίντλεϊ Σκοτ' },
    explanation: { en: 'Ridley Scott directed "Blade Runner" (1982), based on Philip K. Dick\'s "Do Androids Dream of Electric Sheep?" It became a landmark of sci-fi cinema and cyberpunk aesthetics.', el: 'Ο Ρίντλεϊ Σκοτ σκηνοθέτησε το «Blade Runner» (1982), βασισμένο στο «Do Androids Dream of Electric Sheep?» του Φίλιπ Κ. Ντικ. Έγινε ορόσημο της επιστημονικής φαντασίας στον κινηματογράφο και της αισθητικής cyberpunk.' }
  },
  {
    id: 'cult-20',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Which artist released the album "Thriller"?', el: 'Ποιος καλλιτέχνης κυκλοφόρησε το άλμπουμ «Thriller»;' },
    options: { en: ['Prince', 'Michael Jackson', 'Whitney Houston', 'Stevie Wonder'], el: ['Πρινς', 'Μάικλ Τζάκσον', 'Γουίτνεϊ Χιούστον', 'Στίβι Γούντερ'] },
    correct: { en: 'Michael Jackson', el: 'Μάικλ Τζάκσον' },
    explanation: { en: 'Michael Jackson released "Thriller" in 1982. It became the best-selling album of all time, with hits like "Billie Jean" and the title track\'s iconic music video.', el: 'Ο Μάικλ Τζάκσον κυκλοφόρησε το «Thriller» το 1982. Έγινε το πιο εμπορικό άλμπουμ όλων των εποχών, με hits όπως το «Billie Jean» και το εμβληματικό μουσικό βίντεο του τίτλου.' }
  },
  {
    id: 'cult-21',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'What year did Netflix launch its streaming service?', el: 'Ποια χρονιά η Netflix ξεκίνησε την υπηρεσία streaming της;' },
    options: { en: ['2005', '2007', '2009', '2011'], el: ['2005', '2007', '2009', '2011'] },
    correct: { en: '2007', el: '2007' },
    explanation: { en: 'Netflix launched its streaming service in 2007, initially as an add-on to its DVD-by-mail subscription. It transformed how people consume entertainment and produced original content from 2013 onward.', el: 'Η Netflix ξεκίνησε την υπηρεσία streaming της το 2007, αρχικά ως προσθήκη στη συνδρομή αποστολής DVD μέσω ταχυδρομείου. Μεταμόρφωσε τον τρόπο που οι άνθρωποι καταναλώνουν ψυχαγωγία και άρχισε να παράγει πρωτότυπο περιεχόμενο από το 2013.' }
  },
  {
    id: 'cult-22',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Who wrote "The Hitchhiker\'s Guide to the Galaxy"?', el: 'Ποιος έγραψε το «Ο Οδηγός Αυτοκινήτου στο Γαλαξία»;' },
    options: { en: ['Terry Pratchett', 'Douglas Adams', 'Neil Gaiman', 'Terry Gilliam'], el: ['Τέρι Πράτσετ', 'Ντάγκλας Άνταμς', 'Νιλ Γκάιμαν', 'Τέρι Γκίλιαμ'] },
    correct: { en: 'Douglas Adams', el: 'Ντάγκλας Άνταμς' },
    explanation: { en: 'Douglas Adams wrote "The Hitchhiker\'s Guide to the Galaxy," which began as a BBC radio series in 1978. The novel was published in 1979 and spawned a cult following with its absurdist humor.', el: 'Ο Ντάγκλας Άνταμς έγραψε το «Ο Οδηγός Αυτοκινήτου στο Γαλαξία», που ξεκίνησε ως ραδιοφωνική σειρά του BBC το 1978. Το μυθιστόρημα δημοσιεύτηκε το 1979 και δημιούργησε ένα cult ακόλουθο με το absurdist χιούμορ του.' }
  },
  {
    id: 'cult-23',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Which movie franchise features Harry Potter?', el: 'Ποια franchise ταινιών διακρίνεται από τον Χάρι Πότερ;' },
    options: { en: ['The Lord of the Rings', 'Harry Potter', 'Chronicles of Narnia', 'Twilight'], el: ['The Lord of the Rings', 'Harry Potter', 'Chronicles of Narnia', 'Twilight'] },
    correct: { en: 'Harry Potter', el: 'Harry Potter' },
    explanation: { en: 'The Harry Potter film series (2001–2011) adapted J.K. Rowling\'s novels. It became one of the highest-grossing franchises in history and defined a generation.', el: 'Η σειρά ταινιών Harry Potter (2001–2011) προσάρμοσε τα μυθιστορήματα της J.K. Ρόουλινγκ. Έγινε μία από τις πιο εμπορικές franchises στην ιστορία και όρισε μια γενιά.' }
  },
  {
    id: 'cult-24',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'What social platform was originally a photo-filter app called "Burbn"?', el: 'Ποια πλατφόρμα ξεκίνησε ως εφαρμογή φίλτρων φωτογραφιών με το όνομα «Burbn»;' },
    options: { en: ['Snapchat', 'Instagram', 'TikTok', 'Pinterest'], el: ['Snapchat', 'Instagram', 'TikTok', 'Pinterest'] },
    correct: { en: 'Instagram', el: 'Instagram' },
    explanation: { en: 'Instagram started as "Burbn," a location-sharing app. Kevin Systrom and Mike Krieger pivoted to focus on photo-sharing with filters and launched Instagram in 2010.', el: 'Το Instagram ξεκίνησε ως «Burbn», εφαρμογή κοινής χρήσης τοποθεσίας. Ο Kevin Systrom και ο Mike Krieger στράφηκαν στην κοινή χρήση φωτογραφιών με φίλτρα και ξεκίνησαν το Instagram το 2010.' }
  },
  {
    id: 'cult-25',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Who composed the score for "Star Wars"?', el: 'Ποιος συνέθεσε τη μουσική του «Star Wars»;' },
    options: { en: ['Hans Zimmer', 'John Williams', 'Jerry Goldsmith', 'James Horner'], el: ['Χανς Ζίμερ', 'Τζον Γουίλιαμς', 'Τζέρι Γκόλντσμιθ', 'Τζέιμς Χόρνερ'] },
    correct: { en: 'John Williams', el: 'Τζον Γουίλιαμς' },
    explanation: { en: 'John Williams composed the iconic "Star Wars" score in 1977, including "The Imperial March" and the main theme. He went on to score all nine Skywalker saga films.', el: 'Ο Τζον Γουίλιαμς συνέθεσε τη διάσημη μουσική του «Star Wars» το 1977, συμπεριλαμβανομένου του «Imperial March» και του κύριου θέματος. Συνεχίζει να γράφει τη μουσική και για τις εννέα ταινίες της Skywalker saga.' }
  },
  {
    id: 'cult-26',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Which game is known as "the battle royale" with 100 players?', el: 'Ποιο παιχνίδι είναι γνωστό ως «battle royale» με 100 παίκτες;' },
    options: { en: ['Call of Duty', 'Fortnite', 'Minecraft', 'FIFA'], el: ['Call of Duty', 'Fortnite', 'Minecraft', 'FIFA'] },
    correct: { en: 'Fortnite', el: 'Fortnite' },
    explanation: { en: 'Fortnite Battle Royale (2017) popularized the 100-player last-person-standing format. "PlayerUnknown\'s Battlegrounds" (PUBG) also pioneered the genre. Fortnite became a cultural phenomenon.', el: 'Το Fortnite Battle Royale (2017) δημοφίλησε τη μορφή 100 παίκτες last-person-standing. Το «PlayerUnknown\'s Battlegrounds» (PUBG) προήδρευσε επίσης στο είδος. Το Fortnite έγινε πολιτιστικό φαινόμενο.' }
  },
  {
    id: 'cult-27',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'What TV show features the Iron Throne?', el: 'Ποια τηλεοπτική σειρά διακρίνεται από τον Σιδηρό Θρόνο;' },
    options: { en: ['The Witcher', 'Game of Thrones', 'Vikings', 'The Crown'], el: ['The Witcher', 'Game of Thrones', 'Vikings', 'The Crown'] },
    correct: { en: 'Game of Thrones', el: 'Game of Thrones' },
    explanation: { en: 'The Iron Throne is the seat of power in "Game of Thrones" (2011–2019), adapted from George R.R. Martin\'s "A Song of Ice and Fire." The series became a global phenomenon on HBO.', el: 'Ο Σιδηρό Θρόνος είναι ο θρόνος εξουσίας στο «Game of Thrones» (2011–2019), προσαρμογή των μυθιστορημάτων «A Song of Ice and Fire» του George R.R. Martin. Η σειρά έγινε παγκόσμιο φαινόμενο στο HBO.' }
  },
  {
    id: 'cult-28',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'Who directed "Inception"?', el: 'Ποιος σκηνοθέτησε το «Inception»;' },
    options: { en: ['Steven Spielberg', 'Christopher Nolan', 'David Fincher', 'Denis Villeneuve'], el: ['Στίβεν Σπίλμπεργκ', 'Κρίστοφερ Νόλαν', 'Ντέιβιντ Φίντσερ', 'Ντενί Βιλνέβ'] },
    correct: { en: 'Christopher Nolan', el: 'Κρίστοφερ Νόλαν' },
    explanation: { en: 'Christopher Nolan wrote and directed "Inception" (2010), a sci-fi heist film about stealing secrets from dreams. It won four Oscars and became known for its layered narrative and spinning top ending.', el: 'Ο Κρίστοφερ Νόλαν έγραψε και σκηνοθέτησε το «Inception» (2010), επιστημονική φαντασία για κλοπή μυστικών από τα όνειρα. Κέρδισε τέσσερα Όσκαρ και έγινε γνωστό για το πολυεπίπεδο αφηγηματικό και το τέλος με το περιστρεφόμενοστρόβιλο.' }
  },
  {
    id: 'cult-29',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Which band sang "Smells Like Teen Spirit"?', el: 'Ποιο συγκρότημα τραγούδησε το «Smells Like Teen Spirit»;' },
    options: { en: ['Pearl Jam', 'Nirvana', 'Soundgarden', 'Alice in Chains'], el: ['Pearl Jam', 'Nirvana', 'Soundgarden', 'Alice in Chains'] },
    correct: { en: 'Nirvana', el: 'Nirvana' },
    explanation: { en: 'Nirvana released "Smells Like Teen Spirit" in 1991. It became the anthem of Generation X and helped bring grunge and alternative rock into the mainstream.', el: 'Τα Nirvana κυκλοφόρησαν το «Smells Like Teen Spirit» το 1991. Έγινε το ύμνο της Γενιάς X και βοήθησε να φέρει το grunge και το alternative rock στο mainstream.' }
  },
  {
    id: 'cult-30',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'What year did "The Lord of the Rings" film trilogy premiere?', el: 'Ποια χρονιά έκανε πρεμιέρα η τριλογία ταινιών «The Lord of the Rings»;' },
    options: { en: ['1999', '2001', '2003', '2005'], el: ['1999', '2001', '2003', '2005'] },
    correct: { en: '2001', el: '2001' },
    explanation: { en: '"The Fellowship of the Ring" premiered in December 2001. Peter Jackson\'s trilogy (2001–2003) brought J.R.R. Tolkien\'s world to life and won 17 Academy Awards total.', el: 'Το «The Fellowship of the Ring» έκανε πρεμιέρα τον Δεκέμβριο του 2001. Η τριλογία του Peter Jackson (2001–2003) έφερε τον κόσμο του J.R.R. Tolkien στη ζωή και κέρδισε συνολικά 17 Όσκαρ.' }
  },
  {
    id: 'sport-11',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'In which country was basketball invented?', el: 'Σε ποια χώρα εφευρέθηκε το μπάσκετ;' },
    options: { en: ['Canada', 'USA', 'England', 'Australia'], el: ['Καναδάς', 'ΗΠΑ', 'Αγγλία', 'Αυστραλία'] },
    correct: { en: 'USA', el: 'ΗΠΑ' },
    explanation: { en: 'James Naismith invented basketball in 1891 in Springfield, Massachusetts. He created the game to keep his students active indoors during the winter.', el: 'Ο Τζέιμς Νάισμιθ εφηύρε το μπάσκετ το 1891 στο Σπρίνγκφιλντ της Μασαχουσέτης. Δημιούργησε το παιχνίδι για να διατηρήσει τους μαθητές του ενεργούς σε κλειστό χώρο το χειμώνα.' }
  },
  {
    id: 'sport-12',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'How many Grand Slam tennis tournaments are there per year?', el: 'Πόσα τουρνουά τένις Grand Slam πραγματοποιούνται το χρόνο;' },
    options: { en: ['Two', 'Three', 'Four', 'Five'], el: ['Δύο', 'Τρία', 'Τέσσερα', 'Πέντε'] },
    correct: { en: 'Four', el: 'Τέσσερα' },
    explanation: { en: 'The four Grand Slams are the Australian Open, French Open, Wimbledon, and US Open. Winning all four in a calendar year is called a "Calendar Grand Slam."', el: 'Τα τέσσερα Grand Slam είναι το Australian Open, το French Open, το Wimbledon και το US Open. Το να κερδίσει κάποιος και τα τέσσερα σε ένα ημερολογιακό έτος ονομάζεται «Calendar Grand Slam».' }
  },
  {
    id: 'sport-13',
    category: 'Sports',
    difficulty: 'hard',
    question: { en: 'Who has won the most FIFA World Cup titles as a player?', el: 'Ποιος έχει κερδίσει τους περισσότερους τίτλους Παγκοσμίου Κυπέλλου FIFA ως παίκτης;' },
    options: { en: ['Diego Maradona', 'Pelé', 'Lionel Messi', 'Zinedine Zidane'], el: ['Ντιέγο Μαραντόνα', 'Πελέ', 'Λιονέλ Μέσι', 'Ζινεντίν Ζιντάν'] },
    correct: { en: 'Pelé', el: 'Πελέ' },
    explanation: { en: 'Pelé won three World Cups (1958, 1962, 1970) with Brazil—a record no player has matched. He is widely regarded as one of the greatest footballers of all time.', el: 'Ο Πελέ κέρδισε τρία Παγκόσμια Κύπελλα (1958, 1962, 1970) με την Βραζιλία—ρεκόρ που κανένας παίκτης δεν έχει ξεπεράσει. Θεωρείται ευρέως ως ένας από τους μεγαλύτερους ποδοσφαιριστές όλων των εποχών.' }
  },
  {
    id: 'sport-14',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'What color jersey does the leader of the Tour de France wear?', el: 'Ποιο χρώμα φανέλα φοράει ο ηγέτης του Tour de France;' },
    options: { en: ['Green', 'Yellow', 'Polka dot', 'White'], el: ['Πράσινο', 'Κίτρινο', 'Πετρόχαρτο', 'Λευκό'] },
    correct: { en: 'Yellow', el: 'Κίτρινο' },
    explanation: { en: 'The yellow jersey (maillot jaune) is worn by the rider with the lowest cumulative time. It symbolizes the race leader in the Tour de France.', el: 'Η κίτρινη φανέλα (maillot jaune) φοριέται από τον ποδηλάτη με τον χαμηλότερο συνολικό χρόνο. Συμβολίζει τον ηγέτη του αγώνα στο Tour de France.' }
  },
  {
    id: 'sport-15',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'In which city are the Summer Olympics scheduled for 2028?', el: 'Σε ποια πόλη προγραμματίζονται οι Θερινές Ολυμπιακοί Αγώνες του 2028;' },
    options: { en: ['Paris', 'Tokyo', 'Los Angeles', 'Brisbane'], el: ['Παρίσι', 'Τόκιο', 'Λος Άντζελες', 'Μπρίσμπεϊν'] },
    correct: { en: 'Los Angeles', el: 'Λος Άντζελες' },
    explanation: { en: 'Los Angeles will host the 2028 Summer Olympics. It will be the third time LA has hosted the Games, after 1932 and 1984.', el: 'Το Λος Άντζελες θα φιλοξενήσει τους Θερινούς Ολυμπιακούς Αγώνες του 2028. Θα είναι η τρίτη φορά που το LA φιλοξενεί τους Αγώνες, μετά το 1932 και το 1984.' }
  },
  {
    id: 'sport-16',
    category: 'Sports',
    difficulty: 'hard',
    question: { en: 'What is the diameter of a basketball hoop in inches?', el: 'Ποια είναι η διάμετρος ενός καλαθιού μπάσκετ σε ίντσες;' },
    options: { en: ['16 inches', '18 inches', '20 inches', '22 inches'], el: ['16 ίντσες', '18 ίντσες', '20 ίντσες', '22 ίντσες'] },
    correct: { en: '18 inches', el: '18 ίντσες' },
    explanation: { en: 'A standard basketball hoop has an inner diameter of 18 inches (45.7 cm). The rim is 10 feet (3.05 m) high from the court.', el: 'Ένας τυπικός καλαθός μπάσκετ έχει εσωτερική διάμετρο 18 ιντσών (45,7 cm). Το στεφάνι είναι 10 πόδια (3,05 m) ψηλά από το γήπεδο.' }
  },
  {
    id: 'sport-17',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'Which country has won the most FIFA World Cup titles?', el: 'Ποια χώρα έχει κερδίσει τους περισσότερους τίτλους Παγκοσμίου Κυπέλλου FIFA;' },
    options: { en: ['Germany', 'Italy', 'Brazil', 'Argentina'], el: ['Γερμανία', 'Ιταλία', 'Βραζιλία', 'Αργεντινή'] },
    correct: { en: 'Brazil', el: 'Βραζιλία' },
    explanation: { en: 'Brazil has won the FIFA World Cup five times (1958, 1962, 1970, 1994, 2002)—more than any other nation. They are the only country to have participated in every World Cup.', el: 'Η Βραζιλία έχει κερδίσει το Παγκόσμιο Κύπελλο FIFA πέντε φορές (1958, 1962, 1970, 1994, 2002)—περισσότερες από οποιαδήποτε άλλη χώρα. Είναι η μόνη χώρα που συμμετείχε σε κάθε Παγκόσμιο Κύπελλο.' }
  },
  {
    id: 'sport-18',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'What is the maximum break in snooker?', el: 'Ποιο είναι το μέγιστο break στο σνούκερ;' },
    options: { en: ['147', '155', '160', '200'], el: ['147', '155', '160', '200'] },
    correct: { en: '147', el: '147' },
    explanation: { en: 'A 147 break, or "maximum break," is achieved by potting all 15 red balls with 15 blacks, then all six colors. It is the highest possible score in a single visit to the table.', el: 'Ένα break 147, ή «maximum break», επιτυγχάνεται με το να μπαίνουν και οι 15 κόκκινες μπάλες με 15 μαύρες, και μετά όλα τα έξι χρώματα. Είναι το υψηλότερο δυνατό σκορ σε μία επίσκεψη στο τραπέζι.' }
  },
  {
    id: 'sport-19',
    category: 'Sports',
    difficulty: 'hard',
    question: { en: 'Who holds the record for most Olympic gold medals?', el: 'Ποιος κατέχει το ρεκόρ περισσότερων χρυσών Ολυμπιακών μεταλλίων;' },
    options: { en: ['Usain Bolt', 'Carl Lewis', 'Michael Phelps', 'Mark Spitz'], el: ['Γιουσεΐν Μπολτ', 'Καρλ Λιούις', 'Μάικλ Φελπς', 'Μαρκ Σπιτς'] },
    correct: { en: 'Michael Phelps', el: 'Μάικλ Φελπς' },
    explanation: { en: 'Michael Phelps won 23 gold medals across four Olympics (2004–2016)—the most by any athlete. He also holds the records for most total Olympic medals (28) and most golds in a single Games (8 in 2008).', el: 'Ο Μάικλ Φελπς κέρδισε 23 χρυσά μετάλλια σε τέσσερις Ολυμπιακούς Αγώνες (2004–2016)—τα περισσότερα από οποιονδήποτε αθλητή. Κατέχει επίσης τα ρεκόρ για τα περισσότερα συνολικά Ολυμπιακά μετάλλια (28) και για τα περισσότερα χρυσά σε μία Ολυμπιάδα (8 το 2008).' }
  },
  {
    id: 'sport-20',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'How many players are on a baseball team on the field?', el: 'Πόσοι παίκτες έχει μια ομάδα μπέιζμπολ στο γήπεδο;' },
    options: { en: ['7', '8', '9', '10'], el: ['7', '8', '9', '10'] },
    correct: { en: '9', el: '9' },
    explanation: { en: 'A baseball team fields nine players: pitcher, catcher, first baseman, second baseman, shortstop, third baseman, and three outfielders (left, center, right).', el: 'Μια ομάδα μπέιζμπολ έχει εννέα παίκτες στο γήπεδο: pitcher, catcher, first baseman, second baseman, shortstop, third baseman και τρεις outfielders (αριστερό, κεντρικό, δεξί).' }
  },
  {
    id: 'tech-41',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What does "AI" stand for?', el: 'Τι σημαίνει «AI»;' },
    options: { en: ['Artificial Intelligence', 'Automated Interface', 'Advanced Integration', 'Algorithmic Index'], el: ['Artificial Intelligence', 'Automated Interface', 'Advanced Integration', 'Algorithmic Index'] },
    correct: { en: 'Artificial Intelligence', el: 'Artificial Intelligence' },
    explanation: { en: 'AI (Artificial Intelligence) refers to machines or software that simulate human-like thinking, learning, and decision-making. It powers everything from chatbots to self-driving cars.', el: 'Η AI (Artificial Intelligence - Τεχνητή Νοημοσύνη) αναφέρεται σε μηχανές ή λογισμικό που προσομοιώνουν ανθρώπινη σκέψη, μάθηση και λήψη αποφάσεων. Τροφοδοτεί όλα από chatbots μέχρι αυτόνομα οχήματα.' }
  },
  {
    id: 'tech-42',
    category: 'Technology',
    difficulty: 'medium',
    question: { en: 'Which company created the ChatGPT AI chatbot?', el: 'Ποια εταιρεία δημιούργησε το chatbot AI ChatGPT;' },
    options: { en: ['Google', 'Microsoft', 'OpenAI', 'Meta'], el: ['Google', 'Microsoft', 'OpenAI', 'Meta'] },
    correct: { en: 'OpenAI', el: 'OpenAI' },
    explanation: { en: 'OpenAI launched ChatGPT in November 2022. It is a large language model that can converse, answer questions, and generate text. It sparked the generative AI boom.', el: 'Η OpenAI κυκλοφόρησε το ChatGPT τον Νοέμβριο του 2022. Είναι μεγάλο γλωσσικό μοντέλο που μπορεί να συνομιλεί, να απαντάει σε ερωτήσεις και να παράγει κείμενο. Πυροδότησε το boom της generative AI.' }
  },
  {
    id: 'tech-44',
    category: 'Technology',
    difficulty: 'easy',
    question: { en: 'What company produces the Xbox?', el: 'Ποια εταιρεία παράγει το Xbox;' },
    options: { en: ['Sony', 'Nintendo', 'Microsoft', 'Sega'], el: ['Sony', 'Nintendo', 'Microsoft', 'Sega'] },
    correct: { en: 'Microsoft', el: 'Microsoft' },
    explanation: { en: 'Microsoft launched the first Xbox in 2001. It competes with Sony\'s PlayStation and Nintendo\'s consoles in the gaming market.', el: 'Η Microsoft κυκλοφόρησε το πρώτο Xbox το 2001. Ανταγωνίζεται το PlayStation της Sony και τις κονσόλες της Nintendo στην αγορά gaming.' }
  },
  {
    id: 'cult-31',
    category: 'Culture',
    difficulty: 'medium',
    question: { en: 'Who sang "Shape of You"?', el: 'Ποιος τραγούδησε το «Shape of You»;' },
    options: { en: ['Justin Bieber', 'Ed Sheeran', 'Bruno Mars', 'The Weeknd'], el: ['Justin Bieber', 'Ed Sheeran', 'Bruno Mars', 'The Weeknd'] },
    correct: { en: 'Ed Sheeran', el: 'Ed Sheeran' },
    explanation: { en: 'Ed Sheeran released "Shape of You" in 2017. It became one of the best-selling singles of all time and topped charts in over 34 countries.', el: 'Ο Ed Sheeran κυκλοφόρησε το «Shape of You» το 2017. Έγινε ένα από τα πιο εμπορικά singles όλων των εποχών και σκαρφάλωσε στην πρώτη θέση σε πάνω από 34 χώρες.' }
  },
  {
    id: 'cult-32',
    category: 'Culture',
    difficulty: 'hard',
    question: { en: 'What year did the first episode of "Friends" air?', el: 'Ποια χρονιά προβλήθηκε το πρώτο επεισόδιο του «Friends»;' },
    options: { en: ['1992', '1994', '1996', '1998'], el: ['1992', '1994', '1996', '1998'] },
    correct: { en: '1994', el: '1994' },
    explanation: { en: '"Friends" premiered on NBC on September 22, 1994. The sitcom ran for 10 seasons and became one of the most popular and influential TV shows in history.', el: 'Το «Friends» έκανε πρεμιέρα στο NBC στις 22 Σεπτεμβρίου 1994. Η sitcom διαρκήθηκε 10 σεζόν και έγινε μία από τις πιο δημοφιλείς και ελκυστικές τηλεοπτικές σειρές στην ιστορία.' }
  },
  {
    id: 'sport-21',
    category: 'Sports',
    difficulty: 'easy',
    question: { en: 'How many points is a touchdown worth in American football?', el: 'Πόσους πόντους αξίζει ένα touchdown στο αμερικανικό ποδόσφαιρο;' },
    options: { en: ['5', '6', '7', '8'], el: ['5', '6', '7', '8'] },
    correct: { en: '6', el: '6' },
    explanation: { en: 'A touchdown is worth 6 points. After a touchdown, the scoring team can attempt an extra point (kick) for 1 more point or a two-point conversion for 2 more points.', el: 'Ένα touchdown αξίζει 6 πόντους. Μετά το touchdown, η ομάδα που σημείωσε μπορεί να επιχειρήσει extra point (κλικ) για 1 επιπλέον πόντο ή two-point conversion για 2 επιπλέον πόντους.' }
  },
  {
    id: 'sport-22',
    category: 'Sports',
    difficulty: 'medium',
    question: { en: 'In which sport is the Stanley Cup awarded?', el: 'Σε ποιο άθλημα απονέμεται το Stanley Cup;' },
    options: { en: ['Basketball', 'Baseball', 'Ice hockey', 'Soccer'], el: ['Μπάσκετ', 'Μπέιζμπολ', 'Χόκεϊ επί πάγου', 'Ποδόσφαιρο'] },
    correct: { en: 'Ice hockey', el: 'Χόκεϊ επί πάγου' },
    explanation: { en: 'The Stanley Cup is awarded to the winner of the NHL (National Hockey League) playoffs. It is the oldest professional sports trophy in North America.', el: 'Το Stanley Cup απονέμεται στον νικητή των playoffs του NHL (National Hockey League). Είναι το παλαιότερο επαγγελματικό αθλητικό τρόπαιο στη Βόρεια Αμερική.' }
  },
  {
    id: 'tech-43',
    category: 'Technology',
    difficulty: 'hard',
    question: { en: 'What does "QR" in QR code stand for?', el: 'Τι σημαίνει το «QR» στο QR code;' },
    options: { en: ['Quick Response', 'Quality Read', 'Query Result', 'Quantized Register'], el: ['Quick Response', 'Quality Read', 'Query Result', 'Quantized Register'] },
    correct: { en: 'Quick Response', el: 'Quick Response' },
    explanation: { en: 'QR stands for "Quick Response." QR codes were invented in Japan in 1994 by Denso Wave to allow quick decoding. They can store URLs, text, and other data.', el: 'Το QR σημαίνει «Quick Response» (Γρήγορη Απόκριση). Τα QR codes εφευρέθηκαν στην Ιαπωνία το 1994 από την Denso Wave για γρήγορη αποκωδικοποίηση. Μπορούν να αποθηκεύουν URLs, κείμενο και άλλα δεδομένα.' }
  },
  {
    id: 'cult-33',
    category: 'Culture',
    difficulty: 'easy',
    question: { en: 'Which streaming platform is known for "The Mandalorian"?', el: 'Ποια πλατφόρμα streaming είναι γνωστή για το «The Mandalorian»;' },
    options: { en: ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max'], el: ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max'] },
    correct: { en: 'Disney+', el: 'Disney+' },
    explanation: { en: '"The Mandalorian" premiered on Disney+ in 2019. The Star Wars series became a hit and introduced "Baby Yoda" (Grogu) to global pop culture.', el: 'Το «The Mandalorian» έκανε πρεμιέρα στο Disney+ το 2019. Η σειρά Star Wars έγινε επιτυχία και εισήγαγε το «Baby Yoda» (Γκρόγκου) στη παγκόσμια ποπ κουλτούρα.' }
  },
  {
    id: 'sport-23',
    category: 'Sports',
    difficulty: 'hard',
    question: { en: 'What is the name of the tennis tournament held at Wimbledon?', el: 'Ποιο είναι το όνομα του τουρνουά τένις που πραγματοποιείται στο Wimbledon;' },
    options: { en: ['The Championships', 'Wimbledon Open', 'British Grand Slam', 'All England Open'], el: ['The Championships', 'Wimbledon Open', 'British Grand Slam', 'All England Open'] },
    correct: { en: 'The Championships', el: 'The Championships' },
    explanation: { en: 'The official name is "The Championships, Wimbledon." It is the oldest tennis tournament in the world (since 1877) and the only Grand Slam still played on grass courts.', el: 'Το επίσημο όνομα είναι «The Championships, Wimbledon». Είναι το παλαιότερο τουρνουά τένις στον κόσμο (από το 1877) και το μόνο Grand Slam που ακόμα παίζεται σε γρασσέδων γήπεδα.' }
  },
];
