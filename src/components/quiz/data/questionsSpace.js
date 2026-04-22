export const questionsSpace = [
  // === SolarSystem (5) ===
  {
    id: 'sol-1',
    category: 'SolarSystem',
    difficulty: 'easy',
    question: { en: 'Which planet is known as the Red Planet?', el: 'Ποιος πλανήτης είναι γνωστός ως ο Κόκκινος Πλανήτης;' },
    options: { en: ['Venus', 'Mars', 'Jupiter', 'Saturn'], el: ['Αφροδίτη', 'Άρης', 'Δίας', 'Κρόνος'] },
    correct: { en: 'Mars', el: 'Άρης' },
    explanation: { en: 'Mars appears red because its surface is rich in iron oxide (rust), which gives it its distinctive color.', el: 'Ο Άρης φαίνεται κόκκινος επειδή η επιφάνειά του είναι πλούσια σε οξείδιο του σιδήρου (σκουριά), που του δίνει το χαρακτηριστικό χρώμα του.' }
  },
  {
    id: 'sol-2',
    category: 'SolarSystem',
    difficulty: 'medium',
    question: { en: 'How many moons does Jupiter have (approximately)?', el: 'Πόσα φεγγάρια έχει ο Δίας (περίπου);' },
    options: { en: ['16', '27', '79', '95'], el: ['16', '27', '79', '95'] },
    correct: { en: '95', el: '95' },
    explanation: { en: 'Jupiter has the most moons of any planet in our solar system, with approximately 95 known moons as of recent counts.', el: 'Ο Δίας έχει τα περισσότερα φεγγάρια από κάθε πλανήτη στο ηλιακό μας σύστημα, με περίπου 95 γνωστά φεγγάρια σύμφωνα με τις πρόσφατες καταμέτρησεις.' }
  },
  {
    id: 'sol-3',
    category: 'SolarSystem',
    difficulty: 'hard',
    question: { en: 'Which planet has the shortest orbital period?', el: 'Ποιος πλανήτης έχει τη μικρότερη περίοδο περιφοράς;' },
    options: { en: ['Venus', 'Mercury', 'Mars', 'Earth'], el: ['Αφροδίτη', 'Ερμής', 'Άρης', 'Γη'] },
    correct: { en: 'Mercury', el: 'Ερμής' },
    explanation: { en: 'Mercury is closest to the Sun, so it has the shortest orbit and completes a revolution in just 88 Earth days.', el: 'Ο Ερμής είναι ο πλησιέστερος στον Ήλιο, οπότε έχει τη μικρότερη τροχιά και ολοκληρώνει μια περιφορά σε μόνο 88 γήινες ημέρες.' }
  },
  {
    id: 'sol-4',
    category: 'SolarSystem',
    difficulty: 'easy',
    question: { en: 'What is the largest planet in our solar system?', el: 'Ποιος είναι ο μεγαλύτερος πλανήτης του ηλιακού μας συστήματος;' },
    options: { en: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], el: ['Κρόνος', 'Δίας', 'Ποσειδώνας', 'Ουρανός'] },
    correct: { en: 'Jupiter', el: 'Δίας' },
    explanation: { en: 'Jupiter has more than twice the mass of all other planets combined and is the largest by both volume and mass.', el: 'Ο Δίας έχει πάνω από το διπλάσιο μάζα από όλους τους άλλους πλανήτες μαζί και είναι ο μεγαλύτερος τόσο σε όγκο όσο και σε μάζα.' }
  },
  {
    id: 'sol-5',
    category: 'SolarSystem',
    difficulty: 'medium',
    question: { en: 'Which planet rotates on its side?', el: 'Ποιος πλανήτης περιστρέφεται "πλαγιαστά";' },
    options: { en: ['Neptune', 'Uranus', 'Saturn', 'Venus'], el: ['Ποσειδώνας', 'Ουρανός', 'Κρόνος', 'Αφροδίτη'] },
    correct: { en: 'Uranus', el: 'Ουρανός' },
    explanation: { en: 'Uranus has an axial tilt of about 98°, so it essentially orbits the Sun "on its side," likely due to a massive collision early in its history.', el: 'Ο Ουρανός έχει κλίση άξονα περίπου 98°, οπότε ουσιαστικά περιστρέφεται "πλαγιαστά" γύρω από τον Ήλιο, πιθανότατα λόγω μιας τεράστιας σύγκρουσης νωρίς στην ιστορία του.' }
  },

  // === Galaxies (5) ===
  {
    id: 'gal-1',
    category: 'Galaxies',
    difficulty: 'easy',
    question: { en: 'What is the name of our galaxy?', el: 'Πώς ονομάζεται ο γαλαξίας μας;' },
    options: { en: ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'], el: ['Ανδρομέδα', 'Γαλαξίας (Milky Way)', 'Τρίγωνο', 'Σομπρέρο'] },
    correct: { en: 'Milky Way', el: 'Γαλαξίας (Milky Way)' },
    explanation: { en: 'Our galaxy is called the Milky Way because of its pale, band-like appearance in the night sky, resembling spilled milk.', el: 'Ο γαλαξίας μας ονομάζεται Γαλαξίας λόγω της γαλακτώδους, λωρίδος εμφάνισής του στον νυχτερινό ουρανό, που μοιάζει με χυμένο γάλα.' }
  },
  {
    id: 'gal-2',
    category: 'Galaxies',
    difficulty: 'medium',
    question: { en: 'What type of galaxy is the Milky Way?', el: 'Τι τύπος γαλαξία είναι ο Γαλαξίας μας;' },
    options: {
      en: ['Elliptical', 'Spiral', 'Irregular', 'Lenticular'],
      el: ['Ελλειπτικός', 'Σπειροειδής', 'Ακανόνιστος', 'Φακοειδής']
    },
    correct: { en: 'Spiral', el: 'Σπειροειδής' },
    explanation: { en: 'The Milky Way has a distinct spiral structure with curved arms of stars, gas, and dust extending from a central bulge.', el: 'Ο Γαλαξίας μας έχει ξεχωριστή σπειροειδή δομή με καμπύλους βραχίονες αστεριών, αερίων και σκόνης που εκτείνονται από ένα κεντρικό εξόγκωμα.' }
  },
  {
    id: 'gal-3',
    category: 'Galaxies',
    difficulty: 'hard',
    question: { en: 'What lies at the center of most galaxies?', el: 'Τι βρίσκεται στο κέντρο των περισσότερων γαλαξιών;' },
    options: {
      en: ['A neutron star', 'A supermassive black hole', 'A quasar', 'A white dwarf'],
      el: ['Αστέρας νετρονίων', 'Υπερμεγέθης μαύρη τρύπα', 'Κβάζαρ', 'Λευκός νάνος']
    },
    correct: { en: 'A supermassive black hole', el: 'Υπερμεγέθης μαύρη τρύπα' },
    explanation: { en: 'Observations of stars orbiting rapidly around galactic centers provide strong evidence that supermassive black holes lie at the core of most galaxies.', el: 'Οι παρατηρήσεις αστεριών που περιστρέφονται ταχύτατα γύρω από τα κέντρα γαλαξιών παρέχουν ισχυρές αποδείξεις ότι υπερμεγέθεις μαύρες τρύπες βρίσκονται στον πυρήνα των περισσότερων γαλαξιών.' }
  },
  {
    id: 'gal-4',
    category: 'Galaxies',
    difficulty: 'easy',
    question: { en: 'What is a light-year?', el: 'Τι είναι ένα έτος φωτός;' },
    options: {
      en: ['A unit of time', 'A unit of distance', 'A unit of speed', 'A unit of mass'],
      el: ['Μονάδα χρόνου', 'Μονάδα απόστασης', 'Μονάδα ταχύτητας', 'Μονάδα μάζας']
    },
    correct: { en: 'A unit of distance', el: 'Μονάδα απόστασης' },
    explanation: { en: 'A light-year is the distance that light travels in one year in vacuum—about 9.46 trillion kilometers—used to measure vast cosmic distances.', el: 'Ένα έτος φωτός είναι η απόσταση που διανύει το φως σε ένα έτος στο κενό—περίπου 9,46 τρισεκατομμύρια χιλιόμετρα—και χρησιμοποιείται για τη μέτρηση τεράστιων κοσμικών αποστάσεων.' }
  },
  {
    id: 'gal-5',
    category: 'Galaxies',
    difficulty: 'medium',
    question: { en: 'The nearest major galaxy to the Milky Way is...', el: 'Ο πλησιέστερος μεγάλος γαλαξίας στον δικό μας είναι...' },
    options: { en: ['Triangulum', 'Andromeda', 'Centaurus A', 'Whirlpool'], el: ['Τρίγωνο', 'Ανδρομέδα', 'Κένταυρος Α', 'Δίνη'] },
    correct: { en: 'Andromeda', el: 'Ανδρομέδα' },
    explanation: { en: 'The Andromeda Galaxy is about 2.5 million light-years away and is the nearest large galaxy to the Milky Way.', el: 'Ο γαλαξίας της Ανδρομέδας απέχει περίπου 2,5 εκατομμύρια έτη φωτός και είναι ο πλησιέστερος μεγάλος γαλαξίας στον δικό μας.' }
  },

  // === SpaceExploration (5) ===
  {
    id: 'spc-1',
    category: 'SpaceExploration',
    difficulty: 'easy',
    question: { en: 'Who was the first human in space?', el: 'Ποιος ήταν ο πρώτος άνθρωπος στο διάστημα;' },
    options: { en: ['Neil Armstrong', 'Yuri Gagarin', 'John Glenn', 'Alan Shepard'], el: ['Νιλ Άρμστρονγκ', 'Γιούρι Γκαγκάριν', 'Τζον Γκλεν', 'Άλαν Σέπαρντ'] },
    correct: { en: 'Yuri Gagarin', el: 'Γιούρι Γκαγκάριν' },
    explanation: { en: 'Yuri Gagarin became the first human in space on April 12, 1961, when he completed one orbit of Earth aboard Vostok 1.', el: 'Ο Γιούρι Γκαγκάριν έγινε ο πρώτος άνθρωπος στο διάστημα στις 12 Απριλίου 1961, όταν ολοκλήρωσε μια τροχιά γύρω από τη Γη με το Βοστόκ 1.' }
  },
  {
    id: 'spc-2',
    category: 'SpaceExploration',
    difficulty: 'medium',
    question: { en: 'Which space telescope was launched in 1990?', el: 'Ποιο διαστημικό τηλεσκόπιο εκτοξεύτηκε το 1990;' },
    options: { en: ['James Webb', 'Hubble', 'Kepler', 'Spitzer'], el: ['James Webb', 'Hubble', 'Kepler', 'Spitzer'] },
    correct: { en: 'Hubble', el: 'Hubble' },
    explanation: { en: 'The Hubble Space Telescope was launched by the Space Shuttle Discovery in April 1990 and has revolutionized our understanding of the universe.', el: 'Το διαστημικό τηλεσκόπιο Hubble εκτοξεύτηκε από το Διαστημικό Λεωφορείο Discovery τον Απρίλιο του 1990 και έχει φέρει επανάσταση στην κατανόησή μας για το σύμπαν.' }
  },
  {
    id: 'spc-3',
    category: 'SpaceExploration',
    difficulty: 'hard',
    question: { en: 'Which spacecraft first visited Pluto?', el: 'Ποιο διαστημόπλοιο επισκέφτηκε πρώτο τον Πλούτωνα;' },
    options: { en: ['Voyager 2', 'New Horizons', 'Pioneer 10', 'Cassini'], el: ['Voyager 2', 'New Horizons', 'Pioneer 10', 'Cassini'] },
    correct: { en: 'New Horizons', el: 'New Horizons' },
    explanation: { en: 'NASA\'s New Horizons spacecraft flew by Pluto in July 2015, providing the first close-up images and data of the dwarf planet.', el: 'Το διαστημικό σκάφος New Horizons της NASA πέταξε κοντά στον Πλούτωνα τον Ιούλιο του 2015, παρέχοντας τις πρώτες εικόνες και δεδομένα από κοντά για τον νάνο πλανήτη.' }
  },
  {
    id: 'spc-4',
    category: 'SpaceExploration',
    difficulty: 'easy',
    question: { en: 'What does ISS stand for?', el: 'Τι σημαίνει ISS;' },
    options: {
      en: ['International Space Station', 'Interplanetary Science System', 'Integrated Satellite Service', 'International Science Summit'],
      el: ['Διεθνής Διαστημικός Σταθμός', 'Διαπλανητικό Σύστημα Επιστήμης', 'Ενοποιημένη Δορυφορική Υπηρεσία', 'Διεθνής Επιστημονική Σύνοδος']
    },
    correct: { en: 'International Space Station', el: 'Διεθνής Διαστημικός Σταθμός' },
    explanation: { en: 'ISS stands for International Space Station, a collaborative project of NASA, Roscosmos, ESA, JAXA, and CSA that has been continuously occupied since 2000.', el: 'Το ISS σημαίνει Διεθνής Διαστημικός Σταθμός—ένα συνεργατικό έργο της NASA, Roscosmos, ESA, JAXA και CSA που κατοικείται συνεχώς από το 2000.' }
  },
  {
    id: 'spc-5',
    category: 'SpaceExploration',
    difficulty: 'medium',
    question: { en: 'Which company developed the Falcon 9 rocket?', el: 'Ποια εταιρεία ανέπτυξε τον πύραυλο Falcon 9;' },
    options: { en: ['Blue Origin', 'SpaceX', 'Boeing', 'NASA'], el: ['Blue Origin', 'SpaceX', 'Boeing', 'NASA'] },
    correct: { en: 'SpaceX', el: 'SpaceX' },
    explanation: { en: 'SpaceX, founded by Elon Musk, developed the reusable Falcon 9 rocket, which has become a workhorse for launching satellites and Crew Dragon missions.', el: 'Η SpaceX, που ιδρύθηκε από τον Elon Musk, ανέπτυξε τον επαναχρησιμοποιήσιμο πύραυλο Falcon 9, που έχει γίνει η κύρια μονάδα για εκτοξεύσεις δορυφόρων και αποστολών Crew Dragon.' }
  },

  // === SolarSystem (6–10) ===
  {
    id: 'sol-6',
    category: 'SolarSystem',
    difficulty: 'easy',
    question: { en: 'Which dwarf planet was reclassified from planet status in 2006?', el: 'Ποιος νάνος πλανήτης αφαίρεθηκε από την κατηγορία πλανήτη το 2006;' },
    options: { en: ['Eris', 'Pluto', 'Ceres', 'Makemake'], el: ['Έρις', 'Πλούτων', 'Δήμητρα', 'Μακεμάκε'] },
    correct: { en: 'Pluto', el: 'Πλούτων' },
    explanation: { en: 'In 2006, the IAU redefined "planet" and reclassified Pluto as a dwarf planet because it has not cleared its orbital neighborhood.', el: 'Το 2006, η IAU επαναπροσδιόρισε τον όρο "πλανήτης" και ξαναταξινόμησε τον Πλούτωνα ως νάνο πλανήτη επειδή δεν έχει καθαρίσει τη γύρω τροχιακή περιοχή του.' }
  },
  {
    id: 'sol-7',
    category: 'SolarSystem',
    difficulty: 'medium',
    question: { en: 'The main asteroid belt lies between which two planets?', el: 'Η κύρια ζώνη αστεροειδών βρίσκεται ανάμεσα σε ποιον δύο πλανήτες;' },
    options: { en: ['Earth and Mars', 'Mars and Jupiter', 'Jupiter and Saturn', 'Venus and Earth'], el: ['Γη και Άρης', 'Άρης και Δίας', 'Δίας και Κρόνος', 'Αφροδίτη και Γη'] },
    correct: { en: 'Mars and Jupiter', el: 'Άρης και Δίας' },
    explanation: { en: 'The main asteroid belt orbits the Sun between Mars and Jupiter, where Jupiter\'s gravity prevented a planet from forming.', el: 'Η κύρια ζώνη αστεροειδών περιστρέφεται γύρω από τον Ήλιο ανάμεσα στον Άρη και τον Δία, όπου η βαρύτητα του Δία εμπόδισε τη δημιουργία πλανήτη.' }
  },
  {
    id: 'sol-8',
    category: 'SolarSystem',
    difficulty: 'hard',
    question: { en: 'Which planet has the most eccentric (elliptical) orbit of the eight planets?', el: 'Ποιος πλανήτης έχει την πιο εκκεντρική (ελλειπτική) τροχιά από τους οκτώ πλανήτες;' },
    options: { en: ['Mars', 'Mercury', 'Pluto', 'Neptune'], el: ['Άρης', 'Ερμής', 'Πλούτων', 'Ποσειδώνας'] },
    correct: { en: 'Mercury', el: 'Ερμής' },
    explanation: { en: 'Among the eight planets, Mercury has the most elliptical orbit (highest eccentricity), with its distance from the Sun varying significantly.', el: 'Μεταξύ των οκτώ πλανητών, ο Ερμής έχει την πιο ελλειπτική τροχιά (μεγαλύτερη εκκεντρότητα), με την απόστασή του από τον Ήλιο να ποικίλλει σημαντικά.' }
  },
  {
    id: 'sol-9',
    category: 'SolarSystem',
    difficulty: 'medium',
    question: { en: 'What is the largest object in the asteroid belt?', el: 'Ποιο είναι το μεγαλύτερο αντικείμενο στη ζώνη αστεροειδών;' },
    options: { en: ['Vesta', 'Ceres', 'Pallas', 'Hygiea'], el: ['Βέστα', 'Δήμητρα', 'Παλλάς', 'Υγιεία'] },
    correct: { en: 'Ceres', el: 'Δήμητρα' },
    explanation: { en: 'Ceres is both the largest object in the asteroid belt and the only dwarf planet located in the inner solar system.', el: 'Η Δήμητρα είναι τόσο το μεγαλύτερο αντικείμενο στη ζώνη αστεροειδών όσο και ο μόνος νάνος πλανήτης που βρίσκεται στο εσωτερικό ηλιακό σύστημα.' }
  },
  {
    id: 'sol-10',
    category: 'SolarSystem',
    difficulty: 'hard',
    question: { en: 'Which moon is considered a leading candidate for extraterrestrial life due to its subsurface ocean?', el: 'Ποιο φεγγάρι θεωρείται κύριος υποψήφιος για εξωγήινη ζωή λόγω του υποθαλάσσιου ωκεανού του;' },
    options: { en: ['Titan', 'Europa', 'Callisto', 'Ganymede'], el: ['Τιτάνας', 'Ευρώπη', 'Καλλιστώ', 'Γανυμήδης'] },
    correct: { en: 'Europa', el: 'Ευρώπη' },
    explanation: { en: 'Europa has a subsurface ocean of liquid water beneath its icy crust, and water plus potential energy sources make it a prime candidate for life.', el: 'Η Ευρώπη έχει υποθαλάσσιο ωκεανό υγρού νερού κάτω από τον παγωμένο φλοιό της, και το νερό μαζί με πιθανές πηγές ενέργειας την καθιστούν κύριος υποψήφιος για ζωή.' }
  },

  // === Galaxies (6–10) ===
  {
    id: 'gal-6',
    category: 'Galaxies',
    difficulty: 'easy',
    question: { en: 'What is a nebula?', el: 'Τι είναι ένα νεφέλιο;' },
    options: {
      en: ['A cloud of gas and dust in space', 'A type of star', 'A black hole', 'A galaxy cluster'],
      el: ['Νέφος αερίου και σκόνης στο διάστημα', 'Είδος αστεριού', 'Μαύρη τρύπα', 'Σμήνος γαλαξιών']
    },
    correct: { en: 'A cloud of gas and dust in space', el: 'Νέφος αερίου και σκόνης στο διάστημα' },
    explanation: { en: 'A nebula is a cloud of gas and dust in space where stars are born; the term comes from Latin for "cloud."', el: 'Το νεφέλιο είναι ένα νέφος αερίου και σκόνης στο διάστημα όπου γεννιούνται αστέρες· ο όρος προέρχεται από το λατινικό για "νέφος."' }
  },
  {
    id: 'gal-7',
    category: 'Galaxies',
    difficulty: 'medium',
    question: { en: 'What type of star will our Sun become at the end of its life?', el: 'Τι είδους αστέρι θα γίνει ο Ήλιος μας στο τέλος της ζωής του;' },
    options: {
      en: ['Neutron star', 'Black hole', 'White dwarf', 'Red giant'],
      el: ['Αστέρας νετρονίων', 'Μαύρη τρύπα', 'Λευκός νάνος', 'Κόκκινος γίγαντας']
    },
    correct: { en: 'White dwarf', el: 'Λευκός νάνος' },
    explanation: { en: 'Our Sun is not massive enough to become a neutron star or black hole; it will shed its outer layers and leave a dense white dwarf core.', el: 'Ο Ήλιος μας δεν έχει αρκετή μάζα για να γίνει αστέρας νετρονίων ή μαύρη τρύπα· θα αποβάλει τα εξωτερικά στρώματά του και θα αφήσει έναν πυκνό πυρήνα λευκού νάνου.' }
  },
  {
    id: 'gal-8',
    category: 'Galaxies',
    difficulty: 'hard',
    question: { en: 'What is dark energy believed to cause?', el: 'Τι πιστεύεται ότι προκαλεί η σκοτεινή ενέργεια;' },
    options: {
      en: ['Slowing of expansion', 'Accelerating expansion of the universe', 'Formation of galaxies', 'Gravity'],
      el: ['Επιβράδυνση της διαστολής', 'Επιταχυνόμενη διαστολή του σύμπαντος', 'Δημιουργία γαλαξιών', 'Βαρύτητα']
    },
    correct: { en: 'Accelerating expansion of the universe', el: 'Επιταχυνόμενη διαστολή του σύμπαντος' },
    explanation: { en: 'Dark energy is a mysterious form of energy that permeates space and causes the expansion of the universe to accelerate, not slow down.', el: 'Η σκοτεινή ενέργεια είναι μια μυστηριώδης μορφή ενέργειας που διαπερνά τον χώρο και προκαλεί την επιτάχυνση της διαστολής του σύμπαντος, όχι την επιβράδυνσή της.' }
  },
  {
    id: 'gal-9',
    category: 'Galaxies',
    difficulty: 'easy',
    question: { en: 'Which type of main-sequence star has the hottest surface temperature?', el: 'Ποιος τύπος αστέρα της κύριας ακολουθίας έχει τη μεγαλύτερη θερμοκρασία επιφάνειας;' },
    options: {
      en: ['Red dwarf', 'Yellow star', 'Blue (O-type) star', 'Orange star'],
      el: ['Κόκκινος νάνος', 'Κίτρινος αστέρας', 'Μπλε (τύπου Ο) αστέρας', 'Πορτοκαλί αστέρας']
    },
    correct: { en: 'Blue (O-type) star', el: 'Μπλε (τύπου Ο) αστέρας' },
    explanation: { en: 'O-type stars are the hottest and most massive main-sequence stars; higher temperature produces more blue light (Wien\'s law).', el: 'Οι αστέρες τύπου Ο είναι οι πιο θερμοί και ογκώδεις αστέρες της κύριας ακολουθίας· η υψηλότερη θερμοκρασία παράγει περισσότερο μπλε φως (νόμος του Wien).' }
  },
  {
    id: 'gal-10',
    category: 'Galaxies',
    difficulty: 'medium',
    question: { en: 'The cosmic microwave background is leftover radiation from which event?', el: 'Η κοσμική μικροκυματική ακτινοβολία υποβάθρου είναι υπολειπόμενη ακτινοβολία από ποιο γεγονός;' },
    options: {
      en: ['Supernova', 'Big Bang', 'Star formation', 'Black hole merger'],
      el: ['Υπερκαινοφανής', 'Μεγάλη Έκρηξη', 'Δημιουργία αστεριών', 'Συγχώνευση μαύρων τρυπών']
    },
    correct: { en: 'Big Bang', el: 'Μεγάλη Έκρηξη' },
    explanation: { en: 'The CMB is remnant radiation from about 380,000 years after the Big Bang, when the universe became transparent to light.', el: 'Η CMB είναι υπολειπόμενη ακτινοβολία από περίπου 380.000 χρόνια μετά τη Μεγάλη Έκρηξη, όταν το σύμπαν έγινε διαφανές στο φως.' }
  },

  // === SpaceExploration (6–10) ===
  {
    id: 'spc-6',
    category: 'SpaceExploration',
    difficulty: 'easy',
    question: { en: 'Which Mars rover discovered evidence of past liquid water on Mars?', el: 'Ποιο ρομπότ του Άρη ανακάλυψε αποδείξεις για παλιό υγρό νερό στον Άρη;' },
    options: { en: ['Spirit', 'Curiosity', 'Sojourner', 'Pathfinder'], el: ['Spirit', 'Curiosity', 'Sojourner', 'Pathfinder'] },
    correct: { en: 'Curiosity', el: 'Curiosity' },
    explanation: { en: 'Curiosity discovered ancient lake beds and minerals that form in water, proving that Mars had persistent liquid water in its past.', el: 'Το Curiosity ανακάλυψε αρχαία λεκάνες λιμνών και ορυκτά που σχηματίζονται στο νερό, αποδεικνύοντας ότι ο Άρης είχε διαρκή υγρό νερό στο παρελθόν του.' }
  },
  {
    id: 'spc-7',
    category: 'SpaceExploration',
    difficulty: 'medium',
    question: { en: 'What is the name of China\'s modular space station?', el: 'Πώς ονομάζεται ο modular διαστημικός σταθμός της Κίνας;' },
    options: { en: ['Salyut', 'Mir', 'Tiangong', 'Skylab'], el: ['Σαλιούτ', 'Μιρ', 'Τιάνγκονγκ', 'Skylab'] },
    correct: { en: 'Tiangong', el: 'Τιάνγκονγκ' },
    explanation: { en: 'Tiangong (Heavenly Palace) is China\'s modular space station, with modules launched and assembled in low Earth orbit since 2021.', el: 'Το Tiangong (Ουράνιο Παλάτι) είναι ο modular διαστημικός σταθμός της Κίνας, με ενότητες που εκτοξεύτηκαν και συναρμολογήθηκαν σε χαμηλή τροχιά γύρω από τη Γη από το 2021.' }
  },
  {
    id: 'spc-8',
    category: 'SpaceExploration',
    difficulty: 'hard',
    question: { en: 'NASA\'s Artemis program aims to land astronauts where by the mid-2020s?', el: 'Το πρόγραμμα Artemis της NASA στοχεύει να προσγειώσει αστροναύτες πού μέχρι τα μέσα της δεκαετίας του 2020;' },
    options: { en: ['Mars', 'The Moon', 'Asteroid belt', 'Europa'], el: ['Άρης', 'Η Σελήνη', 'Ζώνη αστεροειδών', 'Ευρώπη'] },
    correct: { en: 'The Moon', el: 'Η Σελήνη' },
    explanation: { en: 'Artemis aims to return humans to the Moon by the mid-2020s, including the first woman and first person of color, as a stepping stone to Mars.', el: 'Το Artemis στοχεύει στην επιστροφή ανθρώπων στη Σελήνη μέχρι τα μέσα της δεκαετίας του 2020, συμπεριλαμβανομένης της πρώτης γυναίκας, ως σκαλοπάτι προς τον Άρη.' }
  },
  {
    id: 'spc-9',
    category: 'SpaceExploration',
    difficulty: 'easy',
    question: { en: 'What is the name of NASA\'s Mars rover that landed in February 2021?', el: 'Πώς ονομάζεται το ρομπότ της NASA στον Άρη που προσγειώθηκε τον Φεβρουάριο του 2021;' },
    options: { en: ['Curiosity', 'Opportunity', 'Perseverance', 'Spirit'], el: ['Curiosity', 'Opportunity', 'Perseverance', 'Spirit'] },
    correct: { en: 'Perseverance', el: 'Perseverance' },
    explanation: { en: 'Perseverance landed in Jezero Crater on February 18, 2021, to search for signs of past microbial life and collect samples for return to Earth.', el: 'Το Perseverance προσγειώθηκε στον Κρατήρα Jezero στις 18 Φεβρουαρίου 2021 για να αναζητήσει σημάδια παλιάς μικροβιακής ζωής και να συλλέξει δείγματα για επιστροφή στη Γη.' }
  },
  {
    id: 'spc-10',
    category: 'SpaceExploration',
    difficulty: 'medium',
    question: { en: 'Which planned NASA mission will study Jupiter\'s moon Europa for signs of habitability?', el: 'Ποια προγραμματισμένη αποστολή της NASA θα μελετήσει την Ευρώπη του Δία για σημάδια κατοικησιμότητας;' },
    options: { en: ['Juno', 'Europa Clipper', 'Galileo', 'Cassini'], el: ['Juno', 'Europa Clipper', 'Galileo', 'Cassini'] },
    correct: { en: 'Europa Clipper', el: 'Europa Clipper' },
    explanation: { en: 'Europa Clipper is a NASA mission planned for launch in the 2020s to study Europa\'s icy shell and subsurface ocean for habitability.', el: 'Το Europa Clipper είναι αποστολή της NASA προγραμματισμένη για εκτόξευση τη δεκαετία του 2020 για μελέτη του παγωμένου φλοιού και του υποθαλάσσιου ωκεανού της Ευρώπης για κατοικησιμότητα.' }
  },

  // === 70 NEW QUESTIONS (sol-11 through spc-33) ===
  { id: 'sol-11', category: 'SolarSystem', difficulty: 'easy', question: { en: 'What planet is closest to the Sun?', el: 'Ποιος πλανήτης είναι πλησιέστερος στον Ήλιο;' }, options: { en: ['Venus', 'Mercury', 'Mars', 'Earth'], el: ['Αφροδίτη', 'Ερμής', 'Άρης', 'Γη'] }, correct: { en: 'Mercury', el: 'Ερμής' }, explanation: { en: 'Mercury is the smallest and innermost planet, orbiting the Sun at an average distance of about 58 million kilometers.', el: 'Ο Ερμής είναι ο μικρότερος και εσωτερικότερος πλανήτης, περιστρεφόμενος γύρω από τον Ήλιο σε μέση απόσταση περίπου 58 εκατομμυρίων χιλιομέτρων.' } },
  { id: 'sol-12', category: 'SolarSystem', difficulty: 'easy', question: { en: 'Which planet has visible rings?', el: 'Ποιος πλανήτης έχει ορατά δακτυλίδια;' }, options: { en: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'], el: ['Δίας', 'Ουρανός', 'Κρόνος', 'Ποσειδώνας'] }, correct: { en: 'Saturn', el: 'Κρόνος' }, explanation: { en: 'Saturn has the most prominent ring system of any planet, made of ice and rock particles orbiting the planet.', el: 'Ο Κρόνος έχει το πιο εμφανές σύστημα δακτυλίων από κάθε πλανήτη, αποτελούμενο από σωματίδια πάγου και βράχου.' } },
  { id: 'sol-13', category: 'SolarSystem', difficulty: 'easy', question: { en: 'What is the largest moon in our solar system?', el: 'Ποιο είναι το μεγαλύτερο φεγγάρι στο ηλιακό μας σύστημα;' }, options: { en: ['Titan', 'Europa', 'Ganymede', 'Callisto'], el: ['Τιτάνας', 'Ευρώπη', 'Γανυμήδης', 'Καλλιστώ'] }, correct: { en: 'Ganymede', el: 'Γανυμήδης' }, explanation: { en: 'Ganymede is Jupiter\'s largest moon and is even bigger than the planet Mercury.', el: 'Ο Γανυμήδης είναι το μεγαλύτερο φεγγάρι του Δία και είναι ακόμη μεγαλύτερος από τον πλανήτη Ερμή.' } },
  { id: 'sol-14', category: 'SolarSystem', difficulty: 'easy', question: { en: 'How many planets are in our solar system?', el: 'Πόσοι πλανήτες υπάρχουν στο ηλιακό μας σύστημα;' }, options: { en: ['7', '8', '9', '10'], el: ['7', '8', '9', '10'] }, correct: { en: '8', el: '8' }, explanation: { en: 'There are eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified in 2006.', el: 'Υπάρχουν οκτώ πλανήτες: Ερμής, Αφροδίτη, Γη, Άρης, Δίας, Κρόνος, Ουρανός και Ποσειδώνας. Ο Πλούτων ξαναταξινομήθηκε το 2006.' } },
  { id: 'sol-15', category: 'SolarSystem', difficulty: 'easy', question: { en: 'What causes the phases of the Moon?', el: 'Τι προκαλεί τις φάσεις της Σελήνης;' }, options: { en: ['Earth\'s shadow', 'The Moon\'s rotation', 'Relative positions of Sun, Earth, Moon', 'Lunar eclipses'], el: ['Η σκιά της Γης', 'Η περιστροφή της Σελήνης', 'Η σχετική θέση Ήλιου, Γης, Σελήνης', 'Σεληνιακές εκλείψεις'] }, correct: { en: 'Relative positions of Sun, Earth, Moon', el: 'Η σχετική θέση Ήλιου, Γης, Σελήνης' }, explanation: { en: 'Lunar phases result from the changing angle between the Sun, Earth, and Moon as the Moon orbits Earth.', el: 'Οι σεληνιακές φάσεις προκύπτουν από τη μεταβαλλόμενη γωνία μεταξύ Ήλιου, Γης και Σελήνης καθώς η Σελήνη περιστρέφεται γύρω από τη Γη.' } },
  { id: 'sol-16', category: 'SolarSystem', difficulty: 'medium', question: { en: 'Which planet has the strongest winds in the solar system?', el: 'Ποιος πλανήτης έχει τους ισχυρότερους ανέμους στο ηλιακό σύστημα;' }, options: { en: ['Jupiter', 'Saturn', 'Neptune', 'Mars'], el: ['Δίας', 'Κρόνος', 'Ποσειδώνας', 'Άρης'] }, correct: { en: 'Neptune', el: 'Ποσειδώνας' }, explanation: { en: 'Neptune has supersonic winds reaching over 2,000 km/h in its atmosphere.', el: 'Ο Ποσειδώνας έχει υπερηχητικούς ανέμους που φθάνουν τα 2.000 km/h στην ατμόσφαιρά του.' } },
  { id: 'sol-17', category: 'SolarSystem', difficulty: 'medium', question: { en: 'What is the Great Red Spot on Jupiter?', el: 'Τι είναι η Μεγάλη Κόκκινη Κηλίδα στον Δία;' }, options: { en: ['A volcano', 'A giant storm', 'A moon shadow', 'A cloud formation'], el: ['Ηφαίστειο', 'Τεράστια καταιγίδα', 'Σκιά φεγγαριού', 'Νεφέλωμα'] }, correct: { en: 'A giant storm', el: 'Τεράστια καταιγίδα' }, explanation: { en: 'The Great Red Spot is a persistent anticyclonic storm that has been observed for over 350 years.', el: 'Η Μεγάλη Κόκκινη Κηλίδα είναι μια διαρκής αντικυκλωνική καταιγίδα που παρατηρείται εδώ και πάνω από 350 χρόνια.' } },
  { id: 'sol-18', category: 'SolarSystem', difficulty: 'medium', question: { en: 'Which moon has a thick atmosphere and hydrocarbon lakes?', el: 'Ποιο φεγγάρι έχει πυκνή ατμόσφαιρα και λίμνες υδρογονανθράκων;' }, options: { en: ['Europa', 'Ganymede', 'Titan', 'Io'], el: ['Ευρώπη', 'Γανυμήδης', 'Τιτάνας', 'Ιώ'] }, correct: { en: 'Titan', el: 'Τιτάνας' }, explanation: { en: 'Titan has the only dense atmosphere among moons and surface liquid in the form of methane and ethane lakes.', el: 'Ο Τιτάνας έχει την μόνη πυκνή ατμόσφαιρα μεταξύ των φεγγαριών και επιφανειακό υγρό με τη μορφή λιμνών μεθανίου και αιθανίου.' } },
  { id: 'sol-19', category: 'SolarSystem', difficulty: 'medium', question: { en: 'Where is the Kuiper Belt located?', el: 'Πού βρίσκεται η Ζώνη του Κάιπερ;' }, options: { en: ['Between Mars and Jupiter', 'Beyond Neptune', 'Around the Sun\'s corona', 'Between Earth and Mars'], el: ['Μεταξύ Άρη και Δία', 'Πέρα από τον Ποσειδώνα', 'Γύρω από την κορώνα του Ήλιου', 'Μεταξύ Γης και Άρη'] }, correct: { en: 'Beyond Neptune', el: 'Πέρα από τον Ποσειδώνα' }, explanation: { en: 'The Kuiper Belt is a region of icy bodies extending from Neptune\'s orbit to about 50 AU from the Sun.', el: 'Η Ζώνη του Κάιπερ είναι μια περιοχή παγωμένων σωμάτων που εκτείνεται από την τροχιά του Ποσειδώνα έως περίπου 50 AU από τον Ήλιο.' } },
  { id: 'sol-20', category: 'SolarSystem', difficulty: 'medium', question: { en: 'What is an AU (astronomical unit)?', el: 'Τι είναι το AU (αστρονομική μονάδα);' }, options: { en: ['Average Earth-Sun distance', 'Speed of light', 'Moon-Earth distance', 'Jupiter-Sun distance'], el: ['Μέση απόσταση Γη-Ήλιος', 'Ταχύτητα φωτός', 'Απόσταση Σελήνη-Γη', 'Απόσταση Δίας-Ήλιος'] }, correct: { en: 'Average Earth-Sun distance', el: 'Μέση απόσταση Γη-Ήλιος' }, explanation: { en: 'One AU is approximately 150 million km, the mean distance from Earth to the Sun.', el: 'Ένα AU είναι περίπου 150 εκατομμύρια km, η μέση απόσταση από τη Γη μέχρι τον Ήλιο.' } },
  { id: 'sol-21', category: 'SolarSystem', difficulty: 'hard', question: { en: 'Which moon is the most volcanically active body in the solar system?', el: 'Ποιο φεγγάρι είναι το πιο ηφαιστειακά ενεργό σώμα στο ηλιακό σύστημα;' }, options: { en: ['Europa', 'Titan', 'Io', 'Enceladus'], el: ['Ευρώπη', 'Τιτάνας', 'Ιώ', 'Εγκέλαδος'] }, correct: { en: 'Io', el: 'Ιώ' }, explanation: { en: 'Io experiences tidal heating from Jupiter, driving hundreds of active volcanoes and constant resurfacing.', el: 'Η Ιώ υφίσταται παλιρροιακή θέρμανση από τον Δία, προκαλώντας εκατοντάδες ενεργά ηφαίστεια και συνεχή ανανέωση επιφάνειας.' } },
  { id: 'sol-22', category: 'SolarSystem', difficulty: 'hard', question: { en: 'What phenomenon causes Mercury to have extreme temperature swings?', el: 'Ποιο φαινόμενο προκαλεί τις ακραίες διακυμάνσεις θερμοκρασίας στον Ερμή;' }, options: { en: ['Magnetic field', 'Slow rotation and lack of atmosphere', 'Proximity to Sun only', 'Orbital eccentricity only'], el: ['Μαγνητικό πεδίο', 'Αργή περιστροφή και έλλειψη ατμόσφαιρας', 'Μόνο η εγγύτητα στον Ήλιο', 'Μόνο η εκκεντρότητα τροχιάς'] }, correct: { en: 'Slow rotation and lack of atmosphere', el: 'Αργή περιστροφή και έλλειψη ατμόσφαιρας' }, explanation: { en: 'Mercury\'s long day (59 Earth days) and virtually no atmosphere allow surface temperatures to swing from 430°C to -180°C.', el: 'Η μεγάλη μέρα του Ερμή (59 γήινες ημέρες) και η σχεδόν απόλυτη έλλειψη ατμόσφαιρας επιτρέπουν θερμοκρασίες από 430°C έως -180°C.' } },
  { id: 'sol-23', category: 'SolarSystem', difficulty: 'hard', question: { en: 'What are the Trojan asteroids?', el: 'Τι είναι οι αστεροειδείς Τρώες;' }, options: { en: ['Asteroids between Mars and Jupiter', 'Asteroids at Jupiter\'s L4 and L5 Lagrange points', 'Asteroids near Earth', 'Comets in the Kuiper Belt'], el: ['Αστεροειδείς μεταξύ Άρη και Δία', 'Αστεροειδείς στα σημεία Lagrange L4 και L5 του Δία', 'Αστεροειδείς κοντά στη Γη', 'Κομήτες στη Ζώνη του Κάιπερ'] }, correct: { en: 'Asteroids at Jupiter\'s L4 and L5 Lagrange points', el: 'Αστεροειδείς στα σημεία Lagrange L4 και L5 του Δία' }, explanation: { en: 'Trojans share Jupiter\'s orbit at stable Lagrange points 60° ahead and behind the planet.', el: 'Οι Τρώες μοιράζονται την τροχιά του Δία στα σταθερά σημεία Lagrange 60° μπροστά και πίσω από τον πλανήτη.' } },
  { id: 'sol-24', category: 'SolarSystem', difficulty: 'easy', question: { en: 'What is a comet\'s tail made of?', el: 'Από τι αποτελείται η ουρά ενός κομήτη;' }, options: { en: ['Rock fragments', 'Gas and dust', 'Ice crystals', 'Plasma'], el: ['Θραύσματα βράχου', 'Αέριο και σκόνη', 'Κρύσταλλοι πάγου', 'Πλάσμα'] }, correct: { en: 'Gas and dust', el: 'Αέριο και σκόνη' }, explanation: { en: 'A comet\'s tail forms when solar radiation and wind push gas and dust away from the nucleus.', el: 'Η ουρά ενός κομήτη σχηματίζεται όταν η ηλιακή ακτινοβολία και ο άνεμος σπρώχνουν αέριο και σκόνη μακριά από τον πυρήνα.' } },
  { id: 'sol-25', category: 'SolarSystem', difficulty: 'easy', question: { en: 'Which planet is known as the Evening Star?', el: 'Ποιος πλανήτης είναι γνωστός ως το Εσπερινό Αστέρι;' }, options: { en: ['Mars', 'Jupiter', 'Venus', 'Saturn'], el: ['Άρης', 'Δίας', 'Αφροδίτη', 'Κρόνος'] }, correct: { en: 'Venus', el: 'Αφροδίτη' }, explanation: { en: 'Venus is often called the Morning or Evening Star because it is the brightest object in the sky after the Sun and Moon.', el: 'Η Αφροδίτη συχνά ονομάζεται Πρωινό ή Εσπερινό Αστέρι επειδή είναι το φωτεινότερο αντικείμενο στον ουρανό μετά τον Ήλιο και τη Σελήνη.' } },
  { id: 'sol-26', category: 'SolarSystem', difficulty: 'easy', question: { en: 'How long does it take Earth to orbit the Sun?', el: 'Πόσο χρόνο διαρκεί η περιφορά της Γης γύρω από τον Ήλιο;' }, options: { en: ['24 hours', '30 days', '365 days', '12 months'], el: ['24 ώρες', '30 ημέρες', '365 ημέρες', '12 μήνες'] }, correct: { en: '365 days', el: '365 ημέρες' }, explanation: { en: 'Earth completes one orbit around the Sun in approximately 365.25 days, defining one year.', el: 'Η Γη ολοκληρώνει μια περιφορά γύρω από τον Ήλιο σε περίπου 365,25 ημέρες, ορίζοντας ένα έτος.' } },
  { id: 'sol-27', category: 'SolarSystem', difficulty: 'medium', question: { en: 'Which planet has a "hexagonal" storm at its north pole?', el: 'Ποιος πλανήτης έχει "εξαγωνική" καταιγίδα στον βόρειο πόλο του;' }, options: { en: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'], el: ['Δίας', 'Ουρανός', 'Κρόνος', 'Ποσειδώνας'] }, correct: { en: 'Saturn', el: 'Κρόνος' }, explanation: { en: 'Saturn has a persistent hexagonal jet stream at its north pole, first observed by Voyager in the 1980s.', el: 'Ο Κρόνος έχει μια διαρκή εξαγωνική ροή αερίων στον βόρειο πόλο του, πρώτη παρατήρηση από το Voyager στη δεκαετία του 1980.' } },
  { id: 'sol-28', category: 'SolarSystem', difficulty: 'medium', question: { en: 'What is the Oort Cloud?', el: 'Τι είναι το Νέφος του Όορτ;' }, options: { en: ['A nebula near the Sun', 'A spherical shell of icy objects beyond the Kuiper Belt', 'A ring around Saturn', 'An asteroid belt'], el: ['Νεφέλιο κοντά στον Ήλιο', 'Σφαιρικό κέλυφος παγωμένων αντικειμένων πέρα από τη Ζώνη του Κάιπερ', 'Δακτύλιος γύρω από τον Κρόνο', 'Ζώνη αστεροειδών'] }, correct: { en: 'A spherical shell of icy objects beyond the Kuiper Belt', el: 'Σφαιρικό κέλυφος παγωμένων αντικειμένων πέρα από τη Ζώνη του Κάιπερ' }, explanation: { en: 'The Oort Cloud is a theoretical spherical region of icy planetesimals that may extend up to 100,000 AU from the Sun.', el: 'Το Νέφος του Όορτ είναι μια θεωρητική σφαιρική περιοχή παγωμένων πλανητοειδών που μπορεί να εκτείνεται έως 100.000 AU από τον Ήλιο.' } },
  { id: 'sol-29', category: 'SolarSystem', difficulty: 'medium', question: { en: 'Which dwarf planet is located in the asteroid belt?', el: 'Ποιος νάνος πλανήτης βρίσκεται στη ζώνη αστεροειδών;' }, options: { en: ['Pluto', 'Eris', 'Ceres', 'Makemake'], el: ['Πλούτων', 'Έρις', 'Δήμητρα', 'Μακεμάκε'] }, correct: { en: 'Ceres', el: 'Δήμητρα' }, explanation: { en: 'Ceres is the only dwarf planet in the inner solar system, orbiting in the main asteroid belt.', el: 'Η Δήμητρα είναι ο μόνος νάνος πλανήτης στο εσωτερικό ηλιακό σύστημα, περιστρεφόμενη στην κύρια ζώνη αστεροειδών.' } },
  { id: 'sol-30', category: 'SolarSystem', difficulty: 'hard', question: { en: 'What causes the retrograde rotation of Venus?', el: 'Τι προκαλεί την οπισθοδρόμηση της Αφροδίτης;' }, options: { en: ['Sun\'s gravity', 'A giant impact', 'Magnetic field reversal', 'Unknown; possibly early collision'], el: ['Βαρύτητα Ήλιου', 'Τεράστια πρόσκρουση', 'Αντιστροφή μαγνητικού πεδίου', 'Άγνωστο· πιθανότατα πρώιμη σύγκρουση'] }, correct: { en: 'Unknown; possibly early collision', el: 'Άγνωστο· πιθανότατα πρώιμη σύγκρουση' }, explanation: { en: 'Venus rotates slowly backward; the cause is debated but a massive early impact is a leading hypothesis.', el: 'Η Αφροδίτη περιστρέφεται αργά προς τα πίσω· η αιτία διχάζει αλλά μια τεράστια πρώιμη πρόσκρουση είναι κύρια υπόθεση.' } },

  { id: 'gal-11', category: 'Galaxies', difficulty: 'easy', question: { en: 'What color are the hottest stars?', el: 'Τι χρώμα έχουν οι πιο θερμοί αστέρες;' }, options: { en: ['Red', 'Yellow', 'Blue', 'Orange'], el: ['Κόκκινο', 'Κίτρινο', 'Μπλε', 'Πορτοκαλί'] }, correct: { en: 'Blue', el: 'Μπλε' }, explanation: { en: 'Hotter stars emit more blue light (Wien\'s law); cooler stars appear red or orange.', el: 'Οι θερμότεροι αστέρες εκπέμπουν περισσότερο μπλε φως· οι ψυχρότεροι φαίνονται κόκκινοι ή πορτοκαλί.' } },
  { id: 'gal-12', category: 'Galaxies', difficulty: 'easy', question: { en: 'What happens when a massive star runs out of fuel?', el: 'Τι συμβαίνει όταν ένας τεράστιος αστέρας ξεμείνει από καύσιμο;' }, options: { en: ['It becomes a planet', 'It fades away', 'It explodes as a supernova', 'It turns into a comet'], el: ['Γίνεται πλανήτης', 'Χάνεται', 'Εκρήγνυται ως υπερκαινοφανής', 'Μετατρέπεται σε κομήτη'] }, correct: { en: 'It explodes as a supernova', el: 'Εκρήγνυται ως υπερκαινοφανής' }, explanation: { en: 'Massive stars end their lives in supernova explosions, which can leave behind neutron stars or black holes.', el: 'Οι τεράστιοι αστέρες ολοκληρώνουν τη ζωή τους σε εκρήξεις υπερκαινοφανών, που μπορεί να αφήσουν αστέρες νετρονίων ή μαύρες τρύπες.' } },
  { id: 'gal-13', category: 'Galaxies', difficulty: 'easy', question: { en: 'What is a black hole?', el: 'Τι είναι μια μαύρη τρύπα;' }, options: { en: ['A dark star', 'A region where gravity is so strong that light cannot escape', 'A hole in space', 'A collapsed planet'], el: ['Σκοτεινός αστέρας', 'Περιοχή όπου η βαρύτητα είναι τόσο ισχυρή ώστε το φως δεν μπορεί να ξεφύγει', 'Τρύπα στο διάστημα', 'Καταρρευμένος πλανήτης'] }, correct: { en: 'A region where gravity is so strong that light cannot escape', el: 'Περιοχή όπου η βαρύτητα είναι τόσο ισχυρή ώστε το φως δεν μπορεί να ξεφύγει' }, explanation: { en: 'A black hole forms when matter collapses to an infinitely dense singularity; the escape velocity exceeds the speed of light.', el: 'Μια μαύρη τρύπα σχηματίζεται όταν η ύλη καταρρεύσει σε μία απείρως πυκνή ιδιάζουσα κατάσταση· η ταχύτητα διαφυγής υπερβαίνει την ταχύτητα του φωτός.' } },
  { id: 'gal-14', category: 'Galaxies', difficulty: 'easy', question: { en: 'How many galaxies are estimated to exist in the observable universe?', el: 'Πόσοι γαλαξίες εκτιμώνται ότι υπάρχουν στο παρατηρήσιμο σύμπαν;' }, options: { en: ['Millions', 'Billions', 'Hundreds of billions', 'Thousands'], el: ['Εκατομμύρια', 'Δισεντεριάδες', 'Εκατοντάδες δισεκατομμυρίων', 'Χιλιάδες'] }, correct: { en: 'Hundreds of billions', el: 'Εκατοντάδες δισεκατομμυρίων' }, explanation: { en: 'Estimates suggest 200 billion to 2 trillion galaxies in the observable universe.', el: 'Οι εκτιμήσεις υποδεικνύουν από 200 δισεκατομμύρια έως 2 τρισεκατομμύρια γαλαξίες στο παρατηρήσιμο σύμπαν.' } },
  { id: 'gal-15', category: 'Galaxies', difficulty: 'easy', question: { en: 'What is the Sun primarily made of?', el: 'Από τι αποτελείται κυρίως ο Ήλιος;' }, options: { en: ['Helium', 'Hydrogen and helium', 'Carbon', 'Iron'], el: ['Ήλιο', 'Υδρογόνο και ήλιο', 'Άνθρακα', 'Σίδηρο'] }, correct: { en: 'Hydrogen and helium', el: 'Υδρογόνο και ήλιο' }, explanation: { en: 'The Sun is about 73% hydrogen and 25% helium by mass; fusion converts hydrogen to helium.', el: 'Ο Ήλιος αποτελείται περίπου 73% από υδρογόνο και 25% από ήλιο κατά μάζα· η σχάση μετατρέπει το υδρογόνο σε ήλιο.' } },
  { id: 'gal-16', category: 'Galaxies', difficulty: 'medium', question: { en: 'What is a pulsar?', el: 'Τι είναι ένας παλσάρ;' }, options: { en: ['A type of comet', 'A rapidly rotating neutron star emitting beams of radiation', 'A quasar', 'A red giant'], el: ['Τύπος κομήτη', 'Πολύ γρήγορα περιστρεφόμενος αστέρας νετρονίων που εκπέμπει ακτίνες ακτινοβολίας', 'Κβάζαρ', 'Κόκκινος γίγαντας'] }, correct: { en: 'A rapidly rotating neutron star emitting beams of radiation', el: 'Πολύ γρήγορα περιστρεφόμενος αστέρας νετρονίων που εκπέμπει ακτίνες ακτινοβολίας' }, explanation: { en: 'Pulsars are rotating neutron stars whose magnetic poles sweep beams of radiation across space like a lighthouse.', el: 'Οι παλσάρες είναι περιστρεφόμενοι αστέρες νετρονίων των οποίων οι μαγνητικοί πόλοι σαρώνουν δέσμες ακτινοβολίας στον χώρο σαν φάρος.' } },
  { id: 'gal-17', category: 'Galaxies', difficulty: 'medium', question: { en: 'What is dark matter?', el: 'Τι είναι η σκοτεινή ύλη;' }, options: { en: ['Black holes', 'Invisible matter that does not emit light but has gravitational effects', 'Dust clouds', 'Cold gas'], el: ['Μαύρες τρύπες', 'Αόρατη ύλη που δεν εκπέμπει φως αλλά έχει βαρυτικά αποτελέσματα', 'Νέφη σκόνης', 'Ψυχρό αέριο'] }, correct: { en: 'Invisible matter that does not emit light but has gravitational effects', el: 'Αόρατη ύλη που δεν εκπέμπει φως αλλά έχει βαρυτικά αποτελέσματα' }, explanation: { en: 'Dark matter accounts for about 27% of the universe\'s mass-energy; it is detected through its gravitational influence.', el: 'Η σκοτεινή ύλη αντιπροσωπεύει περίπου 27% της μάζας-ενέργειας του σύμπαντος· ανιχνεύεται μέσω της βαρυτικής της επίδρασης.' } },
  { id: 'gal-18', category: 'Galaxies', difficulty: 'medium', question: { en: 'What is a quasar?', el: 'Τι είναι ένα κβάζαρ;' }, options: { en: ['A type of star', 'An extremely luminous active galactic nucleus powered by a supermassive black hole', 'A nebula', 'A comet'], el: ['Τύπος αστεριού', 'Εξαιρετικά φωτεινός ενεργός γαλαξιακός πυρήνας που τροφοδοτείται από υπερμεγέθη μαύρη τρύπα', 'Νεφέλιο', 'Κομήτης'] }, correct: { en: 'An extremely luminous active galactic nucleus powered by a supermassive black hole', el: 'Εξαιρετικά φωτεινός ενεργός γαλαξιακός πυρήνας που τροφοδοτείται από υπερμεγέθη μαύρη τρύπα' }, explanation: { en: 'Quasars are among the brightest objects in the universe, powered by matter falling into supermassive black holes.', el: 'Τα κβάζαρ είναι μεταξύ των πιο φωτεινών αντικειμένων στο σύμπαν, τροφοδοτούμενα από ύλη που πέφτει σε υπερμεγέθεις μαύρες τρύπες.' } },
  { id: 'gal-19', category: 'Galaxies', difficulty: 'medium', question: { en: 'What is redshift?', el: 'Τι είναι η ερυθρά μετατόπιση;' }, options: { en: ['A type of star', 'The stretching of light wavelengths toward red as objects move away', 'A galaxy type', 'A supernova remnant'], el: ['Τύπος αστεριού', 'Η επιμήκυνση των κυμάτων φωτός προς το ερυθρό καθώς τα αντικείμενα απομακρύνονται', 'Τύπος γαλαξία', 'Υπολείμματα υπερκαινοφανή'] }, correct: { en: 'The stretching of light wavelengths toward red as objects move away', el: 'Η επιμήκυνση των κυμάτων φωτός προς το ερυθρό καθώς τα αντικείμενα απομακρύνονται' }, explanation: { en: 'Redshift indicates cosmic objects are receding; the faster they move away, the more their light shifts to longer (redder) wavelengths.', el: 'Η ερυθρά μετατόπιση δείχνει ότι τα κοσμικά αντικείμενα απομακρύνονται· όσο πιο γρήγορα απομακρύνονται, τόσο περισσότερο το φως τους μετατοπίζεται προς μακρύτερα (ερυθρότερα) μήκη κύματος.' } },
  { id: 'gal-20', category: 'Galaxies', difficulty: 'medium', question: { en: 'When did the Big Bang occur (approximately)?', el: 'Πότε συνέβη κατά προσέγγιση η Μεγάλη Έκρηξη;' }, options: { en: ['1 billion years ago', '4.5 billion years ago', '13.8 billion years ago', '100 billion years ago'], el: ['Πριν 1 δισεκατομμύριο χρόνια', 'Πριν 4,5 δισεκατομμύρια χρόνια', 'Πριν 13,8 δισεκατομμύρια χρόνια', 'Πριν 100 δισεκατομμύρια χρόνια'] }, correct: { en: '13.8 billion years ago', el: 'Πριν 13,8 δισεκατομμύρια χρόνια' }, explanation: { en: 'The universe is estimated to be about 13.8 billion years old based on CMB measurements and cosmic expansion.', el: 'Το σύμπαν εκτιμάται ότι είναι περίπου 13,8 δισεκατομμύρια χρόνια βασισμένο σε μετρήσεις CMB και κοσμική διαστολή.' } },
  { id: 'gal-21', category: 'Galaxies', difficulty: 'hard', question: { en: 'What is the event horizon of a black hole?', el: 'Τι είναι ο ορίζοντας γεγονότων μιας μαύρης τρύπας;' }, options: { en: ['The surface of the black hole', 'The boundary beyond which nothing can escape', 'The center', 'The accretion disk'], el: ['Η επιφάνεια της μαύρης τρύπας', 'Το όριο πέρα από το οποίο τίποτα δεν μπορεί να ξεφύγει', 'Το κέντρο', 'Ο δίσκος προσαύξησης'] }, correct: { en: 'The boundary beyond which nothing can escape', el: 'Το όριο πέρα από το οποίο τίποτα δεν μπορεί να ξεφύγει' }, explanation: { en: 'The event horizon is the point of no return; inside it, the escape velocity exceeds the speed of light.', el: 'Ο ορίζοντας γεγονότων είναι το σημείο χωρίς επιστροφή· μέσα του η ταχύτητα διαφυγής υπερβαίνει την ταχύτητα του φωτός.' } },
  { id: 'gal-22', category: 'Galaxies', difficulty: 'hard', question: { en: 'What is gravitational lensing?', el: 'Τι είναι η βαρυτική συστέγαση;' }, options: { en: ['A telescope lens', 'The bending of light by massive objects, magnifying distant sources', 'A type of black hole', 'Star formation'], el: ['Φακός τηλεσκοπίου', 'Η κάμψη του φωτός από ογκώδη αντικείμενα, μεγενθύνοντας μακρινές πηγές', 'Τύπος μαύρης τρύπας', 'Δημιουργία αστεριών'] }, correct: { en: 'The bending of light by massive objects, magnifying distant sources', el: 'Η κάμψη του φωτός από ογκώδη αντικείμενα, μεγενθύνοντας μακρινές πηγές' }, explanation: { en: 'Einstein predicted that mass curves spacetime; light follows these curves, so massive galaxies can act as cosmic magnifying glasses.', el: 'Ο Αϊνστάιν πρόβλεψε ότι η μάζα κυρτώνει τον χωροχρόνο· το φως ακολουθεί αυτές τις καμπύλες, οπότε ογκώδεις γαλαξίες μπορούν να λειτουργήσουν σαν κοσμικοί μεγεθυντικοί φακοί.' } },
  { id: 'gal-23', category: 'Galaxies', difficulty: 'hard', question: { en: 'What is the Chandrasekhar limit?', el: 'Τι είναι το όριο Chandrasekhar;' }, options: { en: ['Maximum speed of light', 'Maximum mass of a stable white dwarf (~1.4 solar masses)', 'Size of the universe', 'Temperature of the Sun'], el: ['Μέγιστη ταχύτητα φωτός', 'Μέγιστη μάζα σταθερού λευκού νάνου (~1,4 ηλιακές μάζες)', 'Μέγεθος του σύμπαντος', 'Θερμοκρασία του Ήλιου'] }, correct: { en: 'Maximum mass of a stable white dwarf (~1.4 solar masses)', el: 'Μέγιστη μάζα σταθερού λευκού νάνου (~1,4 ηλιακές μάζες)' }, explanation: { en: 'Above this limit, electron degeneracy pressure cannot support the star; it collapses to a neutron star or supernova.', el: 'Πάνω από αυτό το όριο, η πίεση εκφυλισμού ηλεκτρονίων δεν μπορεί να υποστηρίξει τον αστέρα· καταρρέει σε αστέρα νετρονίων ή υπερκαινοφανή.' } },
  { id: 'gal-24', category: 'Galaxies', difficulty: 'easy', question: { en: 'What is a supernova?', el: 'Τι είναι μια υπερκαινοφανής;' }, options: { en: ['A new star', 'A catastrophic explosion of a star', 'A comet', 'A galaxy merger'], el: ['Νέος αστέρας', 'Καταστροφική έκρηξη αστεριού', 'Κομήτης', 'Συγχώνευση γαλαξιών'] }, correct: { en: 'A catastrophic explosion of a star', el: 'Καταστροφική έκρηξη αστεριού' }, explanation: { en: 'Supernovae occur when massive stars collapse or when white dwarfs exceed the Chandrasekhar limit.', el: 'Οι υπερκαινοφανείς συμβαίνουν όταν τεράστιοι αστέρες καταρρέουν ή όταν λευκοί νάνοι υπερβαίνουν το όριο Chandrasekhar.' } },
  { id: 'gal-25', category: 'Galaxies', difficulty: 'easy', question: { en: 'Which constellation contains the North Star (Polaris)?', el: 'Ποιος αστερισμός περιέχει το Βόρειο Αστέρι (Πολικός);' }, options: { en: ['Orion', 'Ursa Minor', 'Cassiopeia', 'Leo'], el: ['Ωρίων', 'Μικρή Άρκτος', 'Κασσιόπη', 'Λέων'] }, correct: { en: 'Ursa Minor', el: 'Μικρή Άρκτος' }, explanation: { en: 'Polaris lies at the end of the Little Dipper\'s handle in Ursa Minor, nearly aligned with Earth\'s rotational axis.', el: 'Ο Πολικός βρίσκεται στο άκρο της λαβής του Μικρού Πήγαου στην Μικρή Άρκτο, σχεδόν ευθυγραμμισμένος με τον άξονα περιστροφής της Γης.' } },

  { id: 'gal-26', category: 'Galaxies', difficulty: 'medium', question: { en: 'What is a red dwarf?', el: 'Τι είναι ένας κόκκινος νάνος;' }, options: { en: ['A dead star', 'A small, cool, long-lived main-sequence star', 'A supernova remnant', 'A young star'], el: ['Νεκρός αστέρας', 'Μικρός, ψυχρός, μακρόβιος αστέρας της κύριας ακολουθίας', 'Υπολείμματα υπερκαινοφανή', 'Νέος αστέρας'] }, correct: { en: 'A small, cool, long-lived main-sequence star', el: 'Μικρός, ψυχρός, μακρόβιος αστέρας της κύριας ακολουθίας' }, explanation: { en: 'Red dwarfs are the most common stars; they burn fuel slowly and can live for trillions of years.', el: 'Οι κόκκινοι νάνοι είναι οι πιο συνηθισμένοι αστέρες· καίνε καύσιμο αργά και μπορούν να ζήσουν για τρισεκατομμύρια χρόνια.' } },
  { id: 'gal-27', category: 'Galaxies', difficulty: 'medium', question: { en: 'What element is primarily created in supernova explosions?', el: 'Ποιο στοιχείο δημιουργείται κυρίως σε εκρήξεις υπερκαινοφανών;' }, options: { en: ['Hydrogen', 'Helium', 'Heavy elements like iron and gold', 'Carbon'], el: ['Υδρογόνο', 'Ήλιο', 'Βαρέα στοιχεία όπως σίδηρο και χρυσό', 'Άνθρακα'] }, correct: { en: 'Heavy elements like iron and gold', el: 'Βαρέα στοιχεία όπως σίδηρο και χρυσό' }, explanation: { en: 'Supernovae forge heavy elements through nucleosynthesis; much of the gold and iron on Earth came from stellar explosions.', el: 'Οι υπερκαινοφανείς δημιουργούν βαρέα στοιχεία μέσω πυρηνοσύνθεσης· μεγάλο μέρος του χρυσού και του σιδήρου στη Γη προέρχεται από αστρικές εκρήξεις.' } },
  { id: 'gal-28', category: 'Galaxies', difficulty: 'hard', question: { en: 'What is Hawking radiation?', el: 'Τι είναι η ακτινοβολία Hawking;' }, options: { en: ['Radiation from the Sun', 'Hypothetical radiation from black holes causing them to evaporate', 'Supernova radiation', 'CMB radiation'], el: ['Ακτινοβολία από τον Ήλιο', 'Υποθετική ακτινοβολία από μαύρες τρύπες που τις οδηγεί στην εξαέρωση', 'Ακτινοβολία υπερκαινοφανή', 'Ακτινοβολία CMB'] }, correct: { en: 'Hypothetical radiation from black holes causing them to evaporate', el: 'Υποθετική ακτινοβολία από μαύρες τρύπες που τις οδηγεί στην εξαέρωση' }, explanation: { en: 'Stephen Hawking predicted that black holes emit quantum radiation and slowly lose mass, eventually evaporating.', el: 'Ο Stephen Hawking πρόβλεψε ότι οι μαύρες τρύπες εκπέμπουν κβαντική ακτινοβολία και χάνουν αργά μάζα, τελικά εξατμίζονται.' } },
  { id: 'gal-29', category: 'Galaxies', difficulty: 'hard', question: { en: 'What is a gamma-ray burst?', el: 'Τι είναι μια έκρηξη ακτίνων γάμμα;' }, options: { en: ['A type of supernova', 'The most energetic explosions in the universe, likely from collapsing massive stars', 'Solar flare', 'Black hole merger'], el: ['Τύπος υπερκαινοφανή', 'Οι πιο ενεργητικές εκρήξεις στο σύμπαν, πιθανότατα από καταρρέοντες τεράστιους αστέρες', 'Ηλιακό φλας', 'Συγχώνευση μαύρων τρυπών'] }, correct: { en: 'The most energetic explosions in the universe, likely from collapsing massive stars', el: 'Οι πιο ενεργητικές εκρήξεις στο σύμπαν, πιθανότατα από καταρρέοντες τεράστιους αστέρες' }, explanation: { en: 'GRBs release more energy in seconds than the Sun will in its lifetime; they may signal the birth of black holes.', el: 'Οι εκρήξεις ακτίνων γάμμα απελευθερώνουν περισσότερη ενέργεια σε δευτερόλεπτα από όση θα απελευθερώσει ο Ήλιος σε όλη τη ζωή του· πιθανότατα σηματοδοτούν τη γέννηση μαύρων τρυπών.' } },
  { id: 'gal-30', category: 'Galaxies', difficulty: 'easy', question: { en: 'What is the approximate age of the universe?', el: 'Ποια είναι η κατά προσέγγιση ηλικία του σύμπαντος;' }, options: { en: ['4.5 billion years', '10 billion years', '13.8 billion years', '20 billion years'], el: ['4,5 δισεκατομμύρια χρόνια', '10 δισεκατομμύρια χρόνια', '13,8 δισεκατομμύρια χρόνια', '20 δισεκατομμύρια χρόνια'] }, correct: { en: '13.8 billion years', el: '13,8 δισεκατομμύρια χρόνια' }, explanation: { en: 'Observations of the cosmic microwave background and type Ia supernovae indicate an age of about 13.8 billion years.', el: 'Οι παρατηρήσεις της κοσμικής μικροκυματικής ακτινοβολίας υποβάθρου και των υπερκαινοφανών τύπου Ia υποδεικνύουν ηλικία περίπου 13,8 δισεκατομμύρια χρόνια.' } },
  { id: 'gal-31', category: 'Galaxies', difficulty: 'medium', question: { en: 'What type of galaxy has no distinct shape?', el: 'Ποιος τύπος γαλαξία δεν έχει ξεχωριστό σχήμα;' }, options: { en: ['Spiral', 'Elliptical', 'Irregular', 'Lenticular'], el: ['Σπειροειδής', 'Ελλειπτικός', 'Ακανόνιστος', 'Φακοειδής'] }, correct: { en: 'Irregular', el: 'Ακανόνιστος' }, explanation: { en: 'Irregular galaxies lack the ordered structure of spirals or ellipticals; they may result from collisions or tidal interactions.', el: 'Οι ακανόνιστοι γαλαξίες στερουνται την τακτική δομή των σπειροειδών ή ελλειπτικών· μπορεί να προκύψουν από συγκρούσεις ή παλιρροιακές αλληλεπιδράσεις.' } },
  { id: 'gal-32', category: 'Galaxies', difficulty: 'hard', question: { en: 'What is the singularity inside a black hole?', el: 'Τι είναι η ιδιάζουσα κατάσταση μέσα σε μια μαύρη τρύπα;' }, options: { en: ['A dense star', 'A point of infinite density where spacetime curvature is infinite', 'The event horizon', 'The accretion disk'], el: ['Πυκνός αστέρας', 'Σημείο άπειρης πυκνότητας όπου η καμπύλωση του χωροχρόνου είναι άπειρη', 'Ο ορίζοντας γεγονότων', 'Ο δίσκος προσαύξησης'] }, correct: { en: 'A point of infinite density where spacetime curvature is infinite', el: 'Σημείο άπειρης πυκνότητας όπου η καμπύλωση του χωροχρόνου είναι άπειρη' }, explanation: { en: 'General relativity predicts a singularity at the center of a black hole, though quantum gravity may modify this.', el: 'Η γενική σχετικότητα προβλέπει μια ιδιάζουσα κατάσταση στο κέντρο μιας μαύρης τρύπας, αν και η κβαντική βαρύτητα μπορεί να την τροποποιήσει.' } },
  { id: 'gal-33', category: 'Galaxies', difficulty: 'medium', question: { en: 'What is a white dwarf made of?', el: 'Από τι αποτελείται ένας λευκός νάνος;' }, options: { en: ['Hydrogen', 'Helium and carbon, supported by electron degeneracy pressure', 'Iron', 'Neutrons'], el: ['Υδρογόνο', 'Ήλιο και άνθρακα, υποστηριζόμενος από πίεση εκφυλισμού ηλεκτρονίων', 'Σίδηρο', 'Νετρόνια'] }, correct: { en: 'Helium and carbon, supported by electron degeneracy pressure', el: 'Ήλιο και άνθρακα, υποστηριζόμενος από πίεση εκφυλισμού ηλεκτρονίων' }, explanation: { en: 'White dwarfs are the exposed cores of low-mass stars; electron degeneracy pressure prevents further collapse.', el: 'Οι λευκοί νάνοι είναι οι εκτεθειμένοι πυρήνες αστεριών χαμηλής μάζας· η πίεση εκφυλισμού ηλεκτρονίων εμποδίζει περαιτέρω κατάρρευση.' } },

  { id: 'spc-11', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'Which astronaut was the first person to walk on the Moon?', el: 'Ποιος αστροναύτης ήταν ο πρώτος που πάτησε στη Σελήνη;' }, options: { en: ['Buzz Aldrin', 'Neil Armstrong', 'John Glenn', 'Yuri Gagarin'], el: ['Μπαζ Όλντριν', 'Νιλ Άρμστρονγκ', 'Τζον Γκλεν', 'Γιούρι Γκαγκάριν'] }, correct: { en: 'Neil Armstrong', el: 'Νιλ Άρμστρονγκ' }, explanation: { en: 'Neil Armstrong stepped onto the Moon on July 20, 1969, during the Apollo 11 mission.', el: 'Ο Νιλ Άρμστρονγκ πάτησε στη Σελήνη στις 20 Ιουλίου 1969, κατά τη διάρκεια της αποστολής Apollo 11.' } },
  { id: 'spc-12', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'What year did the Apollo 11 Moon landing occur?', el: 'Σε ποιο έτος έγινε η προσγείωση Apollo 11 στη Σελήνη;' }, options: { en: ['1967', '1969', '1971', '1973'], el: ['1967', '1969', '1971', '1973'] }, correct: { en: '1969', el: '1969' }, explanation: { en: 'Apollo 11 landed on the Moon on July 20, 1969, with Neil Armstrong and Buzz Aldrin walking on the surface.', el: 'Το Apollo 11 προσγειώθηκε στη Σελήνη στις 20 Ιουλίου 1969, με τους Νιλ Άρμστρονγκ και Μπαζ Όλντριν να περπατούν στην επιφάνεια.' } },
  { id: 'spc-13', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'Which space agency operates the Hubble Space Telescope?', el: 'Ποια διαστημική υπηρεσία λειτουργεί το διαστημικό τηλεσκόπιο Hubble;' }, options: { en: ['ESA', 'NASA', 'Roscosmos', 'JAXA'], el: ['ESA', 'NASA', 'Roscosmos', 'JAXA'] }, correct: { en: 'NASA', el: 'NASA' }, explanation: { en: 'NASA operates Hubble in partnership with ESA; it was launched in 1990 and serviced by Space Shuttle missions.', el: 'Η NASA λειτουργεί το Hubble σε συνεργασία με την ESA· εκτοξεύτηκε το 1990 και επισκευάστηκε από αποστολές Διαστημικού Λεωφορείου.' } },
  { id: 'spc-14', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'What does ESA stand for?', el: 'Τι σημαίνει ESA;' }, options: { en: ['European Space Agency', 'European Science Association', 'Eastern Space Authority', 'Exploration and Space Administration'], el: ['Ευρωπαϊκή Διαστημική Υπηρεσία', 'Ευρωπαϊκή Επιστημονική Ένωση', 'Ανατολική Διαστημική Αρχή', 'Διοίκηση Εξερεύνησης και Διαστήματος'] }, correct: { en: 'European Space Agency', el: 'Ευρωπαϊκή Διαστημική Υπηρεσία' }, explanation: { en: 'ESA is the European Space Agency, coordinating space activities for 22 member states.', el: 'Η ESA είναι η Ευρωπαϊκή Διαστημική Υπηρεσία, συντονίζοντας τις διαστημικές δραστηριότητες για 22 κράτη μέλη.' } },
  { id: 'spc-15', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'What is the name of the rover that landed on Mars with the Ingenuity helicopter?', el: 'Πώς ονομάζεται το ρομπότ που προσγειώθηκε στον Άρη με το ελικόπτερο Ingenuity;' }, options: { en: ['Curiosity', 'Opportunity', 'Perseverance', 'Spirit'], el: ['Curiosity', 'Opportunity', 'Perseverance', 'Spirit'] }, correct: { en: 'Perseverance', el: 'Perseverance' }, explanation: { en: 'Perseverance carried Ingenuity, the first aircraft to achieve powered flight on another planet.', el: 'Το Perseverance μετέφερε το Ingenuity, το πρώτο αεροσκάφος που πέτυχε μηχανοκίνητη πτήση σε άλλον πλανήτη.' } },

  { id: 'spc-16', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'Which spacecraft has traveled farthest from Earth?', el: 'Ποιο διαστημόπλοιο έχει ταξιδέψει πιο μακριά από τη Γη;' }, options: { en: ['Voyager 1', 'Pioneer 10', 'New Horizons', 'Voyager 2'], el: ['Voyager 1', 'Pioneer 10', 'New Horizons', 'Voyager 2'] }, correct: { en: 'Voyager 1', el: 'Voyager 1' }, explanation: { en: 'Voyager 1, launched in 1977, has entered interstellar space and is the most distant human-made object.', el: 'Το Voyager 1, που εκτοξεύτηκε το 1977, έχει εισέλθει στο διαστρικό χώρο και είναι το πιο μακρινό ανθρώπινο αντικείμενο.' } },
  { id: 'spc-17', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'What was the first artificial satellite?', el: 'Ποιος ήταν ο πρώτος τεχνητός δορυφόρος;' }, options: { en: ['Explorer 1', 'Sputnik 1', 'Vanguard 1', 'Luna 1'], el: ['Explorer 1', 'Sputnik 1', 'Vanguard 1', 'Luna 1'] }, correct: { en: 'Sputnik 1', el: 'Sputnik 1' }, explanation: { en: 'The Soviet Union launched Sputnik 1 on October 4, 1957, starting the space age.', el: 'Η Σοβιετική Ένωση εκτόξευσε τον Sputnik 1 στις 4 Οκτωβρίου 1957, ξεκινώντας την διαστημική εποχή.' } },
  { id: 'spc-18', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'Which NASA mission provided detailed maps of the Moon before Apollo?', el: 'Ποια αποστολή της NASA παρείχε λεπτομερή χάρτες της Σελήνης πριν από το Apollo;' }, options: { en: ['Mariner', 'Lunar Orbiter', 'Surveyor', 'Ranger'], el: ['Mariner', 'Lunar Orbiter', 'Surveyor', 'Ranger'] }, correct: { en: 'Lunar Orbiter', el: 'Lunar Orbiter' }, explanation: { en: 'The Lunar Orbiter program (1966–67) mapped 99% of the Moon\'s surface to select Apollo landing sites.', el: 'Το πρόγραμμα Lunar Orbiter (1966–67) χαρτογράφησε το 99% της επιφάνειας της Σελήνης για την επιλογή τόπων προσγείωσης Apollo.' } },
  { id: 'spc-19', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'What is the James Webb Space Telescope\'s primary mirror made of?', el: 'Από τι είναι κατασκευασμένος ο κύριος καθρέφτης του διαστημικού τηλεσκοπίου James Webb;' }, options: { en: ['Glass', 'Beryllium coated with gold', 'Aluminum', 'Titanium'], el: ['Γυαλί', 'Βηρύλλιο επικαλυμμένο με χρυσό', 'Αλουμίνιο', 'Τιτανίου'] }, correct: { en: 'Beryllium coated with gold', el: 'Βηρύλλιο επικαλυμμένο με χρυσό' }, explanation: { en: 'JWST uses 18 hexagonal beryllium segments coated with gold for optimal infrared reflectivity.', el: 'Το JWST χρησιμοποιεί 18 εξαγωνικά τμήματα βηρυλλίου επικαλυμμένα με χρυσό για βέλτιστη υπέρυθρη ανάκλαση.' } },
  { id: 'spc-20', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'Which mission discovered water ice on the Moon?', el: 'Ποια αποστολή ανακάλυψε πάγο νερού στη Σελήνη;' }, options: { en: ['Apollo 11', 'LRO/LCROSS', 'Luna 2', 'Clementine'], el: ['Apollo 11', 'LRO/LCROSS', 'Luna 2', 'Clementine'] }, correct: { en: 'LRO/LCROSS', el: 'LRO/LCROSS' }, explanation: { en: 'NASA\'s LCROSS mission (2009) crashed into a lunar crater and confirmed water ice in the ejecta.', el: 'Η αποστολή LCROSS της NASA (2009) συνετρίβη σε σεληνιακό κρατήρα και επιβεβαίωσε πάγο νερού στα εκτοξευθέντα υλικά.' } },
  { id: 'spc-21', category: 'SpaceExploration', difficulty: 'hard', question: { en: 'What is the purpose of the Parker Solar Probe?', el: 'Ποιος είναι ο σκοπός του Parker Solar Probe;' }, options: { en: ['Study Mars', 'Study the Sun\'s corona and solar wind up close', 'Search for exoplanets', 'Map the Milky Way'], el: ['Μελέτη του Άρη', 'Μελέτη της κορώνας και του ηλιακού ανέμου του Ήλιου από κοντά', 'Αναζήτηση εξωπλανητών', 'Χαρτογράφηση του Γαλαξία'] }, correct: { en: 'Study the Sun\'s corona and solar wind up close', el: 'Μελέτη της κορώνας και του ηλιακού ανέμου του Ήλιου από κοντά' }, explanation: { en: 'Parker Solar Probe flies through the Sun\'s corona to understand heating and solar wind acceleration.', el: 'Το Parker Solar Probe πετά μέσα από την κορώνα του Ήλιου για να κατανοήσει τη θέρμανση και την επιτάχυνση του ηλιακού ανέμου.' } },
  { id: 'spc-22', category: 'SpaceExploration', difficulty: 'hard', question: { en: 'Which mission first detected gravitational waves from space?', el: 'Ποια αποστολή ανίχνευσε πρώτα βαρυτικά κύματα από το διάστημα;' }, options: { en: ['Hubble', 'LIGO (ground-based)', 'LISA Pathfinder', 'LIGO is ground-based; no space mission yet'], el: ['Hubble', 'LIGO (επιφανειακό)', 'LISA Pathfinder', 'Το LIGO είναι επιφανειακό· ακόμη όχι διαστημική αποστολή'] }, correct: { en: 'LIGO is ground-based; no space mission yet', el: 'Το LIGO είναι επιφανειακό· ακόμη όχι διαστημική αποστολή' }, explanation: { en: 'LIGO detectors on Earth first observed gravitational waves in 2015; LISA will be a future space-based observatory.', el: 'Οι ανιχνευτές LIGO στη Γη παρατήρησαν πρώτα βαρυτικά κύματα το 2015· το LISA θα είναι μελλοντικό διαστημικό παρατηρητήριο.' } },
  { id: 'spc-23', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'What is a rocket\'s main purpose?', el: 'Ποιος είναι ο κύριος σκοπός ενός πυραύλου;' }, options: { en: ['To orbit satellites', 'To propel payloads into space using thrust', 'To study the atmosphere', 'To communicate with astronauts'], el: ['Να τροχιοθετήσει δορυφόρους', 'Να προωθήσει φορτία στο διάστημα χρησιμοποιώντας ώθηση', 'Να μελετήσει την ατμόσφαιρα', 'Να επικοινωνήσει με αστροναύτες'] }, correct: { en: 'To propel payloads into space using thrust', el: 'Να προωθήσει φορτία στο διάστημα χρησιμοποιώντας ώθηση' }, explanation: { en: 'Rockets generate thrust by expelling mass (propellant) at high speed, following Newton\'s third law.', el: 'Οι πύραυλοι παράγουν ώθηση εκτοξεύοντας μάζα (καύσιμο) με υψηλή ταχύτητα, ακολουθώντας τον τρίτο νόμο του Newton.' } },
  { id: 'spc-24', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'Which planet has NASA sent the most missions to?', el: 'Σε ποιον πλανήτη έχει στείλει η NASA τις περισσότερες αποστολές;' }, options: { en: ['Venus', 'Jupiter', 'Mars', 'Saturn'], el: ['Αφροδίτη', 'Δίας', 'Άρης', 'Κρόνος'] }, correct: { en: 'Mars', el: 'Άρης' }, explanation: { en: 'Mars has been the target of dozens of NASA missions—orbiters, landers, and rovers—due to its habitability potential.', el: 'Ο Άρης είναι ο στόχος δεκάδων αποστολών της NASA—τροχιακών, προσγειωτών και ρομπότ—λόγω της δυνατότητας κατοικησιμότητας.' } },
  { id: 'spc-25', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'What is the ISS\'s orbit altitude approximately?', el: 'Ποιο είναι περίπου το ύψος τροχιάς του ISS;' }, options: { en: ['200 km', '400 km', '800 km', '1200 km'], el: ['200 km', '400 km', '800 km', '1200 km'] }, correct: { en: '400 km', el: '400 km' }, explanation: { en: 'The ISS orbits at about 400 km altitude in low Earth orbit, completing an orbit every ~90 minutes.', el: 'Το ISS τροχιά σε περίπου 400 km ύψος σε χαμηλή γήινη τροχιά, ολοκληρώνοντας μια τροχιά κάθε ~90 λεπτά.' } },
  { id: 'spc-26', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'Which ESA mission landed a probe on a comet?', el: 'Ποια αποστολή της ESA προσγείωσε συσκευή σε κομήτη;' }, options: { en: ['Rosetta', 'Giotto', 'Vega', 'Cassini'], el: ['Rosetta', 'Giotto', 'Vega', 'Cassini'] }, correct: { en: 'Rosetta', el: 'Rosetta' }, explanation: { en: 'Rosetta\'s Philae lander touched down on comet 67P/Churyumov-Gerasimenko in November 2014.', el: 'Ο προσγειωτής Philae του Rosetta προσγειώθηκε στον κομήτη 67P/Τσουριούμοφ-Γκερασιμένκο τον Νοέμβριο του 2014.' } },
  { id: 'spc-27', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'What did the Kepler mission primarily search for?', el: 'Για τι έψαχνε κυρίως η αποστολή Kepler;' }, options: { en: ['Black holes', 'Exoplanets', 'Asteroids', 'Comets'], el: ['Μαύρες τρύπες', 'Εξωπλανήτες', 'Αστεροειδείς', 'Κομήτες'] }, correct: { en: 'Exoplanets', el: 'Εξωπλανήτες' }, explanation: { en: 'Kepler observed star brightness dips caused by planets transiting across their host stars, discovering thousands of exoplanets.', el: 'Το Kepler παρατήρησε μειώσεις φωτεινότητας αστεριών που προκαλούνταν από πλανήτες που διέρχονται μπροστά από τα αστέρια τους.' } },
  { id: 'spc-28', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'Which spacecraft studied Saturn and its moons from 2004 to 2017?', el: 'Ποιο διαστημόπλοιο μελέτησε τον Κρόνο και τα φεγγάρια του από το 2004 έως το 2017;' }, options: { en: ['Voyager 1', 'Galileo', 'Cassini', 'Juno'], el: ['Voyager 1', 'Galileo', 'Cassini', 'Juno'] }, correct: { en: 'Cassini', el: 'Cassini' }, explanation: { en: 'Cassini-Huygens orbited Saturn for 13 years, making groundbreaking discoveries including the liquid seas on Titan.', el: 'Το Cassini-Huygens τροχία γύρω από τον Κρόνο για 13 χρόνια, κάνοντας πρωτοποριακές ανακαλύψεις όπως τις υγρές θάλασσες στον Τιτάνα.' } },
  { id: 'spc-29', category: 'SpaceExploration', difficulty: 'hard', question: { en: 'What is the main challenge of human Mars missions?', el: 'Ποια είναι η κύρια πρόκληση των ανθρώπινων αποστολών στον Άρη;' }, options: { en: ['Cost only', 'Radiation, long duration, landing, and return', 'Lack of water', 'Communication delay only'], el: ['Μόνο το κόστος', 'Ακτινοβολία, μεγάλη διάρκεια, προσγείωση και επιστροφή', 'Έλλειψη νερού', 'Μόνο η καθυστέρηση επικοινωνίας'] }, correct: { en: 'Radiation, long duration, landing, and return', el: 'Ακτινοβολία, μεγάλη διάρκεια, προσγείωση και επιστροφή' }, explanation: { en: 'Mars missions face cosmic radiation, months in microgravity, precise landing, and the difficulty of returning to Earth.', el: 'Οι αποστολές στον Άρη αντιμετωπίζουν κοσμική ακτινοβολία, μήνες σε μικροβαρύτητα, ακριβή προσγείωση και τις δυσκολίες της επιστροφής στη Γη.' } },
  { id: 'spc-30', category: 'SpaceExploration', difficulty: 'hard', question: { en: 'What did the Voyager spacecraft carry as a message to extraterrestrials?', el: 'Τι μετέφεραν τα διαστημόπλια Voyager ως μήνυμα προς εξωγήινους;' }, options: { en: ['Radio signal only', 'Golden Record with sounds and images of Earth', 'Written message only', 'Nothing'], el: ['Μόνο ραδιοφωνικό σήμα', 'Χρυσός Δίσκος με ήχους και εικόνες της Γης', 'Μόνο γραπτό μήνυμα', 'Τίποτα'] }, correct: { en: 'Golden Record with sounds and images of Earth', el: 'Χρυσός Δίσκος με ήχους και εικόνες της Γης' }, explanation: { en: 'Each Voyager carries a Golden Record—a phonograph record with music, greetings, and images representing Earth.', el: 'Κάθε Voyager μεταφέρει έναν Χρυσό Δίσκο—ένα φωνογράφο με μουσική, χαιρετισμούς και εικόνες που αντιπροσωπεύουν τη Γη.' } },
  { id: 'spc-31', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'What is an astronaut\'s suit called?', el: 'Πώς ονομάζεται η στολή ενός αστροναύτη;' }, options: { en: ['Space suit', 'EVA suit or spacesuit', 'Rocket suit', 'Flight suit'], el: ['Διαστημική στολή', 'Στολή EVA ή διαστημική στολή', 'Στολή πυραύλου', 'Στολή πτήσης'] }, correct: { en: 'EVA suit or spacesuit', el: 'Στολή EVA ή διαστημική στολή' }, explanation: { en: 'Spacesuits provide oxygen, pressure, temperature control, and protection from radiation and micrometeoroids during extravehicular activity.', el: 'Οι διαστημικές στολές παρέχουν οξυγόνο, πίεση, έλεγχο θερμοκρασίας και προστασία από ακτινοβολία και μικρομετεωρίτες.' } },
  { id: 'spc-32', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'Which country launched the first space station?', el: 'Ποια χώρα εκτόξευσε τον πρώτο διαστημικό σταθμό;' }, options: { en: ['USA', 'Soviet Union', 'China', 'ESA'], el: ['ΗΠΑ', 'Σοβιετική Ένωση', 'Κίνα', 'ESA'] }, correct: { en: 'Soviet Union', el: 'Σοβιετική Ένωση' }, explanation: { en: 'The Soviet Salyut 1, launched in 1971, was the world\'s first space station.', el: 'Ο Σοβιετικός Salyut 1, που εκτοξεύτηκε το 1971, ήταν ο πρώτος διαστημικός σταθμός στον κόσμο.' } },
  { id: 'spc-33', category: 'SpaceExploration', difficulty: 'hard', question: { en: 'What is the Delta-V required to reach low Earth orbit from the surface?', el: 'Ποιο είναι το Δέλτα-V που απαιτείται για να φθάσει κανείς σε χαμηλή γήινη τροχιά από την επιφάνεια;' }, options: { en: ['About 4 km/s', 'About 7.8 km/s', 'About 11 km/s', 'About 15 km/s'], el: ['Περίπου 4 km/s', 'Περίπου 7,8 km/s', 'Περίπου 11 km/s', 'Περίπου 15 km/s'] }, correct: { en: 'About 7.8 km/s', el: 'Περίπου 7,8 km/s' }, explanation: { en: 'Reaching LEO requires about 9.3–10 km/s total; roughly 7.8 km/s is orbital velocity at ~200 km altitude.', el: 'Η άφιξη σε χαμηλή γήινη τροχιά απαιτεί συνολικά περίπου 9,3–10 km/s· περίπου 7,8 km/s είναι η τροχιακή ταχύτητα σε ~200 km ύψος.' } },
  { id: 'spc-34', category: 'SpaceExploration', difficulty: 'easy', question: { en: 'Which star does Earth orbit?', el: 'Ποιο αστέρι περιστρέφεται γύρω η Γη;' }, options: { en: ['Proxima Centauri', 'The Sun', 'Alpha Centauri', 'Sirius'], el: ['Proxima Centauri', 'Ο Ήλιος', 'Alpha Centauri', 'Σείριος'] }, correct: { en: 'The Sun', el: 'Ο Ήλιος' }, explanation: { en: 'Earth orbits the Sun, our nearest star, at an average distance of about 150 million km.', el: 'Η Γη περιστρέφεται γύρω από τον Ήλιο, το πλησιέστερο αστέρι μας, σε μέση απόσταση περίπου 150 εκατομμυρίων km.' } },
  { id: 'spc-35', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'What does the JWST primarily observe?', el: 'Τι παρατηρεί κυρίως το JWST;' }, options: { en: ['Visible light', 'Ultraviolet', 'Infrared', 'X-rays'], el: ['Ορατό φως', 'Υπεριώδες', 'Υπέρυθρο', 'Ακτίνες Χ'] }, correct: { en: 'Infrared', el: 'Υπέρυθρο' }, explanation: { en: 'JWST is optimized for infrared astronomy to see through dust and observe the earliest galaxies.', el: 'Το JWST είναι βελτιστοποιημένο για υπέρυθρη αστρονομία για να δει μέσα από σκόνη και να παρατηρήσει τους πρώτους γαλαξίες.' } },
  { id: 'spc-36', category: 'SpaceExploration', difficulty: 'medium', question: { en: 'Which NASA program preceded Apollo and tested human spaceflight?', el: 'Ποιο πρόγραμμα της NASA προηγήθηκε του Apollo και δοκίμασε την ανθρώπινη διαστημική πτήση;' }, options: { en: ['Space Shuttle', 'Gemini', 'Mercury', 'Both Mercury and Gemini'], el: ['Διαστημικό Λεωφορείο', 'Gemini', 'Mercury', 'Και Mercury και Gemini'] }, correct: { en: 'Both Mercury and Gemini', el: 'Και Mercury και Gemini' }, explanation: { en: 'Project Mercury (1961–63) put Americans in space; Gemini (1965–66) developed techniques needed for Apollo.', el: 'Το Project Mercury (1961–63) έβαλε Αμερικανούς στο διάστημα· το Gemini (1965–66) ανέπτυξε τις τεχνικές που χρειάστηκαν για το Apollo.' } },
  { id: 'spc-37', category: 'SpaceExploration', difficulty: 'hard', question: { en: 'What is the main scientific goal of the Event Horizon Telescope?', el: 'Ποιος είναι ο κύριος επιστημονικός στόχος του Event Horizon Telescope;' }, options: { en: ['Study the Moon', 'Image black hole event horizons', 'Discover exoplanets', 'Map dark matter'], el: ['Μελέτη της Σελήνης', 'Απεικόνιση των ορίζοντων γεγονότων μαύρων τρυπών', 'Ανακάλυψη εξωπλανητών', 'Χαρτογράφηση σκοτεινής ύλης'] }, correct: { en: 'Image black hole event horizons', el: 'Απεικόνιση των ορίζοντων γεγονότων μαύρων τρυπών' }, explanation: { en: 'The EHT is a global array of telescopes that produced the first image of a black hole (M87*) in 2019.', el: 'Το EHT είναι μια παγκόσμια σύνδεση τηλεσκοπίων που παρήγαγε την πρώτη εικόνα μιας μαύρης τρύπας (M87*) το 2019.' } }
];
