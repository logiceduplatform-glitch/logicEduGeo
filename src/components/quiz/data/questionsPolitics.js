export const questionsPolitics = [
  // === Geopolitics (5) ===
  {
    id: 'geopol-1',
    category: 'Geopolitics',
    difficulty: 'easy',
    question: { en: 'How many permanent members does the UN Security Council have?', el: 'Πόσα μόνιμα μέλη έχει το Συμβούλιο Ασφαλείας του ΟΗΕ;' },
    options: [3, 5, 7, 10],
    correct: 5,
    explanation: { en: 'The UN Charter of 1945 established the Security Council with 5 permanent members (USA, Russia, China, UK, France), each with veto power over substantive resolutions.', el: 'Το Χάρτη των Ηνωμένων Εθνών του 1945 καθόρισε το Συμβούλιο Ασφαλείας με 5 μόνιμα μέλη (ΗΠΑ, Ρωσία, Κίνα, ΗΒ, Γαλλία), καθένα με δικαίωμα βέτο σε ουσιώδη ψηφίσματα.' }
  },
  {
    id: 'geopol-2',
    category: 'Geopolitics',
    difficulty: 'medium',
    question: { en: 'Where is the International Court of Justice located?', el: 'Πού βρίσκεται το Διεθνές Δικαστήριο;' },
    options: { en: ['Geneva', 'New York', 'The Hague', 'Brussels'], el: ['Γενεύη', 'Νέα Υόρκη', 'Χάγη', 'Βρυξέλλες'] },
    correct: { en: 'The Hague', el: 'Χάγη' },
    explanation: { en: 'The ICJ is the principal judicial organ of the UN and has been based in The Hague, Netherlands, since its establishment in 1945.', el: 'Το Διεθνές Δικαστήριο είναι το κύριο δικαστικό όργανο του ΟΗΕ και εδρεύει στη Χάγη της Ολλανδίας από την ίδρυσή του το 1945.' }
  },
  {
    id: 'geopol-3',
    category: 'Geopolitics',
    difficulty: 'hard',
    question: { en: 'What does NATO stand for?', el: 'Τι σημαίνει NATO;' },
    options: {
      en: ['North Atlantic Treaty Organization', 'National Alliance for Territorial Operations', 'Northern Armed Tactical Order', 'New Allied Treaty Organization'],
      el: ['Οργανισμός Βορειοατλαντικού Συμφώνου', 'Εθνική Συμμαχία Εδαφικών Επιχειρήσεων', 'Βόρεια Ένοπλη Τακτική Διαταγή', 'Νέα Συμμαχική Οργάνωση Συνθήκης']
    },
    correct: { en: 'North Atlantic Treaty Organization', el: 'Οργανισμός Βορειοατλαντικού Συμφώνου' },
    explanation: { en: 'NATO was founded in 1949 by the North Atlantic Treaty as a collective defense alliance among North American and European nations.', el: 'Το ΝΑΤΟ ιδρύθηκε το 1949 με τη Συνθήκη του Βορείου Ατλαντικού ως συμμαχία συλλογικής άμυνας μεταξύ Βορειοαμερικανικών και Ευρωπαϊκών κρατών.' }
  },
  {
    id: 'geopol-4',
    category: 'Geopolitics',
    difficulty: 'easy',
    question: { en: 'Which organization has its headquarters in Geneva?', el: 'Ποιος οργανισμός έχει την έδρα του στη Γενεύη;' },
    options: { en: ['EU', 'WHO', 'NATO', 'OPEC'], el: ['ΕΕ', 'ΠΟΥ', 'ΝΑΤΟ', 'ΟΠΕΚ'] },
    correct: { en: 'WHO', el: 'ΠΟΥ' },
    explanation: { en: 'The World Health Organization (WHO), a UN specialized agency for international public health, has had its headquarters in Geneva since 1948.', el: 'Ο Παγκόσμιος Οργανισμός Υγείας (ΠΟΥ), εξειδικευμένος οργανισμός του ΟΗΕ για τη διεθνή δημόσια υγεία, έχει την έδρα του στη Γενεύη από το 1948.' }
  },
  {
    id: 'geopol-5',
    category: 'Geopolitics',
    difficulty: 'medium',
    question: { en: 'What is the G7?', el: 'Τι είναι η G7;' },
    options: {
      en: ['A military alliance', 'A group of 7 advanced economies', 'A space program', 'A trade agreement'],
      el: ['Στρατιωτική συμμαχία', 'Ομάδα 7 προηγμένων οικονομιών', 'Διαστημικό πρόγραμμα', 'Εμπορική συμφωνία']
    },
    correct: { en: 'A group of 7 advanced economies', el: 'Ομάδα 7 προηγμένων οικονομιών' },
    explanation: { en: 'The G7 is an informal forum of seven major advanced economies (USA, Japan, Germany, UK, France, Italy, Canada) that coordinate on global economic policy.', el: 'Η G7 είναι ανεπίσημη ομάδα επτά μεγάλων προηγμένων οικονομιών (ΗΠΑ, Ιαπωνία, Γερμανία, ΗΒ, Γαλλία, Ιταλία, Καναδάς) που συντονίζουν την παγκόσμια οικονομική πολιτική.' }
  },

  // === EU (5) ===
  {
    id: 'eu-1',
    category: 'EU',
    difficulty: 'easy',
    question: { en: 'How many member states does the EU currently have?', el: 'Πόσα κράτη-μέλη έχει σήμερα η ΕΕ;' },
    options: [25, 27, 28, 30],
    correct: 27,
    explanation: { en: 'After the UK left in 2020 (Brexit), the EU has 27 member states; it previously had 28 when the UK was a member.', el: 'Μετά την αποχώρηση του Ηνωμένου Βασιλείου το 2020 (Brexit), η ΕΕ έχει 27 κράτη-μέλη· προηγουμένως είχε 28 όταν το ΗΒ ήταν μέλος.' }
  },
  {
    id: 'eu-2',
    category: 'EU',
    difficulty: 'medium',
    question: { en: 'In which year was the Euro currency introduced?', el: 'Ποια χρονιά εισήχθη το ευρώ;' },
    options: [1995, 1999, 2002, 2004],
    correct: 2002,
    explanation: { en: 'The euro was introduced as physical cash and coins on 1 January 2002; it had existed as electronic currency in financial markets since 1999.', el: 'Το ευρώ εισήχθη ως χαρτονομίσματα και κέρματα την 1η Ιανουαρίου 2002· υπήρχε ως ηλεκτρονικό νόμισμα στις χρηματιστηριακές αγορές από το 1999.' }
  },
  {
    id: 'eu-3',
    category: 'EU',
    difficulty: 'hard',
    question: { en: 'Which treaty established the European Economic Community in 1957?', el: 'Ποια συνθήκη ίδρυσε την Ευρωπαϊκή Οικονομική Κοινότητα το 1957;' },
    options: {
      en: ['Treaty of Maastricht', 'Treaty of Rome', 'Treaty of Lisbon', 'Treaty of Paris'],
      el: ['Συνθήκη Μάαστριχτ', 'Συνθήκη Ρώμης', 'Συνθήκη Λισαβόνας', 'Συνθήκη Παρισίων']
    },
    correct: { en: 'Treaty of Rome', el: 'Συνθήκη Ρώμης' },
    explanation: { en: 'Signed in Rome in 1957, the Treaty of Rome established the European Economic Community (EEC), a key predecessor of the modern European Union.', el: 'Η Συνθήκη Ρώμης, που υπογράφηκε στη Ρώμη το 1957, ίδρυσε την Ευρωπαϊκή Οικονομική Κοινότητα (ΕΟΚ), προκάτοχο της σημερινής Ευρωπαϊκής Ένωσης.' }
  },
  {
    id: 'eu-4',
    category: 'EU',
    difficulty: 'easy',
    question: { en: 'Where is the European Parliament located?', el: 'Πού βρίσκεται το Ευρωπαϊκό Κοινοβούλιο;' },
    options: { en: ['Brussels', 'Strasbourg', 'Luxembourg', 'Both Brussels and Strasbourg'], el: ['Βρυξέλλες', 'Στρασβούργο', 'Λουξεμβούργο', 'Βρυξέλλες και Στρασβούργο'] },
    correct: { en: 'Both Brussels and Strasbourg', el: 'Βρυξέλλες και Στρασβούργο' },
    explanation: { en: 'The European Parliament holds plenary sessions in Strasbourg, France, and committee meetings in Brussels, Belgium, by treaty arrangement.', el: 'Το Ευρωπαϊκό Κοινοβούλιο πραγματοποιεί τις ολομέλειές του στο Στρασβούργο της Γαλλίας και τις συνεδριάσεις των επιτροπών του στις Βρυξέλλες του Βελγίου, σύμφωνα με τη συνθήκη.' }
  },
  {
    id: 'eu-5',
    category: 'EU',
    difficulty: 'medium',
    question: { en: 'When did Greece join the European Community?', el: 'Πότε εντάχθηκε η Ελλάδα στην Ευρωπαϊκή Κοινότητα;' },
    options: [1975, 1981, 1986, 1992],
    correct: 1981,
    explanation: { en: 'Greece became the tenth member of the European Economic Community on 1 January 1981, after the accession treaty was signed in 1979.', el: 'Η Ελλάδα εντάχθηκε ως δέκατο μέλος στην Ευρωπαϊκή Οικονομική Κοινότητα την 1η Ιανουαρίου 1981, αφού η συνθήκη προσχώρησης υπεγράφη το 1979.' }
  },

  // === Economics (5) ===
  {
    id: 'econ-1',
    category: 'Economics',
    difficulty: 'easy',
    question: { en: 'What does GDP stand for?', el: 'Τι σημαίνει ΑΕΠ (GDP);' },
    options: {
      en: ['General Domestic Production', 'Gross Domestic Product', 'Global Development Program', 'Gross Demand Percentage'],
      el: ['Γενική Εγχώρια Παραγωγή', 'Ακαθάριστο Εγχώριο Προϊόν', 'Παγκόσμιο Πρόγραμμα Ανάπτυξης', 'Ακαθάριστο Ποσοστό Ζήτησης']
    },
    correct: { en: 'Gross Domestic Product', el: 'Ακαθάριστο Εγχώριο Προϊόν' },
    explanation: { en: 'GDP measures the total monetary value of all goods and services produced within a country\'s borders in a given period, indicating economic size and output.', el: 'Το ΑΕΠ μετρά τη συνολική νομισματική αξία όλων των αγαθών και υπηρεσιών που παράγονται εντός των συνόρων μιας χώρας σε δεδομένη περίοδο, υποδεικνύοντας το οικονομικό μέγεθος και την παραγωγή.' }
  },
  {
    id: 'econ-2',
    category: 'Economics',
    difficulty: 'medium',
    question: { en: 'What is inflation?', el: 'Τι είναι ο πληθωρισμός;' },
    options: {
      en: ['A decrease in unemployment', 'A general increase in prices over time', 'A drop in interest rates', 'An increase in exports'],
      el: ['Μείωση ανεργίας', 'Γενική αύξηση τιμών στο χρόνο', 'Πτώση επιτοκίων', 'Αύξηση εξαγωγών']
    },
    correct: { en: 'A general increase in prices over time', el: 'Γενική αύξηση τιμών στο χρόνο' },
    explanation: { en: 'Inflation is the rate at which the general level of prices for goods and services rises over time, which reduces the purchasing power of money.', el: 'Ο πληθωρισμός είναι ο ρυθμός με τον οποίο αυξάνεται το γενικό επίπεδο τιμών των αγαθών και υπηρεσιών με την πάροδο του χρόνου, μειώνοντας τη αγοραστική δύναμη του χρήματος.' }
  },
  {
    id: 'econ-3',
    category: 'Economics',
    difficulty: 'hard',
    question: { en: 'What economic concept describes the cost of the next best alternative?', el: 'Ποια οικονομική έννοια περιγράφει το κόστος της επόμενης καλύτερης εναλλακτικής;' },
    options: {
      en: ['Marginal cost', 'Opportunity cost', 'Fixed cost', 'Sunk cost'],
      el: ['Οριακό κόστος', 'Κόστος ευκαιρίας', 'Σταθερό κόστος', 'Βυθισμένο κόστος']
    },
    correct: { en: 'Opportunity cost', el: 'Κόστος ευκαιρίας' },
    explanation: { en: 'Opportunity cost is the value of the next best alternative that must be forgone when making a choice; it reflects the trade-offs in resource allocation.', el: 'Το κόστος ευκαιρίας είναι η αξία της επόμενης καλύτερης εναλλακτικής που παραλείπεται όταν γίνεται μια επιλογή· αντικατοπτρίζει τις ανταλλαγές στη διαχείριση των πόρων.' }
  },
  {
    id: 'econ-4',
    category: 'Economics',
    difficulty: 'easy',
    question: { en: 'What is a monopoly?', el: 'Τι είναι το μονοπώλιο;' },
    options: {
      en: ['A market with many sellers', 'A market with one dominant seller', 'A government subsidy', 'A type of tax'],
      el: ['Αγορά με πολλούς πωλητές', 'Αγορά με έναν κυρίαρχο πωλητή', 'Κρατική επιδότηση', 'Τύπος φόρου']
    },
    correct: { en: 'A market with one dominant seller', el: 'Αγορά με έναν κυρίαρχο πωλητή' },
    explanation: { en: 'A monopoly exists when a single firm is the sole seller of a product with no close substitutes, giving it significant market power over price.', el: 'Το μονοπώλιο υπάρχει όταν μία μόνο επιχείρηση είναι ο μοναδικός πωλητής ενός προϊόντος χωρίς κοντινούς υποκαταστάτες, έχοντας σημαντική αγοραία δύναμη ως προς τις τιμές.' }
  },
  {
    id: 'econ-5',
    category: 'Economics',
    difficulty: 'medium',
    question: { en: 'Which institution controls the monetary policy of the Eurozone?', el: 'Ποιο ίδρυμα ελέγχει τη νομισματική πολιτική της Ευρωζώνης;' },
    options: {
      en: ['IMF', 'European Central Bank', 'World Bank', 'Federal Reserve'],
      el: ['ΔΝΤ', 'Ευρωπαϊκή Κεντρική Τράπεζα', 'Παγκόσμια Τράπεζα', 'Ομοσπονδιακή Τράπεζα']
    },
    correct: { en: 'European Central Bank', el: 'Ευρωπαϊκή Κεντρική Τράπεζα' },
    explanation: { en: 'The European Central Bank (ECB), established in 1998, formulates and implements monetary policy for the Eurozone, including interest rates and money supply.', el: 'Η Ευρωπαϊκή Κεντρική Τράπεζα (ΕΚΤ), που ιδρύθηκε το 1998, καθορίζει και εφαρμόζει τη νομισματική πολιτική της Ευρωζώνης, συμπεριλαμβανομένων των επιτοκίων και της προσφοράς χρήματος.' }
  },

  // === Democracy & Governance (5) ===
  {
    id: 'pol-16',
    category: 'Democracy',
    difficulty: 'easy',
    question: { en: 'What is the separation of powers?', el: 'Τι είναι η διάκριση εξουσιών;' },
    options: {
      en: ['Division of military forces', 'Division of government into branches', 'Division of territory', 'Division of economic sectors'],
      el: ['Διαχωρισμός στρατιωτικών δυνάμεων', 'Διαχωρισμός κυβέρνησης σε κλάδους', 'Διαχωρισμός εδαφών', 'Διαχωρισμός οικονομικών τομέων']
    },
    correct: { en: 'Division of government into branches', el: 'Διαχωρισμός κυβέρνησης σε κλάδους' },
    explanation: { en: 'The separation of powers divides government into legislative, executive, and judicial branches to prevent concentration of authority, as theorized by Montesquieu.', el: 'Η διάκριση εξουσιών χωρίζει την κυβέρνηση σε νομοθετική, εκτελεστική και δικαστική εξουσία για να αποφευχθεί η συγκέντρωση εξουσίας, όπως θεωρητικοποίησε ο Μοντεσκιέ.' }
  },
  {
    id: 'pol-17',
    category: 'Democracy',
    difficulty: 'medium',
    question: { en: 'In which country did women first gain the right to vote nationally?', el: 'Σε ποια χώρα οι γυναίκες απέκτησαν πρώτες δικαίωμα ψήφου σε εθνικό επίπεδο;' },
    options: { en: ['United Kingdom', 'New Zealand', 'United States', 'France'], el: ['Ηνωμένο Βασίλειο', 'Νέα Ζηλανδία', 'Ηνωμένες Πολιτείες', 'Γαλλία'] },
    correct: { en: 'New Zealand', el: 'Νέα Ζηλανδία' },
    explanation: { en: 'New Zealand became the first self-governing country to grant all women the right to vote in 1893.', el: 'Η Νέα Ζηλανδία έγινε η πρώτη αυτοδιοικούμενη χώρα που παραχώρησε σε όλες τις γυναίκες δικαίωμα ψήφου το 1893.' }
  },
  {
    id: 'pol-18',
    category: 'Democracy',
    difficulty: 'hard',
    question: { en: 'What legal principle protects individuals from unlawful detention?', el: 'Ποια νομική αρχή προστατεύει τα άτομα από παράνομη κράτηση;' },
    options: {
      en: ['Habeas corpus', 'Res judicata', 'Stare decisis', 'Prima facie'],
      el: ['Habeas corpus', 'Res judicata', 'Stare decisis', 'Prima facie']
    },
    correct: { en: 'Habeas corpus', el: 'Habeas corpus' },
    explanation: { en: 'Habeas corpus (Latin for "you shall have the body") requires authorities to bring a detained person before a court to justify their imprisonment.', el: 'Το Habeas corpus (λατινικά για «θα έχεις το σώμα») απαιτεί από τις αρχές να φέρουν τον κρατούμενο ενώπιον δικαστηρίου για να δικαιολογήσουν τη φυλάκισή του.' }
  },
  {
    id: 'pol-19',
    category: 'Democracy',
    difficulty: 'easy',
    question: { en: 'What type of government is ruled by a single person with absolute power?', el: 'Ποιο είδος κυβέρνησης κυβερνάται από ένα πρόσωπο με απόλυτη εξουσία;' },
    options: { en: ['Democracy', 'Oligarchy', 'Dictatorship', 'Republic'], el: ['Δημοκρατία', 'Ολιγαρχία', 'Δικτατορία', 'Δημοκρατία (πολιτεία)'] },
    correct: { en: 'Dictatorship', el: 'Δικτατορία' },
    explanation: { en: 'A dictatorship concentrates power in one ruler who governs without effective constitutional limits or democratic accountability.', el: 'Η δικτατορία συγκεντρώνει εξουσία σε έναν ηγέτη που κυβερνά χωρίς ουσιαστικούς συνταγματικούς περιορισμούς ή δημοκρατικό έλεγχο.' }
  },
  {
    id: 'pol-20',
    category: 'Democracy',
    difficulty: 'medium',
    question: { en: 'What does "referendum" mean?', el: 'Τι σημαίνει «δημοψήφισμα»;' },
    options: {
      en: ['A court decision', 'A direct vote by citizens on a specific issue', 'A parliamentary debate', 'An executive order'],
      el: ['Δικαστική απόφαση', 'Άμεση ψηφοφορία πολιτών σε συγκεκριμένο ζήτημα', 'Κοινοβουλευτική συζήτηση', 'Εκτελεστική εντολή']
    },
    correct: { en: 'A direct vote by citizens on a specific issue', el: 'Άμεση ψηφοφορία πολιτών σε συγκεκριμένο ζήτημα' },
    explanation: { en: 'A referendum allows citizens to vote directly on a political question or law, bypassing representatives for that specific decision.', el: 'Το δημοψήφισμα επιτρέπει στους πολίτες να ψηφίσουν απευθείας σε ένα πολιτικό ζήτημα ή νόμο, παρακάμπτοντας τους αντιπροσώπους για τη συγκεκριμένη απόφαση.' }
  },

  // === International Law & Human Rights (5) ===
  {
    id: 'pol-21',
    category: 'InternationalLaw',
    difficulty: 'medium',
    question: { en: 'Where is the International Criminal Court (ICC) located?', el: 'Πού εδρεύει το Διεθνές Ποινικό Δικαστήριο (ICC);' },
    options: { en: ['Geneva', 'The Hague', 'New York', 'Vienna'], el: ['Γενεύη', 'Χάγη', 'Νέα Υόρκη', 'Βιέννη'] },
    correct: { en: 'The Hague', el: 'Χάγη' },
    explanation: { en: 'The ICC, established by the Rome Statute in 2002, is headquartered in The Hague, Netherlands, and prosecutes individuals for genocide, war crimes, and crimes against humanity.', el: 'Το ICC, που ιδρύθηκε με το Καταστατικό της Ρώμης το 2002, εδρεύει στη Χάγη της Ολλανδίας και διώκει άτομα για γενοκτονία, εγκλήματα πολέμου και εγκλήματα κατά της ανθρωπότητας.' }
  },
  {
    id: 'pol-22',
    category: 'HumanRights',
    difficulty: 'easy',
    question: { en: 'When was the Universal Declaration of Human Rights adopted?', el: 'Πότε υιοθετήθηκε η Οικουμενική Διακήρυξη Ανθρωπίνων Δικαιωμάτων;' },
    options: [1945, 1948, 1950, 1955],
    correct: 1948,
    explanation: { en: 'The UDHR was adopted by the UN General Assembly on December 10, 1948 in Paris, establishing fundamental human rights to be universally protected.', el: 'Η Οικουμενική Διακήρυξη υιοθετήθηκε από τη Γενική Συνέλευση του ΟΗΕ στις 10 Δεκεμβρίου 1948 στο Παρίσι, καθορίζοντας θεμελιώδη ανθρώπινα δικαιώματα που πρέπει να προστατεύονται παγκοσμίως.' }
  },
  {
    id: 'pol-23',
    category: 'HumanRights',
    difficulty: 'hard',
    question: { en: 'What do the Geneva Conventions primarily regulate?', el: 'Τι ρυθμίζουν κυρίως οι Συμβάσεις της Γενεύης;' },
    options: {
      en: ['International trade', 'Treatment of people in war', 'Environmental protection', 'Space exploration'],
      el: ['Διεθνές εμπόριο', 'Μεταχείριση ατόμων σε πόλεμο', 'Προστασία περιβάλλοντος', 'Εξερεύνηση διαστήματος']
    },
    correct: { en: 'Treatment of people in war', el: 'Μεταχείριση ατόμων σε πόλεμο' },
    explanation: { en: 'The four Geneva Conventions (1949) set international standards for the humanitarian treatment of war victims: wounded, sick, shipwrecked, prisoners of war, and civilians.', el: 'Οι τέσσερις Συμβάσεις της Γενεύης (1949) καθορίζουν διεθνή πρότυπα για την ανθρωπιστική μεταχείριση θυμάτων πολέμου: τραυματίες, ασθενείς, ναυαγοί, αιχμάλωτοι πολέμου και πολίτες.' }
  },
  {
    id: 'pol-24',
    category: 'InternationalLaw',
    difficulty: 'easy',
    question: { en: 'What is the main purpose of the IMF?', el: 'Ποιος είναι ο κύριος σκοπός του ΔΝΤ;' },
    options: {
      en: ['Military defense', 'Promoting global monetary cooperation', 'Space research', 'Environmental policy'],
      el: ['Στρατιωτική άμυνα', 'Προώθηση παγκόσμιας νομισματικής συνεργασίας', 'Διαστημική έρευνα', 'Περιβαλλοντική πολιτική']
    },
    correct: { en: 'Promoting global monetary cooperation', el: 'Προώθηση παγκόσμιας νομισματικής συνεργασίας' },
    explanation: { en: 'The IMF was established in 1944 to promote international monetary cooperation, exchange rate stability, and orderly financial relations among nations.', el: 'Το ΔΝΤ ιδρύθηκε το 1944 για να προωθήσει τη διεθνή νομισματική συνεργασία, τη σταθερότητα συναλλαγματικών ισοτιμιών και τις εύρυθμες χρηματοοικονομικές σχέσεις μεταξύ κρατών.' }
  },
  {
    id: 'pol-25',
    category: 'HumanRights',
    difficulty: 'medium',
    question: { en: 'Which treaty established the European Court of Human Rights?', el: 'Ποια συνθήκη ίδρυσε το Ευρωπαϊκό Δικαστήριο Ανθρωπίνων Δικαιωμάτων;' },
    options: {
      en: ['Treaty of Rome', 'European Convention on Human Rights', 'Lisbon Treaty', 'Helsinki Accords'],
      el: ['Συνθήκη Ρώμης', 'Ευρωπαϊκή Σύμβαση Ανθρωπίνων Δικαιωμάτων', 'Συνθήκη Λισαβόνας', 'Συμφωνίες Ελσίνκι']
    },
    correct: { en: 'European Convention on Human Rights', el: 'Ευρωπαϊκή Σύμβαση Ανθρωπίνων Δικαιωμάτων' },
    explanation: { en: 'The ECHR (1950) established the European Court of Human Rights in Strasbourg to enforce the rights and freedoms guaranteed by the Convention.', el: 'Η ΕΣΔΑ (1950) ίδρυσε το Ευρωπαϊκό Δικαστήριο Ανθρωπίνων Δικαιωμάτων στο Στρασβούργο για να επιβάλλει τα δικαιώματα και ελευθερίες που εγγυάται η Σύμβαση.' }
  },

  // === Trade & Global Institutions (5) ===
  {
    id: 'pol-26',
    category: 'Trade',
    difficulty: 'easy',
    question: { en: 'What does the WTO regulate?', el: 'Τι ρυθμίζει ο ΠΟΕ (WTO);' },
    options: {
      en: ['Military alliances', 'International trade rules', 'Climate change', 'Immigration policies'],
      el: ['Στρατιωτικές συμμαχίες', 'Κανόνες διεθνούς εμπορίου', 'Κλιματική αλλαγή', 'Μεταναστευτικές πολιτικές']
    },
    correct: { en: 'International trade rules', el: 'Κανόνες διεθνούς εμπορίου' },
    explanation: { en: 'The World Trade Organization (WTO), established in 1995, sets the rules for global trade, mediates disputes, and promotes trade liberalization.', el: 'Ο Παγκόσμιος Οργανισμός Εμπορίου (ΠΟΕ), που ιδρύθηκε το 1995, θέτει τους κανόνες για το παγκόσμιο εμπόριο, μεσολαβεί σε διαφορές και προωθεί τη φιλελευθεροποίηση του εμπορίου.' }
  },
  {
    id: 'pol-27',
    category: 'Trade',
    difficulty: 'medium',
    question: { en: 'What is a tariff?', el: 'Τι είναι ο δασμός;' },
    options: {
      en: ['A tax on imports', 'A trade agreement', 'A currency exchange rate', 'A diplomatic sanction'],
      el: ['Φόρος στις εισαγωγές', 'Εμπορική συμφωνία', 'Συναλλαγματική ισοτιμία', 'Διπλωματική κύρωση']
    },
    correct: { en: 'A tax on imports', el: 'Φόρος στις εισαγωγές' },
    explanation: { en: 'A tariff is a tax imposed by a government on goods imported from other countries, typically to protect domestic industries or generate revenue.', el: 'Ο δασμός είναι φόρος που επιβάλλει μια κυβέρνηση σε αγαθά που εισάγονται από άλλες χώρες, συνήθως για να προστατεύσει τις εγχώριες βιομηχανίες ή να δημιουργήσει έσοδα.' }
  },
  {
    id: 'pol-28',
    category: 'Geopolitics',
    difficulty: 'hard',
    question: { en: 'What is the BRICS group?', el: 'Τι είναι η ομάδα BRICS;' },
    options: {
      en: ['A European defense alliance', 'A group of major emerging economies', 'A UN peacekeeping force', 'A humanitarian aid organization'],
      el: ['Ευρωπαϊκή αμυντική συμμαχία', 'Ομάδα μεγάλων αναδυόμενων οικονομιών', 'Ειρηνευτική δύναμη ΟΗΕ', 'Οργανισμός ανθρωπιστικής βοήθειας']
    },
    correct: { en: 'A group of major emerging economies', el: 'Ομάδα μεγάλων αναδυόμενων οικονομιών' },
    explanation: { en: 'BRICS originally included Brazil, Russia, India, China, and South Africa as major emerging economies; it has since expanded to include additional members.', el: 'Η BRICS αρχικά περιελάμβανε Βραζιλία, Ρωσία, Ινδία, Κίνα και Νότια Αφρική ως μεγάλες αναδυόμενες οικονομίες· έχει από τότε επεκταθεί με επιπλέον μέλη.' }
  },
  {
    id: 'pol-29',
    category: 'Geopolitics',
    difficulty: 'easy',
    question: { en: 'Where is the United Nations headquarters located?', el: 'Πού βρίσκεται η έδρα των Ηνωμένων Εθνών;' },
    options: { en: ['Geneva', 'New York', 'London', 'Paris'], el: ['Γενεύη', 'Νέα Υόρκη', 'Λονδίνο', 'Παρίσι'] },
    correct: { en: 'New York', el: 'Νέα Υόρκη' },
    explanation: { en: 'The UN headquarters has been located in New York City since its completion in 1952, situated on international territory along the East River in Manhattan.', el: 'Η έδρα του ΟΗΕ βρίσκεται στη Νέα Υόρκη από την ολοκλήρωσή της το 1952, σε διεθνές έδαφος κατά μήκος του ποταμού East στο Μανχάταν.' }
  },
  {
    id: 'pol-30',
    category: 'Geopolitics',
    difficulty: 'hard',
    question: { en: 'What is the "Responsibility to Protect" (R2P) doctrine?', el: 'Τι είναι το δόγμα «Ευθύνη Προστασίας» (R2P);' },
    options: {
      en: ['A trade policy', 'International duty to intervene in humanitarian crises', 'A military alliance clause', 'Environmental protection treaty'],
      el: ['Εμπορική πολιτική', 'Διεθνής υποχρέωση παρέμβασης σε ανθρωπιστικές κρίσεις', 'Ρήτρα στρατιωτικής συμμαχίας', 'Συνθήκη περιβαλλοντικής προστασίας']
    },
    correct: { en: 'International duty to intervene in humanitarian crises', el: 'Διεθνής υποχρέωση παρέμβασης σε ανθρωπιστικές κρίσεις' },
    explanation: { en: 'R2P, endorsed at the 2005 UN World Summit, holds that the international community has a responsibility to protect populations from genocide, war crimes, ethnic cleansing, and crimes against humanity when their own state fails.', el: 'Η R2P, που εγκρίθηκε στην Παγκόσμια Σύνοδο Κορυφής του ΟΗΕ του 2005, θεωρεί ότι η διεθνής κοινότητα έχει ευθύνη να προστατεύει πληθυσμούς από γενοκτονία, εγκλήματα πολέμου, εθνοκάθαρση και εγκλήματα κατά της ανθρωπότητας όταν το δικό τους κράτος αποτυγχάνει.' }
  },

  // === NEW: Geopolitics (12) ===
  {
    id: 'geopol-6',
    category: 'Geopolitics',
    difficulty: 'easy',
    question: { en: 'Which country has veto power in the UN Security Council?', el: 'Ποια χώρα έχει δικαίωμα βέτο στο Συμβούλιο Ασφαλείας του ΟΗΕ;' },
    options: { en: ['Germany', 'Japan', 'China', 'Canada'], el: ['Γερμανία', 'Ιαπωνία', 'Κίνα', 'Καναδάς'] },
    correct: { en: 'China', el: 'Κίνα' },
    explanation: { en: 'China is one of the five permanent members (P5) of the UN Security Council, along with the USA, Russia, UK, and France, each with veto power.', el: 'Η Κίνα είναι ένα από τα πέντε μόνιμα μέλη (P5) του Συμβουλίου Ασφαλείας του ΟΗΕ, μαζί με τις ΗΠΑ, τη Ρωσία, το ΗΒ και τη Γαλλία, καθένα με δικαίωμα βέτο.' }
  },
  {
    id: 'geopol-7',
    category: 'Geopolitics',
    difficulty: 'medium',
    question: { en: 'In which year was the United Nations founded?', el: 'Ποια χρονιά ιδρύθηκε ο Οργανισμός Ηνωμένων Εθνών;' },
    options: { en: ['1943', '1945', '1948', '1950'], el: ['1943', '1945', '1948', '1950'] },
    correct: { en: '1945', el: '1945' },
    explanation: { en: 'The UN was founded on 24 October 1945 after the UN Charter was ratified following World War II.', el: 'Ο ΟΗΕ ιδρύθηκε στις 24 Οκτωβρίου 1945 αφού ο Χάρτης των ΗΕ επικυρώθηκε μετά τον Β\' Παγκόσμιο Πόλεμο.' }
  },
  {
    id: 'geopol-8',
    category: 'Geopolitics',
    difficulty: 'hard',
    question: { en: 'What is the principle of non-intervention in international law?', el: 'Τι είναι η αρχή μη παρεμβατικότητας στο διεθνές δίκαιο;' },
    options: {
      en: ['States may intervene anywhere', 'States must not interfere in others\' internal affairs', 'UN can override state sovereignty', 'Military alliances are mandatory'],
      el: ['Τα κράτη μπορούν να παρέμβουν παντού', 'Τα κράτη δεν πρέπει να παρεμβαίνουν στα εσωτερικά άλλων', 'Ο ΟΗΕ μπορεί να υπερβαίνει την εθνική κυριαρχία', 'Οι στρατιωτικές συμμαχίες είναι υποχρεωτικές']
    },
    correct: { en: 'States must not interfere in others\' internal affairs', el: 'Τα κράτη δεν πρέπει να παρεμβαίνουν στα εσωτερικά άλλων' },
    explanation: { en: 'The principle of non-intervention, enshrined in the UN Charter, prohibits states from interfering in the internal affairs of other sovereign states.', el: 'Η αρχή μη παρεμβατικότητας, που καθιερώνεται στο Χάρτη του ΟΗΕ, απαγορεύει στα κράτη να παρεμβαίνουν στα εσωτερικά άλλον κυρίαρχων κρατών.' }
  },
  {
    id: 'geopol-9',
    category: 'Geopolitics',
    difficulty: 'easy',
    question: { en: 'What does OSCE stand for?', el: 'Τι σημαίνει ΟΑΣΕ;' },
    options: {
      en: ['Organization for Security and Co-operation in Europe', 'Ocean Security and Climate Enforcement', 'Olympic Sports Coordinating Committee', 'Offshore Settlement and Currency Exchange'],
      el: ['Οργανισμός για την Ασφάλεια και τη Συνεργασία στην Ευρώπη', 'Ασφάλεια Ωκεανού και Εφαρμογή Κλίματος', 'Επιτροπή Συντονισμού Ολυμπιακών Αθλημάτων', 'Υπεράκτια Διακανονισμός και Ανταλλαγή Συναλλάγματος']
    },
    correct: { en: 'Organization for Security and Co-operation in Europe', el: 'Οργανισμός για την Ασφάλεια και τη Συνεργασία στην Ευρώπη' },
    explanation: { en: 'The OSCE is the world\'s largest regional security organization, spanning 57 participating states across Europe, North America, and Asia.', el: 'Η ΟΑΣΕ είναι ο μεγαλύτερος περιφερειακός οργανισμός ασφαλείας στον κόσμο, με 57 συμμετέχοντα κράτη στην Ευρώπη, τη Βόρεια Αμερική και την Ασία.' }
  },
  {
    id: 'geopol-10',
    category: 'Geopolitics',
    difficulty: 'medium',
    question: { en: 'Which country joined NATO most recently?', el: 'Ποια χώρα εντάχθηκε πιο πρόσφατα στο ΝΑΤΟ;' },
    options: { en: ['Poland', 'Sweden', 'Finland', 'North Macedonia'], el: ['Πολωνία', 'Σουηδία', 'Φινλανδία', 'Βόρεια Μακεδονία'] },
    correct: { en: 'Sweden', el: 'Σουηδία' },
    explanation: { en: 'Sweden joined NATO on 7 March 2024, becoming the 32nd member state, after Finland joined in 2023.', el: 'Η Σουηδία εντάχθηκε στο ΝΑΤΟ στις 7 Μαρτίου 2024, γίνοντας το 32ο κράτη-μέλος, μετά τη Φινλανδία που εντάχθηκε το 2023.' }
  },
  {
    id: 'geopol-11',
    category: 'Geopolitics',
    difficulty: 'hard',
    question: { en: 'What is the "Thucydides Trap" in international relations?', el: 'Τι είναι η «παγίδα του Θουκυδίδη» στις διεθνείς σχέσεις;' },
    options: {
      en: ['Trade dispute mechanism', 'Danger of war when rising power challenges dominant power', 'Climate negotiation framework', 'Currency exchange regulation'],
      el: ['Μηχανισμός εμπορικών διαφορών', 'Κίνδυνος πολέμου όταν αναδυόμενη δύναμη αμφισβητεί την κυρίαρχη', 'Πλαίσιο διαπραγμάτευσης για το κλίμα', 'Ρύθμιση συναλλαγματικής ισοτιμίας']
    },
    correct: { en: 'Danger of war when rising power challenges dominant power', el: 'Κίνδυνος πολέμου όταν αναδυόμενη δύναμη αμφισβητεί την κυρίαρχη' },
    explanation: { en: 'Coined by Graham Allison, the Thucydides Trap describes the structural stress when a rising power threatens to displace a dominant one, historically often leading to war.', el: 'Ο όρος, που επινοήθηκε από τον Graham Allison, περιγράφει τον δομικό στρες όταν μια αναδυόμενη δύναμη απειλεί να αντικαταστήσει την κυρίαρχη, ιστορικά συχνά οδηγώντας σε πόλεμο.' }
  },
  {
    id: 'geopol-12',
    category: 'Geopolitics',
    difficulty: 'easy',
    question: { en: 'Where is the headquarters of NATO located?', el: 'Πού βρίσκεται η έδρα του ΝΑΤΟ;' },
    options: { en: ['Paris', 'London', 'Brussels', 'Berlin'], el: ['Παρίσι', 'Λονδίνο', 'Βρυξέλλες', 'Βερολίνο'] },
    correct: { en: 'Brussels', el: 'Βρυξέλλες' },
    explanation: { en: 'NATO headquarters has been in Brussels, Belgium, since 1967, when it moved from Paris.', el: 'Η έδρα του ΝΑΤΟ βρίσκεται στις Βρυξέλλες του Βελγίου από το 1967, όταν μετακόμισε από το Παρίσι.' }
  },
  {
    id: 'geopol-13',
    category: 'Geopolitics',
    difficulty: 'medium',
    question: { en: 'What is multilateralism?', el: 'Τι είναι ο πολυμερής αναλυτισμός;' },
    options: {
      en: ['Single-nation dominance', 'Cooperation among three or more states', 'Bilateral trade only', 'Military unilateral action'],
      el: ['Ηγεμονία ενός κράτους', 'Συνεργασία μεταξύ τριών ή περισσότερων κρατών', 'Μόνο διμερές εμπόριο', 'Μονομερής στρατιωτική δράση']
    },
    correct: { en: 'Cooperation among three or more states', el: 'Συνεργασία μεταξύ τριών ή περισσότερων κρατών' },
    explanation: { en: 'Multilateralism is the practice of coordinating national policies with three or more states, often through international organizations like the UN or WTO.', el: 'Ο πολυμερής αναλυτισμός είναι η πρακτική συντονισμού εθνικών πολιτικών με τρία ή περισσότερα κράτη, συχνά μέσω διεθνών οργανισμών όπως ο ΟΗΕ ή ο ΠΟΕ.' }
  },
  {
    id: 'geopol-14',
    category: 'Geopolitics',
    difficulty: 'hard',
    question: { en: 'What does "soft power" mean in international relations?', el: 'Τι σημαίνει η «μαλακή δύναμη» στις διεθνείς σχέσεις;' },
    options: {
      en: ['Military capability', 'Ability to attract through culture and values', 'Economic sanctions', 'Nuclear deterrence'],
      el: ['Στρατιωτική ικανότητα', 'Δυνατότητα προσελκυσμού μέσω πολιτισμού και αξιών', 'Οικονομικές κυρώσεις', 'Πυρηνική αναχαίτιση']
    },
    correct: { en: 'Ability to attract through culture and values', el: 'Δυνατότητα προσελκυσμού μέσω πολιτισμού και αξιών' },
    explanation: { en: 'Coined by Joseph Nye, soft power is the ability to shape others\' preferences through attraction (culture, values, policies) rather than coercion or payment.', el: 'Ο όρος του Joseph Nye περιγράφει την ικανότητα διαμόρφωσης των προτιμήσεων άλλων μέσω έλξης (πολιτισμός, αξίες, πολιτικές) αντί για καταναγκασμό ή πληρωμή.' }
  },
  {
    id: 'geopol-15',
    category: 'Geopolitics',
    difficulty: 'easy',
    question: { en: 'What is a sovereign state?', el: 'Τι είναι ένα κυρίαρχο κράτος;' },
    options: {
      en: ['A colony', 'A state with supreme authority over its territory', 'A UN dependency', 'A trade bloc'],
      el: ['Μια αποικία', 'Κράτος με ανώτατη εξουσία στο έδαφός του', 'Εξάρτηση του ΟΗΕ', 'Εμπορικός συνασπισμός']
    },
    correct: { en: 'A state with supreme authority over its territory', el: 'Κράτος με ανώτατη εξουσία στο έδαφός του' },
    explanation: { en: 'A sovereign state has full legal authority over its territory and population, and is not subject to external control.', el: 'Ένα κυρίαρχο κράτος έχει πλήρη νομική εξουσία στο έδαφό και τον πληθυσμό του και δεν υπόκειται σε εξωτερικό έλεγχο.' }
  },
  {
    id: 'geopol-16',
    category: 'Geopolitics',
    difficulty: 'medium',
    question: { en: 'Which body elects the UN Secretary-General?', el: 'Ποιο όργανο εκλέγει τον Γενικό Γραμματέα του ΟΗΕ;' },
    options: {
      en: ['General Assembly alone', 'Security Council recommends, General Assembly appoints', 'Security Council alone', 'Economic and Social Council'],
      el: ['Μόνο η Γενική Συνέλευση', 'Το Συμβούλιο Ασφαλείας προτείνει, η Γενική Συνέλευση διορίζει', 'Μόνο το Συμβούλιο Ασφαλείας', 'Οικονομικό και Κοινωνικό Συμβούλιο']
    },
    correct: { en: 'Security Council recommends, General Assembly appoints', el: 'Το Συμβούλιο Ασφαλείας προτείνει, η Γενική Συνέλευση διορίζει' },
    explanation: { en: 'The UN Secretary-General is appointed by the General Assembly upon the recommendation of the Security Council.', el: 'Ο Γενικός Γραμματέας του ΟΗΕ διορίζεται από τη Γενική Συνέλευση μετά από πρόταση του Συμβουλίου Ασφαλείας.' }
  },
  {
    id: 'geopol-17',
    category: 'Geopolitics',
    difficulty: 'hard',
    question: { en: 'What is the "balance of power" in realist international relations theory?', el: 'Τι είναι η «ισορροπία δυνάμεων» στη ρεαλιστική θεωρία διεθνών σχέσεων;' },
    options: {
      en: ['Economic equilibrium', 'Distribution of power preventing any single state dominance', 'Military parity only', 'UN voting balance'],
      el: ['Οικονομική ισορροπία', 'Κατανομή δύναμης που εμποδίζει την κυριαρχία ενός κράτους', 'Μόνο στρατιωτική ισοδυναμία', 'Ισορροπία ψηφοφορίας στο ΟΗΕ']
    },
    correct: { en: 'Distribution of power preventing any single state dominance', el: 'Κατανομή δύναμης που εμποδίζει την κυριαρχία ενός κράτους' },
    explanation: { en: 'Balance of power theory holds that national security is enhanced when military capability is distributed so no single state can dominate others.', el: 'Η θεωρία ισορροπίας δυνάμεων θεωρεί ότι η εθνική ασφάλεια ενισχύεται όταν η στρατιωτική ικανότητα κατανέμεται έτσι ώστε κανένα κράτος να μην μπορεί να κυριαρχήσει.' }
  },

  // === NEW: EU (10) ===
  {
    id: 'eu-6',
    category: 'EU',
    difficulty: 'easy',
    question: { en: 'Which institution proposes EU laws?', el: 'Ποιο θεσμικό όργανο προτείνει τους νόμους της ΕΕ;' },
    options: {
      en: ['European Parliament', 'European Commission', 'Council of the EU', 'European Council'],
      el: ['Ευρωπαϊκό Κοινοβούλιο', 'Ευρωπαϊκή Επιτροπή', 'Συμβούλιο της ΕΕ', 'Ευρωπαϊκό Συμβούλιο']
    },
    correct: { en: 'European Commission', el: 'Ευρωπαϊκή Επιτροπή' },
    explanation: { en: 'The European Commission is the EU\'s executive body and has the sole right to propose new legislation.', el: 'Η Ευρωπαϊκή Επιτροπή είναι το εκτελεστικό σώμα της ΕΕ και έχει το αποκλειστικό δικαίωμα πρότασης νέων νομοθεσιών.' }
  },
  {
    id: 'eu-7',
    category: 'EU',
    difficulty: 'medium',
    question: { en: 'What is the Schengen Area?', el: 'Τι είναι η Ζώνη Σένγκεν;' },
    options: {
      en: ['Eurozone countries', 'Area with no internal border controls', 'EU military alliance', 'Trade bloc'],
      el: ['Χώρες Ευρωζώνης', 'Ζώνη χωρίς εσωτερικούς έλεγχους συνόρων', 'Στρατιωτική συμμαχία ΕΕ', 'Εμπορικός συνασπισμός']
    },
    correct: { en: 'Area with no internal border controls', el: 'Ζώνη χωρίς εσωτερικούς έλεγχους συνόρων' },
    explanation: { en: 'The Schengen Area allows free movement across internal borders without passport checks; it includes most EU states plus Norway, Switzerland, Iceland, and Liechtenstein.', el: 'Η Ζώνη Σένγκεν επιτρέπει την ελεύθερη μετακίνηση στα εσωτερικά σύνορα χωρίς έλεγχο διαβατηρίων· περιλαμβάνει την πλειοψηφία κρατών της ΕΕ και τη Νορβηγία, την Ελβετία, την Ισλανδία και το Λιχτενστάιν.' }
  },
  {
    id: 'eu-8',
    category: 'EU',
    difficulty: 'hard',
    question: { en: 'What is the principle of "subsidiarity" in the EU?', el: 'Τι είναι η αρχή της «επικουρικότητας» στην ΕΕ;' },
    options: {
      en: ['EU has priority over member states', 'Decisions taken at lowest effective level', 'All laws come from Brussels', 'Budget must be balanced'],
      el: ['Η ΕΕ έχει προτεραιότητα έναντι κρατών μελών', 'Αποφάσεις στο χαμηλότερο αποτελεσματικό επίπεδο', 'Όλοι οι νόμοι προέρχονται από τις Βρυξέλλες', 'Ο προϋπολογισμός πρέπει να είναι εξισορροπημένος']
    },
    correct: { en: 'Decisions taken at lowest effective level', el: 'Αποφάσεις στο χαμηλότερο αποτελεσματικό επίπεδο' },
    explanation: { en: 'Subsidiarity means the EU should act only when objectives cannot be sufficiently achieved by member states, preferring local or national action.', el: 'Η επικουρικότητα σημαίνει ότι η ΕΕ πρέπει να ενεργεί μόνο όταν οι στόχοι δεν μπορούν να επιτευχθούν επαρκώς από τα κράτη μέλη, προτιμώντας τοπική ή εθνική δράση.' }
  },
  {
    id: 'eu-9',
    category: 'EU',
    difficulty: 'easy',
    question: { en: 'How often are European Parliament elections held?', el: 'Πόσο συχνά γίνονται οι εκλογές για το Ευρωπαϊκό Κοινοβούλιο;' },
    options: {
      en: ['Every 3 years', 'Every 5 years', 'Every 7 years', 'Every 10 years'],
      el: ['Κάθε 3 χρόνια', 'Κάθε 5 χρόνια', 'Κάθε 7 χρόνια', 'Κάθε 10 χρόνια']
    },
    correct: { en: 'Every 5 years', el: 'Κάθε 5 χρόνια' },
    explanation: { en: 'European Parliament elections take place every five years; the last one was in 2024.', el: 'Οι εκλογές για το Ευρωπαϊκό Κοινοβούλιο γίνονται κάθε πέντε χρόνια· οι τελευταίες έγιναν το 2024.' }
  },
  {
    id: 'eu-10',
    category: 'EU',
    difficulty: 'medium',
    question: { en: 'Which treaty created the European Union in its current form?', el: 'Ποια συνθήκη δημιούργησε την Ευρωπαϊκή Ένωση στη σημερινή της μορφή;' },
    options: {
      en: ['Treaty of Rome', 'Single European Act', 'Treaty of Maastricht', 'Treaty of Amsterdam'],
      el: ['Συνθήκη Ρώμης', 'Ενιαία Ευρωπαϊκή Πράξη', 'Συνθήκη Μάαστριχτ', 'Συνθήκη Αμστερνταμ']
    },
    correct: { en: 'Treaty of Maastricht', el: 'Συνθήκη Μάαστριχτ' },
    explanation: { en: 'The Maastricht Treaty, signed in 1992, established the European Union and introduced the three-pillar structure and plans for the euro.', el: 'Η Συνθήκη Μάαστριχτ, που υπογράφηκε το 1992, ίδρυσε την Ευρωπαϊκή Ένωση και εισήγαγε τη δομή τριών πυλών και τα σχέδια για το ευρώ.' }
  },
  {
    id: 'eu-11',
    category: 'EU',
    difficulty: 'hard',
    question: { en: 'What is qualified majority voting in the EU Council?', el: 'Τι είναι η ψηφοφορία με qualified majority στο Συμβούλιο της ΕΕ;' },
    options: {
      en: ['Unanimity required', '55% of member states representing 65% of population', 'Simple majority of states', 'Only large states vote'],
      el: ['Απαιτείται ομοφωνία', '55% κρατών μελών αντιπροσωπεύοντας 65% του πληθυσμού', 'Απλή πλειοψηφία κρατών', 'Ψηφίζουν μόνο οι μεγάλες χώρες']
    },
    correct: { en: '55% of member states representing 65% of population', el: '55% κρατών μελών αντιπροσωπεύοντας 65% του πληθυσμού' },
    explanation: { en: 'Qualified majority requires 55% of member states (15 of 27) representing at least 65% of the EU population for most Council decisions.', el: 'Η qualified majority απαιτεί 55% των κρατών μελών (15 από 27) που αντιπροσωπεύουν τουλάχιστον 65% του πληθυσμού της ΕΕ για τις περισσότερες αποφάσεις του Συμβουλίου.' }
  },
  {
    id: 'eu-12',
    category: 'EU',
    difficulty: 'easy',
    question: { en: 'Which country held the EU presidency in the first half of 2024?', el: 'Ποια χώρα είχε την προεδρία της ΕΕ στο πρώτο εξάμηνο του 2024;' },
    options: { en: ['Germany', 'Belgium', 'Hungary', 'Poland'], el: ['Γερμανία', 'Βέλγιο', 'Ουγγαρία', 'Πολωνία'] },
    correct: { en: 'Belgium', el: 'Βέλγιο' },
    explanation: { en: 'Belgium held the rotating Council of the EU presidency from January to June 2024.', el: 'Το Βέλγιο είχε την περιστρεφόμενη προεδρία του Συμβουλίου της ΕΕ από τον Ιανουάριο έως τον Ιούνιο του 2024.' }
  },
  {
    id: 'eu-13',
    category: 'EU',
    difficulty: 'medium',
    question: { en: 'What is the European Stability Mechanism (ESM)?', el: 'Τι είναι ο Μηχανισμός Ευρωπαϊκής Σταθερότητας (ESM);' },
    options: {
      en: ['EU central bank', 'Permanent crisis resolution mechanism for eurozone', 'Trade agreement', 'Environmental fund'],
      el: ['Κεντρική τράπεζα ΕΕ', 'Μόνιμος μηχανισμός επιλύσεως κρίσεων για την Ευρωζώνη', 'Εμπορική συμφωνία', 'Περιβαλλοντικό Ταμείο']
    },
    correct: { en: 'Permanent crisis resolution mechanism for eurozone', el: 'Μόνιμος μηχανισμός επιλύσεως κρίσεων για την Ευρωζώνη' },
    explanation: { en: 'The ESM, established in 2012, provides financial assistance to eurozone countries in severe financial distress.', el: 'Ο ESM, που ιδρύθηκε το 2012, παρέχει χρηματοοικονομική βοήθεια σε χώρες της Ευρωζώνης σε σοβαρή οικονομική δυσπραγία.' }
  },
  {
    id: 'eu-14',
    category: 'EU',
    difficulty: 'hard',
    question: { en: 'What does the EU\'s "four freedoms" include?', el: 'Τι περιλαμβάνουν οι «τέσσερις ελευθερίες» της ΕΕ;' },
    options: {
      en: ['Freedom of religion, speech, press, assembly', 'Goods, services, capital, people', 'Trade, military, culture, education', 'Healthcare, housing, work, education'],
      el: ['Ελευθερία θρησκείας, λόγου, τύπου, συγκέντρωσης', 'Αγαθά, υπηρεσίες, κεφάλαιο, άνθρωποι', 'Εμπόριο, στρατιωτικά, πολιτισμός, εκπαίδευση', 'Υγεία, στέγη, εργασία, εκπαίδευση']
    },
    correct: { en: 'Goods, services, capital, people', el: 'Αγαθά, υπηρεσίες, κεφάλαιο, άνθρωποι' },
    explanation: { en: 'The EU single market is based on four freedoms: free movement of goods, services, capital, and people.', el: 'Η ενιαία αγορά της ΕΕ βασίζεται σε τέσσερις ελευθερίες: ελεύθερη μετακίνηση αγαθών, υπηρεσιών, κεφαλαίου και ανθρώπων.' }
  },
  {
    id: 'eu-15',
    category: 'EU',
    difficulty: 'easy',
    question: { en: 'Which EU country does not use the euro?', el: 'Ποια χώρα της ΕΕ δεν χρησιμοποιεί το ευρώ;' },
    options: { en: ['Portugal', 'Poland', 'Spain', 'Ireland'], el: ['Πορτογαλία', 'Πολωνία', 'Ισπανία', 'Ιρλανδία'] },
    correct: { en: 'Poland', el: 'Πολωνία' },
    explanation: { en: 'Poland uses the zloty and has not yet adopted the euro, though it is legally committed to do so as an EU member.', el: 'Η Πολωνία χρησιμοποιεί το ζλότι και δεν έχει ακόμη υιοθετήσει το ευρώ, αν και είναι νομικά δεσμευμένη να το κάνει ως μέλος της ΕΕ.' }
  },

  // === NEW: Economics (5) ===
  {
    id: 'econ-6',
    category: 'Economics',
    difficulty: 'easy',
    question: { en: 'What is a trade deficit?', el: 'Τι είναι το εμπορικό έλλειμμα;' },
    options: {
      en: ['Exports exceed imports', 'Imports exceed exports', 'Balanced trade', 'Currency devaluation'],
      el: ['Οι εξαγωγές ξεπερνούν τις εισαγωγές', 'Οι εισαγωγές ξεπερνούν τις εξαγωγές', 'Ισορροπημένο εμπόριο', 'Υποτίμηση νομίσματος']
    },
    correct: { en: 'Imports exceed exports', el: 'Οι εισαγωγές ξεπερνούν τις εξαγωγές' },
    explanation: { en: 'A trade deficit occurs when a country imports more goods and services than it exports in a given period.', el: 'Το εμπορικό έλλειμμα προκύπτει όταν μια χώρα εισάγει περισσότερα αγαθά και υπηρεσίες από όσα εξάγει σε δεδομένη περίοδο.' }
  },
  {
    id: 'econ-7',
    category: 'Economics',
    difficulty: 'medium',
    question: { en: 'What does the term "austerity" mean in economic policy?', el: 'Τι σημαίνει ο όρος «λιτότητα» στην οικονομική πολιτική;' },
    options: {
      en: ['Increase in government spending', 'Policies to reduce government deficits through spending cuts', 'Tax reduction', 'Monetary expansion'],
      el: ['Αύξηση δαπανών κυβέρνησης', 'Πολιτικές μείωσης ελλείμματος μέσω περικοπών δαπανών', 'Μείωση φόρων', 'Νομισματική διεύρυνση']
    },
    correct: { en: 'Policies to reduce government deficits through spending cuts', el: 'Πολιτικές μείωσης ελλείμματος μέσω περικοπών δαπανών' },
    explanation: { en: 'Austerity typically involves cutting government spending, raising taxes, or both to reduce budget deficits and public debt.', el: 'Η λιτότητα συνήθως περιλαμβάνει περικοπές δαπανών, αύξηση φόρων ή και τα δύο για τη μείωση των ελλειμμάτων προϋπολογισμού και του δημόσιου χρέους.' }
  },
  {
    id: 'econ-8',
    category: 'Economics',
    difficulty: 'hard',
    question: { en: 'What is the "tragedy of the commons" in economics?', el: 'Τι είναι η «τραγωδία των κοινών» στην οικονομία;' },
    options: {
      en: ['Government default', 'Overuse of shared resources by individuals acting in self-interest', 'Bank failure', 'Currency crisis'],
      el: ['Κρατικό χρέος', 'Υπερεκμετάλλευση κοινών πόρων από άτομα που ενεργούν προς ιδιοτέλεια', 'Τραπεζική αποτυχία', 'Νομισματική κρίση']
    },
    correct: { en: 'Overuse of shared resources by individuals acting in self-interest', el: 'Υπερεκμετάλλευση κοινών πόρων από άτομα που ενεργούν προς ιδιοτέλεια' },
    explanation: { en: 'The tragedy of the commons describes how individuals, acting independently and rationally, can collectively deplete a shared resource to everyone\'s detriment.', el: 'Η τραγωδία των κοινών περιγράφει πώς τα άτομα, ενεργώντας ανεξάρτητα και ορθολογικά, μπορούν συλλογικά να εξαντλήσουν έναν κοινό πόρο σε βλάβη όλων.' }
  },
  {
    id: 'econ-9',
    category: 'Economics',
    difficulty: 'easy',
    question: { en: 'What is a progressive tax?', el: 'Τι είναι ο προοδευτικός φόρος;' },
    options: {
      en: ['Same rate for all', 'Higher rate for higher incomes', 'Tax on imports only', 'One-time levy'],
      el: ['Ίσο ποσοστό για όλους', 'Υψηλότερο ποσοστό για υψηλότερα εισοδήματα', 'Φόρος μόνο στις εισαγωγές', 'Εφάπαξ επιβάρυνση']
    },
    correct: { en: 'Higher rate for higher incomes', el: 'Υψηλότερο ποσοστό για υψηλότερα εισοδήματα' },
    explanation: { en: 'A progressive tax imposes a higher tax rate on higher income levels, shifting more burden to wealthier taxpayers.', el: 'Ο προοδευτικός φόρος επιβάλλει υψηλότερο φορολογικό συντελεστή σε υψηλότερα επίπεδα εισοδήματος, μετατοπίζοντας το μεγαλύτερο βάρος στους πιο εύπορους φορολογούμενους.' }
  },
  {
    id: 'econ-10',
    category: 'Economics',
    difficulty: 'medium',
    question: { en: 'What is sovereign debt?', el: 'Τι είναι το κυβερνητικό χρέος;' },
    options: {
      en: ['Corporate bonds', 'Debt owed by a national government', 'Household loans', 'Bank deposits'],
      el: ['Εταιρικά ομόλογα', 'Χρέος που οφείλει η εθνική κυβέρνηση', 'Οικιακά δάνεια', 'Τραπεζικές καταθέσεις']
    },
    correct: { en: 'Debt owed by a national government', el: 'Χρέος που οφείλει η εθνική κυβέρνηση' },
    explanation: { en: 'Sovereign debt is money borrowed by a national government, typically through bonds, to finance deficits or investment.', el: 'Το κυβερνητικό χρέος είναι χρήματα που δανείζεται η εθνική κυβέρνηση, συνήθως μέσω ομολόγων, για τη χρηματοδότηση ελλειμμάτων ή επενδύσεων.' }
  },

  // === NEW: Democracy (10) ===
  {
    id: 'pol-31',
    category: 'Democracy',
    difficulty: 'easy',
    question: { en: 'What is a constitutional monarchy?', el: 'Τι είναι η συνταγματική μοναρχία;' },
    options: {
      en: ['King has absolute power', 'Monarch reigns but does not rule', 'No parliament', 'Elected king'],
      el: ['Ο βασιλιάς έχει απόλυτη εξουσία', 'Ο μονάρχης βασιλεύει αλλά δεν κυβερνά', 'Χωρίς κοινοβούλιο', 'Εκλεγμένος βασιλιάς']
    },
    correct: { en: 'Monarch reigns but does not rule', el: 'Ο μονάρχης βασιλεύει αλλά δεν κυβερνά' },
    explanation: { en: 'In a constitutional monarchy, the monarch serves as head of state but political power is exercised by elected officials under a constitution.', el: 'Σε συνταγματική μοναρχία, ο μονάρχης υπηρετεί ως αρχηγός κράτους αλλά η πολιτική εξουσία ασκείται από εκλεγμένους αξιωματούχους βάσει συνταγματικού πλαισίου.' }
  },
  {
    id: 'pol-32',
    category: 'Democracy',
    difficulty: 'medium',
    question: { en: 'What is proportional representation?', el: 'Τι είναι η αναλογική εκπροσώπηση;' },
    options: {
      en: ['Winner takes all', 'Seats allocated by share of votes', 'Only majority party gets seats', 'Appointment by president'],
      el: ['Ο νικητής παίρνει όλα', 'Έδρες ανάλογα με το μερίδιο ψήφων', 'Μόνο το κόμμα πλειοψηφίας παίρνει έδρες', 'Διορισμός από πρόεδρο']
    },
    correct: { en: 'Seats allocated by share of votes', el: 'Έδρες ανάλογα με το μερίδιο ψήφων' },
    explanation: { en: 'Proportional representation allocates legislative seats according to the percentage of votes each party receives.', el: 'Η αναλογική εκπροσώπηση διανέμει τις νομοθετικές έδρες σύμφωνα με το ποσοστό ψήφων που λαμβάνει κάθε κόμμα.' }
  },
  {
    id: 'pol-33',
    category: 'Democracy',
    difficulty: 'hard',
    question: { en: 'Who wrote "The Leviathan" and influenced modern political philosophy?', el: 'Ποιος έγραψε το «Λεβιάθαν» και επηρέασε τη σύγχρονη πολιτική φιλοσοφία;' },
    options: {
      en: ['John Locke', 'Jean-Jacques Rousseau', 'Thomas Hobbes', 'Montesquieu'],
      el: ['Τζον Λοκ', 'Ζαν-Ζακ Ρουσσώ', 'Τόμας Χομπς', 'Μοντεσκιέ']
    },
    correct: { en: 'Thomas Hobbes', el: 'Τόμας Χομπς' },
    explanation: { en: 'Thomas Hobbes published "Leviathan" in 1651, arguing that humans need a strong sovereign to avoid the "war of all against all."', el: 'Ο Thomas Hobbes δημοσίευσε το «Λεβιάθαν» το 1651, υποστηρίζοντας ότι οι άνθρωποι χρειάζονται ισχυρό κυρίαρχο για να αποφύγουν τον «πόλεμο όλων ενάντια σε όλους».' }
  },
  {
    id: 'pol-34',
    category: 'Democracy',
    difficulty: 'easy',
    question: { en: 'What is the role of the opposition in a democracy?', el: 'Ποιος είναι ο ρόλος της αντιπολίτευσης στη δημοκρατία;' },
    options: {
      en: ['To overthrow the government', 'To scrutinize and challenge the government', 'To support all policies', 'To dissolve parliament'],
      el: ['Να ανατρέψει την κυβέρνηση', 'Να ελέγχει και να αμφισβητεί την κυβέρνηση', 'Να υποστηρίζει όλες τις πολιτικές', 'Να διαλύσει το κοινοβούλιο']
    },
    correct: { en: 'To scrutinize and challenge the government', el: 'Να ελέγχει και να αμφισβητεί την κυβέρνηση' },
    explanation: { en: 'The opposition holds the government accountable through debate, parliamentary questions, and offering alternative policies.', el: 'Η αντιπολίτευση ελέγχει την κυβέρνηση μέσω διαβουλεύσεων, κοινοβουλευτικών ερωτήσεων και πρότασης εναλλακτικών πολιτικών.' }
  },
  {
    id: 'pol-35',
    category: 'Democracy',
    difficulty: 'medium',
    question: { en: 'What is judicial independence?', el: 'Τι είναι η δικαστική ανεξαρτησία;' },
    options: {
      en: ['Courts follow executive orders', 'Courts decide cases free from political pressure', 'Courts are elected by parliament', 'Judges serve for life without review'],
      el: ['Τα δικαστήρια ακολουθούν εκτελεστικές εντολές', 'Τα δικαστήρια αποφασίζουν χωρίς πολιτική πίεση', 'Τα δικαστήρια εκλέγονται από το κοινοβούλιο', 'Οι δικαστές υπηρετούν επί ζωής χωρίς έλεγχο']
    },
    correct: { en: 'Courts decide cases free from political pressure', el: 'Τα δικαστήρια αποφασίζουν χωρίς πολιτική πίεση' },
    explanation: { en: 'Judicial independence ensures that courts can make decisions based on law without interference from the executive or legislature.', el: 'Η δικαστική ανεξαρτησία διασφαλίζει ότι τα δικαστήρια μπορούν να λαμβάνουν αποφάσεις βάσει νόμου χωρίς παρέμβαση από την εκτελεστική ή τη νομοθετική εξουσία.' }
  },
  {
    id: 'pol-36',
    category: 'Democracy',
    difficulty: 'hard',
    question: { en: 'What is the "social contract" theory?', el: 'Τι είναι η θεωρία του «κοινωνικού συμβολαίου»;' },
    options: {
      en: ['Government owns all property', 'Individuals consent to be governed in exchange for security', 'Military rule by contract', 'Trade agreement between states'],
      el: ['Η κυβέρνηση κατέχει όλη την περιουσία', 'Τα άτομα συναινουν να κυβερνώνται αντάλλαγμα ασφάλειας', 'Στρατιωτική διακυβέρνηση με συμβόλαιο', 'Εμπορική συμφωνία μεταξύ κρατών']
    },
    correct: { en: 'Individuals consent to be governed in exchange for security', el: 'Τα άτομα συναινoύν να κυβερνώνται σε αντάλλαγμα για ασφάλεια' },
    explanation: { en: 'Social contract theory, advanced by Hobbes, Locke, and Rousseau, holds that political authority derives from an implicit agreement among citizens.', el: 'Η θεωρία του κοινωνικού συμβολαίου, που προώθησαν οι Hobbes, Locke και Rousseau, θεωρεί ότι η πολιτική εξουσία προέρχεται από μια σιωπηρή συμφωνία μεταξύ πολιτών.' }
  },
  {
    id: 'pol-37',
    category: 'Democracy',
    difficulty: 'easy',
    question: { en: 'What is a coalition government?', el: 'Τι είναι κυβέρνηση συνασπισμού;' },
    options: {
      en: ['Single party majority', 'Multiple parties sharing power', 'Military junta', 'Presidential appointment only'],
      el: ['Μονοκόμματη πλειοψηφία', 'Πολλά κόμματα μοιράζονται την εξουσία', 'Στρατιωτική χούντα', 'Μόνο πρόεδρος διορίζει']
    },
    correct: { en: 'Multiple parties sharing power', el: 'Πολλά κόμματα μοιράζονται την εξουσία' },
    explanation: { en: 'A coalition government is formed when no single party has a majority, so two or more parties agree to govern together.', el: 'Μια κυβέρνηση συνασπισμού διαμορφώνεται όταν κανένα κόμμα δεν έχει πλειοψηφία, οπότε δύο ή περισσότερα κόμματα συμφωνούν να κυβερνήσουν από κοινού.' }
  },
  {
    id: 'pol-38',
    category: 'Democracy',
    difficulty: 'medium',
    question: { en: 'What is civil society?', el: 'Τι είναι η πολιτική κοινωνία;' },
    options: {
      en: ['Government agencies', 'Voluntary associations between state and individual', 'Military institutions', 'State-owned enterprises'],
      el: ['Κρατικοί φορείς', 'Εθελοντικές ενώσεις μεταξύ κράτους και ατόμου', 'Στρατιωτικά ιδρύματα', 'Κρατικές επιχειρήσεις']
    },
    correct: { en: 'Voluntary associations between state and individual', el: 'Εθελοντικές ενώσεις μεταξύ κράτους και ατόμου' },
    explanation: { en: 'Civil society refers to the sphere of voluntary associations, NGOs, and civic groups that operate independently of the state.', el: 'Η πολιτική κοινωνία αναφέρεται στη σφαίρα των εθελοντικών ενώσεων, ΜΚΟ και πολιτικών ομάδων που λειτουργούν ανεξάρτητα από το κράτος.' }
  },
  {
    id: 'pol-39',
    category: 'Democracy',
    difficulty: 'hard',
    question: { en: 'What is federalism?', el: 'Τι είναι η ομοσπονδία;' },
    options: {
      en: ['Centralized unitary state', 'Division of power between central and regional governments', 'Single national identity only', 'Military federation'],
      el: ['Κεντραλισμένο ενιαίο κράτος', 'Κατανομή εξουσίας μεταξύ κεντρικής και περιφερειακής κυβέρνησης', 'Μόνο εθνική ταυτότητα', 'Στρατιωτική ομοσπονδία']
    },
    correct: { en: 'Division of power between central and regional governments', el: 'Κατανομή εξουσίας μεταξύ κεντρικής και περιφερειακής κυβέρνησης' },
    explanation: { en: 'Federalism divides power between a central government and constituent regional units, each with their own spheres of authority.', el: 'Ο φεντεραλισμός διαμοιράζει την εξουσία μεταξύ κεντρικής κυβέρνησης και περιφερειακών μονάδων, καθεμία με το δικό της πεδίο αρμοδιοτήτων.' }
  },
  {
    id: 'pol-40',
    category: 'Democracy',
    difficulty: 'easy',
    question: { en: 'What is universal suffrage?', el: 'Τι είναι η καθολική ψηφοφορία;' },
    options: {
      en: ['Only men vote', 'All adult citizens can vote', 'Only property owners vote', 'Voting by appointment'],
      el: ['Μόνο οι άνδρες ψηφίζουν', 'Όλοι οι ενήλικες πολίτες μπορούν να ψηφίσουν', 'Μόνο ιδιοκτήτες ψηφίζουν', 'Ψηφοφορία με διορισμό']
    },
    correct: { en: 'All adult citizens can vote', el: 'Όλοι οι ενήλικες πολίτες μπορούν να ψηφίσουν' },
    explanation: { en: 'Universal suffrage means all adult citizens have the right to vote regardless of property, race, or gender (where implemented).', el: 'Η καθολική ψηφοφορία σημαίνει ότι όλοι οι ενήλικες πολίτες έχουν δικαίωμα ψήφου ανεξάρτητα από περιουσία, φυλή ή φύλο (όπου εφαρμόζεται).' }
  },

  // === NEW: International Law (8) ===
  {
    id: 'pol-41',
    category: 'InternationalLaw',
    difficulty: 'easy',
    question: { en: 'What is diplomatic immunity?', el: 'Τι είναι η διπλωματική ασυλία;' },
    options: {
      en: ['Tax exemption for diplomats', 'Protection from prosecution in host country', 'Military protection', 'Trade preference'],
      el: ['Φοροαπαλλαγή διπλωματών', 'Προστασία από δίωξη στη δέχουσα χώρα', 'Στρατιωτική προστασία', 'Εμπορική προτίμηση']
    },
    correct: { en: 'Protection from prosecution in host country', el: 'Προστασία από δίωξη στη δέχουσα χώρα' },
    explanation: { en: 'Diplomatic immunity, under the Vienna Convention, protects diplomats from arrest and prosecution in the host country to enable their work.', el: 'Η διπλωματική ασυλία, βάσει της Σύμβασης της Βιέννης, προστατεύει τους διπλωμάτες από σύλληψη και δίωξη στη δέχουσα χώρα για να μπορούν να ασκούν τα καθήκοντά τους.' }
  },
  {
    id: 'pol-42',
    category: 'InternationalLaw',
    difficulty: 'medium',
    question: { en: 'What is the Rome Statute?', el: 'Τι είναι το Καταστατικό της Ρώμης;' },
    options: {
      en: ['EU treaty', 'Treaty establishing the International Criminal Court', 'UN Charter amendment', 'NATO agreement'],
      el: ['Συνθήκη ΕΕ', 'Συνθήκη ίδρυσης του Διεθνούς Ποινικού Δικαστηρίου', 'Τροποποίηση Χάρτη ΟΗΕ', 'Συμφωνία ΝΑΤΟ']
    },
    correct: { en: 'Treaty establishing the International Criminal Court', el: 'Συνθήκη ίδρυσης του Διεθνούς Ποινικού Δικαστηρίου' },
    explanation: { en: 'The Rome Statute, adopted in 1998, established the ICC to prosecute genocide, crimes against humanity, war crimes, and aggression.', el: 'Το Καταστατικό της Ρώμης, που υιοθετήθηκε το 1998, ίδρυσε το ΔΠΔ για τη δίωξη γενοκτονίας, εγκλημάτων κατά της ανθρωπότητας, εγκλημάτων πολέμου και επέμβασης.' }
  },
  {
    id: 'pol-43',
    category: 'InternationalLaw',
    difficulty: 'hard',
    question: { en: 'What is "jus cogens" in international law?', el: 'Τι είναι το «jus cogens» στο διεθνές δίκαιο;' },
    options: {
      en: ['Optional treaty clause', 'Peremptory norms from which no derogation is allowed', 'Regional custom', 'Diplomatic protocol'],
      el: ['Προαιρετική ρήτρα συνθήκης', 'Απολυταρχικές νόρμες από τις οποίες δεν επιτρέπεται παρέκκλιση', 'Περιφερειακό έθιμο', 'Διπλωματικό πρωτόκολλο']
    },
    correct: { en: 'Peremptory norms from which no derogation is allowed', el: 'Απολυταρχικές νόρμες από τις οποίες δεν επιτρέπεται παρέκκλιση' },
    explanation: { en: 'Jus cogens are fundamental principles of international law, such as the prohibition of genocide, that bind all states and cannot be overridden by treaty.', el: 'Το jus cogens αναφέρεται σε θεμελιώδεις αρχές διεθνούς δικαίου, όπως η απαγόρευση της γενοκτονίας, που δεσμεύουν όλα τα κράτη και δεν μπορούν να ακυρωθούν με συνθήκη.' }
  },
  {
    id: 'pol-44',
    category: 'InternationalLaw',
    difficulty: 'easy',
    question: { en: 'What does the International Court of Justice settle?', el: 'Τι διευθετεί το Διεθνές Δικαστήριο;' },
    options: {
      en: ['Criminal cases against individuals', 'Disputes between states', 'Trade disputes only', 'Human rights complaints'],
      el: ['Ποινικές υποθέσεις κατά ατόμων', 'Διαφορές μεταξύ κρατών', 'Μόνο εμπορικές διαφορές', 'Καταγγελίες ανθρωπίνων δικαιωμάτων']
    },
    correct: { en: 'Disputes between states', el: 'Διαφορές μεταξύ κρατών' },
    explanation: { en: 'The ICJ is the UN\'s principal judicial organ and settles legal disputes between states and gives advisory opinions.', el: 'Το ΔΔ είναι το κύριο δικαστικό όργανο του ΟΗΕ και διευθετεί νομικές διαφορές μεταξύ κρατών και εκδίδει γνωμοδοτικές αποφάσεις.' }
  },
  {
    id: 'pol-45',
    category: 'InternationalLaw',
    difficulty: 'medium',
    question: { en: 'What are economic sanctions?', el: 'Τι είναι οι οικονομικές κυρώσεις;' },
    options: {
      en: ['Trade incentives', 'Measures to restrict trade or finance against a state', 'Development aid', 'Tax reduction agreements'],
      el: ['Εμπορικά κίνητρα', 'Μέτρα περιορισμού εμπορίου ή χρηματοδοσίας έναντι κράτους', 'Βοήθεια ανάπτυξης', 'Συμφωνίες μείωσης φόρων']
    },
    correct: { en: 'Measures to restrict trade or finance against a state', el: 'Μέτρα περιορισμού εμπορίου ή χρηματοδοσίας έναντι κράτους' },
    explanation: { en: 'Economic sanctions are punitive measures, such as trade embargoes or asset freezes, imposed to pressure states to change behavior.', el: 'Οι οικονομικές κυρώσεις είναι τιμωρητικά μέτρα, όπως εμπορικά εμπάργκο ή κατάψυξη περιουσιακών στοιχείων, που επιβάλλονται για να πιέσουν τα κράτη να αλλάξουν συμπεριφορά.' }
  },
  {
    id: 'pol-46',
    category: 'InternationalLaw',
    difficulty: 'hard',
    question: { en: 'What is the principle of "pacta sunt servanda"?', el: 'Τι είναι η αρχή «pacta sunt servanda»;' },
    options: {
      en: ['Treaties can be broken freely', 'Treaties must be performed in good faith', 'Only written agreements count', 'States may withdraw anytime'],
      el: ['Οι συνθήκες μπορούν να παραβιαστούν ελεύθερα', 'Οι συνθήκες πρέπει να εκτελούνται με καλή πίστη', 'Μόνο γραπτές συμφωνίες υπολογίζονται', 'Τα κράτη μπορούν να αποσυρθούν ανά πάσα στιγμή']
    },
    correct: { en: 'Treaties must be performed in good faith', el: 'Οι συνθήκες πρέπει να εκτελούνται με καλή πίστη' },
    explanation: { en: 'Pacta sunt servanda (Latin: "agreements must be kept") is a fundamental principle that states must fulfill their treaty obligations in good faith.', el: 'Το pacta sunt servanda (λατινικά: «οι συμφωνίες πρέπει να τηρούνται») είναι θεμελιώδης αρχή ότι τα κράτη πρέπει να εκτελούν τις συνθηκιακές τους υποχρεώσεις με καλή πίστη.' }
  },
  {
    id: 'pol-47',
    category: 'InternationalLaw',
    difficulty: 'easy',
    question: { en: 'What is an embassy?', el: 'Τι είναι μια πρεσβεία;' },
    options: {
      en: ['Military base abroad', 'Diplomatic mission representing a country in another', 'Trade office', 'UN agency'],
      el: ['Στρατιωτική βάση στο εξωτερικό', 'Διπλωματική αποστολή που εκπροσωπεί χώρα σε άλλη', 'Εμπορικό γραφείο', 'Φορέας ΟΗΕ']
    },
    correct: { en: 'Diplomatic mission representing a country in another', el: 'Διπλωματική αποστολή που εκπροσωπεί χώρα σε άλλη' },
    explanation: { en: 'An embassy is the diplomatic representation of one country in another, typically headed by an ambassador.', el: 'Η πρεσβεία είναι η διπλωματική εκπροσώπηση μιας χώρας σε άλλη, συνήθως με επικεφαλής πρέσβη.' }
  },
  {
    id: 'pol-48',
    category: 'InternationalLaw',
    difficulty: 'medium',
    question: { en: 'What is the principle of state sovereignty?', el: 'Τι είναι η αρχή της κρατικής κυριαρχίας;' },
    options: {
      en: ['States must obey the UN always', 'States have supreme authority within their territory', 'No state has borders', 'International law overrides domestic law'],
      el: ['Τα κράτη πρέπει να υπακούν πάντα τον ΟΗΕ', 'Τα κράτη έχουν ανώτατη εξουσία εντός του εδάφους τους', 'Κανένα κράτος δεν έχει σύνορα', 'Το διεθνές δίκαιο υπερβαίνει το εσωτερικό δίκαιο']
    },
    correct: { en: 'States have supreme authority within their territory', el: 'Τα κράτη έχουν ανώτατη εξουσία εντός του εδάφους τους' },
    explanation: { en: 'State sovereignty means that each state has full authority over its territory and domestic affairs, without subordination to other states.', el: 'Η κρατική κυριαρχία σημαίνει ότι κάθε κράτος έχει πλήρη εξουσία στο έδαφό του και στα εσωτερικά του θέματα, χωρίς υποταγή σε άλλα κράτη.' }
  },

  // === NEW: Human Rights (10) ===
  {
    id: 'pol-49',
    category: 'HumanRights',
    difficulty: 'easy',
    question: { en: 'What does freedom of expression protect?', el: 'Τι προστατεύει η ελευθερία έκφρασης;' },
    options: {
      en: ['Only official statements', 'Right to hold and express opinions without interference', 'Commercial advertising only', 'Government propaganda'],
      el: ['Μόνο επίσημες δηλώσεις', 'Δικαίωμα διατήρησης και έκφρασης απόψεων χωρίς παρέμβαση', 'Μόνο εμπορική διαφήμιση', 'Κρατική προπαγάνδα']
    },
    correct: { en: 'Right to hold and express opinions without interference', el: 'Δικαίωμα διατήρησης και έκφρασης απόψεων χωρίς παρέμβαση' },
    explanation: { en: 'Freedom of expression, under Article 19 UDHR, protects the right to seek, receive, and impart information through any media.', el: 'Η ελευθερία έκφρασης, βάσει του άρθρου 19 της Οικουμενικής Διακήρυξης, προστατεύει το δικαίωμα αναζήτησης, λήψης και μετάδοσης πληροφοριών μέσω οποιουδήποτε μέσου.' }
  },
  {
    id: 'pol-50',
    category: 'HumanRights',
    difficulty: 'medium',
    question: { en: 'What is the European Convention on Human Rights?', el: 'Τι είναι η Ευρωπαϊκή Σύμβαση Ανθρωπίνων Δικαιωμάτων;' },
    options: {
      en: ['EU-only treaty', 'Council of Europe treaty protecting fundamental rights', 'NATO agreement', 'Trade covenant'],
      el: ['Συνθήκη μόνο ΕΕ', 'Συνθήκη Συμβουλίου της Ευρώπης για θεμελιώδη δικαιώματα', 'Συμφωνία ΝΑΤΟ', 'Εμπορική συνθήκη']
    },
    correct: { en: 'Council of Europe treaty protecting fundamental rights', el: 'Συνθήκη Συμβουλίου της Ευρώπης για θεμελιώδη δικαιώματα' },
    explanation: { en: 'The ECHR, adopted in 1950 by the Council of Europe, guarantees civil and political rights and established the Strasbourg Court.', el: 'Η ΕΣΔΑ, που υιοθετήθηκε το 1950 από το Συμβούλιο της Ευρώπης, εγγυάται αστικά και πολιτικά δικαιώματα και ίδρυσε το Δικαστήριο του Στρασβούργου.' }
  },
  {
    id: 'pol-51',
    category: 'HumanRights',
    difficulty: 'hard',
    question: { en: 'What are "negative" and "positive" rights in human rights theory?', el: 'Τι είναι τα «αρνητικά» και «θετικά» δικαιώματα στη θεωρία ανθρωπίνων δικαιωμάτων;' },
    options: {
      en: ['Negative: freedom from interference; Positive: entitlement to benefits', 'Both mean the same', 'Negative: economic; Positive: civil', 'Only negative rights exist'],
      el: ['Αρνητικά: ελευθερία από παρέμβαση· Θετικά: δικαίωμα σε παροχές', 'Έχουν την ίδια σημασία', 'Αρνητικά: οικονομικά· Θετικά: αστικά', 'Υπάρχουν μόνο αρνητικά δικαιώματα']
    },
    correct: { en: 'Negative: freedom from interference; Positive: entitlement to benefits', el: 'Αρνητικά: ελευθερία από παρέμβαση· Θετικά: δικαίωμα σε παροχές' },
    explanation: { en: 'Negative rights require non-interference (e.g., freedom from torture); positive rights require provision of goods/services (e.g., education).', el: 'Τα αρνητικά δικαιώματα απαιτούν μη παρέμβαση (π.χ. ελευθερία από βασανιστήρια)· τα θετικά απαιτούν παροχή αγαθών/υπηρεσιών (π.χ. εκπαίδευση).' }
  },
  {
    id: 'pol-52',
    category: 'HumanRights',
    difficulty: 'easy',
    question: { en: 'What does the prohibition of torture entail?', el: 'Τι συνεπάγεται η απαγόρευση των βασανιστηρίων;' },
    options: {
      en: ['Allowed in emergencies', 'Absolute ban with no exceptions', 'Only in wartime', 'Optional for states'],
      el: ['Επιτρέπεται σε εκτάκτους καταστάσεις', 'Απολυταρχική απαγόρευση χωρίς εξαιρέσεις', 'Μόνο σε πολεμικές συνθήκες', 'Προαιρετική για τα κράτη']
    },
    correct: { en: 'Absolute ban with no exceptions', el: 'Απολυταρχική απαγόρευση χωρίς εξαιρέσεις' },
    explanation: { en: 'The prohibition of torture is a peremptory norm (jus cogens)—no derogation is permitted, including in war or emergency.', el: 'Η απαγόρευση των βασανιστηρίων είναι απολυταρχική νόρμα (jus cogens)—δεν επιτρέπεται καμία παρέκκλιση, συμπεριλαμβανομένου πολέμου ή έκτακτης ανάγκης.' }
  },
  {
    id: 'pol-53',
    category: 'HumanRights',
    difficulty: 'medium',
    question: { en: 'What is the UN Human Rights Council?', el: 'Τι είναι το Συμβούλιο Ανθρωπίνων Δικαιωμάτων του ΟΗΕ;' },
    options: {
      en: ['Criminal court', 'UN body promoting and protecting human rights worldwide', 'Trade tribunal', 'Security agency'],
      el: ['Ποινικό δικαστήριο', 'Όργανο ΟΗΕ για προώθηση και προστασία ανθρωπίνων δικαιωμάτων παγκοσμίως', 'Εμπορικό δικαστήριο', 'Οργανισμός ασφαλείας']
    },
    correct: { en: 'UN body promoting and protecting human rights worldwide', el: 'Όργανο ΟΗΕ για προώθηση και προστασία ανθρωπίνων δικαιωμάτων παγκοσμίως' },
    explanation: { en: 'The HRC, established in 2006, addresses human rights violations and can mandate investigations and make recommendations to the General Assembly.', el: 'Το Συμβούλιο, που ιδρύθηκε το 2006, αντιμετωπίζει παραβιάσεις ανθρωπίνων δικαιωμάτων και μπορεί να εντάξει εξετάσεις και να κάνει συστάσεις στη Γενική Συνέλευση.' }
  },
  {
    id: 'pol-54',
    category: 'HumanRights',
    difficulty: 'hard',
    question: { en: 'What is the right to asylum?', el: 'Τι είναι το δικαίωμα άσυλου;' },
    options: {
      en: ['Right to travel freely', 'Protection granted to persons fleeing persecution', 'Economic migration right', 'Tourist visa entitlement'],
      el: ['Δικαίωμα ελεύθερης μετανάστευσης', 'Προστασία που παρέχεται σε άτομα που φεύγουν από διωγμό', 'Δικαίωμα οικονομικής μετανάστευσης', 'Δικαίωμα τουριστικής βίζας']
    },
    correct: { en: 'Protection granted to persons fleeing persecution', el: 'Προστασία που παρέχεται σε άτομα που φεύγουν από διωγμό' },
    explanation: { en: 'The right to asylum, under the 1951 Refugee Convention, protects individuals who flee their country due to persecution on grounds of race, religion, nationality, or political opinion.', el: 'Το δικαίωμα άσυλου, βάσει της Σύμβασης για τους Πρόσφυγες του 1951, προστατεύει άτομα που εγκαταλείπουν τη χώρα τους λόγω διωγμού για φυλή, θρησκεία, εθνικότητα ή πολιτική άποψη.' }
  },
  {
    id: 'pol-55',
    category: 'HumanRights',
    difficulty: 'easy',
    question: { en: 'What does the right to a fair trial include?', el: 'Τι περιλαμβάνει το δικαίωμα σε δίκαιη δίκη;' },
    options: {
      en: ['Secret proceedings', 'Public hearing, presumption of innocence, legal aid', 'No appeal allowed', 'Judge appointed by accuser'],
      el: ['Μυστικές διαδικασίες', 'Δημόσια ακρόαση, αρχή της αθωότητας, νομική υποστήριξη', 'Απαγόρευση έφεσης', 'Δικαστής που διορίζει ο κατήγορος']
    },
    correct: { en: 'Public hearing, presumption of innocence, legal aid', el: 'Δημόσια ακρόαση, αρχή της αθωότητας, νομική υποστήριξη' },
    explanation: { en: 'The right to a fair trial includes access to an impartial tribunal, presumption of innocence, right to counsel, and public hearing.', el: 'Το δικαίωμα σε δίκαιη δίκη περιλαμβάνει πρόσβαση σε αμερόληπτο δικαστήριο, αρχή της αθωότητας, δικαίωμα δικηγόρου και δημόσια ακρόαση.' }
  },
  {
    id: 'pol-56',
    category: 'HumanRights',
    difficulty: 'medium',
    question: { en: 'What is the principle of non-discrimination?', el: 'Τι είναι η αρχή της μη διάκρισης;' },
    options: {
      en: ['Preference for majority', 'Equal treatment regardless of race, sex, religion, etc.', 'Quotas only', 'Separate facilities for groups'],
      el: ['Προτίμηση για την πλειοψηφία', 'Ισότιμη μεταχείριση ανεξάρτητα από φυλή, φύλο, θρησκεία κ.λπ.', 'Μόνο θέσεις', 'Χωριστές εγκαταστάσεις για ομάδες']
    },
    correct: { en: 'Equal treatment regardless of race, sex, religion, etc.', el: 'Ισότιμη μεταχείριση ανεξάρτητα από φυλή, φύλο, θρησκεία κ.λπ.' },
    explanation: { en: 'Non-discrimination requires that rights be guaranteed without distinction based on race, color, sex, language, religion, national origin, or other status.', el: 'Η μη διάκριση απαιτεί τα δικαιώματα να εγγυώνται χωρίς διάκριση για φυλή, χρώμα, φύλο, γλώσσα, θρησκεία, εθνική καταγωγή ή άλλο καθεστώς.' }
  },
  {
    id: 'pol-57',
    category: 'HumanRights',
    difficulty: 'hard',
    question: { en: 'What is the Optional Protocol to the ICCPR?', el: 'Τι είναι το Πρόσθετο Πρωτόκολλο στη ΔΕΔΠ;' },
    options: {
      en: ['Trade amendment', 'Allows individuals to complain to UN about rights violations', 'Military agreement', 'Environmental treaty'],
      el: ['Εμπορική τροποποίηση', 'Επιτρέπει στα άτομα να καταγγείλουν παραβιάσεις στον ΟΗΕ', 'Στρατιωτική συμφωνία', 'Περιβαλλοντική συνθήκη']
    },
    correct: { en: 'Allows individuals to complain to UN about rights violations', el: 'Επιτρέπει στα άτομα να καταγγείλουν παραβιάσεις στον ΟΗΕ' },
    explanation: { en: 'The First Optional Protocol to the ICCPR allows individuals to submit complaints to the Human Rights Committee about violations by states party to it.', el: 'Το Πρώτο Πρόσθετο Πρωτόκολλο στη ΔΕΔΠ επιτρέπει στα άτομα να υποβάλουν καταγγελίες στην Επιτροπή Ανθρωπίνων Δικαιωμάτων για παραβιάσεις από κράτη που το έχουν επικυρώσει.' }
  },
  {
    id: 'pol-58',
    category: 'HumanRights',
    difficulty: 'easy',
    question: { en: 'When is International Human Rights Day celebrated?', el: 'Πότε γιορτάζεται η Διεθνής Ημέρα Ανθρωπίνων Δικαιωμάτων;' },
    options: {
      en: ['1 January', '10 December', '25 June', '15 August'],
      el: ['1 Ιανουαρίου', '10 Δεκεμβρίου', '25 Ιουνίου', '15 Αυγούστου']
    },
    correct: { en: '10 December', el: '10 Δεκεμβρίου' },
    explanation: { en: 'International Human Rights Day is observed on 10 December, the date the UDHR was adopted in 1948.', el: 'Η Διεθνής Ημέρα Ανθρωπίνων Δικαιωμάτων εορτάζεται στις 10 Δεκεμβρίου, την ημερομηνία υιοθέτησης της Οικουμενικής Διακήρυξης το 1948.' }
  },

  // === NEW: Trade (5) ===
  { id: 'pol-59', category: 'Trade', difficulty: 'easy', question: { en: 'What is free trade?', el: 'Τι είναι η ελεύθερη συναλλαγή;' }, options: { en: ['Trade without tariffs or barriers', 'Government-controlled trade', 'Barter only', 'Regional trade only'], el: ['Εμπόριο χωρίς δασμούς ή εμπόδια', 'Κρατικό ελεγχόμενο εμπόριο', 'Μόνο ανταλλαγή', 'Μόνο περιφερειακό εμπόριο'] }, correct: { en: 'Trade without tariffs or barriers', el: 'Εμπόριο χωρίς δασμούς ή εμπόδια' }, explanation: { en: 'Free trade is a policy where governments do not restrict imports or exports through tariffs, quotas, or other barriers.', el: 'Η ελεύθερη συναλλαγή είναι πολιτική όπου οι κυβερνήσεις δεν περιορίζουν τις εισαγωγές ή εξαγωγές μέσω δασμών, ορίων ή άλλων εμποδίων.' } },
  { id: 'pol-60', category: 'Trade', difficulty: 'medium', question: { en: 'What is a trade bloc?', el: 'Τι είναι ένα εμπορικό μπλοκ;' }, options: { en: ['Military alliance', 'Group of countries with preferential trade agreements', 'Single company monopoly', 'UN agency'], el: ['Στρατιωτική συμμαχία', 'Ομάδα χωρών με προτιμησιακές εμπορικές συμφωνίες', 'Μονοπώλιο μίας εταιρείας', 'Φορέας ΟΗΕ'] }, correct: { en: 'Group of countries with preferential trade agreements', el: 'Ομάδα χωρών με προτιμησιακές εμπορικές συμφωνίες' }, explanation: { en: 'A trade bloc is a group of countries that agree to reduce or eliminate trade barriers among themselves.', el: 'Ένα εμπορικό μπλοκ είναι μια ομάδα χωρών που συμφωνούν να μειώσουν ή να εξαλείψουν τα εμπορικά εμπόδια μεταξύ τους.' } },
  { id: 'pol-61', category: 'Trade', difficulty: 'hard', question: { en: 'What is "most favored nation" (MFN) treatment in trade?', el: 'Τι είναι η μεταχείριση «πιο ευνοημένου έθνους» στο εμπόριο;' }, options: { en: ['Preference for richest nations', 'Equal treatment to all WTO members', 'Military allies only', 'Regional exclusivity'], el: ['Προτίμηση για τις πιο πλούσιες χώρες', 'Ισότιμη μεταχείριση σε όλα τα μέλη του ΠΟΕ', 'Μόνο στρατιωτικοί σύμμαχοι', 'Περιφερειακή αποκλειστικότητα'] }, correct: { en: 'Equal treatment to all WTO members', el: 'Ισότιμη μεταχείριση σε όλα τα μέλη του ΠΟΕ' }, explanation: { en: 'MFN under WTO rules means any favorable treatment given to one member must be given to all members.', el: 'Η μεταχείριση πιο ευνοημένου έθνους βάσει κανόνων ΠΟΕ σημαίνει ότι οποιαδήποτε ευνοϊκή μεταχείριση σε ένα μέλος πρέπει να δίνεται σε όλα τα μέλη.' } },
  { id: 'pol-62', category: 'Trade', difficulty: 'easy', question: { en: 'What is protectionism?', el: 'Τι είναι ο προστατευτισμός;' }, options: { en: ['Free market policy', 'Use of tariffs and quotas to protect domestic industry', 'Environmental regulation', 'Human rights law'], el: ['Πολιτική ελεύθερης αγοράς', 'Χρήση δασμών και ορίων για προστασία εγχώριας βιομηχανίας', 'Περιβαλλοντικοί κανονισμοί', 'Νόμος ανθρωπίνων δικαιωμάτων'] }, correct: { en: 'Use of tariffs and quotas to protect domestic industry', el: 'Χρήση δασμών και ορίων για προστασία εγχώριας βιομηχανίας' }, explanation: { en: 'Protectionism uses trade barriers to shield domestic producers from foreign competition.', el: 'Ο προστατευτισμός χρησιμοποιεί εμπορικά εμπόδια για να προστατέψει τους εγχώριους παραγωγούς από ξένη ανταγωνιστικότητα.' } },
  { id: 'pol-63', category: 'Trade', difficulty: 'medium', question: { en: 'What does GATT stand for?', el: 'Τι σημαίνει GATT;' }, options: { en: ['General Agreement on Tariffs and Trade', 'Global Agricultural Trade Treaty', 'Government Asset Transfer Treaty', 'General Arms Trade Treaty'], el: ['Γενική Συμφωνία για Δασμούς και Εμπόριο', 'Συμφωνία Παγκόσμιας Γεωργικής Συναλλαγής', 'Συμφωνία Μεταβίβασης Κρατικών Περιουσιακών Στοιχείων', 'Γενική Συνθήκη Εμπορίου Όπλων'] }, correct: { en: 'General Agreement on Tariffs and Trade', el: 'Γενική Συμφωνία για Δασμούς και Εμπόριο' }, explanation: { en: 'GATT (1947–1994) was a multilateral agreement to reduce trade barriers; it was subsumed by the WTO in 1995.', el: 'Το GATT (1947–1994) ήταν πολυμερής συμφωνία για τη μείωση εμπορικών εμποδίων· ενσωματώθηκε στον ΠΟΕ το 1995.' } },

  // === NEW: Greek Politics (10) ===
  { id: 'grpol-1', category: 'GreekPolitics', difficulty: 'easy', question: { en: 'What is the form of government in Greece?', el: 'Ποιο είναι το πολίτευμα της Ελλάδας;' }, options: { en: ['Monarchy', 'Parliamentary republic', 'Presidential republic', 'Federal republic'], el: ['Μοναρχία', 'Κοινοβουλευτική δημοκρατία', 'Προεδρευόμενη δημοκρατία', 'Ομοσπονδιακή δημοκρατία'] }, correct: { en: 'Parliamentary republic', el: 'Κοινοβουλευτική δημοκρατία' }, explanation: { en: 'Greece is a parliamentary republic; the Prime Minister leads the government and is accountable to the Parliament.', el: 'Η Ελλάδα είναι κοινοβουλευτική δημοκρατία· ο Πρωθυπουργός ηγείται της κυβέρνησης και είναι λογαριαζόμενος στο Κοινοβούλιο.' } },
  { id: 'grpol-2', category: 'GreekPolitics', difficulty: 'medium', question: { en: 'When was the current Greek Constitution adopted?', el: 'Πότε υιοθετήθηκε το σημερινό Σύνταγμα της Ελλάδας;' }, options: { en: ['1974', '1975', '1986', '2001'], el: ['1974', '1975', '1986', '2001'] }, correct: { en: '1975', el: '1975' }, explanation: { en: 'The Constitution of 1975 was adopted after the fall of the military junta (1967–1974) and the restoration of democracy.', el: 'Το Σύνταγμα του 1975 υιοθετήθηκε μετά την πτώση της στρατιωτικής χούντας (1967–1974) και την αποκατάσταση της δημοκρατίας.' } },
  { id: 'grpol-3', category: 'GreekPolitics', difficulty: 'hard', question: { en: 'How many articles does the Greek Constitution contain?', el: 'Πόσα άρθρα περιέχει το Σύνταγμα της Ελλάδας;' }, options: { en: ['100', '150', '120', '200'], el: ['100', '150', '120', '200'] }, correct: { en: '120', el: '120' }, explanation: { en: 'The Greek Constitution of 1975 comprises 120 articles organized in four parts.', el: 'Το Σύνταγμα του 1975 αποτελείται από 120 άρθρα οργανωμένα σε τέσσερα μέρη.' } },
  { id: 'grpol-4', category: 'GreekPolitics', difficulty: 'easy', question: { en: 'What is the Greek Parliament called?', el: 'Πώς ονομάζεται το ελληνικό Κοινοβούλιο;' }, options: { en: ['Congress', 'Hellenic Parliament (Vouli ton Ellinon)', 'National Assembly', 'Chamber of Deputies'], el: ['Κογκρέσο', 'Βουλή των Ελλήνων', 'Εθνοσυνέλευση', 'Αντιπροσωπευτικό Μέλος'] }, correct: { en: 'Hellenic Parliament (Vouli ton Ellinon)', el: 'Βουλή των Ελλήνων' }, explanation: { en: 'The Greek Parliament is officially called "Vouli ton Ellinon" (Βουλή των Ελλήνων).', el: 'Το ελληνικό Κοινοβούλιο ονομάζεται επίσημα «Βουλή των Ελλήνων».' } },
  { id: 'grpol-5', category: 'GreekPolitics', difficulty: 'medium', question: { en: 'What is the electoral threshold to enter the Greek Parliament?', el: 'Ποιο είναι το εκλογικό όριο για είσοδο στη Βουλή;' }, options: { en: ['1%', '2%', '3%', '5%'], el: ['1%', '2%', '3%', '5%'] }, correct: { en: '3%', el: '3%' }, explanation: { en: 'Since 2023, parties need at least 3% of the vote to enter the Greek Parliament.', el: 'Από το 2023, τα κόμματα χρειάζονται τουλάχιστον 3% των ψήφων για να μπουν στη Βουλή.' } },
  { id: 'grpol-6', category: 'GreekPolitics', difficulty: 'hard', question: { en: 'Who appoints the Prime Minister of Greece?', el: 'Ποιος διορίζει τον Πρωθυπουργό της Ελλάδας;' }, options: { en: ['Parliament', 'President of the Republic', 'Supreme Court', 'People in referendum'], el: ['Κοινοβούλιο', 'Πρόεδρος της Δημοκρατίας', 'Άρειος Πάγος', 'Λαός σε δημοψήφισμα'] }, correct: { en: 'President of the Republic', el: 'Πρόεδρος της Δημοκρατίας' }, explanation: { en: 'The President of the Republic appoints the Prime Minister, typically the leader of the party with a parliamentary majority.', el: 'Ο Πρόεδρος της Δημοκρατίας διορίζει τον Πρωθυπουργό, συνήθως τον αρχηγό του κόμματος με κοινοβουλευτική πλειοψηφία.' } },
  { id: 'grpol-7', category: 'GreekPolitics', difficulty: 'easy', question: { en: 'How many seats does the Greek Parliament have?', el: 'Πόσες έδρες έχει η Βουλή των Ελλήνων;' }, options: { en: ['250', '280', '300', '350'], el: ['250', '280', '300', '350'] }, correct: { en: '300', el: '300' }, explanation: { en: 'The Greek Parliament has 300 members, elected by universal suffrage for a four-year term.', el: 'Η Βουλή των Ελλήνων έχει 300 μέλη, που εκλέγονται με καθολική ψηφοφορία για τετραετή θητεία.' } },
  { id: 'grpol-8', category: 'GreekPolitics', difficulty: 'medium', question: { en: 'What is the role of the Greek President?', el: 'Ποιος είναι ο ρόλος του Προέδρου της Ελλάδας;' }, options: { en: ['Head of government with executive power', 'Ceremonial head of state with limited powers', 'Commander of armed forces only', 'Prime legislator'], el: ['Αρχηγός κυβέρνησης με εκτελεστική εξουσία', 'Τελετουργικός αρχηγός κράτους με περιορισμένες αρμοδιότητες', 'Αρχηγός ενόπλων δυνάμεων μόνο', 'Κύριος νομοθέτης'] }, correct: { en: 'Ceremonial head of state with limited powers', el: 'Τελετουργικός αρχηγός κράτους με περιορισμένες αρμοδιότητες' }, explanation: { en: 'The President is Greece\'s head of state with largely ceremonial duties; real executive power rests with the Prime Minister.', el: 'Ο Πρόεδρος είναι αρχηγός κράτους με κατά βάση τελετουργικά καθήκοντα· η πραγματική εκτελεστική εξουσία ανήκει στον Πρωθυπουργό.' } },
  { id: 'grpol-9', category: 'GreekPolitics', difficulty: 'hard', question: { en: 'What electoral system does Greece use for parliamentary elections?', el: 'Ποιο εκλογικό σύστημα χρησιμοποιεί η Ελλάδα για τις βουλευτικές εκλογές;' }, options: { en: ['First-past-the-post', 'Reinforced proportional representation', 'Pure proportional', 'Mixed-member proportional'], el: ['Πλειοψηφικό', 'Ενισχυμένη αναλογική εκπροσώπηση', 'Καθαρά αναλογικό', 'Μικτό αναλογικό'] }, correct: { en: 'Reinforced proportional representation', el: 'Ενισχυμένη αναλογική εκπροσώπηση' }, explanation: { en: 'Greece uses reinforced proportionality with a seat bonus for the leading party to facilitate government formation.', el: 'Η Ελλάδα χρησιμοποιεί την ενισχυμένη αναλογική με πλεονέκτημα εδρών για το πρώτο κόμμα.' } },
  { id: 'grpol-10', category: 'GreekPolitics', difficulty: 'easy', question: { en: 'Which body is the highest court in Greece for civil and criminal cases?', el: 'Ποιο όργανο είναι το ανώτατο δικαστήριο της Ελλάδας για πολιτικές και ποινικές υποθέσεις;' }, options: { en: ['Council of State', 'Court of Audit', 'Supreme Court (Areios Pagos)', 'Supreme Special Court'], el: ['Συμβούλιο της Επικρατείας', 'Ελεγκτικό Συμβούλιο', 'Άρειος Πάγος', 'Ανώτατο Ειδικό Δικαστήριο'] }, correct: { en: 'Supreme Court (Areios Pagos)', el: 'Άρειος Πάγος' }, explanation: { en: 'The Areios Pagos (Supreme Court) is the highest court for civil and criminal cases; the Council of State handles administrative law.', el: 'Ο Άρειος Πάγος είναι το ανώτατο δικαστήριο για πολιτικές και ποινικές υποθέσεις· το Συμβούλιο της Επικρατείας ασχολείται με το διοικητικό δίκαιο.' } }
];
