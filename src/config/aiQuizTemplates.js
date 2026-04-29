// Template-based quiz generator - works fully client-side
// Maps topics/keywords to pre-built question pools

export const TOPIC_KEYWORDS = {
  math: ["math", "μαθηματικ", "αριθμ", "πρόσθεσ", "αφαίρεσ", "πολλαπλασ", "διαίρεσ", "γεωμετρ", "κλάσμα", "addition", "subtraction", "fraction", "geometry"],
  science: ["science", "επιστήμ", "φυσικ", "χημε", "βιολογ", "σώμα", "body", "physics", "chemistry", "biology"],
  geography: ["γεωγραφ", "ήπειρ", "θάλασσ", "ωκεαν", "χώρ", "πρωτεύουσ", "geography", "country", "capital", "ocean", "continent"],
  history: ["ιστορ", "αρχαί", "πόλεμ", "βυζαν", "επανάστασ", "history", "ancient", "war", "revolution"],
  language: ["γλώσσ", "γραμματικ", "ορθογραφ", "ρήμα", "ουσιαστικ", "language", "grammar", "spelling", "verb", "noun"],
  animals: ["ζώα", "ζώο", "ζώου", "animal", "wildlife", "pet"],
  space: ["διάστημ", "πλανήτ", "άστρ", "γαλαξ", "space", "planet", "star", "galaxy"],
  nature: ["φύσ", "φυτ", "δέντρ", "λουλούδ", "nature", "plant", "tree", "flower"],
  body: ["σώμα", "καρδιά", "πνεύμον", "βιταμίν", "body", "heart", "lung", "vitamin"],
  greek_history: ["ελληνικ", "αρχαία ελλάδα", "βυζαν", "1821", "ολυμπιακ", "greek", "olympics", "1821"],
};

