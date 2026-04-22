export const questionsNaturalWorld = [
  // === Biology (5) ===
  {
    id: 'bio-1',
    category: 'Biology',
    difficulty: 'easy',
    question: { en: 'What is the powerhouse of the cell?', el: 'Ποιο είναι το «εργοστάσιο ενέργειας» του κυττάρου;' },
    options: {
      en: ['Nucleus', 'Mitochondria', 'Ribosome'],
      el: ['Πυρήνας', 'Μιτοχόνδρια', 'Ριβόσωμα']
    },
    correct: { en: 'Mitochondria', el: 'Μιτοχόνδρια' },
    explanation: { en: 'Mitochondria produce ATP through cellular respiration, making them the cell\'s primary energy source.', el: 'Τα μιτοχόνδρια παράγουν ATP μέσω της κυτταρικής αναπνοής, καθιστώντας τα την κύρια πηγή ενέργειας του κυττάρου.' }
  },
  {
    id: 'bio-2',
    category: 'Biology',
    difficulty: 'medium',
    question: { en: 'How many chromosomes does a human cell normally have?', el: 'Πόσα χρωμοσώματα έχει φυσιολογικά ένα ανθρώπινο κύτταρο;' },
    options: [23, 46, 48],
    correct: 46,
    explanation: { en: 'Human somatic cells have 46 chromosomes (23 pairs) — one set inherited from each parent.', el: 'Τα ανθρώπινα σωματικά κύτταρα έχουν 46 χρωμοσώματα (23 ζεύγη) — ένα σετ κληρονομείται από κάθε γονέα.' }
  },
  {
    id: 'bio-3',
    category: 'Biology',
    difficulty: 'hard',
    question: { en: 'Which blood type is the universal donor?', el: 'Ποια ομάδα αίματος είναι ο «καθολικός δότης»;' },
    options: { en: ['A+', 'O−', 'AB+'], el: ['A+', 'O−', 'AB+'] },
    correct: { en: 'O−', el: 'O−' },
    explanation: { en: 'O− blood lacks both A/B antigens and the Rh factor, so it can be safely given to any recipient.', el: 'Το αίμα O− δεν έχει αντιγόνα A/B ούτε παράγοντα Rh, επομένως μπορεί να δοθεί με ασφάλεια σε οποιονδήποτε δέκτη.' }
  },
  {
    id: 'bio-4',
    category: 'Biology',
    difficulty: 'easy',
    question: { en: 'What gas do plants absorb during photosynthesis?', el: 'Ποιο αέριο απορροφούν τα φυτά κατά τη φωτοσύνθεση;' },
    options: { en: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], el: ['Οξυγόνο', 'Διοξείδιο του άνθρακα', 'Άζωτο'] },
    correct: { en: 'Carbon dioxide', el: 'Διοξείδιο του άνθρακα' },
    explanation: { en: 'Plants use carbon dioxide and water to produce glucose and oxygen during photosynthesis.', el: 'Τα φυτά χρησιμοποιούν διοξείδιο του άνθρακα και νερό για να παράγουν γλυκόζη και οξυγόνο κατά τη φωτοσύνθεση.' }
  },
  {
    id: 'bio-5',
    category: 'Biology',
    difficulty: 'medium',
    question: { en: 'What is the largest organ in the human body?', el: 'Ποιο είναι το μεγαλύτερο όργανο στο ανθρώπινο σώμα;' },
    options: { en: ['Liver', 'Skin', 'Brain'], el: ['Ήπαρ', 'Δέρμα', 'Εγκέφαλος'] },
    correct: { en: 'Skin', el: 'Δέρμα' },
    explanation: { en: 'The skin is the largest organ by both surface area and total mass, protecting the body and regulating temperature.', el: 'Το δέρμα είναι το μεγαλύτερο όργανο σε επιφάνεια και συνολική μάζα, προστατεύοντας το σώμα και ρυθμίζοντας τη θερμοκρασία.' }
  },

  // === Chemistry (5) ===
  {
    id: 'chem-1',
    category: 'Chemistry',
    difficulty: 'easy',
    question: { en: 'What is the chemical symbol for gold?', el: 'Ποιο είναι το χημικό σύμβολο του χρυσού;' },
    options: { en: ['Go', 'Au', 'Gd'], el: ['Go', 'Au', 'Gd'] },
    correct: { en: 'Au', el: 'Au' },
    explanation: { en: 'The symbol Au comes from the Latin word "aurum", meaning gold.', el: 'Το σύμβολο Au προέρχεται από τη λατινική λέξη «aurum» που σημαίνει χρυσός.' }
  },
  {
    id: 'chem-2',
    category: 'Chemistry',
    difficulty: 'medium',
    question: { en: 'What is the pH of pure water?', el: 'Ποιο είναι το pH του καθαρού νερού;' },
    options: [5, 7, 9],
    correct: 7,
    explanation: { en: 'Pure water is neutral with pH 7 because the concentration of H⁺ and OH⁻ ions is equal.', el: 'Το καθαρό νερό είναι ουδέτερο με pH 7 επειδή η συγκέντρωση των ιόντων H⁺ και OH⁻ είναι ίση.' }
  },
  {
    id: 'chem-3',
    category: 'Chemistry',
    difficulty: 'hard',
    question: { en: 'What is the most abundant element in the universe?', el: 'Ποιο είναι το πιο άφθονο στοιχείο στο σύμπαν;' },
    options: {
      en: ['Helium', 'Hydrogen', 'Oxygen'],
      el: ['Ήλιο', 'Υδρογόνο', 'Οξυγόνο']
    },
    correct: { en: 'Hydrogen', el: 'Υδρογόνο' },
    explanation: { en: 'Hydrogen accounts for about 75% of the universe\'s elemental mass, formed in the Big Bang.', el: 'Το υδρογόνο αποτελεί περίπου το 75% της στοιχειακής μάζας του σύμπαντος και σχηματίστηκε στο Μεγάλο Έκρηξη.' }
  },
  {
    id: 'chem-4',
    category: 'Chemistry',
    difficulty: 'easy',
    question: { en: 'What is the chemical formula for table salt?', el: 'Ποιος είναι ο χημικός τύπος του μαγειρικού αλατιού;' },
    options: { en: ['NaCl', 'KCl', 'CaCl₂'], el: ['NaCl', 'KCl', 'CaCl₂'] },
    correct: { en: 'NaCl', el: 'NaCl' },
    explanation: { en: 'Table salt is sodium chloride, a compound of one sodium atom (Na) and one chlorine atom (Cl).', el: 'Το μαγειρικό αλάτι είναι το χλωριούχο νάτριο, ένωση ενός ατόμου νατρίου (Na) και ενός ατόμου χλωρίου (Cl).' }
  },
  {
    id: 'chem-5',
    category: 'Chemistry',
    difficulty: 'medium',
    question: { en: 'How many elements are in the periodic table (approx.)?', el: 'Πόσα στοιχεία έχει ο περιοδικός πίνακας (περίπου);' },
    options: [92, 118, 150],
    correct: 118,
    explanation: { en: 'The modern periodic table contains 118 confirmed elements, organized by atomic number.', el: 'Ο σύγχρονος περιοδικός πίνακας περιέχει 118 επιβεβαιωμένα στοιχεία, οργανωμένα κατά ατομικό αριθμό.' }
  },

  // === Physics (5) ===
  {
    id: 'phys-1',
    category: 'Physics',
    difficulty: 'easy',
    question: { en: 'What is the speed of light approximately?', el: 'Ποια είναι η ταχύτητα του φωτός περίπου;' },
    options: {
      en: ['300,000 km/s', '150,000 km/s', '500,000 km/s'],
      el: ['300.000 km/s', '150.000 km/s', '500.000 km/s']
    },
    correct: { en: '300,000 km/s', el: '300.000 km/s' },
    explanation: { en: 'Light travels at about 299,792 km/s in vacuum — a fundamental constant in physics (c).', el: 'Το φως ταξιδεύει με περίπου 299.792 km/s στο κενό — μια θεμελιώδης σταθερά της φυσικής (c).' }
  },
  {
    id: 'phys-2',
    category: 'Physics',
    difficulty: 'medium',
    question: { en: 'What force keeps planets in orbit around the Sun?', el: 'Ποια δύναμη κρατά τους πλανήτες σε τροχιά γύρω από τον Ήλιο;' },
    options: {
      en: ['Electromagnetic', 'Gravity', 'Nuclear'],
      el: ['Ηλεκτρομαγνητική', 'Βαρύτητα', 'Πυρηνική']
    },
    correct: { en: 'Gravity', el: 'Βαρύτητα' },
    explanation: { en: 'Gravity is the attractive force between masses; the Sun\'s gravity bends planetary paths into orbits.', el: 'Η βαρύτητα είναι η ελκτική δύναμη μεταξύ μαζών· η βαρύτητα του Ήλιου στρέφει τις τροχιές των πλανητών σε ελλείψεις.' }
  },
  {
    id: 'phys-3',
    category: 'Physics',
    difficulty: 'hard',
    question: { en: 'What is absolute zero in Celsius?', el: 'Πόσο είναι το απόλυτο μηδέν σε Κελσίου;' },
    options: { en: ['−273.15°C', '−100°C', '0°C'], el: ['−273,15°C', '−100°C', '0°C'] },
    correct: { en: '−273.15°C', el: '−273,15°C' },
    explanation: { en: 'Absolute zero (−273.15°C) is the lowest possible temperature, where molecular motion ceases.', el: 'Το απόλυτο μηδέν (−273,15°C) είναι η χαμηλότερη δυνατή θερμοκρασία, όπου η μοριακή κίνηση σταματά.' }
  },
  {
    id: 'phys-4',
    category: 'Physics',
    difficulty: 'easy',
    question: { en: 'What unit is used to measure electric current?', el: 'Σε ποια μονάδα μετράμε το ηλεκτρικό ρεύμα;' },
    options: { en: ['Volt', 'Ampere', 'Watt'], el: ['Volt', 'Ampere', 'Watt'] },
    correct: { en: 'Ampere', el: 'Ampere' },
    explanation: { en: 'The ampere (A) is the SI base unit for electric current, measuring the flow of electric charge.', el: 'Το αμπέρ (A) είναι η βασική μονάδα SI για το ηλεκτρικό ρεύμα, μετρώντας τη ροή του ηλεκτρικού φορτίου.' }
  },
  {
    id: 'phys-5',
    category: 'Physics',
    difficulty: 'medium',
    question: { en: 'Who formulated the three laws of motion?', el: 'Ποιος διατύπωσε τους τρεις νόμους της κίνησης;' },
    options: { en: ['Einstein', 'Newton', 'Galileo'], el: ['Αϊνστάιν', 'Νεύτωνας', 'Γαλιλαίος'] },
    correct: { en: 'Newton', el: 'Νεύτωνας' },
    explanation: { en: 'Isaac Newton published his three laws of motion in the "Principia" in 1687, founding classical mechanics.', el: 'Ο Ισαάκ Νεύτων δημοσίευσε τους τρεις νόμους της κίνησης στα «Principia» το 1687, ιδρύοντας την κλασική μηχανική.' }
  },

  // === Extra Biology (5) ===
  {
    id: 'bio-6',
    category: 'Biology',
    difficulty: 'easy',
    question: { en: 'What gas do plants absorb from the atmosphere?', el: 'Ποιο αέριο απορροφούν τα φυτά από την ατμόσφαιρα;' },
    options: { en: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], el: ['Οξυγόνο', 'Διοξείδιο του άνθρακα', 'Άζωτο', 'Υδρογόνο'] },
    correct: { en: 'Carbon dioxide', el: 'Διοξείδιο του άνθρακα' },
    explanation: { en: 'Plants absorb CO₂ through stomata and use it in photosynthesis to make organic compounds.', el: 'Τα φυτά απορροφούν το CO₂ μέσω των στοματικών πόρων και το χρησιμοποιούν στη φωτοσύνθεση για να φτιάξουν οργανικές ενώσεις.' }
  },
  {
    id: 'bio-7',
    category: 'Biology',
    difficulty: 'medium',
    question: { en: 'What is the largest organ in the human body?', el: 'Ποιο είναι το μεγαλύτερο όργανο του ανθρώπινου σώματος;' },
    options: { en: ['Liver', 'Brain', 'Skin', 'Heart'], el: ['Συκώτι', 'Εγκέφαλος', 'Δέρμα', 'Καρδιά'] },
    correct: { en: 'Skin', el: 'Δέρμα' },
    explanation: { en: 'The skin is the largest organ, covering about 2 square meters and weighing 3–4 kg in adults.', el: 'Το δέρμα είναι το μεγαλύτερο όργανο, καλύπτοντας περίπου 2 τετραγωνικά μέτρα και ζυγίζοντας 3–4 kg σε ενήλικες.' }
  },
  {
    id: 'bio-8',
    category: 'Biology',
    difficulty: 'hard',
    question: { en: 'What type of cell division produces gametes?', el: 'Ποιος τύπος κυτταρικής διαίρεσης παράγει γαμέτες;' },
    options: { en: ['Mitosis', 'Meiosis', 'Binary fission', 'Budding'], el: ['Μίτωση', 'Μείωση', 'Δυαδική σχάση', 'Εκβλάστηση'] },
    correct: { en: 'Meiosis', el: 'Μείωση' },
    explanation: { en: 'Meiosis produces haploid gametes (sperm and egg) with half the chromosomes for sexual reproduction.', el: 'Η μείωση παράγει απλοειδείς γαμέτες (σπερματοζωάριο και ωάριο) με τα μισά χρωμοσώματα για την σεξουαλική αναπαραγωγή.' }
  },
  {
    id: 'bio-9',
    category: 'Biology',
    difficulty: 'easy',
    question: { en: 'Which blood type is the universal donor?', el: 'Ποια ομάδα αίματος είναι ο οικουμενικός δότης;' },
    options: { en: ['A', 'B', 'AB', 'O'], el: ['A', 'B', 'AB', 'O'] },
    correct: { en: 'O', el: 'O' },
    explanation: { en: 'Blood type O has no A or B antigens on red cells, so it does not trigger immune reactions in recipients.', el: 'Η ομάδα αίματος O δεν έχει αντιγόνα A ή B στα ερυθρά κύτταρα, επομένως δεν προκαλεί ανοσολογικές αντιδράσεις στους δέκτες.' }
  },
  {
    id: 'bio-10',
    category: 'Biology',
    difficulty: 'medium',
    question: { en: 'What molecule carries genetic information?', el: 'Ποιο μόριο μεταφέρει τη γενετική πληροφορία;' },
    options: { en: ['RNA', 'DNA', 'ATP', 'Protein'], el: ['RNA', 'DNA', 'ATP', 'Πρωτεΐνη'] },
    correct: { en: 'DNA', el: 'DNA' },
    explanation: { en: 'DNA stores the genetic code in its sequence of nucleotides; it is replicated and passed to offspring.', el: 'Το DNA αποθηκεύει τον γενετικό κώδικα στη αλληλουχία των νουκλεοτιδίων του· αντιγράφεται και μεταβιβάζεται στα απογόνων.' }
  },

  // === Extra Chemistry (5) ===
  {
    id: 'chem-6',
    category: 'Chemistry',
    difficulty: 'easy',
    question: { en: 'What is the chemical formula for table salt?', el: 'Ποιος είναι ο χημικός τύπος του μαγειρικού αλατιού;' },
    options: { en: ['NaCl', 'KCl', 'CaCl₂', 'NaOH'], el: ['NaCl', 'KCl', 'CaCl₂', 'NaOH'] },
    correct: { en: 'NaCl', el: 'NaCl' },
    explanation: { en: 'Table salt is sodium chloride (NaCl), formed by the ionic bond between sodium and chlorine.', el: 'Το μαγειρικό αλάτι είναι το χλωριούχο νάτριο (NaCl), που σχηματίζεται από τον ιοντικό δεσμό μεταξύ νατρίου και χλωρίου.' }
  },
  {
    id: 'chem-7',
    category: 'Chemistry',
    difficulty: 'medium',
    question: { en: 'What is the most abundant gas in Earth\'s atmosphere?', el: 'Ποιο είναι το πιο άφθονο αέριο στην ατμόσφαιρα της Γης;' },
    options: { en: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], el: ['Οξυγόνο', 'Διοξείδιο του άνθρακα', 'Άζωτο', 'Αργό'] },
    correct: { en: 'Nitrogen', el: 'Άζωτο' },
    explanation: { en: 'Nitrogen makes up about 78% of Earth\'s atmosphere by volume, while oxygen is about 21%.', el: 'Το άζωτο αποτελεί περίπου το 78% της ατμόσφαιρας της Γης κατά όγκο, ενώ το οξυγόνο περίπου το 21%.' }
  },
  {
    id: 'chem-8',
    category: 'Chemistry',
    difficulty: 'hard',
    question: { en: 'What is Avogadro\'s number approximately equal to?', el: 'Πόσο είναι περίπου ο αριθμός Αβογκάντρο;' },
    options: { en: ['6.02 × 10²³', '3.14 × 10⁸', '9.81 × 10²', '1.60 × 10⁻¹⁹'], el: ['6,02 × 10²³', '3,14 × 10⁸', '9,81 × 10²', '1,60 × 10⁻¹⁹'] },
    correct: { en: '6.02 × 10²³', el: '6,02 × 10²³' },
    explanation: { en: 'Avogadro\'s number (≈6.02×10²³) is the number of atoms or molecules in one mole of a substance.', el: 'Ο αριθμός Αβογκάντρο (≈6,02×10²³) είναι ο αριθμός ατόμων ή μορίων σε ένα mole ενός ουσίας.' }
  },
  {
    id: 'chem-9',
    category: 'Chemistry',
    difficulty: 'easy',
    question: { en: 'What are the three states of matter?', el: 'Ποιες είναι οι τρεις καταστάσεις της ύλης;' },
    options: {
      en: ['Solid, liquid, gas', 'Hot, cold, warm', 'Light, dark, grey', 'Hard, soft, flexible'],
      el: ['Στερεό, υγρό, αέριο', 'Ζεστό, κρύο, χλιαρό', 'Φωτεινό, σκοτεινό, γκρίζο', 'Σκληρό, μαλακό, εύκαμπτο']
    },
    correct: { en: 'Solid, liquid, gas', el: 'Στερεό, υγρό, αέριο' },
    explanation: { en: 'Solid, liquid, and gas are the three fundamental states of matter, differing in particle arrangement and energy.', el: 'Το στερεό, το υγρό και το αέριο είναι οι τρεις θεμελιώδεις καταστάσεις της ύλης, που διαφέρουν στη διάταξη και την ενέργεια των σωματιδίων.' }
  },
  {
    id: 'chem-10',
    category: 'Chemistry',
    difficulty: 'medium',
    question: { en: 'Which element has the atomic number 79?', el: 'Ποιο στοιχείο έχει ατομικό αριθμό 79;' },
    options: { en: ['Silver', 'Gold', 'Platinum', 'Copper'], el: ['Ασήμι', 'Χρυσός', 'Λευκόχρυσος', 'Χαλκός'] },
    correct: { en: 'Gold', el: 'Χρυσός' },
    explanation: { en: 'Gold has atomic number 79, meaning each gold atom has 79 protons in its nucleus.', el: 'Ο χρυσός έχει ατομικό αριθμό 79, δηλαδή κάθε άτομο χρυσού έχει 79 πρωτόνια στον πυρήνα του.' }
  },

  // === Extra Physics (5) ===
  {
    id: 'phys-6',
    category: 'Physics',
    difficulty: 'easy',
    question: { en: 'What is the unit of electric current?', el: 'Ποια είναι η μονάδα μέτρησης του ηλεκτρικού ρεύματος;' },
    options: { en: ['Volt', 'Ampere', 'Ohm', 'Watt'], el: ['Βολτ', 'Αμπέρ', 'Ωμ', 'Βατ'] },
    correct: { en: 'Ampere', el: 'Αμπέρ' },
    explanation: { en: 'The ampere (A) is the SI unit for electric current, named after physicist André-Marie Ampère.', el: 'Το αμπέρ (A) είναι η μονάδα SI για το ηλεκτρικό ρεύμα, ονομασμένο προς τιμήν του φυσικού Αντρέ-Μαρί Αμπέρ.' }
  },
  {
    id: 'phys-7',
    category: 'Physics',
    difficulty: 'medium',
    question: { en: 'What is the formula for kinetic energy?', el: 'Ποιος είναι ο τύπος της κινητικής ενέργειας;' },
    options: { en: ['½mv²', 'mgh', 'F=ma', 'E=mc²'], el: ['½mv²', 'mgh', 'F=ma', 'E=mc²'] },
    correct: { en: '½mv²', el: '½mv²' },
    explanation: { en: 'Kinetic energy equals half the mass times velocity squared (KE = ½mv²), the energy of motion.', el: 'Η κινητική ενέργεια ισούται με το μισό της μάζας επί την ταχύτητα στο τετράγωνο (KE = ½mv²), η ενέργεια της κίνησης.' }
  },
  {
    id: 'phys-8',
    category: 'Physics',
    difficulty: 'hard',
    question: { en: 'What phenomenon causes a rainbow?', el: 'Ποιο φαινόμενο προκαλεί το ουράνιο τόξο;' },
    options: {
      en: ['Reflection only', 'Refraction and dispersion of light', 'Diffraction', 'Polarization'],
      el: ['Μόνο ανάκλαση', 'Διάθλαση και διασπορά φωτός', 'Περίθλαση', 'Πόλωση']
    },
    correct: { en: 'Refraction and dispersion of light', el: 'Διάθλαση και διασπορά φωτός' },
    explanation: { en: 'Rainbows form when sunlight is refracted, reflected, and dispersed by water droplets, splitting white light into colors.', el: 'Τα ουράνια τόξα σχηματίζονται όταν το ηλιακό φως διαθλάται, ανακλάται και διαχέεται από σταγόνες νερού, διαχωρίζοντας το λευκό φως σε χρώματα.' }
  },
  {
    id: 'phys-9',
    category: 'Physics',
    difficulty: 'easy',
    question: { en: 'What does a thermometer measure?', el: 'Τι μετρά ένα θερμόμετρο;' },
    options: { en: ['Pressure', 'Temperature', 'Humidity', 'Speed'], el: ['Πίεση', 'Θερμοκρασία', 'Υγρασία', 'Ταχύτητα'] },
    correct: { en: 'Temperature', el: 'Θερμοκρασία' },
    explanation: { en: 'A thermometer measures temperature by detecting the expansion or contraction of a substance (e.g., mercury or alcohol).', el: 'Ένα θερμόμετρο μετρά τη θερμοκρασία ανιχνεύοντας την διαστολή ή τη συστολή μιας ουσίας (π.χ. υδράργυρος ή αλκοόλη).' }
  },
  {
    id: 'phys-10',
    category: 'Physics',
    difficulty: 'medium',
    question: { en: 'What is the acceleration due to gravity on Earth (approx.)?', el: 'Πόση είναι η επιτάχυνση της βαρύτητας στη Γη (περίπου);' },
    options: { en: ['5.8 m/s²', '9.8 m/s²', '12.5 m/s²', '7.2 m/s²'], el: ['5,8 m/s²', '9,8 m/s²', '12,5 m/s²', '7,2 m/s²'] },
    correct: { en: '9.8 m/s²', el: '9,8 m/s²' },
    explanation: { en: 'Objects near Earth\'s surface accelerate at about 9.8 m/s² downward due to gravity (symbol g).', el: 'Τα αντικείμενα κοντά στην επιφάνεια της Γης επιταχύνονται με περίπου 9,8 m/s² προς τα κάτω λόγω της βαρύτητας (σύμβολο g).' }
  },

  // === Ecology (10) ===
  { id: 'eco-1', category: 'Ecology', difficulty: 'easy', question: { en: 'What is the primary source of energy for most ecosystems?', el: 'Ποια είναι η κύρια πηγή ενέργειας για τα περισσότερα οικοσυστήματα;' }, options: { en: ['The Sun', 'Geothermal heat', 'Chemosynthesis', 'Decaying matter'], el: ['Ο Ήλιος', 'Γεωθερμική θερμότητα', 'Χημειοσύνθεση', 'Σαπίζουσα ύλη'] }, correct: { en: 'The Sun', el: 'Ο Ήλιος' }, explanation: { en: 'Sunlight drives photosynthesis, which produces the organic matter that fuels food chains in most ecosystems.', el: 'Το ηλιακό φως τροφοδοτεί τη φωτοσύνθεση, που παράγει την οργανική ύλη που τροφοδοτεί τις τροφικές αλυσίδες στα περισσότερα οικοσυστήματα.' } },
  { id: 'eco-2', category: 'Ecology', difficulty: 'medium', question: { en: 'What is a keystone species?', el: 'Τι είναι ένα βασικό είδος σε ένα οικοσύστημα;' }, options: { en: ['The largest species', 'A species critical to ecosystem structure', 'The most numerous species', 'An invasive species'], el: ['Το μεγαλύτερο είδος', 'Είδος κρίσιμο για τη δομή του οικοσυστήματος', 'Το πιο πολυάριθμο είδος', 'Εισβλητικό είδος'] }, correct: { en: 'A species critical to ecosystem structure', el: 'Είδος κρίσιμο για τη δομή του οικοσυστήματος' }, explanation: { en: 'A keystone species has a disproportionate effect on its ecosystem; its removal can cause major ecological collapse.', el: 'Ένα βασικό είδος έχει δυσανάλογο αντίκτυπο στο οικοσύστημά του· η αφαίρεσή του μπορεί να προκαλέσει μεγάλη οικολογική κατάρρευση.' } },
  { id: 'eco-3', category: 'Ecology', difficulty: 'hard', question: { en: 'What is the trophic level of a primary consumer?', el: 'Ποιο είναι το τροφικό επίπεδο ενός πρωτογενούς καταναλωτή;' }, options: { en: ['First level', 'Second level', 'Third level', 'Decomposer level'], el: ['Πρώτο επίπεδο', 'Δεύτερο επίπεδο', 'Τρίτο επίπεδο', 'Επίπεδο αποικοδομητή'] }, correct: { en: 'Second level', el: 'Δεύτερο επίπεδο' }, explanation: { en: 'Primary consumers (herbivores) eat producers (level 1) and occupy the second trophic level.', el: 'Οι πρωτογενείς καταναλωτές (φυτοφάγοι) τρώνε τους παραγωγούς (επίπεδο 1) και καταλαμβάνουν το δεύτερο τροφικό επίπεδο.' } },
  { id: 'eco-4', category: 'Ecology', difficulty: 'easy', question: { en: 'What do decomposers break down?', el: 'Τι αποικοδομούν οι αποικοδομητές;' }, options: { en: ['Rocks', 'Dead organisms and waste', 'Water molecules', 'Sunlight'], el: ['Πέτρες', 'Νεκρών οργανισμών και αποβλήτων', 'Μόρια νερού', 'Ηλιακό φως'] }, correct: { en: 'Dead organisms and waste', el: 'Νεκρών οργανισμών και αποβλήτων' }, explanation: { en: 'Decomposers like bacteria and fungi recycle nutrients by breaking down dead matter and organic waste.', el: 'Οι αποικοδομητές όπως τα βακτήρια και οι μύκητες ανακυκλώνουν θρεπτικά συστατικά αποικοδομώντας νεκρή ύλη και οργανικά απόβλητα.' } },
  { id: 'eco-5', category: 'Ecology', difficulty: 'medium', question: { en: 'What is mutualism in ecology?', el: 'Τι είναι ο αμοιβαϊκός συμβιωτισμός στην οικολογία;' }, options: { en: ['One benefits, one is harmed', 'Both species benefit', 'One benefits, one is unaffected', 'Both are harmed'], el: ['Ένα ωφελείται, ένα βλάπτεται', 'Και τα δύο είδη ωφελούνται', 'Ένα ωφελείται, ένα αδέσμευτο', 'Και τα δύο βλάπτονται'] }, correct: { en: 'Both species benefit', el: 'Και τα δύο είδη ωφελούνται' }, explanation: { en: 'Mutualism is a symbiotic relationship where both organisms benefit, e.g., bees and flowers.', el: 'Ο αμοιβαϊκός συμβιωτισμός είναι μια συμβιωτική σχέση όπου και οι δύο οργανισμοί ωφελούνται, π.χ. μέλισσες και λουλούδια.' } },
  { id: 'eco-6', category: 'Ecology', difficulty: 'hard', question: { en: 'What is the carrying capacity of an ecosystem?', el: 'Τι είναι η φέρουσα ικανότητα ενός οικοσυστήματος;' }, options: { en: ['The maximum population size', 'The birth rate', 'The death rate', 'The immigration rate'], el: ['Το μέγιστο μέγεθος πληθυσμού', 'Ο ρυθμός γεννήσεων', 'Ο ρυθμός θανάτων', 'Ο ρυθμός μετανάστευσης'] }, correct: { en: 'The maximum population size', el: 'Το μέγιστο μέγεθος πληθυσμού' }, explanation: { en: 'Carrying capacity is the maximum population size an environment can sustain given available resources.', el: 'Η φέρουσα ικανότητα είναι το μέγιστο μέγεθος πληθυσμού που ένα περιβάλλον μπορεί να υποστηρίξει δεδομένων των διαθέσιμων πόρων.' } },
  { id: 'eco-7', category: 'Ecology', difficulty: 'easy', question: { en: 'What is biodiversity?', el: 'Τι είναι η βιοποικιλότητα;' }, options: { en: ['Only animal species', 'Variety of life in an area', 'Only plant species', 'Number of humans'], el: ['Μόνο τα ζωϊκά είδη', 'Ποικιλότητα ζωής σε μια περιοχή', 'Μόνο τα φυτικά είδη', 'Αριθμός ανθρώπων'] }, correct: { en: 'Variety of life in an area', el: 'Ποικιλότητα ζωής σε μια περιοχή' }, explanation: { en: 'Biodiversity refers to the variety of life at all levels: genes, species, and ecosystems.', el: 'Η βιοποικιλότητα αναφέρεται στη ποικιλότητα της ζωής σε όλα τα επίπεδα: γονίδια, είδη και οικοσυστήματα.' } },
  { id: 'eco-8', category: 'Ecology', difficulty: 'medium', question: { en: 'What is a carbon sink?', el: 'Τι είναι ένας απορροφητήρας άνθρακα;' }, options: { en: ['A source of CO₂', 'A reservoir that absorbs more carbon than it releases', 'A type of volcano', 'A factory'], el: ['Πηγή CO₂', 'Αποθηκευτικός χώρος που απορροφά περισσότερο άνθρακα απ\' όσο αποδεσμεύει', 'Τύπος ηφαιστείου', 'Εργοστάσιο'] }, correct: { en: 'A reservoir that absorbs more carbon than it releases', el: 'Αποθηκευτικός χώρος που απορροφά περισσότερο άνθρακα απ\' όσο αποδεσμεύει' }, explanation: { en: 'Forests, oceans, and soil act as carbon sinks by absorbing CO₂ from the atmosphere.', el: 'Τα δάση, οι ωκεανοί και το έδαφος λειτουργούν ως απορροφητήρες άνθρακα απορροφώντας CO₂ από την ατμόσφαιρα.' } },
  { id: 'eco-9', category: 'Ecology', difficulty: 'hard', question: { en: 'What is ecological succession?', el: 'Τι είναι η οικολογική διαδοχή;' }, options: { en: ['Population explosion', 'Gradual change in community over time', 'Sudden extinction', 'Seasonal migration'], el: ['Πληθυσμιακή έκρηξη', 'Σταδιακή αλλαγή της κοινότητας με το χρόνο', 'Ξαφνική εξαφάνιση', 'Εποχική μετακίνηση'] }, correct: { en: 'Gradual change in community over time', el: 'Σταδιακή αλλαγή της κοινότητας με το χρόνο' }, explanation: { en: 'Ecological succession is the process by which a biological community changes over time after a disturbance.', el: 'Η οικολογική διαδοχή είναι η διαδικασία κατά την οποία μια βιολογική κοινότητα αλλάζει με το χρόνο μετά από μια διατάραξη.' } },
  // === Geology (10) ===
  { id: 'geo-1', category: 'Geology', difficulty: 'easy', question: { en: 'What type of rock is formed from cooled magma or lava?', el: 'Ποιος τύπος πέτρας σχηματίζεται από ψυχόμενο magma ή λάβα;' }, options: { en: ['Sedimentary', 'Igneous', 'Metamorphic', 'Limestone'], el: ['Ιζηματογενής', 'Πυριγενής', 'Μεταμορφωμένη', 'Ασβεστόλιθος'] }, correct: { en: 'Igneous', el: 'Πυριγενής' }, explanation: { en: 'Igneous rocks form when molten material (magma or lava) cools and solidifies.', el: 'Οι πυριγενείς πέτρες σχηματίζονται όταν ψυχόμενη υλική ουσία (magma ή λάβα) κρυώνει και παγώνει.' } },
  { id: 'geo-2', category: 'Geology', difficulty: 'medium', question: { en: 'What is the Richter scale used to measure?', el: 'Τι μετρά η κλίμακα Ρίχτερ;' }, options: { en: ['Temperature', 'Earthquake magnitude', 'Wind speed', 'Ocean depth'], el: ['Θερμοκρασία', 'Μέγεθος σεισμού', 'Ταχύτητα ανέμου', 'Βάθος ωκεανού'] }, correct: { en: 'Earthquake magnitude', el: 'Μέγεθος σεισμού' }, explanation: { en: 'The Richter scale measures the magnitude (energy release) of earthquakes on a logarithmic scale.', el: 'Η κλίμακα Ρίχτερ μετρά το μέγεθος (απελευθέρωση ενέργειας) των σεισμών σε λογαριθμική κλίμακα.' } },
  { id: 'geo-3', category: 'Geology', difficulty: 'hard', question: { en: 'What is subduction in plate tectonics?', el: 'Τι είναι η υποβύθιση στην τεκτονική των πλακών;' }, options: { en: ['Mountain building', 'One plate sliding under another', 'Seafloor spreading', 'Volcanic eruption'], el: ['Ορογονία', 'Μια πλάκα γλιστρά κάτω από άλλη', 'Διάχυση βυθοπέλαγους', 'Ηφαιστειακή έκρηξη'] }, correct: { en: 'One plate sliding under another', el: 'Μια πλάκα γλιστρά κάτω από άλλη' }, explanation: { en: 'Subduction occurs when a denser oceanic plate is forced beneath a continental or lighter plate.', el: 'Η υποβύθιση συμβαίνει όταν μια πυκνότερη ωκεάνια πλάκα αναγκάζεται κάτω από ηπειρωτική ή ελαφρύτερη πλάκα.' } },
  { id: 'geo-4', category: 'Geology', difficulty: 'easy', question: { en: 'What is the outermost layer of Earth called?', el: 'Πώς ονομάζεται το εξωτερικό στρώμα της Γης;' }, options: { en: ['Mantle', 'Core', 'Crust', 'Lithosphere'], el: ['Μανδύας', 'Πυρήνας', 'Φλοιός', 'Λιθόσφαιρα'] }, correct: { en: 'Crust', el: 'Φλοιός' }, explanation: { en: 'The crust is Earth\'s thin outer layer of solid rock, ranging from 5–70 km thick.', el: 'Ο φλοιός είναι το λεπτό εξωτερικό στρώμα της Γης από στερεό πέτρωμα, με πάχος 5–70 km.' } },
  { id: 'geo-5', category: 'Geology', difficulty: 'medium', question: { en: 'What mineral gives marble its characteristic appearance?', el: 'Ποιο ορυκτό δίνει στο μάρμαρο τη χαρακτηριστική εμφάνισή του;' }, options: { en: ['Quartz', 'Calcite', 'Feldspar', 'Mica'], el: ['Χαλαζίας', 'Ασβεστίτης', 'Πεδίοσπατος', 'Μαργαρίτης'] }, correct: { en: 'Calcite', el: 'Ασβεστίτης' }, explanation: { en: 'Marble is metamorphosed limestone composed mainly of calcite (calcium carbonate).', el: 'Το μάρμαρο είναι μεταμορφωμένος ασβεστόλιθος που αποτελείται κυρίως από ασβεστίτη (ανθρακικό ασβέστιο).' } },
  { id: 'geo-6', category: 'Geology', difficulty: 'hard', question: { en: 'What causes the formation of mid-ocean ridges?', el: 'Τι προκαλεί το σχηματισμό των μεσοωκεάνιων ραχιών;' }, options: { en: ['Subduction', 'Seafloor spreading and upwelling magma', 'Glacial erosion', 'River deposition'], el: ['Υποβύθιση', 'Διάχυση βυθοπέλαγους και άνοδος magma', 'Παγετωνική διάβρωση', 'Ιζηματογένεση ποταμού'] }, correct: { en: 'Seafloor spreading and upwelling magma', el: 'Διάχυση βυθοπέλαγους και άνοδος magma' }, explanation: { en: 'Mid-ocean ridges form where tectonic plates diverge; magma rises to create new ocean floor.', el: 'Οι μεσοωκεάνιες ράχες σχηματίζονται όπου οι τεκτονικές πλάκες αποκλίνουν· το magma ανεβαίνει δημιουργώντας νέο ωκεάνιο πάτο.' } },
  { id: 'geo-7', category: 'Geology', difficulty: 'easy', question: { en: 'What is a fossil?', el: 'Τι είναι ένα απολίθωμα;' }, options: { en: ['A living organism', 'Preserved remains of past life', 'A type of crystal', 'A volcanic rock'], el: ['Ζωντανός οργανισμός', 'Σωζόμενα λείψανα προηγούμενης ζωής', 'Τύπος κρυστάλλου', 'Ηφαιστειακή πέτρα'] }, correct: { en: 'Preserved remains of past life', el: 'Σωζόμενα λείψανα προηγούμενης ζωής' }, explanation: { en: 'Fossils are the preserved remains or traces of organisms from the geologic past.', el: 'Τα απολιθώματα είναι τα σωζόμενα λείψανα ή ίχνη οργανισμών από το γεωλογικό παρελθόν.' } },
  { id: 'geo-8', category: 'Geology', difficulty: 'medium', question: { en: 'Which gas is released by volcanic eruptions?', el: 'Ποιο αέριο απελευθερώνεται από τις ηφαιστειακές εκρήξεις;' }, options: { en: ['Oxygen', 'Nitrogen', 'Carbon dioxide and sulfur dioxide', 'Helium'], el: ['Οξυγόνο', 'Άζωτο', 'Διοξείδιο του άνθρακα και διοξείδιο του θείου', 'Ήλιο'] }, correct: { en: 'Carbon dioxide and sulfur dioxide', el: 'Διοξείδιο του άνθρακα και διοξείδιο του θείου' }, explanation: { en: 'Volcanoes release CO₂, SO₂, water vapor, and other gases that can affect climate.', el: 'Τα ηφαίστεια απελευθερώνουν CO₂, SO₂, υδρατμούς και άλλα αέρια που μπορούν να επηρεάσουν το κλίμα.' } },
  { id: 'geo-9', category: 'Geology', difficulty: 'hard', question: { en: 'What is the Moho discontinuity?', el: 'Τι είναι η ασυνέχεια Moho;' }, options: { en: ['A fault line', 'The boundary between crust and mantle', 'A volcanic vent', 'A fossil bed'], el: ['Ρήγμα', 'Το όριο μεταξύ φλοιού και μανδύα', 'Ηφαιστειακός αεραγωγός', 'Στρώμα απολιθωμάτων'] }, correct: { en: 'The boundary between crust and mantle', el: 'Το όριο μεταξύ φλοιού και μανδύα' }, explanation: { en: 'The Mohorovičić discontinuity (Moho) is the boundary between Earth\'s crust and the underlying mantle.', el: 'Η ασυνέχεια Mohorovičić (Moho) είναι το όριο μεταξύ του φλοιού της Γης και του υποκείμενου μανδύα.' } },
  // === Weather (10) ===
  { id: 'wea-1', category: 'Weather', difficulty: 'easy', question: { en: 'What is the main cause of wind?', el: 'Ποια είναι η κύρια αιτία του ανέμου;' }, options: { en: ['Earth rotation', 'Uneven heating of Earth\'s surface', 'Ocean currents', 'Plant transpiration'], el: ['Περιστροφή της Γης', 'Ανόμοια θέρμανση της επιφάνειας της Γης', 'Ωκεάνια ρεύματα', 'Φυτική διαπνοή'] }, correct: { en: 'Uneven heating of Earth\'s surface', el: 'Ανόμοια θέρμανση της επιφάνειας της Γης' }, explanation: { en: 'Wind is caused by air moving from high-pressure to low-pressure areas, driven by uneven solar heating.', el: 'Ο άνεμος προκαλείται από αέρα που κινείται από υψηλή προς χαμηλή πίεση, τροφοδοτούμενο από ανόμοια ηλιακή θέρμανση.' } },
  { id: 'wea-2', category: 'Weather', difficulty: 'medium', question: { en: 'What scale measures hurricane intensity?', el: 'Ποια κλίμακα μετρά την ένταση των τυφώνων;' }, options: { en: ['Richter', 'Fujita', 'Saffir-Simpson', 'Beaufort'], el: ['Ρίχτερ', 'Φουζίτα', 'Σάφιρ-Σίμπσον', 'Μποφόρ'] }, correct: { en: 'Saffir-Simpson', el: 'Σάφιρ-Σίμπσον' }, explanation: { en: 'The Saffir-Simpson scale rates hurricanes from 1 to 5 based on sustained wind speed.', el: 'Η κλίμακα Σάφιρ-Σίμπσον ταξινομεί τους τυφώνες από 1 έως 5 με βάση την παρατεταμένη ταχύτητα ανέμου.' } },
  { id: 'wea-3', category: 'Weather', difficulty: 'hard', question: { en: 'What is the Coriolis effect?', el: 'Τι είναι το φαινόμενο Coriolis;' }, options: { en: ['Ocean tides', 'Deflection of moving objects due to Earth\'s rotation', 'Lightning formation', 'Cloud formation'], el: ['Ωκεάνιες παλίρροιες', 'Απόκλιση κινούμενων αντικειμένων λόγω περιστροφής της Γης', 'Σχηματισμός αστραπής', 'Σχηματισμός νεφών'] }, correct: { en: 'Deflection of moving objects due to Earth\'s rotation', el: 'Απόκλιση κινούμενων αντικειμένων λόγω περιστροφής της Γης' }, explanation: { en: 'The Coriolis effect deflects moving air and water to the right in the Northern Hemisphere and left in the Southern.', el: 'Το φαινόμενο Coriolis εκτρέπει τον κινούμενο αέρα και το νερό προς τα δεξιά στο Βόρειο Ημισφαίριο και προς τα αριστερά στο Νότιο.' } },
  { id: 'wea-4', category: 'Weather', difficulty: 'easy', question: { en: 'What is humidity?', el: 'Τι είναι η υγρασία;' }, options: { en: ['Rain amount', 'Water vapor in the air', 'Cloud cover', 'Temperature'], el: ['Ποσότητα βροχής', 'Υδρατμοί στον αέρα', 'Κάλυψη νεφών', 'Θερμοκρασία'] }, correct: { en: 'Water vapor in the air', el: 'Υδρατμοί στον αέρα' }, explanation: { en: 'Humidity is the amount of water vapor present in the atmosphere, often expressed as relative humidity.', el: 'Η υγρασία είναι η ποσότητα υδρατμών που υπάρχει στην ατμόσφαιρα, συχνά εκφρασμένη ως σχετική υγρασία.' } },
  { id: 'wea-5', category: 'Weather', difficulty: 'medium', question: { en: 'What causes a thunderstorm?', el: 'Τι προκαλεί μια καταιγίδα;' }, options: { en: ['Cold fronts only', 'Rapid upward movement of warm, moist air', 'Earthquakes', 'Volcanic eruptions'], el: ['Μόνο κρύα μέτωπα', 'Γρήγορη ανοδική κίνηση ζεστού, υγρού αέρα', 'Σεισμοί', 'Ηφαιστειακές εκρήξεις'] }, correct: { en: 'Rapid upward movement of warm, moist air', el: 'Γρήγορη ανοδική κίνηση ζεστού, υγρού αέρα' }, explanation: { en: 'Thunderstorms form when warm, moist air rises rapidly, cools, and condenses into cumulonimbus clouds.', el: 'Οι καταιγίδες σχηματίζονται όταν ζεστός, υγρός αέρας ανεβαίνει γρήγορα, κρυώνει και συμπυκνώνεται σε νέφη cumulonimbus.' } },
  { id: 'wea-6', category: 'Weather', difficulty: 'hard', question: { en: 'What is an occluded front?', el: 'Τι είναι ένα κλειστό μέτωπο;' }, options: { en: ['A stationary front', 'A front where a cold front overtakes a warm front', 'A tropical front', 'A polar front'], el: ['Σταθερό μέτωπο', 'Μέτωπο όπου κρύο μέτωπο ξεπερνά ζεστό μέτωπο', 'Τροπικό μέτωπο', 'Πολικό μέτωπο'] }, correct: { en: 'A front where a cold front overtakes a warm front', el: 'Μέτωπο όπου κρύο μέτωπο ξεπερνά ζεστό μέτωπο' }, explanation: { en: 'An occluded front forms when a cold front catches and overtakes a warm front, lifting the warm air.', el: 'Ένα κλειστό μέτωπο σχηματίζεται όταν ένα κρύο μέτωπο προλαβαίνει και ξεπερνά ένα ζεστό μέτωπο, ανυψώνοντας τον ζεστό αέρα.' } },
  { id: 'wea-7', category: 'Weather', difficulty: 'easy', question: { en: 'What instrument measures air pressure?', el: 'Ποιο όργανο μετρά την ατμοσφαιρική πίεση;' }, options: { en: ['Thermometer', 'Barometer', 'Hygrometer', 'Anemometer'], el: ['Θερμόμετρο', 'Βαρόμετρο', 'Υγρόμετρο', 'Ανεμόμετρο'] }, correct: { en: 'Barometer', el: 'Βαρόμετρο' }, explanation: { en: 'A barometer measures atmospheric pressure; falling pressure often indicates approaching storms.', el: 'Ένα βαρόμετρο μετρά την ατμοσφαιρική πίεση· η πτώση της πίεσης συχνά υποδηλώνει επερχόμενες καταιγίδες.' } },
  { id: 'wea-8', category: 'Weather', difficulty: 'medium', question: { en: 'What type of cloud produces thunderstorms?', el: 'Ποιος τύπος νέφους παράγει καταιγίδες;' }, options: { en: ['Cirrus', 'Stratus', 'Cumulonimbus', 'Altocumulus'], el: ['Κίρρος', 'Στρατός', 'Κυμονανθρακονέφη', 'Αλτοκύματα'] }, correct: { en: 'Cumulonimbus', el: 'Κυμονανθρακονέφη' }, explanation: { en: 'Cumulonimbus clouds are tall, dense clouds that produce thunderstorms, heavy rain, and lightning.', el: 'Τα νέφη cumulonimbus είναι ψηλά, πυκνά νέφη που παράγουν καταιγίδες, έντονες βροχοπτώσεις και αστραπές.' } },
  { id: 'wea-9', category: 'Weather', difficulty: 'hard', question: { en: 'What is the jet stream?', el: 'Τι είναι το ρεύμα τζετ;' }, options: { en: ['Ocean current', 'Narrow band of strong winds in upper atmosphere', 'River in the sky', 'Tornado path'], el: ['Ωκεάνιο ρεύμα', 'Στενή ζώνη ισχυρών ανέμων στην άνω ατμόσφαιρα', 'Ποταμός στον ουρανό', 'Διάδρομος ανεμοστρόβιλου'] }, correct: { en: 'Narrow band of strong winds in upper atmosphere', el: 'Στενή ζώνη ισχυρών ανέμων στην άνω ατμόσφαιρα' }, explanation: { en: 'The jet stream is a fast-flowing, narrow air current in the upper troposphere that influences weather patterns.', el: 'Το ρεύμα τζετ είναι ένα ταχύρρεον, στενό αερίσιο ρεύμα στην άνω τροπόσφαιρα που επηρεάζει τα καιρικά σχήματα.' } },
  // === Oceans (10) ===
  { id: 'oce-1', category: 'Oceans', difficulty: 'easy', question: { en: 'What is the largest ocean on Earth?', el: 'Ποιος είναι ο μεγαλύτερος ωκεανός στη Γη;' }, options: { en: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], el: ['Ατλαντικός', 'Ινδικός', 'Ειρηνικός', 'Αρκτικός'] }, correct: { en: 'Pacific', el: 'Ειρηνικός' }, explanation: { en: 'The Pacific Ocean is the largest, covering about 63 million square miles and more than 30% of Earth\'s surface.', el: 'Ο Ειρηνικός ωκεανός είναι ο μεγαλύτερος, καλύπτοντας περίπου 63 εκατομμύρια τετραγωνικά μίλια και πάνω από 30% της επιφάνειας της Γης.' } },
  { id: 'oce-2', category: 'Oceans', difficulty: 'medium', question: { en: 'What causes ocean tides?', el: 'Τι προκαλεί τις ωκεάνιες παλίρροιες;' }, options: { en: ['Wind', 'Gravitational pull of Moon and Sun', 'Earth rotation only', 'Ocean currents'], el: ['Άνεμος', 'Βαρυτική έλξη της Σελήνης και του Ήλιου', 'Μόνο η περιστροφή της Γης', 'Ωκεάνια ρεύματα'] }, correct: { en: 'Gravitational pull of Moon and Sun', el: 'Βαρυτική έλξη της Σελήνης και του Ήλιου' }, explanation: { en: 'Tides are caused primarily by the Moon\'s gravity, with the Sun contributing during full and new moons.', el: 'Οι παλίρροιες προκαλούνται κυρίως από τη βαρύτητα της Σελήνης, με τον Ήλιο να συνεισφέρει κατά τη διάρκεια πανσελήνου και νουμηνίας.' } },
  { id: 'oce-3', category: 'Oceans', difficulty: 'hard', question: { en: 'Where is the Mariana Trench located?', el: 'Πού βρίσκεται η τάφρος Μαριάνας;' }, options: { en: ['Atlantic Ocean', 'Indian Ocean', 'Western Pacific Ocean', 'Arctic Ocean'], el: ['Ατλαντικός ωκεανός', 'Ινδικός ωκεανός', 'Δυτικός Ειρηνικός ωκεανός', 'Αρκτικός ωκεανός'] }, correct: { en: 'Western Pacific Ocean', el: 'Δυτικός Ειρηνικός ωκεανός' }, explanation: { en: 'The Mariana Trench is in the western Pacific, the deepest point on Earth at about 11 km below sea level.', el: 'Η τάφρος Μαριάνας βρίσκεται στον δυτικό Ειρηνικό, το βαθύτερο σημείο της Γης σε περίπου 11 km κάτω από τη στάθμη της θάλασσας.' } },
  { id: 'oce-4', category: 'Oceans', difficulty: 'easy', question: { en: 'What is coral made of?', el: 'Από τι αποτελείται το κοράλλι;' }, options: { en: ['Rocks', 'Calcium carbonate from tiny animals', 'Plants', 'Sand'], el: ['Πέτρες', 'Ανθρακικό ασβέστιο από μικρά ζώα', 'Φυτά', 'Άμμος'] }, correct: { en: 'Calcium carbonate from tiny animals', el: 'Ανθρακικό ασβέστιο από μικρά ζώα' }, explanation: { en: 'Coral is built by tiny animals called polyps that secrete calcium carbonate, forming reef structures.', el: 'Το κοράλλι χτίζεται από μικρά ζώα που ονομάζονται πολύποδες τα οποία εκκρίνουν ανθρακικό ασβέστιο, σχηματίζοντας κοραλλοκρεβατόπετρες.' } },
  { id: 'oce-5', category: 'Oceans', difficulty: 'medium', question: { en: 'What is the Great Ocean Conveyor Belt?', el: 'Τι είναι η Μεγάλη Ωκεάνια Λέβητας Μεταφορά;' }, options: { en: ['A shipping route', 'A global system of ocean currents', 'A fishing net', 'A submarine cable'], el: ['Διαδρομή ναυτιλίας', 'Παγκόσμιο σύστημα ωκεάνιων ρευμάτων', 'Δίχτυ ψαρέματος', 'Υποβρύχιο καλώδιο'] }, correct: { en: 'A global system of ocean currents', el: 'Παγκόσμιο σύστημα ωκεάνιων ρευμάτων' }, explanation: { en: 'The thermohaline circulation is a global conveyor of deep and surface currents driven by temperature and salinity.', el: 'Η θερμοαλική κυκλοφορία είναι μια παγκόσμια μεταφορά βαθιάς και επιφανειακής κυκλοφορίας που οδηγείται από θερμοκρασία και αλατότητα.' } },
  { id: 'oce-6', category: 'Oceans', difficulty: 'hard', question: { en: 'What percentage of Earth\'s oxygen is produced by ocean phytoplankton?', el: 'Ποιο ποσοστό του οξυγόνου της Γης παράγεται από το φυτοπλαγκτόν των ωκεανών;' }, options: { en: ['About 10%', 'About 20%', 'About 50%', 'About 70%'], el: ['Περίπου 10%', 'Περίπου 20%', 'Περίπου 50%', 'Περίπου 70%'] }, correct: { en: 'About 50%', el: 'Περίπου 50%' }, explanation: { en: 'Ocean phytoplankton and algae produce roughly half of the world\'s oxygen through photosynthesis.', el: 'Το φυτοπλαγκτόν και οι φύκια των ωκεανών παράγουν περίπου το μισό του παγκόσμιου οξυγόνου μέσω της φωτοσύνθεσης.' } },
  { id: 'oce-7', category: 'Oceans', difficulty: 'easy', question: { en: 'What is salinity?', el: 'Τι είναι η αλατότητα;' }, options: { en: ['Ocean depth', 'Salt content in water', 'Ocean temperature', 'Wave height'], el: ['Βάθος ωκεανού', 'Περιεκτικότητα σε αλάτι στο νερό', 'Θερμοκρασία ωκεανού', 'Ύψος κύματος'] }, correct: { en: 'Salt content in water', el: 'Περιεκτικότητα σε αλάτι στο νερό' }, explanation: { en: 'Salinity is the measure of dissolved salts in seawater, typically around 35 grams per kilogram.', el: 'Η αλατότητα είναι η μέτρηση των διαλελυμένων αλατών στο θαλασσινό νερό, συνήθως περίπου 35 γραμμάρια ανά κιλό.' } },
  { id: 'oce-8', category: 'Oceans', difficulty: 'medium', question: { en: 'What causes the Gulf Stream?', el: 'Τι προκαλεί το ρεύμα του Κόλπου;' }, options: { en: ['Wind only', 'Temperature and salinity differences, winds', 'Earthquakes', 'Volcanic activity'], el: ['Μόνο άνεμος', 'Διαφορές θερμοκρασίας και αλατότητας, άνεμοι', 'Σεισμοί', 'Ηφαιστειακή δραστηριότητα'] }, correct: { en: 'Temperature and salinity differences, winds', el: 'Διαφορές θερμοκρασίας και αλατότητας, άνεμοι' }, explanation: { en: 'The Gulf Stream is a warm, swift Atlantic current driven by wind and thermohaline circulation.', el: 'Το ρεύμα του Κόλπου είναι ένα ζεστό, γρήγορο ατλαντικό ρεύμα που οδηγείται από άνεμο και θερμοαλική κυκλοφορία.' } },
  { id: 'oce-9', category: 'Oceans', difficulty: 'hard', question: { en: 'What is the photic zone?', el: 'Τι είναι η φωτική ζώνη;' }, options: { en: ['The deepest ocean layer', 'The upper layer where sunlight penetrates', 'A coral reef', 'A trench'], el: ['Το βαθύτερο στρώμα του ωκεανού', 'Το ανώτερο στρώμα όπου το ηλιακό φως διεισδύει', 'Κοραλλοκρεβατόπετρα', 'Τάφρος'] }, correct: { en: 'The upper layer where sunlight penetrates', el: 'Το ανώτερο στρώμα όπου το ηλιακό φως διεισδύει' }, explanation: { en: 'The photic zone is the sunlit upper layer of the ocean (roughly 200 m) where photosynthesis can occur.', el: 'Η φωτική ζώνη είναι το ηλιολουστή ανώτερο στρώμα του ωκεανού (περίπου 200 m) όπου μπορεί να γίνει φωτοσύνθεση.' } },
  // === Plants (10) ===
  { id: 'pla-1', category: 'Plants', difficulty: 'easy', question: { en: 'What process do plants use to make their food?', el: 'Ποια διαδικασία χρησιμοποιούν τα φυτά για να φτιάξουν το φαγητό τους;' }, options: { en: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], el: ['Αναπνοή', 'Φωτοσύνθεση', 'Πέψη', 'Ζύμωση'] }, correct: { en: 'Photosynthesis', el: 'Φωτοσύνθεση' }, explanation: { en: 'Plants use photosynthesis to convert sunlight, CO₂, and water into glucose and oxygen.', el: 'Τα φυτά χρησιμοποιούν τη φωτοσύνθεση για να μετατρέψουν το ηλιακό φως, το CO₂ και το νερό σε γλυκόζη και οξυγόνο.' } },
  { id: 'pla-2', category: 'Plants', difficulty: 'medium', question: { en: 'What is xylem?', el: 'Τι είναι το ξύλωμα;' }, options: { en: ['Leaf tissue', 'Tissue that transports water upward', 'Root tip', 'Flower part'], el: ['Ιστό φύλλου', 'Ιστός που μεταφέρει νερό προς τα πάνω', 'Άκρο ρίζας', 'Μέρος λουλουδιού'] }, correct: { en: 'Tissue that transports water upward', el: 'Ιστός που μεταφέρει νερό προς τα πάνω' }, explanation: { en: 'Xylem carries water and minerals from roots to leaves; phloem transports sugars downward.', el: 'Το ξύλωμα μεταφέρει νερό και ορυκτά από τις ρίζες στα φύλλα· το φλοιό μεταφέρει σάκχαρα προς τα κάτω.' } },
  { id: 'pla-3', category: 'Plants', difficulty: 'hard', question: { en: 'What is the purpose of mycorrhizae?', el: 'Ποιος είναι ο σκοπός των μυκορίζων;' }, options: { en: ['Flower pigmentation', 'Symbiotic association that helps roots absorb nutrients', 'Seed dispersal', 'Pest defense'], el: ['Χρωστική λουλουδιών', 'Συμβιωτική σχέση που βοηθά τις ρίζες να απορροφούν θρεπτικά', 'Διασπορά σπόρων', 'Άμυνα εντόμων'] }, correct: { en: 'Symbiotic association that helps roots absorb nutrients', el: 'Συμβιωτική σχέση που βοηθά τις ρίζες να απορροφούν θρεπτικά' }, explanation: { en: 'Mycorrhizae are fungal associations with plant roots that enhance water and nutrient uptake.', el: 'Οι μυκορίζες είναι μυκητιακές σχέσεις με τις ρίζες των φυτών που ενισχύουν την απορρόφηση νερού και θρεπτικών.' } },
  { id: 'pla-4', category: 'Plants', difficulty: 'easy', question: { en: 'What gas do plants release during photosynthesis?', el: 'Ποιο αέριο αποδεσμεύουν τα φυτά κατά τη φωτοσύνθεση;' }, options: { en: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Methane'], el: ['Διοξείδιο του άνθρακα', 'Οξυγόνο', 'Άζωτο', 'Μεθάνιο'] }, correct: { en: 'Oxygen', el: 'Οξυγόνο' }, explanation: { en: 'Plants release oxygen as a byproduct of splitting water molecules during photosynthesis.', el: 'Τα φυτά αποδεσμεύουν οξυγόνο ως παράπροϊον του διαχωρισμού των μορίων του νερού κατά τη φωτοσύνθεση.' } },
  { id: 'pla-5', category: 'Plants', difficulty: 'medium', question: { en: 'What is an annual plant?', el: 'Τι είναι ένα ετήσιο φυτό;' }, options: { en: ['A plant that lives 100 years', 'A plant that completes its lifecycle in one year', 'A plant that blooms yearly', 'A tropical plant'], el: ['Φυτό που ζει 100 χρόνια', 'Φυτό που ολοκληρώνει τον κύκλο ζωής του σε ένα χρόνο', 'Φυτό που ανθίζει ετησίως', 'Τροπικό φυτό'] }, correct: { en: 'A plant that completes its lifecycle in one year', el: 'Φυτό που ολοκληρώνει τον κύκλο ζωής του σε ένα χρόνο' }, explanation: { en: 'Annuals germinate, flower, set seed, and die within one growing season; biennials take two years.', el: 'Τα ετήσια φυτά βλαστάνουν, ανθίζουν, παράγουν σπόρους και πεθαίνουν μέσα σε μία εποχή ανάπτυξης· τα διετή παίρνουν δύο χρόνια.' } },
  { id: 'pla-6', category: 'Plants', difficulty: 'hard', question: { en: 'What is phototropism?', el: 'Τι είναι η φωτοτροπισμός;' }, options: { en: ['Root growth toward water', 'Plant growth toward or away from light', 'Flower opening', 'Leaf shedding'], el: ['Ανάπτυξη ρίζας προς νερό', 'Φυτική ανάπτυξη προς ή μακριά από φως', 'Άνοιγμα λουλουδιού', 'Πτώση φύλλων'] }, correct: { en: 'Plant growth toward or away from light', el: 'Φυτική ανάπτυξη προς ή μακριά από φως' }, explanation: { en: 'Phototropism is the growth of plants in response to light direction; stems typically grow toward light.', el: 'Ο φωτοτροπισμός είναι η ανάπτυξη των φυτών σε απάντηση στην κατεύθυνση του φωτός· τα βλαστοί συνήθως αναπτύσσονται προς το φως.' } },
  { id: 'pla-7', category: 'Plants', difficulty: 'easy', question: { en: 'What part of the plant absorbs water from soil?', el: 'Ποιο μέρος του φυτού απορροφά νερό από το έδαφος;' }, options: { en: ['Leaves', 'Stem', 'Roots', 'Flowers'], el: ['Φύλλα', 'Βλαστός', 'Ρίζες', 'Λουλούδια'] }, correct: { en: 'Roots', el: 'Ρίζες' }, explanation: { en: 'Roots absorb water and dissolved minerals from the soil through root hairs.', el: 'Οι ρίζες απορροφούν νερό και διαλελυμένα ορυκτά από το έδαφος μέσω των τριχοειδών της ρίζας.' } },
  { id: 'pla-8', category: 'Plants', difficulty: 'medium', question: { en: 'What is the largest type of plant on Earth?', el: 'Ποιος είναι ο μεγαλύτερος τύπος φυτού στη Γη;' }, options: { en: ['Oak tree', 'Sequoiadendron giganteum (giant sequoia)', 'Bamboo', 'Palm tree'], el: ['Δρυς', 'Σεκουοία (γιγαντιαία σεκουόια)', 'Μπαμπού', 'Φοίνικας'] }, correct: { en: 'Sequoiadendron giganteum (giant sequoia)', el: 'Σεκουοία (γιγαντιαία σεκουόια)' }, explanation: { en: 'Giant sequoias are the largest trees by volume; some exceed 1,400 cubic meters.', el: 'Οι γιγαντιαίες σεκουόιες είναι τα μεγαλύτερα δέντρα κατά όγκο· μερικές ξεπερνούν τα 1.400 κυβικά μέτρα.' } },
  { id: 'pla-9', category: 'Plants', difficulty: 'hard', question: { en: 'What hormone regulates plant growth and stem elongation?', el: 'Ποια ορμόνη ρυθμίζει την ανάπτυξη των φυτών και την επιμήκυνση του βλαστού;' }, options: { en: ['Ethylene', 'Auxin', 'Cytokinin', 'Abscisic acid'], el: ['Αιθυλένιο', 'Ωωξίνη', 'Κυτοκινίνη', 'Αποκομητική οξύ'] }, correct: { en: 'Auxin', el: 'Ωωξίνη' }, explanation: { en: 'Auxins promote cell elongation, root formation, and tropic responses like phototropism.', el: 'Οι ωωξίνες προωθούν την επιμήκυνση των κυττάρων, τον σχηματισμό ρίζων και τροπικές αντιδράσεις όπως ο φωτοτροπισμός.' } },
  // === Animals (10) ===
  { id: 'ani-1', category: 'Animals', difficulty: 'easy', question: { en: 'What is the fastest land animal?', el: 'Ποιο είναι το ταχύτερο ζώο στη στεριά;' }, options: { en: ['Lion', 'Cheetah', 'Horse', 'Gazelle'], el: ['Λιοντάρι', 'Γατόπαρδο', 'Άλογο', 'Γαζέλα'] }, correct: { en: 'Cheetah', el: 'Γατόπαρδο' }, explanation: { en: 'The cheetah can reach speeds of about 70 mph (113 km/h) in short bursts.', el: 'Το γατόπαρδο μπορεί να φτάσει ταχύτητες περίπου 113 km/h σε σύντομες εκρήξεις.' } },
  { id: 'ani-2', category: 'Animals', difficulty: 'medium', question: { en: 'What is echolocation used for?', el: 'Προς τι χρησιμεύει η ηχοεντοπισμός;' }, options: { en: ['Breathing underwater', 'Navigation and hunting using sound', 'Communication only', 'Thermoregulation'], el: ['Αναπνοή κάτω από το νερό', 'Πλοήγηση και κυνήγι με ήχο', 'Μόνο επικοινωνία', 'Θερμορύθμιση'] }, correct: { en: 'Navigation and hunting using sound', el: 'Πλοήγηση και κυνήγι με ήχο' }, explanation: { en: 'Bats, dolphins, and some whales use echolocation to navigate and locate prey by interpreting sound echoes.', el: 'Οι νυχτερίδες, οι δελφίνες και κάτι φάλαινες χρησιμοποιούν ηχοεντοπισμό για πλοήγηση και εντοπισμό λείας ερμηνεύοντας αντηχήσεις ήχου.' } },
  { id: 'ani-3', category: 'Animals', difficulty: 'hard', question: { en: 'What is the only mammal that can truly fly?', el: 'Ποιο είναι το μόνο θηλαστικό που μπορεί πραγματικά να πετάξει;' }, options: { en: ['Flying squirrel', 'Bat', 'Flying fish', 'Sugar glider'], el: ['Ιπτάμενη σκίουρος', 'Νυχτερίδα', 'Ιπτάμενο ψάρι', 'Ζάκαρ γλυκόζη'] }, correct: { en: 'Bat', el: 'Νυχτερίδα' }, explanation: { en: 'Bats are the only mammals capable of sustained, powered flight; flying squirrels merely glide.', el: 'Οι νυχτερίδες είναι τα μόνα θηλαστικά ικανά για συνεχόμενη, ενεργή πτήση· οι ιπτάμενες σκίουροι απλώς αιωρούνται.' } },
  { id: 'ani-4', category: 'Animals', difficulty: 'easy', question: { en: 'What do bees collect from flowers?', el: 'Τι συλλέγουν οι μέλισσες από τα λουλούδια;' }, options: { en: ['Water', 'Nectar and pollen', 'Leaves', 'Seeds'], el: ['Νερό', 'Νέκταρ και γύρη', 'Φύλλα', 'Σπόροι'] }, correct: { en: 'Nectar and pollen', el: 'Νέκταρ και γύρη' }, explanation: { en: 'Bees collect nectar for honey and pollen for protein; they also pollinate flowers in the process.', el: 'Οι μέλισσες συλλέγουν νέκταρ για μέλι και γύρη για πρωτεΐνη· γίνονται και επικονιαστές κατά τη διαδικασία.' } },
  { id: 'ani-5', category: 'Animals', difficulty: 'medium', question: { en: 'Which animal has the longest migration?', el: 'Ποιο ζώο κάνει τη μεγαλύτερη μετακίνηση;' }, options: { en: ['Monarch butterfly', 'Arctic tern', 'Gray whale', 'Caribou'], el: ['Πεταλούδα μονάρχης', 'Αρκτική χελιδόνα', 'Γκρι φάλαινα', 'Καριμπού'] }, correct: { en: 'Arctic tern', el: 'Αρκτική χελιδόνα' }, explanation: { en: 'The Arctic tern migrates from pole to pole each year, traveling up to 71,000 km annually.', el: 'Η αρκτική χελιδόνα μετακινείται από πόλο σε πόλο κάθε χρόνο, ταξιδεύοντας έως 71.000 km ετησίως.' } },
  { id: 'ani-6', category: 'Animals', difficulty: 'hard', question: { en: 'What is countershading in animals?', el: 'Τι είναι η αντισκίαση στα ζώα;' }, options: { en: ['Camouflage with dark top and light belly', 'Poisonous skin', 'Bioluminescence', 'Striped fur'], el: ['Καμουφλάζ με σκούρο πάνω και ανοιχτό κάτω', 'Δηλητηριώδες δέρμα', 'Βιοφωταύγεια', 'Ραβδωτό τρίχωμα'] }, correct: { en: 'Camouflage with dark top and light belly', el: 'Καμουφλάζ με σκούρο πάνω και ανοιχτό κάτω' }, explanation: { en: 'Countershading reduces shadow visibility: dark tops blend with depths, light bellies match sky when viewed from below.', el: 'Η αντισκίαση μειώνει την ορατότητα της σκιάς: τα σκούρα πάνω ταιριάζουν με τα βάθη, τα ανοιχτά στομάχια ταιριάζουν με τον ουρανό όταν είσαι κάτω.' } },
  { id: 'ani-7', category: 'Animals', difficulty: 'easy', question: { en: 'What is a herbivore?', el: 'Τι είναι ένα φυτοφάγο;' }, options: { en: ['Meat eater', 'Plant eater', 'Both plant and meat eater', 'Scavenger'], el: ['Σαρκοφάγο', 'Φυτοφάγο', 'Τρωγό και φυτά και κρέας', 'Νεκροφάγο'] }, correct: { en: 'Plant eater', el: 'Φυτοφάγο' }, explanation: { en: 'Herbivores eat plants; carnivores eat meat; omnivores eat both.', el: 'Τα φυτοφάγα τρώνε φυτά· τα σαρκοφάγα τρώνε κρέας· τα παντοφάγα τρώνε και τα δύο.' } },
  { id: 'ani-8', category: 'Animals', difficulty: 'medium', question: { en: 'What is hibernation?', el: 'Τι είναι η χειμερία νάρκη;' }, options: { en: ['Migration', 'Deep sleep to conserve energy in winter', 'Summer rest', 'Daily sleep'], el: ['Μετακίνηση', 'Βαθύς ύπνος για εξοικονόμηση ενέργειας τον χειμώνα', 'Καλοκαιρινή ανάπαυση', 'Καθημερινός ύπνος'] }, correct: { en: 'Deep sleep to conserve energy in winter', el: 'Βαθύς ύπνος για εξοικονόμηση ενέργειας τον χειμώνα' }, explanation: { en: 'Hibernation is a state of minimal metabolic activity during cold months when food is scarce.', el: 'Η χειμερία νάρκη είναι κατάσταση ελάχιστης μεταβολικής δραστηριότητας κατά τους ψυχρούς μήνες όταν το φαγητό είναι σπάνιο.' } },
  { id: 'ani-9', category: 'Animals', difficulty: 'hard', question: { en: 'What is the largest living animal on Earth?', el: 'Ποιο είναι το μεγαλύτερο ζωντανό ζώο στη Γη;' }, options: { en: ['Elephant', 'Blue whale', 'Giraffe', 'Polar bear'], el: ['Ελέφαντας', 'Μπλε φάλαινα', 'Καμηλοπάρδαλη', 'Πολική αρκούδα'] }, correct: { en: 'Blue whale', el: 'Μπλε φάλαινα' }, explanation: { en: 'The blue whale is the largest animal ever known, reaching up to 30 m and 200 tons.', el: 'Η μπλε φάλαινα είναι το μεγαλύτερο ζώο που έχει γίνει ποτέ γνωστό, φτάνοντας έως 30 m και 200 τόνους.' } },
  { id: 'ani-10', category: 'Animals', difficulty: 'easy', question: { en: 'What class do frogs belong to?', el: 'Σε ποια τάξη ανήκουν οι βάτραχοι;' }, options: { en: ['Reptiles', 'Amphibians', 'Fish', 'Mammals'], el: ['Ερπετά', 'Αμφίβια', 'Ψάρια', 'Θηλαστικά'] }, correct: { en: 'Amphibians', el: 'Αμφίβια' }, explanation: { en: 'Frogs are amphibians—vertebrates that live both in water and on land, often with aquatic larval stage.', el: 'Οι βάτραχοι είναι αμφίβια—σπονδυλωτά που ζουν τόσο στο νερό όσο και στη στεριά, συχνά με υδρόβιο προνύμφειο στάδιο.' } },

  // === Ecosystems (5) ===
  { id: 'ecs-1', category: 'Ecosystems', difficulty: 'easy', question: { en: 'What is a wetland?', el: 'Τι είναι ένα υγρότοπο;' }, options: { en: ['A desert', 'Land saturated with water', 'A mountain', 'A glacier'], el: ['Έρημος', 'Γη κορεσμένη με νερό', 'Βουνό', 'Παγετώνας'] }, correct: { en: 'Land saturated with water', el: 'Γη κορεσμένη με νερό' }, explanation: { en: 'Wetlands include marshes, swamps, and bogs—ecosystems where water covers or saturates the soil.', el: 'Οι υγρότοποι περιλαμβάνουν βάλτους, έλη και τύρφες—οικοσυστήματα όπου το νερό καλύπτει ή κορεσμέει το έδαφος.' } },
  { id: 'ecs-2', category: 'Ecosystems', difficulty: 'medium', question: { en: 'What makes tropical rainforests so biodiverse?', el: 'Τι κάνει τις τροπικές ζούγκλες τόσο βιοποικίλες;' }, options: { en: ['Low temperature', 'Stable climate, abundant sunlight, complex structure', 'Few predators', 'Shallow soil'], el: ['Χαμηλή θερμοκρασία', 'Σταθερό κλίμα, άφθονο ηλιακό φως, πολύπλοκη δομή', 'Λίγοι θηρευτές', 'Ρηχό έδαφος'] }, correct: { en: 'Stable climate, abundant sunlight, complex structure', el: 'Σταθερό κλίμα, άφθονο ηλιακό φως, πολύπλοκη δομή' }, explanation: { en: 'Tropical rainforests have year-round warmth, high rainfall, and layered structure supporting countless niches.', el: 'Οι τροπικές ζούγκλες έχουν χειμερινή ζεστούρα, υψηλές βροχοπτώσεις και στρωματική δομή που υποστηρίζει αμέτρητες θέσεις.' } },
  { id: 'ecs-3', category: 'Ecosystems', difficulty: 'hard', question: { en: 'What is a biome?', el: 'Τι είναι ένα βιότοπο;' }, options: { en: ['A single species', 'A large community of plants and animals adapted to a climate', 'A river', 'A forest'], el: ['Ένα μόνο είδος', 'Μεγάλη κοινότητα φυτών και ζώων προσαρμοσμένη σε κλίμα', 'Ποτάμι', 'Δάσος'] }, correct: { en: 'A large community of plants and animals adapted to a climate', el: 'Μεγάλη κοινότητα φυτών και ζώων προσαρμοσμένη σε κλίμα' }, explanation: { en: 'Biomes are major ecological communities (tundra, taiga, grassland, etc.) defined by climate and geography.', el: 'Οι βιότοποι είναι μεγάλες οικολογικές κοινότητες (τούνδρα, τάιγκα, λιβάδια κ.λπ.) που καθορίζονται από το κλίμα και τη γεωγραφία.' } },
  { id: 'ecs-4', category: 'Ecosystems', difficulty: 'easy', question: { en: 'What is a food chain?', el: 'Τι είναι μια τροφική αλυσίδα;' }, options: { en: ['A fishing net', 'Sequence of who eats whom', 'A restaurant chain', 'A farming method'], el: ['Δίχτυ ψαρέματος', 'Ακολουθία ποιος τρώει ποιον', 'Αλυσίδα εστιατορίων', 'Μέθοδος καλλιέργειας'] }, correct: { en: 'Sequence of who eats whom', el: 'Ακολουθία ποιος τρώει ποιον' }, explanation: { en: 'A food chain shows the flow of energy from producers through consumers to decomposers.', el: 'Μια τροφική αλυσίδα δείχνει τη ροή της ενέργειας από τους παραγωγούς μέσω των καταναλωτών στους αποικοδομητές.' } },
  { id: 'ecs-5', category: 'Ecosystems', difficulty: 'medium', question: { en: 'What is the edge effect in ecology?', el: 'Τι είναι το φαινόμενο άκρης στην οικολογία;' }, options: { en: ['Ocean waves', 'Greater diversity at boundaries between habitats', 'Mountain peaks', 'Desert borders'], el: ['Ωκεάνια κύματα', 'Μεγαλύτερη ποικιλότητα στα όρια μεταξύ οικοτόπων', 'Κορυφές βουνών', 'Όρια ερήμων'] }, correct: { en: 'Greater diversity at boundaries between habitats', el: 'Μεγαλύτερη ποικιλότητα στα όρια μεταξύ οικοτόπων' }, explanation: { en: 'Edge effects occur where two habitats meet; species from both may coexist, increasing biodiversity.', el: 'Τα φαινόμενα άκρης συμβαίνουν όπου δύο οικότοποι συναντιούνται· είδη και από τα δύο μπορεί να συνυπάρχουν, αυξάνοντας τη βιοποικιλότητα.' } },

  // === Evolution (5) ===
  { id: 'evo-1', category: 'Evolution', difficulty: 'easy', question: { en: 'What is natural selection?', el: 'Τι είναι η φυσική επιλογή;' }, options: { en: ['Artificial selection', 'Survival of individuals best suited to environment', 'Random change', 'Extinction'], el: ['Τεχνητή επιλογή', 'Επιβίωση των πιο προσαρμοσμένων στο περιβάλλον ατόμων', 'Τυχαία αλλαγή', 'Εξαφάνιση'] }, correct: { en: 'Survival of individuals best suited to environment', el: 'Επιβίωση των πιο προσαρμοσμένων στο περιβάλλον ατόμων' }, explanation: { en: 'Natural selection favors traits that improve survival and reproduction; less fit individuals leave fewer offspring.', el: 'Η φυσική επιλογή ευνοεί χαρακτηριστικά που βελτιώνουν την επιβίωση και την αναπαραγωγή· τα λιγότερο προσαρμοσμένα άτομα αφήνουν λιγότερους απογόνους.' } },
  { id: 'evo-2', category: 'Evolution', difficulty: 'medium', question: { en: 'What are homologous structures?', el: 'Τι είναι οι ομόλογες δομές;' }, options: { en: ['Identical organs', 'Similar structures from common ancestry', 'Artificial implants', 'Fossil remains'], el: ['Ολοκληρωτικά ίδια όργανα', 'Παρόμοιες δομές από κοινή καταγωγή', 'Τεχνητές εμφυτεύσεις', 'Λείψανα απολιθωμάτων'] }, correct: { en: 'Similar structures from common ancestry', el: 'Παρόμοιες δομές από κοινή καταγωγή' }, explanation: { en: 'Homologous structures (e.g., bat wing, human arm) share ancestry but may have different functions.', el: 'Οι ομόλογες δομές (π.χ. φτερό νυχτερίδας, χέρι ανθρώπου) μοιράζονται καταγωγή αλλά μπορεί να έχουν διαφορετικές λειτουργίες.' } },
  { id: 'evo-3', category: 'Evolution', difficulty: 'hard', question: { en: 'What is genetic drift?', el: 'Τι είναι η γενετική παρέκκλιση;' }, options: { en: ['Natural selection', 'Random change in gene frequency in small populations', 'Mutation rate', 'Gene flow'], el: ['Φυσική επιλογή', 'Τυχαία αλλαγή στη συχνότητα γονιδίων σε μικρούς πληθυσμούς', 'Ρυθμός μετάλλαξης', 'Ροή γονιδίων'] }, correct: { en: 'Random change in gene frequency in small populations', el: 'Τυχαία αλλαγή στη συχνότητα γονιδίων σε μικρούς πληθυσμούς' }, explanation: { en: 'Genetic drift is random sampling effects on allele frequencies, especially strong in small populations.', el: 'Η γενετική παρέκκλιση είναι τυχαία αποτελέσματα δειγματοληψίας στις συχνότητες αλληλομόρφων, ιδιαίτερα ισχυρά σε μικρούς πληθυσμούς.' } },
  { id: 'evo-4', category: 'Evolution', difficulty: 'easy', question: { en: 'What did Charles Darwin propose?', el: 'Τι πρότεινε ο Charles Darwin;' }, options: { en: ['Lamarckism', 'Theory of evolution by natural selection', 'Fixity of species', 'Creationism'], el: ['Λαμαρκισμός', 'Θεωρία εξέλιξης μέσω φυσικής επιλογής', 'Σταθερότητα ειδών', 'Δημιουργισμός'] }, correct: { en: 'Theory of evolution by natural selection', el: 'Θεωρία εξέλιξης μέσω φυσικής επιλογής' }, explanation: { en: 'Darwin proposed that species evolve through natural selection acting on inherited variation.', el: 'Ο Darwin πρότεινε ότι τα είδη εξελίσσονται μέσω της φυσικής επιλογής που δρα σε κληρονομική παραλλαγή.' } },
  { id: 'evo-5', category: 'Evolution', difficulty: 'medium', question: { en: 'What is speciation?', el: 'Τι είναι η ειδογένεση;' }, options: { en: ['Extinction', 'Formation of new species', 'Hybridization', 'Migration'], el: ['Εξαφάνιση', 'Σχηματισμός νέων ειδών', 'Υβριδοποίηση', 'Μετανάστευση'] }, correct: { en: 'Formation of new species', el: 'Σχηματισμός νέων ειδών' }, explanation: { en: 'Speciation is the process by which new species arise, typically through reproductive isolation.', el: 'Η ειδογένεση είναι η διαδικασία με την οποία εμφανίζονται νέα είδη, συνήθως μέσω αναπαραγωγικής απομόνωσης.' } },

  // === Climate (5) ===
  { id: 'cli-1', category: 'Climate', difficulty: 'easy', question: { en: 'What is the greenhouse effect?', el: 'Τι είναι το φαινόμενο του θερμοκηπίου;' }, options: { en: ['Farming in greenhouses', 'Trapping of heat by atmospheric gases', 'Ozone depletion', 'Ocean warming'], el: ['Καλλιέργεια σε θερμοκήπια', 'Εγκλωβισμός θερμότητας από ατμοσφαιρικά αέρια', 'Εξασθένιση όζοντος', 'Θέρμανση ωκεανών'] }, correct: { en: 'Trapping of heat by atmospheric gases', el: 'Εγκλωβισμός θερμότητας από ατμοσφαιρικά αέρια' }, explanation: { en: 'Greenhouse gases (CO₂, methane, etc.) absorb and re-emit infrared radiation, warming the planet.', el: 'Τα αέρια του θερμοκηπίου (CO₂, μεθάνιο κ.λπ.) απορροφούν και ξαναεκπέμπουν υπέρυθρη ακτινοβολία, θερμαίνοντας τον πλανήτη.' } },
  { id: 'cli-2', category: 'Climate', difficulty: 'medium', question: { en: 'What is the main cause of recent global warming?', el: 'Ποια είναι η κύρια αιτία της πρόσφατης παγκόσμιας θέρμανσης;' }, options: { en: ['Solar cycles', 'Human emissions of greenhouse gases', 'Volcanic activity', 'Ocean currents'], el: ['Ηλιακοί κύκλοι', 'Ανθρώπινες εκπομπές αερίων θερμοκηπίου', 'Ηφαιστειακή δραστηριότητα', 'Ωκεάνια ρεύματα'] }, correct: { en: 'Human emissions of greenhouse gases', el: 'Ανθρώπινες εκπομπές αερίων θερμοκηπίου' }, explanation: { en: 'Scientific consensus attributes modern warming largely to fossil fuel burning and land-use change.', el: 'Η επιστημονική συναίνεση αποδίδει τη σύγχρονη θέρμανση σε μεγάλο βαθμό στην καύση ορυκτών καυσίμων και την αλλαγή χρήσης γης.' } },
  { id: 'cli-3', category: 'Climate', difficulty: 'hard', question: { en: 'What is albedo?', el: 'Τι είναι η αλμπέδο;' }, options: { en: ['Ocean current', 'Reflectivity of a surface', 'Wind pattern', 'Rainfall amount'], el: ['Ωκεάνιο ρεύμα', 'Ανακλαστικότητα επιφάνειας', 'Σχέδιο ανέμου', 'Ποσότητα βροχής'] }, correct: { en: 'Reflectivity of a surface', el: 'Ανακλαστικότητα επιφάνειας' }, explanation: { en: 'Albedo is the fraction of sunlight reflected; ice and snow have high albedo, dark oceans have low albedo.', el: 'Η αλμπέδο είναι το κλάσμα του ηλιακού φωτός που ανακλάται· ο πάγος και το χιόνι έχουν υψηλή αλμπέδο, οι σκοτεινοί ωκεανοί χαμηλή.' } },
  { id: 'cli-4', category: 'Climate', difficulty: 'easy', question: { en: 'Which gas is the primary greenhouse gas from human activity?', el: 'Ποιο αέριο είναι το κύριο αέριο θερμοκηπίου από την ανθρώπινη δραστηριότητα;' }, options: { en: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'], el: ['Οξυγόνο', 'Άζωτο', 'Διοξείδιο του άνθρακα', 'Αργό'] }, correct: { en: 'Carbon dioxide', el: 'Διοξείδιο του άνθρακα' }, explanation: { en: 'CO₂ from burning fossil fuels and deforestation is the largest anthropogenic greenhouse gas contributor.', el: 'Το CO₂ από την καύση ορυκτών καυσίμων και την αποψίλωση δασών είναι ο μεγαλύτερος ανθρωπογενής συνεισφέρων αερίων θερμοκηπίου.' } },
  { id: 'cli-5', category: 'Climate', difficulty: 'medium', question: { en: 'What is permafrost?', el: 'Τι είναι ο μόνιμα παγετός;' }, options: { en: ['Seasonal ice', 'Ground that remains frozen for two or more years', 'Glacier', 'Sea ice'], el: ['Εποχικός πάγος', 'Έδαφος που παραμένει παγωμένο για δύο ή περισσότερα χρόνια', 'Παγετώνας', 'Θαλασσινός πάγος'] }, correct: { en: 'Ground that remains frozen for two or more years', el: 'Έδαφος που παραμένει παγωμένο για δύο ή περισσότερα χρόνια' }, explanation: { en: 'Permafrost holds large amounts of organic carbon; thawing can release methane and CO₂, amplifying warming.', el: 'Ο μόνιμος παγετός περιέχει μεγάλες ποσότητες οργανικού άνθρακα· η ξεπαγώνωση μπορεί να απελευθερώσει μεθάνιο και CO₂, ενισχύοντας τη θέρμανση.' } }
];