const POOLS = {
  math: [
    { q: { el: "Πόσο είναι 7 × 8;", en: "What is 7 × 8?" }, options: ["54", "56", "58", "63"], correct: "56" },
    { q: { el: "Πόσο είναι 144 ÷ 12;", en: "What is 144 ÷ 12?" }, options: ["10", "12", "14", "16"], correct: "12" },
    { q: { el: "Πόσο είναι 25% του 80;", en: "What is 25% of 80?" }, options: ["15", "20", "25", "30"], correct: "20" },
    { q: { el: "Ποιο είναι το άθροισμα των γωνιών τριγώνου;", en: "Sum of triangle angles?" }, options: ["90°", "180°", "270°", "360°"], correct: "180°" },
    { q: { el: "Πόσο είναι 9²;", en: "What is 9²?" }, options: ["72", "81", "89", "99"], correct: "81" },
    { q: { el: "Πόσο είναι 1/2 + 1/4;", en: "What is 1/2 + 1/4?" }, options: ["1/4", "1/2", "3/4", "1"], correct: "3/4" },
    { q: { el: "Πόσες πλευρές έχει το εξάγωνο;", en: "Sides of a hexagon?" }, options: ["5", "6", "7", "8"], correct: "6" },
    { q: { el: "√64 = ?", en: "√64 = ?" }, options: ["6", "7", "8", "9"], correct: "8" },
    { q: { el: "Πόσο είναι 2³ × 2²;", en: "What is 2³ × 2²?" }, options: ["16", "32", "64", "128"], correct: "32" },
    { q: { el: "Πόσο είναι το 10% του 250;", en: "What is 10% of 250?" }, options: ["20", "25", "30", "35"], correct: "25" },
    { q: { el: "Ποιος είναι ο μέσος όρος του 4, 6, 8;", en: "Mean of 4, 6, 8?" }, options: ["5", "6", "7", "8"], correct: "6" },
    { q: { el: "Πόσο είναι 100 - 47;", en: "100 - 47?" }, options: ["43", "53", "57", "63"], correct: "53" },
    { q: { el: "Πόσο είναι 12 × 12;", en: "12 × 12?" }, options: ["124", "132", "144", "156"], correct: "144" },
    { q: { el: "Πόσοι μήνες έχουν 30 μέρες;", en: "Months with 30 days?" }, options: ["3", "4", "5", "7"], correct: "4" },
    { q: { el: "Πόσα δευτερόλεπτα έχει ένα λεπτό;", en: "Seconds in a minute?" }, options: ["50", "60", "100", "120"], correct: "60" },
  ],
  science: [
    { q: { el: "Πόσα οστά έχει ο ενήλικας άνθρωπος;", en: "Bones in an adult human?" }, options: ["186", "206", "226", "256"], correct: "206" },
    { q: { el: "Ποιο όργανο πομπάρει το αίμα;", en: "Which organ pumps blood?" }, options: [{ el: "Πνεύμονας", en: "Lung" }, { el: "Καρδιά", en: "Heart" }, { el: "Εγκέφαλος", en: "Brain" }, { el: "Συκώτι", en: "Liver" }], correct: "Καρδιά|Heart" },
    { q: { el: "Σε τι θερμοκρασία βράζει το νερό;", en: "At what temperature does water boil?" }, options: ["50°C", "75°C", "100°C", "150°C"], correct: "100°C" },
    { q: { el: "Ποιο αέριο εισπνέουμε;", en: "Which gas do we breathe in?" }, options: [{ el: "Άζωτο", en: "Nitrogen" }, { el: "Οξυγόνο", en: "Oxygen" }, { el: "Διοξείδιο άνθρακα", en: "Carbon Dioxide" }, { el: "Υδρογόνο", en: "Hydrogen" }], correct: "Οξυγόνο|Oxygen" },
    { q: { el: "Ποιος ανακάλυψε τη βαρύτητα;", en: "Who discovered gravity?" }, options: [{ el: "Αϊνστάιν", en: "Einstein" }, { el: "Νεύτων", en: "Newton" }, { el: "Γαλιλαίος", en: "Galileo" }, { el: "Τέσλα", en: "Tesla" }], correct: "Νεύτων|Newton" },
    { q: { el: "Από τι αποτελείται το νερό;", en: "What is water made of?" }, options: ["H₂O", "CO₂", "O₂", "N₂"], correct: "H₂O" },
    { q: { el: "Πόσοι πλανήτες υπάρχουν στο ηλιακό σύστημα;", en: "How many planets in the solar system?" }, options: ["6", "7", "8", "9"], correct: "8" },
    { q: { el: "Ποιο μέρος του κυττάρου παράγει ενέργεια;", en: "Which cell part produces energy?" }, options: [{ el: "Πυρήνας", en: "Nucleus" }, { el: "Μιτοχόνδριο", en: "Mitochondrion" }, { el: "Ριβόσωμα", en: "Ribosome" }, { el: "Μεμβράνη", en: "Membrane" }], correct: "Μιτοχόνδριο|Mitochondrion" },
    { q: { el: "Ποιος είναι ο πιο σκληρός πέτρα;", en: "Hardest natural material?" }, options: [{ el: "Σίδηρος", en: "Iron" }, { el: "Γρανίτης", en: "Granite" }, { el: "Διαμάντι", en: "Diamond" }, { el: "Χρυσός", en: "Gold" }], correct: "Διαμάντι|Diamond" },
    { q: { el: "Πόσα δόντια έχει ο ενήλικας;", en: "Adult teeth count?" }, options: ["28", "32", "36", "40"], correct: "32" },
    { q: { el: "Πόσες αισθήσεις έχει ο άνθρωπος;", en: "How many senses do humans have?" }, options: ["3", "4", "5", "6"], correct: "5" },
    { q: { el: "Πώς λέγεται η μελέτη των ζώων;", en: "Study of animals is called?" }, options: [{ el: "Βοτανική", en: "Botany" }, { el: "Ζωολογία", en: "Zoology" }, { el: "Γεωλογία", en: "Geology" }, { el: "Βιολογία", en: "Biology" }], correct: "Ζωολογία|Zoology" },
  ],
  geography: [
    { q: { el: "Ποια είναι η πρωτεύουσα της Ελλάδας;", en: "Capital of Greece?" }, options: [{ el: "Θεσσαλονίκη", en: "Thessaloniki" }, { el: "Αθήνα", en: "Athens" }, { el: "Πάτρα", en: "Patras" }, { el: "Λάρισα", en: "Larissa" }], correct: "Αθήνα|Athens" },
    { q: { el: "Ποια είναι η μεγαλύτερη ήπειρος;", en: "Largest continent?" }, options: [{ el: "Αφρική", en: "Africa" }, { el: "Ασία", en: "Asia" }, { el: "Ευρώπη", en: "Europe" }, { el: "Αμερική", en: "America" }], correct: "Ασία|Asia" },
    { q: { el: "Ποιος είναι ο μεγαλύτερος ωκεανός;", en: "Largest ocean?" }, options: [{ el: "Ατλαντικός", en: "Atlantic" }, { el: "Ινδικός", en: "Indian" }, { el: "Ειρηνικός", en: "Pacific" }, { el: "Αρκτικός", en: "Arctic" }], correct: "Ειρηνικός|Pacific" },
    { q: { el: "Ποιο είναι το μεγαλύτερο όρος της Ελλάδας;", en: "Tallest mountain in Greece?" }, options: [{ el: "Όλυμπος", en: "Olympus" }, { el: "Παρνασσός", en: "Parnassos" }, { el: "Ταΰγετος", en: "Taygetos" }, { el: "Πίνδος", en: "Pindos" }], correct: "Όλυμπος|Olympus" },
    { q: { el: "Ποια ήπειρος είναι η ψυχρότερη;", en: "Coldest continent?" }, options: [{ el: "Ευρώπη", en: "Europe" }, { el: "Ανταρκτική", en: "Antarctica" }, { el: "Ασία", en: "Asia" }, { el: "Αφρική", en: "Africa" }], correct: "Ανταρκτική|Antarctica" },
    { q: { el: "Ποιος είναι ο μεγαλύτερος ποταμός;", en: "Longest river?" }, options: [{ el: "Νείλος", en: "Nile" }, { el: "Αμαζόνιος", en: "Amazon" }, { el: "Δούναβης", en: "Danube" }, { el: "Μισσισσιπής", en: "Mississippi" }], correct: "Νείλος|Nile" },
    { q: { el: "Πόσες πολιτείες έχουν οι ΗΠΑ;", en: "How many US states?" }, options: ["48", "49", "50", "52"], correct: "50" },
    { q: { el: "Ποια χώρα έχει σχήμα μπότας;", en: "Boot-shaped country?" }, options: [{ el: "Ισπανία", en: "Spain" }, { el: "Ιταλία", en: "Italy" }, { el: "Πορτογαλία", en: "Portugal" }, { el: "Ελλάδα", en: "Greece" }], correct: "Ιταλία|Italy" },
    { q: { el: "Ποιος είναι ο μεγαλύτερος έρημος του κόσμου;", en: "Largest desert?" }, options: [{ el: "Σαχάρα", en: "Sahara" }, { el: "Γκόμπι", en: "Gobi" }, { el: "Καλαχάρι", en: "Kalahari" }, { el: "Ανταρκτική", en: "Antarctic" }], correct: "Ανταρκτική|Antarctic" },
    { q: { el: "Πόσες είναι οι ήπειροι;", en: "How many continents?" }, options: ["5", "6", "7", "8"], correct: "7" },
    { q: { el: "Ποια χώρα έχει τους περισσότερους κατοίκους;", en: "Most populated country?" }, options: [{ el: "ΗΠΑ", en: "USA" }, { el: "Ινδία", en: "India" }, { el: "Κίνα", en: "China" }, { el: "Ρωσία", en: "Russia" }], correct: "Ινδία|India" },
    { q: { el: "Ποια είναι η πρωτεύουσα της Γαλλίας;", en: "Capital of France?" }, options: [{ el: "Λονδίνο", en: "London" }, { el: "Παρίσι", en: "Paris" }, { el: "Βερολίνο", en: "Berlin" }, { el: "Μαδρίτη", en: "Madrid" }], correct: "Παρίσι|Paris" },
  ],
  history: [
    { q: { el: "Ποιο έτος ξεκίνησε η Ελληνική Επανάσταση;", en: "Year of Greek Revolution?" }, options: ["1810", "1821", "1830", "1850"], correct: "1821" },
    { q: { el: "Ποιος ήταν ο πρώτος αυτοκράτορας του Βυζαντίου;", en: "First Byzantine emperor?" }, options: [{ el: "Ιουστινιανός", en: "Justinian" }, { el: "Κωνσταντίνος", en: "Constantine" }, { el: "Ηράκλειος", en: "Heraclius" }, { el: "Βασίλειος", en: "Basil" }], correct: "Κωνσταντίνος|Constantine" },
    { q: { el: "Ποιος έγραψε την Οδύσσεια;", en: "Who wrote the Odyssey?" }, options: [{ el: "Σοφοκλής", en: "Sophocles" }, { el: "Όμηρος", en: "Homer" }, { el: "Πλάτων", en: "Plato" }, { el: "Αριστοτέλης", en: "Aristotle" }], correct: "Όμηρος|Homer" },
    { q: { el: "Πότε έγιναν οι πρώτοι Ολυμπιακοί;", en: "When were the first Olympics?" }, options: ["776 π.Χ. / 776 BC", "500 π.Χ. / 500 BC", "1000 π.Χ. / 1000 BC", "300 π.Χ. / 300 BC"], correct: "776 π.Χ. / 776 BC" },
    { q: { el: "Ποιος ίδρυσε τη Ρώμη σύμφωνα με τον μύθο;", en: "Mythical founder of Rome?" }, options: [{ el: "Καίσαρας", en: "Caesar" }, { el: "Ρωμύλος", en: "Romulus" }, { el: "Νέρων", en: "Nero" }, { el: "Αύγουστος", en: "Augustus" }], correct: "Ρωμύλος|Romulus" },
    { q: { el: "Πότε έπεσε η Κωνσταντινούπολη;", en: "Fall of Constantinople year?" }, options: ["1204", "1453", "1500", "1600"], correct: "1453" },
    { q: { el: "Ποιος ανακάλυψε την Αμερική;", en: "Who discovered America?" }, options: [{ el: "Μαγγελάνος", en: "Magellan" }, { el: "Κολόμβος", en: "Columbus" }, { el: "Βάσκο ντα Γκάμα", en: "Vasco da Gama" }, { el: "Κουκ", en: "Cook" }], correct: "Κολόμβος|Columbus" },
    { q: { el: "Πότε έληξε ο Β' Παγκόσμιος Πόλεμος;", en: "When did WWII end?" }, options: ["1939", "1942", "1945", "1950"], correct: "1945" },
    { q: { el: "Ποιος ήταν ο Μέγας Αλέξανδρος;", en: "Who was Alexander the Great?" }, options: [{ el: "Φιλόσοφος", en: "Philosopher" }, { el: "Στρατηγός", en: "General" }, { el: "Ζωγράφος", en: "Painter" }, { el: "Συγγραφέας", en: "Writer" }], correct: "Στρατηγός|General" },
    { q: { el: "Ποιοι έχτισαν τις πυραμίδες;", en: "Who built the pyramids?" }, options: [{ el: "Έλληνες", en: "Greeks" }, { el: "Ρωμαίοι", en: "Romans" }, { el: "Αιγύπτιοι", en: "Egyptians" }, { el: "Πέρσες", en: "Persians" }], correct: "Αιγύπτιοι|Egyptians" },
  ],
  language: [
    { q: { el: "Πώς γράφεται σωστά;", en: "Correct spelling?" }, options: ["Πώρτα", "Πόρτα", "Πορτα", "Πορτά"], correct: "Πόρτα" },
    { q: { el: "Ποιο είναι ουσιαστικό;", en: "Which is a noun?" }, options: [{ el: "Τρέχω", en: "Run" }, { el: "Σπίτι", en: "House" }, { el: "Όμορφο", en: "Beautiful" }, { el: "Γρήγορα", en: "Quickly" }], correct: "Σπίτι|House" },
    { q: { el: "Ποιο είναι ρήμα;", en: "Which is a verb?" }, options: [{ el: "Σχολείο", en: "School" }, { el: "Παιδί", en: "Child" }, { el: "Παίζω", en: "Play" }, { el: "Πράσινος", en: "Green" }], correct: "Παίζω|Play" },
    { q: { el: "Πόσα γράμματα έχει το ελληνικό αλφάβητο;", en: "Letters in Greek alphabet?" }, options: ["22", "24", "26", "28"], correct: "24" },
    { q: { el: "Ποιο είναι αντίθετο του 'μεγάλος';", en: "Opposite of 'big'?" }, options: [{ el: "Μικρός", en: "Small" }, { el: "Πλατύς", en: "Wide" }, { el: "Ψηλός", en: "Tall" }, { el: "Στενός", en: "Narrow" }], correct: "Μικρός|Small" },
    { q: { el: "Πληθυντικός του 'παιδί';", en: "Plural of 'child'?" }, options: [{ el: "Παιδιά", en: "Children" }, { el: "Παιδί", en: "Childs" }, { el: "Παιδιές", en: "Childes" }, { el: "Παίδιες", en: "Childies" }], correct: "Παιδιά|Children" },
    { q: { el: "Ποιο είναι επίθετο;", en: "Which is an adjective?" }, options: [{ el: "Τρέχω", en: "Run" }, { el: "Όμορφος", en: "Beautiful" }, { el: "Σπίτι", en: "House" }, { el: "Γρήγορα", en: "Quickly" }], correct: "Όμορφος|Beautiful" },
    { q: { el: "Ποιο είναι σωστό;", en: "Which is correct?" }, options: ["Είσε", "Είσαι", "Είσαί", "Ίσαι"], correct: "Είσαι" },
    { q: { el: "Συνώνυμο του 'γρήγορος';", en: "Synonym of 'fast'?" }, options: [{ el: "Αργός", en: "Slow" }, { el: "Ταχύς", en: "Quick" }, { el: "Ήρεμος", en: "Calm" }, { el: "Δυνατός", en: "Strong" }], correct: "Ταχύς|Quick" },
    { q: { el: "Πόσα φωνήεντα έχει η ελληνική;", en: "Vowels in Greek?" }, options: ["5", "7", "9", "10"], correct: "7" },
  ],
  animals: [
    { q: { el: "Ποιο ζώο είναι το πιο γρήγορο;", en: "Fastest animal?" }, options: [{ el: "Λιοντάρι", en: "Lion" }, { el: "Τσίτα", en: "Cheetah" }, { el: "Άλογο", en: "Horse" }, { el: "Λύκος", en: "Wolf" }], correct: "Τσίτα|Cheetah" },
    { q: { el: "Πόσα πόδια έχει η αράχνη;", en: "Spider legs?" }, options: ["4", "6", "8", "10"], correct: "8" },
    { q: { el: "Πώς αναπνέουν τα ψάρια;", en: "How do fish breathe?" }, options: [{ el: "Πνεύμονες", en: "Lungs" }, { el: "Βράγχια", en: "Gills" }, { el: "Δέρμα", en: "Skin" }, { el: "Στόμα", en: "Mouth" }], correct: "Βράγχια|Gills" },
    { q: { el: "Ποιο είναι το μεγαλύτερο ζώο;", en: "Largest animal?" }, options: [{ el: "Ελέφαντας", en: "Elephant" }, { el: "Φάλαινα", en: "Whale" }, { el: "Καμηλοπάρδαλη", en: "Giraffe" }, { el: "Κροκόδειλος", en: "Crocodile" }], correct: "Φάλαινα|Whale" },
    { q: { el: "Τι τρώει η αρκούδα;", en: "What do bears eat?" }, options: [{ el: "Μόνο φυτά", en: "Only plants" }, { el: "Μόνο κρέας", en: "Only meat" }, { el: "Και τα δύο", en: "Both" }, { el: "Μόνο ψάρια", en: "Only fish" }], correct: "Και τα δύο|Both" },
    { q: { el: "Ποιο είναι το μεγαλύτερο πουλί;", en: "Largest bird?" }, options: [{ el: "Αετός", en: "Eagle" }, { el: "Στρουθοκάμηλος", en: "Ostrich" }, { el: "Πιγκουίνος", en: "Penguin" }, { el: "Φλαμίγκο", en: "Flamingo" }], correct: "Στρουθοκάμηλος|Ostrich" },
    { q: { el: "Πόσες καρδιές έχει το χταπόδι;", en: "Octopus hearts?" }, options: ["1", "2", "3", "4"], correct: "3" },
    { q: { el: "Ποιο ζώο κάνει μέλι;", en: "Which animal makes honey?" }, options: [{ el: "Μυρμήγκι", en: "Ant" }, { el: "Μέλισσα", en: "Bee" }, { el: "Σφήκα", en: "Wasp" }, { el: "Πεταλούδα", en: "Butterfly" }], correct: "Μέλισσα|Bee" },
    { q: { el: "Πόσα δόντια έχει ο σκύλος;", en: "Dog teeth count?" }, options: ["28", "32", "42", "48"], correct: "42" },
    { q: { el: "Ποιο ζώο μπορεί να αναγεννήσει το δέρμα του;", en: "Which animal regenerates skin?" }, options: [{ el: "Σαλιγκάρι", en: "Snail" }, { el: "Φίδι", en: "Snake" }, { el: "Σκουλήκι", en: "Worm" }, { el: "Όλα", en: "All" }], correct: "Φίδι|Snake" },
  ],
  space: [
    { q: { el: "Ποιος είναι ο μεγαλύτερος πλανήτης;", en: "Largest planet?" }, options: [{ el: "Άρης", en: "Mars" }, { el: "Δίας", en: "Jupiter" }, { el: "Κρόνος", en: "Saturn" }, { el: "Ποσειδώνας", en: "Neptune" }], correct: "Δίας|Jupiter" },
    { q: { el: "Ποιος είναι ο πιο κοντινός στον Ήλιο;", en: "Closest planet to Sun?" }, options: [{ el: "Αφροδίτη", en: "Venus" }, { el: "Ερμής", en: "Mercury" }, { el: "Γη", en: "Earth" }, { el: "Άρης", en: "Mars" }], correct: "Ερμής|Mercury" },
    { q: { el: "Πόσοι δορυφόροι έχει ο Άρης;", en: "Mars's moons?" }, options: ["0", "1", "2", "4"], correct: "2" },
    { q: { el: "Ποιος ήταν ο πρώτος άνθρωπος στη Σελήνη;", en: "First human on Moon?" }, options: [{ el: "Γκαγκάριν", en: "Gagarin" }, { el: "Άρμστρονγκ", en: "Armstrong" }, { el: "Άλντριν", en: "Aldrin" }, { el: "Γκλεν", en: "Glenn" }], correct: "Άρμστρονγκ|Armstrong" },
    { q: { el: "Πώς λέγεται ο γαλαξίας μας;", en: "Our galaxy's name?" }, options: [{ el: "Ανδρομέδα", en: "Andromeda" }, { el: "Γαλαξίας", en: "Milky Way" }, { el: "Τρίγωνο", en: "Triangle" }, { el: "Σομπρέρο", en: "Sombrero" }], correct: "Γαλαξίας|Milky Way" },
    { q: { el: "Πόσα έτη έχει ο Ήλιος;", en: "Sun's age?" }, options: ["1 δισ. / 1B", "2 δισ. / 2B", "4.6 δισ. / 4.6B", "10 δισ. / 10B"], correct: "4.6 δισ. / 4.6B" },
    { q: { el: "Πόσοι πλανήτες έχουν δακτυλίους;", en: "Planets with rings?" }, options: ["1", "2", "3", "4"], correct: "4" },
    { q: { el: "Πόσο διαρκεί μια μέρα στην Αφροδίτη;", en: "Day length on Venus?" }, options: [{ el: "1 ημέρα Γης", en: "1 Earth day" }, { el: "117 ημέρες", en: "117 days" }, { el: "243 ημέρες", en: "243 days" }, { el: "365 ημέρες", en: "365 days" }], correct: "243 ημέρες|243 days" },
    { q: { el: "Τι είναι μαύρη τρύπα;", en: "What is a black hole?" }, options: [{ el: "Πλανήτης", en: "Planet" }, { el: "Άστρο", en: "Star" }, { el: "Περιοχή με ισχυρή βαρύτητα", en: "Strong gravity region" }, { el: "Κενό", en: "Void" }], correct: "Περιοχή με ισχυρή βαρύτητα|Strong gravity region" },
    { q: { el: "Πόση είναι η απόσταση Γη-Σελήνη;", en: "Earth-Moon distance?" }, options: ["100.000 km", "200.000 km", "384.000 km", "1.000.000 km"], correct: "384.000 km" },
  ],
  nature: [
    { q: { el: "Πώς λέγεται η διαδικασία που τα φυτά παράγουν τροφή;", en: "Process by which plants make food?" }, options: [{ el: "Αναπνοή", en: "Respiration" }, { el: "Φωτοσύνθεση", en: "Photosynthesis" }, { el: "Πέψη", en: "Digestion" }, { el: "Εξάτμιση", en: "Evaporation" }], correct: "Φωτοσύνθεση|Photosynthesis" },
    { q: { el: "Ποιο μέρος του φυτού απορροφά νερό;", en: "Which plant part absorbs water?" }, options: [{ el: "Φύλλα", en: "Leaves" }, { el: "Ρίζες", en: "Roots" }, { el: "Λουλούδια", en: "Flowers" }, { el: "Καρποί", en: "Fruits" }], correct: "Ρίζες|Roots" },
    { q: { el: "Πόσες εποχές έχει ο χρόνος;", en: "Seasons in a year?" }, options: ["2", "3", "4", "5"], correct: "4" },
    { q: { el: "Τι παράγουν τα δέντρα;", en: "What do trees produce?" }, options: [{ el: "Διοξείδιο άνθρακα", en: "CO₂" }, { el: "Οξυγόνο", en: "Oxygen" }, { el: "Άζωτο", en: "Nitrogen" }, { el: "Υδρογόνο", en: "Hydrogen" }], correct: "Οξυγόνο|Oxygen" },
    { q: { el: "Πόσα κύρια χρώματα έχει το ουράνιο τόξο;", en: "Rainbow colors?" }, options: ["5", "6", "7", "8"], correct: "7" },
    { q: { el: "Από τι αποτελείται το χιόνι;", en: "What is snow made of?" }, options: [{ el: "Νερό", en: "Water" }, { el: "Πάγος", en: "Ice crystals" }, { el: "Άμμος", en: "Sand" }, { el: "Σκόνη", en: "Dust" }], correct: "Πάγος|Ice crystals" },
    { q: { el: "Σε ποια εποχή πέφτουν τα φύλλα;", en: "When do leaves fall?" }, options: [{ el: "Άνοιξη", en: "Spring" }, { el: "Καλοκαίρι", en: "Summer" }, { el: "Φθινόπωρο", en: "Autumn" }, { el: "Χειμώνας", en: "Winter" }], correct: "Φθινόπωρο|Autumn" },
    { q: { el: "Από τι γίνονται τα σύννεφα;", en: "What are clouds made of?" }, options: [{ el: "Καπνός", en: "Smoke" }, { el: "Σταγονίδια νερού", en: "Water droplets" }, { el: "Σκόνη", en: "Dust" }, { el: "Παγωμένος αέρας", en: "Frozen air" }], correct: "Σταγονίδια νερού|Water droplets" },
  ],
  body: [
    { q: { el: "Πόσες πλευρές έχει το ανθρώπινο σώμα;", en: "How many ribs?" }, options: ["20", "22", "24", "26"], correct: "24" },
    { q: { el: "Ποιο όργανο φιλτράρει το αίμα;", en: "Which organ filters blood?" }, options: [{ el: "Καρδιά", en: "Heart" }, { el: "Νεφρά", en: "Kidneys" }, { el: "Πνεύμονες", en: "Lungs" }, { el: "Στομάχι", en: "Stomach" }], correct: "Νεφρά|Kidneys" },
    { q: { el: "Ποια βιταμίνη παίρνουμε από τον ήλιο;", en: "Vitamin from sunlight?" }, options: ["A", "B", "C", "D"], correct: "D" },
    { q: { el: "Πόσοι μύες υπάρχουν στο σώμα;", en: "Muscles in the body?" }, options: ["~200", "~400", "~600", "~800"], correct: "~600" },
    { q: { el: "Πόσο γρήγορα χτυπά η καρδιά;", en: "Heart beats per minute?" }, options: ["40-60", "60-100", "100-150", "150-200"], correct: "60-100" },
    { q: { el: "Ποιο όργανο πέπτει την τροφή;", en: "Which organ digests food?" }, options: [{ el: "Καρδιά", en: "Heart" }, { el: "Στομάχι", en: "Stomach" }, { el: "Πνεύμονες", en: "Lungs" }, { el: "Εγκέφαλος", en: "Brain" }], correct: "Στομάχι|Stomach" },
    { q: { el: "Πόσοι αιμοσφαιρίνες υπάρχουν στο αίμα;", en: "Blood cell types?" }, options: ["1", "2", "3", "4"], correct: "3" },
    { q: { el: "Ποιο μέρος του εγκεφάλου ελέγχει την ισορροπία;", en: "Brain part for balance?" }, options: [{ el: "Παρεγκεφαλίδα", en: "Cerebellum" }, { el: "Εγκέφαλος", en: "Cerebrum" }, { el: "Στέλεχος", en: "Brainstem" }, { el: "Νωτιαίος μυελός", en: "Spinal cord" }], correct: "Παρεγκεφαλίδα|Cerebellum" },
  ],
};

export const SUBJECT_OPTIONS = [
  { id: "math",         icon: "🧮", label: { el: "Μαθηματικά",       en: "Math" } },
  { id: "science",      icon: "🔬", label: { el: "Επιστήμη",         en: "Science" } },
  { id: "geography",    icon: "🌍", label: { el: "Γεωγραφία",        en: "Geography" } },
  { id: "history",      icon: "📜", label: { el: "Ιστορία",          en: "History" } },
  { id: "language",     icon: "📖", label: { el: "Γλώσσα",           en: "Language" } },
  { id: "animals",      icon: "🐾", label: { el: "Ζώα",              en: "Animals" } },
  { id: "space",        icon: "🚀", label: { el: "Διάστημα",         en: "Space" } },
  { id: "nature",       icon: "🌿", label: { el: "Φύση",             en: "Nature" } },
  { id: "body",         icon: "🫀", label: { el: "Ανθρώπινο Σώμα",   en: "Human Body" } },
];

function detectTopic(text) {
  const lower = text.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const score = keywords.reduce((s, kw) => s + (lower.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; bestMatch = topic; }
  }
  return bestMatch || "math";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCorrectIndex(opts, correctValue, lang) {
  const possibleAnswers = correctValue.split("|");
  const a = possibleAnswers[0];
  const b = possibleAnswers[1] || a;

  return opts.findIndex(opt => {
    if (typeof opt === "string") return opt === a || opt === b;
    return opt.el === a || opt.en === b || opt.en === a;
  });
}

export function generateQuiz({ topic, count = 10, subjectId, lang = "el" }) {
  const detectedTopic = subjectId || detectTopic(topic);
  const pool = POOLS[detectedTopic] || POOLS.math;
  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((q, i) => {
    const options = q.options.map(o => typeof o === "string" ? o : (lang === "el" ? o.el : o.en));
    const correctIdx = getCorrectIndex(q.options, q.correct, lang);

    return {
      id: `gen_${Date.now()}_${i}`,
      question: lang === "el" ? q.q.el : q.q.en,
      options,
      correct: correctIdx >= 0 ? correctIdx : 0,
      difficulty: "medium",
    };
  });
}
