/**
 * Bilingual (EN/EL) Trivial Pursuit Questions
 * 30 questions per category, 6 categories, 180 total
 */

export const trivialQuestions = {
  geography: [
    {
      question: { en: 'What is the capital of Australia?', el: 'Ποια είναι η πρωτεύουσα της Αυστραλίας;' },
      options: { en: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], el: ['Σίδνεϊ', 'Μελβούρνη', 'Κάνμπερα', 'Μπρίσμπεϊν'] },
      correct: { en: 'Canberra', el: 'Κάνμπερα' },
      explanation: { en: 'Canberra was chosen as the capital in 1908 as a compromise between Sydney and Melbourne.', el: 'Η Κάνμπερα επιλέχθηκε ως πρωτεύουσα το 1908 ως συμβιβασμός μεταξύ Σίδνεϊ και Μελβούρνης.' }
    },
    {
      question: { en: 'Which river is the longest in Africa?', el: 'Ποιος ποταμός είναι ο μεγαλύτερος στην Αφρική;' },
      options: { en: ['Congo', 'Nile', 'Niger', 'Zambezi'], el: ['Κονγκό', 'Νείλος', 'Νίγηρας', 'Ζαμβέζης'] },
      correct: { en: 'Nile', el: 'Νείλος' },
      explanation: { en: 'The Nile is approximately 6,650 km long, flowing through 11 countries.', el: 'Ο Νείλος έχει μήκος περίπου 6.650 χλμ και διαρρέει 11 χώρες.' }
    },
    {
      question: { en: 'Which country has the most population in the world?', el: 'Ποια χώρα έχει τον μεγαλύτερο πληθυσμό στον κόσμο;' },
      options: { en: ['India', 'USA', 'China', 'Indonesia'], el: ['Ινδία', 'ΗΠΑ', 'Κίνα', 'Ινδονησία'] },
      correct: { en: 'India', el: 'Ινδία' },
      explanation: { en: 'India overtook China as the most populous country in 2023.', el: 'Η Ινδία ξεπέρασε την Κίνα ως η πιο πυκνοκατοικημένη χώρα το 2023.' }
    },
    {
      question: { en: 'What is the smallest country in the world by area?', el: 'Ποια είναι η μικρότερη χώρα στον κόσμο ως προς το εμβαδόν;' },
      options: { en: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], el: ['Μονακό', 'Βατικανό', 'Άγιος Μαρίνος', 'Λιχτενστάιν'] },
      correct: { en: 'Vatican City', el: 'Βατικανό' },
      explanation: { en: 'Vatican City spans approximately 0.44 square kilometers.', el: 'Το Βατικανό έχει έκταση περίπου 0,44 τετραγωνικά χιλιόμετρα.' }
    },
    {
      question: { en: 'Which ocean is the largest by surface area?', el: 'Ποιος ωκεανός είναι ο μεγαλύτερος σε έκταση επιφάνειας;' },
      options: { en: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], el: ['Ατλαντικός', 'Ινδικός', 'Ειρηνικός', 'Αρκτικός'] },
      correct: { en: 'Pacific', el: 'Ειρηνικός' },
      explanation: { en: 'The Pacific Ocean covers about 165 million square kilometers.', el: 'Ο Ειρηνικός Ωκεανός καλύπτει περίπου 165 εκατομμύρια τ.χλμ.' }
    },
    {
      question: { en: 'Mount Everest is located on the border of which two countries?', el: 'Το Όρος Έβερεστ βρίσκεται στα σύνορα ποιων δύο χωρών;' },
      options: { en: ['India and China', 'Nepal and China', 'India and Nepal', 'Bhutan and China'], el: ['Ινδία και Κίνα', 'Νεπάλ και Κίνα', 'Ινδία και Νεπάλ', 'Μπουτάν και Κίνα'] },
      correct: { en: 'Nepal and China', el: 'Νεπάλ και Κίνα' },
      explanation: { en: 'Everest sits on the border between Nepal and Tibet (China).', el: 'Το Έβερεστ βρίσκεται στα σύνορα Νεπάλ και Θιβέτ (Κίνα).' }
    },
    {
      question: { en: 'Which continent has no permanent human population?', el: 'Ποια ήπειρος δεν έχει μόνιμο ανθρώπινο πληθυσμό;' },
      options: { en: ['Greenland', 'Australia', 'Antarctica', 'Arctic islands'], el: ['Γροιλανδία', 'Αυστραλία', 'Ανταρκτική', 'Αρκτικά νησιά'] },
      correct: { en: 'Antarctica', el: 'Ανταρκτική' },
      explanation: { en: 'Antarctica has only temporary scientific research stations.', el: 'Η Ανταρκτική έχει μόνο προσωρινούς επιστημονικούς σταθμούς.' }
    },
    {
      question: { en: 'What is the capital of Kazakhstan?', el: 'Ποια είναι η πρωτεύουσα του Καζαχστάν;' },
      options: { en: ['Almaty', 'Astana', 'Bishkek', 'Tashkent'], el: ['Αλμάτι', 'Αστάνα', 'Μπισκέκ', 'Τασκένδη'] },
      correct: { en: 'Astana', el: 'Αστάνα' },
      explanation: { en: 'Astana replaced Almaty as capital in 1997. It was renamed Nur-Sultan from 2019–2022.', el: 'Η Αστάνα αντικατέστησε την Αλμάτι ως πρωτεύουσα το 1997.' }
    },
    {
      question: { en: 'The Amazon River flows through which South American country for the longest distance?', el: 'Η Amazon διαρρέει ποια νοτιοαμερικανική χώρα για τη μεγαλύτερη απόσταση;' },
      options: { en: ['Colombia', 'Peru', 'Brazil', 'Bolivia'], el: ['Κολομβία', 'Περού', 'Βραζιλία', 'Βολιβία'] },
      correct: { en: 'Brazil', el: 'Βραζιλία' },
      explanation: { en: 'About 60% of the Amazon basin is in Brazil.', el: 'Περίπου το 60% της λεκάνης του Αμαζονίου είναι στη Βραζιλία.' }
    },
    {
      question: { en: 'Which country has the most islands?', el: 'Ποια χώρα έχει τα περισσότερα νησιά;' },
      options: { en: ['Indonesia', 'Philippines', 'Sweden', 'Finland'], el: ['Ινδονησία', 'Φιλιππίνες', 'Σουηδία', 'Φινλανδία'] },
      correct: { en: 'Sweden', el: 'Σουηδία' },
      explanation: { en: 'Sweden has over 267,000 islands, the most of any country.', el: 'Η Σουηδία έχει πάνω από 267.000 νησιά, τα περισσότερα παγκοσμίως.' }
    },
    {
      question: { en: 'The Suez Canal connects which two bodies of water?', el: 'Η Διώρυγα του Σουέζ συνδέει ποια δύο νερά;' },
      options: { en: ['Red Sea and Arabian Sea', 'Mediterranean and Red Sea', 'Mediterranean and Black Sea', 'Indian Ocean and Arabian Sea'], el: ['Ερυθρά Θάλασσα και Αραβική Θάλασσα', 'Μεσόγειος και Ερυθρά Θάλασσα', 'Μεσόγειος και Μαύρη Θάλασσα', 'Ινδικός Ωκεανός και Αραβική Θάλασσα'] },
      correct: { en: 'Mediterranean and Red Sea', el: 'Μεσόγειος και Ερυθρά Θάλασσα' },
      explanation: { en: 'The Suez Canal links the Mediterranean Sea to the Red Sea.', el: 'Η Διώρυγα του Σουέζ συνδέει τη Μεσόγειο με την Ερυθρά Θάλασσα.' }
    },
    {
      question: { en: 'Which African country was never colonized by Europe?', el: 'Ποια αφρικανική χώρα δεν αποικίστηκε ποτέ από την Ευρώπη;' },
      options: { en: ['Ethiopia', 'Liberia', 'Both Ethiopia and Liberia', 'Morocco'], el: ['Αιθιοπία', 'Λιβερία', 'Και η Αιθιοπία και η Λιβερία', 'Μαρόκο'] },
      correct: { en: 'Both Ethiopia and Liberia', el: 'Και η Αιθιοπία και η Λιβερία' },
      explanation: { en: 'Ethiopia resisted colonization; Liberia was founded by freed US slaves.', el: 'Η Αιθιοπία απέκρουσε την αποικιοκρατία· η Λιβερία ιδρύθηκε από απελευθερωμένους σκλάβους.' }
    },
    {
      question: { en: 'What is the highest waterfall in the world?', el: 'Ποιο είναι το ψηλότερο καταρράκτη στον κόσμο;' },
      options: { en: ['Victoria Falls', 'Angel Falls', 'Niagara Falls', 'Iguazu Falls'], el: ['Καταρράκτες Βικτώρια', 'Καταρράκτες Angel', 'Νιαγάρα', 'Ιγκουασού'] },
      correct: { en: 'Angel Falls', el: 'Καταρράκτες Angel' },
      explanation: { en: 'Angel Falls in Venezuela drops 979 meters from Auyán-tepui.', el: 'Οι καταρράκτες Angel στη Βενεζουέλα έχουν πτώση 979 μέτρων.' }
    },
    {
      question: { en: 'Which country has the longest coastline in the world?', el: 'Ποια χώρα έχει τη μεγαλύτερη ακτογραμμή στον κόσμο;' },
      options: { en: ['Russia', 'Canada', 'Indonesia', 'Australia'], el: ['Ρωσία', 'Καναδάς', 'Ινδονησία', 'Αυστραλία'] },
      correct: { en: 'Canada', el: 'Καναδάς' },
      explanation: { en: 'Canada has about 243,000 km of coastline including Arctic islands.', el: 'Ο Καναδάς έχει περίπου 243.000 χλμ ακτογραμμής.' }
    },
    {
      question: { en: 'The Strait of Gibraltar separates which two landmasses?', el: 'Το Στενό της Γιβραλτάρ χωρίζει ποιες δύο ξηρές;' },
      options: { en: ['Spain and Morocco', 'Europe and Africa', 'Portugal and Morocco', 'France and Algeria'], el: ['Ισπανία και Μαρόκο', 'Ευρώπη και Αφρική', 'Πορτογαλία και Μαρόκο', 'Γαλλία και Αλγερία'] },
      correct: { en: 'Europe and Africa', el: 'Ευρώπη και Αφρική' },
      explanation: { en: 'The strait connects the Atlantic to the Mediterranean between Europe and Africa.', el: 'Το στενό συνδέει τον Ατλαντικό με τη Μεσόγειο μεταξύ Ευρώπης και Αφρικής.' }
    },
    {
      question: { en: 'Which country is both in Europe and Asia?', el: 'Ποια χώρα βρίσκεται τόσο στην Ευρώπη όσο και στην Ασία;' },
      options: { en: ['Georgia', 'Turkey', 'Egypt', 'Russia'], el: ['Γεωργία', 'Τουρκία', 'Αίγυπτος', 'Ρωσία'] },
      correct: { en: 'Turkey', el: 'Τουρκία' },
      explanation: { en: 'Istanbul sits on the Bosphorus, dividing European and Asian Turkey.', el: 'Η Κωνσταντινούπολη βρίσκεται στον Βόσπορο, χωρίζοντας την Ευρωπαϊκή από την Ασιατική Τουρκία.' }
    },
    {
      question: { en: 'What is the largest desert in the world?', el: 'Ποια είναι η μεγαλύτερη έρημος στον κόσμο;' },
      options: { en: ['Sahara', 'Arabian', 'Antarctic', 'Gobi'], el: ['Σαχάρα', 'Αραβική', 'Ανταρκτική', 'Γκόμπι'] },
      correct: { en: 'Antarctic', el: 'Ανταρκτική' },
      explanation: { en: 'Antarctica is classified as a cold desert; Sahara is the largest hot desert.', el: 'Η Ανταρκτική είναι ψυχρή έρημος· η Σαχάρα είναι η μεγαλύτερη ζεστή έρημος.' }
    },
    {
      question: { en: 'Which sea is the Dead Sea a part of?', el: 'Τι θάλασσα είναι η Νεκρή Θάλασσα;' },
      options: { en: ['It is a lake', 'Red Sea', 'Mediterranean', 'Caspian Sea'], el: ['Είναι λίμνη', 'Ερυθρά Θάλασσα', 'Μεσόγειος', 'Κασπία Θάλασσα'] },
      correct: { en: 'It is a lake', el: 'Είναι λίμνη' },
      explanation: { en: 'The Dead Sea is actually a hypersaline lake, not connected to any sea.', el: 'Η Νεκρή Θάλασσα είναι στην πραγματικότητα αλμυρή λίμνη.' }
    },
    {
      question: { en: 'What is the capital of Mongolia?', el: 'Ποια είναι η πρωτεύουσα της Μογγολίας;' },
      options: { en: ['Ulaanbaatar', 'Almaty', 'Bishkek', 'Dushanbe'], el: ['Ουλάν Μπατόρ', 'Αλμάτι', 'Μπισκέκ', 'Ντουσάνμπε'] },
      correct: { en: 'Ulaanbaatar', el: 'Ουλάν Μπατόρ' },
      explanation: { en: "Ulaanbaatar means 'Red Hero' and is one of the coldest national capitals.", el: 'Η Ουλάν Μπατόρ σημαίνει Κόκκινος Ήρωας και είναι από τις ψυχρότερες πρωτεύουσες.' }
    },
    {
      question: { en: 'Which river flows through Paris?', el: 'Ποιος ποταμός διαρρέει το Παρίσι;' },
      options: { en: ['Rhine', 'Loire', 'Seine', 'Thames'], el: ['Ρήνος', 'Λίγηρας', 'Σηκουάνας', 'Τάμεσης'] },
      correct: { en: 'Seine', el: 'Σηκουάνας' },
      explanation: { en: 'The Seine flows through Paris and empties into the English Channel.', el: 'Η Σηκουάνας διασχίζει το Παρίσι και εκβάλλει στη Μάγχη.' }
    },
    {
      question: { en: 'Which continent contains the most countries?', el: 'Ποια ήπειρος περιέχει τις περισσότερες χώρες;' },
      options: { en: ['Asia', 'Europe', 'Africa', 'South America'], el: ['Ασία', 'Ευρώπη', 'Αφρική', 'Νότια Αμερική'] },
      correct: { en: 'Africa', el: 'Αφρική' },
      explanation: { en: 'Africa has 54 recognized sovereign states.', el: 'Η Αφρική έχει 54 αναγνωρισμένα κυρίαρχα κράτη.' }
    },
    {
      question: { en: 'Mount Kilimanjaro is located in which country?', el: 'Το Όρος Κιλιμάντζαρο βρίσκεται σε ποια χώρα;' },
      options: { en: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'], el: ['Κένυα', 'Τανζανία', 'Ουγκάντα', 'Αιθιοπία'] },
      correct: { en: 'Tanzania', el: 'Τανζανία' },
      explanation: { en: 'Kilimanjaro is in northeastern Tanzania, near the Kenyan border.', el: 'Το Κιλιμάντζαρο βρίσκεται στη βορειοανατολική Τανζανία.' }
    },
    {
      question: { en: 'Which country has the flag with a maple leaf?', el: 'Ποια χώρα έχει τη σημαία με το φύλλο σφενδάμου;' },
      options: { en: ['USA', 'Canada', 'New Zealand', 'Australia'], el: ['ΗΠΑ', 'Καναδάς', 'Νέα Ζηλανδία', 'Αυστραλία'] },
      correct: { en: 'Canada', el: 'Καναδάς' },
      explanation: { en: "Canada's flag features an 11-pointed red maple leaf on white.", el: 'Η σημαία του Καναδά έχει κόκκινο φύλλο σφενδάμου σε λευκό φόντο.' }
    },
    {
      question: { en: 'The Great Barrier Reef is off the coast of which country?', el: 'Η Μεγάλη Κοραλλοφύκη είναι ακτοπλοϊκά ποιας χώρας;' },
      options: { en: ['Indonesia', 'Philippines', 'Australia', 'Thailand'], el: ['Ινδονησία', 'Φιλιππίνες', 'Αυστραλία', 'Ταϊλάνδη'] },
      correct: { en: 'Australia', el: 'Αυστραλία' },
      explanation: { en: 'The Great Barrier Reef lies off Queensland, Australia.', el: 'Η Μεγάλη Κοραλλοφύκη βρίσκεται ακτοπλοϊκά του Κουίνσλαντ, Αυστραλία.' }
    },
    {
      question: { en: 'Which country shares the longest border with France?', el: 'Ποια χώρα έχει το μεγαλύτερο μεθόριο με τη Γαλλία;' },
      options: { en: ['Germany', 'Spain', 'Belgium', 'Italy'], el: ['Γερμανία', 'Ισπανία', 'Βέλγιο', 'Ιταλία'] },
      correct: { en: 'Spain', el: 'Ισπανία' },
      explanation: { en: 'France–Spain border runs about 623 km along the Pyrenees.', el: 'Το γαλλο-ισπανικό σύνορο είναι περίπου 623 χλμ στους Πυρηναίους.' }
    },
    {
      question: { en: 'Lake Baikal is located in which country?', el: 'Η Λίμνη Βαϊκάλη βρίσκεται σε ποια χώρα;' },
      options: { en: ['Mongolia', 'Russia', 'Kazakhstan', 'China'], el: ['Μογγολία', 'Ρωσία', 'Καζαχστάν', 'Κίνα'] },
      correct: { en: 'Russia', el: 'Ρωσία' },
      explanation: { en: 'Baikal in Siberia is the world\'s deepest and oldest freshwater lake.', el: 'Η Βαϊκάλη στη Σιβηρία είναι η βαθύτερη και αρχαιότερη γλυκού νερού λίμνη.' }
    },
    {
      question: { en: 'Which city is known as the City of Bridges?', el: 'Ποια πόλη είναι γνωστή ως η Πόλη των Γεφυρών;' },
      options: { en: ['Amsterdam', 'Venice', 'Hamburg', 'Pittsburgh'], el: ['Άμστερνταμ', 'Βενετία', 'Αμβούργο', 'Πίτσμπεργκ'] },
      correct: { en: 'Hamburg', el: 'Αμβούργο' },
      explanation: { en: 'Hamburg has over 2,500 bridges, more than Venice and Amsterdam combined.', el: 'Το Αμβούργο έχει πάνω από 2.500 γέφυρες.' }
    },
    {
      question: { en: 'The Andes mountain range runs through how many countries?', el: 'Διασχίζει η οροσειρά των Άνδεων πόσες χώρες;' },
      options: { en: ['5', '7', '9', '11'], el: ['5', '7', '9', '11'] },
      correct: { en: '7', el: '7' },
      explanation: { en: 'The Andes traverse Venezuela, Colombia, Ecuador, Peru, Bolivia, Chile, and Argentina.', el: 'Οι Άνδεις διασχίζουν Βενεζουέλα, Κολομβία, Εκουαδόρ, Περού, Βολιβία, Χιλή και Αργεντινή.' }
    },
    {
      question: { en: 'What is the capital of South Korea?', el: 'Ποια είναι η πρωτεύουσα της Νότιας Κορέας;' },
      options: { en: ['Busan', 'Seoul', 'Incheon', 'Daegu'], el: ['Πουσάν', 'Σεούλ', 'Ιντσόν', 'Τεγκού'] },
      correct: { en: 'Seoul', el: 'Σεούλ' },
      explanation: { en: 'Seoul has been the capital since 1394 and is one of the largest metropolises.', el: 'Η Σεούλ είναι πρωτεύουσα από το 1394.' }
    },
    {
      question: { en: 'Which European country has no official capital city?', el: 'Ποια ευρωπαϊκή χώρα δεν έχει επίσημη πρωτεύουσα;' },
      options: { en: ['Switzerland', 'Monaco', 'Liechtenstein', 'San Marino'], el: ['Ελβετία', 'Μονακό', 'Λιχτενστάιν', 'Άγιος Μαρίνος'] },
      correct: { en: 'Switzerland', el: 'Ελβετία' },
      explanation: { en: 'Bern is the de facto capital, but Switzerland has no constitutionally designated capital.', el: 'Η Βέρνη είναι de facto πρωτεύουσα αλλά δεν υπάρχει συνταγματικά ορισμένη πρωτεύουσα.' }
    }
  ],
  entertainment: [
    {
      question: { en: 'Who directed the film "Pulp Fiction"?', el: 'Ποιος σκηνοθέτησε την ταινία "Pulp Fiction";' },
      options: { en: ['Martin Scorsese', 'Quentin Tarantino', 'Coen Brothers', 'David Lynch'], el: ['Μάρτιν Σκορσέζε', 'Κουέντιν Ταραντίνο', 'Coen Brothers', 'Ντέιβιντ Λιντς'] },
      correct: { en: 'Quentin Tarantino', el: 'Κουέντιν Ταραντίνο' },
      explanation: { en: 'Tarantino wrote and directed the 1994 crime film.', el: 'Ο Ταραντίνο έγραψε και σκηνοθέτησε την ταινία εγκλήματος του 1994.' }
    },
    {
      question: { en: 'Which TV series features Walter White as the main character?', el: 'Ποια σειρά έχει τον Γουόλτερ Γουάιτ ως κύριο χαρακτήρα;' },
      options: { en: ['The Sopranos', 'Breaking Bad', 'Better Call Saul', 'Ozark'], el: ['The Sopranos', 'Breaking Bad', 'Better Call Saul', 'Ozark'] },
      correct: { en: 'Breaking Bad', el: 'Breaking Bad' },
      explanation: { en: 'Bryan Cranston played Walter White in the acclaimed AMC drama.', el: 'Ο Μπράιαν Κράνστον ενσάρκωσε τον Γουόλτερ Γουάιτ στην εκπομπή.' }
    },
    {
      question: { en: 'Who sang "Bohemian Rhapsody"?', el: 'Ποιος τραγούδησε το "Bohemian Rhapsody";' },
      options: { en: ['The Beatles', 'Led Zeppelin', 'Queen', 'Pink Floyd'], el: ['The Beatles', 'Led Zeppelin', 'Queen', 'Pink Floyd'] },
      correct: { en: 'Queen', el: 'Queen' },
      explanation: { en: 'Freddie Mercury wrote and sang the 1975 hit for Queen.', el: 'Ο Freddie Mercury έγραψε και τραγούδησε το hit του 1975.' }
    },
    {
      question: { en: 'Which streaming service produced "The Crown"?', el: 'Ποια πλατφόρμα streaming παρήγαγε το "The Crown";' },
      options: { en: ['HBO Max', 'Amazon Prime', 'Netflix', 'Disney+'], el: ['HBO Max', 'Amazon Prime', 'Netflix', 'Disney+'] },
      correct: { en: 'Netflix', el: 'Netflix' },
      explanation: { en: 'The Crown is a Netflix original series about Queen Elizabeth II.', el: 'Το The Crown είναι πρωτότυπη σειρά του Netflix για τη βασίλισσα Ελισάβετ Β\'.' }
    },
    {
      question: { en: 'In which year did the first Star Wars film release?', el: 'Σε ποιο έτος κυκλοφόρησε η πρώτη ταινία Star Wars;' },
      options: { en: ['1975', '1977', '1979', '1981'], el: ['1975', '1977', '1979', '1981'] },
      correct: { en: '1977', el: '1977' },
      explanation: { en: 'Star Wars: Episode IV – A New Hope opened in theaters in 1977.', el: 'Το Star Wars: Επεισόδιο IV κυκλοφόρησε στους κινηματογράφους το 1977.' }
    },
    {
      question: { en: 'Which actor played Jack in Titanic?', el: 'Ποιος ηθοποιός ενσάρκωσε τον Τζακ στο Titanic;' },
      options: { en: ['Brad Pitt', 'Leonardo DiCaprio', 'Matt Damon', 'Tom Cruise'], el: ['Μπραντ Πιτ', 'Λεονάρντο Ντι Κάπριο', 'Ματ Ντέιμον', 'Τομ Κρουζ'] },
      correct: { en: 'Leonardo DiCaprio', el: 'Λεονάρντο Ντι Κάπριο' },
      explanation: { en: 'DiCaprio starred opposite Kate Winslet in the 1997 film.', el: 'Ο Ντι Κάπριο πρωταγωνίστησε με την Κέιτ Γουίνσλετ στην ταινία του 1997.' }
    },
    {
      question: { en: 'Which video game franchise features Master Chief?', el: 'Ποιο franchise βιντεοπαιχνιδιών έχει τον Master Chief;' },
      options: { en: ['Call of Duty', 'Halo', 'Gears of War', 'Destiny'], el: ['Call of Duty', 'Halo', 'Gears of War', 'Destiny'] },
      correct: { en: 'Halo', el: 'Halo' },
      explanation: { en: 'Master Chief is the protagonist of the Halo series by Microsoft.', el: 'Ο Master Chief είναι ο πρωταγωνιστής της σειράς Halo.' }
    },
    {
      question: { en: 'Who won the most Grammy Awards for Album of the Year?', el: 'Ποιος έχει κερδίσει τα περισσότερα Grammy για Album της Χρονιάς;' },
      options: { en: ['Frank Sinatra', 'Stevie Wonder', 'Paul Simon', 'U2'], el: ['Φρανκ Σινάτρα', 'Στιβι Γουόντερ', 'Πολ Σάιμον', 'U2'] },
      correct: { en: 'Frank Sinatra', el: 'Φρανκ Σινάτρα' },
      explanation: { en: 'Sinatra won the award three times in the 1960s.', el: 'Ο Σινάτρα το κέρδισε τρεις φορές τη δεκαετία του 1960.' }
    },
    {
      question: { en: 'Which animated film won the first Oscar for Best Animated Feature?', el: 'Ποια κινούμενη ταινία κέρδισε το πρώτο Όσκαρ Καλύτερης Κινούμενης Ταινίας;' },
      options: { en: ['Toy Story', 'Shrek', 'Spirited Away', 'Finding Nemo'], el: ['Toy Story', 'Shrek', 'Ταξίδι στη Χώρα των Θαυμάτων', 'Finding Nemo'] },
      correct: { en: 'Shrek', el: 'Shrek' },
      explanation: { en: 'The category was introduced in 2001; Shrek won in 2002.', el: 'Η κατηγορία δημιουργήθηκε το 2001 και το Shrek κέρδισε το 2002.' }
    },
    {
      question: { en: 'In which Broadway musical does Elphaba sing "Defying Gravity"?', el: 'Σε ποιο μιούζικαλ του Broadway τραγουδά η Elphaba το "Defying Gravity";' },
      options: { en: ['The Lion King', 'Wicked', 'Hamilton', 'Phantom of the Opera'], el: ['Ο Βασιλιάς των Λιονταριών', 'Wicked', 'Hamilton', 'Το Φάντασμα της Όπερας'] },
      correct: { en: 'Wicked', el: 'Wicked' },
      explanation: { en: 'Wicked tells the backstory of the Wicked Witch of the West.', el: 'Το Wicked αφηγείται την προϊστορία της Κακιάς Μάγισσας της Δύσης.' }
    },
    {
      question: { en: 'Who created the television series "Game of Thrones"?', el: 'Ποιος δημιούργησε τη σειρά "Game of Thrones";' },
      options: { en: ['J.J. Abrams', 'David Benioff and D.B. Weiss', 'Vince Gilligan', 'Damon Lindelof'], el: ['J.J. Abrams', 'David Benioff και D.B. Weiss', 'Vince Gilligan', 'Damon Lindelof'] },
      correct: { en: 'David Benioff and D.B. Weiss', el: 'David Benioff και D.B. Weiss' },
      explanation: { en: 'They adapted George R.R. Martin\'s A Song of Ice and Fire novels.', el: 'Προσάρμοσαν τα μυθιστορήματα A Song of Ice and Fire του Martin.' }
    },
    {
      question: { en: 'Which band performed "Smells Like Teen Spirit"?', el: 'Ποιο συγκρότημα ερμήνευσε το "Smells Like Teen Spirit";' },
      options: { en: ['Pearl Jam', 'Soundgarden', 'Nirvana', 'Alice in Chains'], el: ['Pearl Jam', 'Soundgarden', 'Nirvana', 'Alice in Chains'] },
      correct: { en: 'Nirvana', el: 'Nirvana' },
      explanation: { en: 'The song defined grunge and became Nirvana\'s signature anthem.', el: 'Το τραγούδι καθόρισε το grunge και έγινε το ύμνος των Nirvana.' }
    },
    {
      question: { en: 'What is the highest-grossing film of all time (unadjusted)?', el: 'Ποια είναι η ταινία με τα μεγαλύτερα έσοδα όλων των εποχών (χωρίς προσαρμογή);' },
      options: { en: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Avatar: The Way of Water'], el: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Avatar: The Way of Water'] },
      correct: { en: 'Avatar', el: 'Avatar' },
      explanation: { en: 'Avatar held the record; re-releases have shifted rankings.', el: 'Το Avatar κατείχε το ρεκόρ· οι επανεκδόσεις άλλαξαν τις τάξεις.' }
    },
    {
      question: { en: 'Which comedy troupe created "Monty Python and the Holy Grail"?', el: 'Ποια κωμική ομάδα δημιούργησε το "Monty Python και το Ιερό Δισκοπότηρο";' },
      options: { en: ['The Kids in the Hall', 'Monty Python', 'The League of Gentlemen', 'Fawlty Towers'], el: ['The Kids in the Hall', 'Monty Python', 'The League of Gentlemen', 'Fawlty Towers'] },
      correct: { en: 'Monty Python', el: 'Monty Python' },
      explanation: { en: 'Monty Python\'s Flying Circus members made the 1975 film.', el: 'Τα μέλη του Monty Python\'s Flying Circus έκαναν την ταινία του 1975.' }
    },
    {
      question: { en: 'Who played the Joker in "The Dark Knight"?', el: 'Ποιος ενσάρκωσε τον Joker στο "The Dark Knight";' },
      options: { en: ['Jack Nicholson', 'Heath Ledger', 'Joaquin Phoenix', 'Jared Leto'], el: ['Τζακ Νίκολσον', 'Χιθ Λέτζερ', 'Χοακίν Φοίνιξ', 'Τζάρεντ Λέτο'] },
      correct: { en: 'Heath Ledger', el: 'Χιθ Λέτζερ' },
      explanation: { en: 'Ledger won a posthumous Oscar for the role.', el: 'Ο Λέτζερ κέρδισε μετεπανεκλογικό Όσκαρ για τον ρόλο.' }
    },
    {
      question: { en: 'Which video game has the character Mario?', el: 'Ποιο βιντεοπαιχνίδι έχει τον χαρακτήρα Mario;' },
      options: { en: ['Sonic', 'Donkey Kong', 'Super Mario Bros', 'Zelda'], el: ['Sonic', 'Donkey Kong', 'Super Mario Bros', 'Zelda'] },
      correct: { en: 'Super Mario Bros', el: 'Super Mario Bros' },
      explanation: { en: 'Mario debuted in Donkey Kong and stars in the Super Mario franchise.', el: 'Ο Mario έκανε ντεμπούτο στο Donkey Kong και πρωταγωνιστεί στο franchise.' }
    },
    {
      question: { en: 'What TV show is set in the town of Hawkins, Indiana?', el: 'Ποια σειρά διαδραματίζεται στην πόλη Hawkins της Ιντιάνα;' },
      options: { en: ['The Walking Dead', 'Stranger Things', 'Twin Peaks', 'Riverdale'], el: ['The Walking Dead', 'Stranger Things', 'Twin Peaks', 'Riverdale'] },
      correct: { en: 'Stranger Things', el: 'Stranger Things' },
      explanation: { en: 'The Duffer Brothers created the Netflix sci-fi hit.', el: 'Οι Duffer Brothers δημιούργησαν το sci-fi hit του Netflix.' }
    },
    {
      question: { en: 'Which artist released the album "21"?', el: 'Ποιος καλλιτέχνης κυκλοφόρησε το άλμπουμ "21";' },
      options: { en: ['Taylor Swift', 'Adele', 'Beyoncé', 'Rihanna'], el: ['Taylor Swift', 'Αντέλ', 'Μπιγιονσέ', 'Ριάννα'] },
      correct: { en: 'Adele', el: 'Αντέλ' },
      explanation: { en: 'Adele\'s 21 included "Rolling in the Deep" and "Someone Like You".', el: 'Το 21 περιλάμβανε το "Rolling in the Deep" και "Someone Like You".' }
    },
    {
      question: { en: 'Which Pixar film features a rat who wants to cook?', el: 'Ποια ταινία της Pixar έχει έναν αρουραίο που θέλει να μαγειρέψει;' },
      options: { en: ['Finding Nemo', 'Ratatouille', 'Up', 'Wall-E'], el: ['Finding Nemo', 'Ratatouille', 'Up', 'Wall-E'] },
      correct: { en: 'Ratatouille', el: 'Ratatouille' },
      explanation: { en: 'Ratatouille (2007) follows Remy the rat in Paris.', el: 'Το Ratatouille (2007) ακολουθεί τον αρουραίο Remy στο Παρίσι.' }
    },
    {
      question: { en: 'Who wrote "Harry Potter"?', el: 'Ποια έγραψε το "Harry Potter";' },
      options: { en: ['Philip Pullman', 'J.K. Rowling', 'Neil Gaiman', 'Terry Pratchett'], el: ['Philip Pullman', 'J.K. Rowling', 'Neil Gaiman', 'Terry Pratchett'] },
      correct: { en: 'J.K. Rowling', el: 'J.K. Rowling' },
      explanation: { en: 'Rowling published the first book in 1997.', el: 'Η Rowling δημοσίευσε το πρώτο βιβλίο το 1997.' }
    },
    {
      question: { en: 'Which film won Best Picture at the 2020 Oscars?', el: 'Ποια ταινία κέρδισε Καλύτερη Ταινία στα Όσκαρ 2020;' },
      options: { en: ['1917', 'Parasite', 'Joker', 'Once Upon a Time in Hollywood'], el: ['1917', 'Parasite', 'Joker', 'Once Upon a Time in Hollywood'] },
      correct: { en: 'Parasite', el: 'Parasite' },
      explanation: { en: 'Bong Joon-ho\'s Parasite was the first non-English Best Picture winner.', el: 'Το Parasite του Μπong Joon-ho ήταν η πρώτη μη αγγλόφωνη νικήτρια.' }
    },
    {
      question: { en: 'Which band had a hit with "Stairway to Heaven"?', el: 'Ποιο συγκρότημα είχε επιτυχία με το "Stairway to Heaven";' },
      options: { en: ['The Who', 'Queen', 'Led Zeppelin', 'Black Sabbath'], el: ['The Who', 'Queen', 'Led Zeppelin', 'Black Sabbath'] },
      correct: { en: 'Led Zeppelin', el: 'Led Zeppelin' },
      explanation: { en: 'The song appears on Led Zeppelin IV (1971).', el: 'Το τραγούδι εμφανίζεται στο Led Zeppelin IV (1971).' }
    },
    {
      question: { en: 'What is the name of the coffee shop in "Friends"?', el: 'Ποιο είναι το όνομα του καφέ στο "Friends";' },
      options: { en: ['Central Perk', 'Coffee Central', 'The Perk', 'Central Coffee'], el: ['Central Perk', 'Coffee Central', 'The Perk', 'Central Coffee'] },
      correct: { en: 'Central Perk', el: 'Central Perk' },
      explanation: { en: 'Central Perk was where the friends often gathered.', el: 'Στο Central Perk συναθροίζονταν συχνά οι φίλοι.' }
    },
    {
      question: { en: 'Which actor has won the most Academy Awards for acting?', el: 'Ποιος ηθοποιός έχει κερδίσει τα περισσότερα Όσκαρ ηθοποιίας;' },
      options: { en: ['Meryl Streep', 'Katharine Hepburn', 'Jack Nicholson', 'Daniel Day-Lewis'], el: ['Μέριλ Στριπ', 'Κάθριν Χέπμπορν', 'Τζακ Νίκολσον', 'Ντάνιελ Ντέι Λιούις'] },
      correct: { en: 'Katharine Hepburn', el: 'Κάθριν Χέπμπορν' },
      explanation: { en: 'Hepburn won four Best Actress Oscars between 1933 and 1981.', el: 'Η Hepburn κέρδισε τέσσερα Όσκαρ Καλύτερης Ηθοποιού μεταξύ 1933 και 1981.' }
    },
    {
      question: { en: 'Which streaming platform released "Squid Game"?', el: 'Ποια πλατφόρμα streaming κυκλοφόρησε το "Squid Game";' },
      options: { en: ['Amazon Prime', 'Netflix', 'HBO Max', 'Disney+'], el: ['Amazon Prime', 'Netflix', 'HBO Max', 'Disney+'] },
      correct: { en: 'Netflix', el: 'Netflix' },
      explanation: { en: 'The Korean drama became Netflix\'s most-watched show in 2021.', el: 'Το κορεατικό drama έγινε η πιο δημοφιλής σειρά του Netflix το 2021.' }
    },
    {
      question: { en: 'Who composed the score for "Jaws"?', el: 'Ποιος συνέθεσε τη μουσική του "Τα Σαγόνια της Θάλασσας";' },
      options: { en: ['Hans Zimmer', 'John Williams', 'Ennio Morricone', 'Jerry Goldsmith'], el: ['Hans Zimmer', 'John Williams', 'Ένιο Μορρικόνε', 'Jerry Goldsmith'] },
      correct: { en: 'John Williams', el: 'John Williams' },
      explanation: { en: 'Williams created the iconic two-note shark theme.', el: 'Ο Williams δημιούργησε το χαρακτηριστικό δίφθογγο θέμα του καρχαρία.' }
    },
    {
      question: { en: 'Which animated series features Homer Simpson?', el: 'Ποια σειρά κινουμένων σχεδίων έχει τον Χόμερ Σίμπσον;' },
      options: { en: ['Family Guy', 'The Simpsons', 'South Park', 'Futurama'], el: ['Family Guy', 'The Simpsons', 'South Park', 'Futurama'] },
      correct: { en: 'The Simpsons', el: 'The Simpsons' },
      explanation: { en: 'The Simpsons is the longest-running American sitcom.', el: 'Το The Simpsons είναι η μακροβιότερη αμερικανική sitcom.' }
    },
    {
      question: { en: 'What year did MTV launch?', el: 'Ποιο έτος ξεκίνησε το MTV;' },
      options: { en: ['1979', '1981', '1983', '1985'], el: ['1979', '1981', '1983', '1985'] },
      correct: { en: '1981', el: '1981' },
      explanation: { en: 'MTV aired "Video Killed the Radio Star" as its first video.', el: 'Το MTV προβλήθηκε το "Video Killed the Radio Star" ως πρώτο βίντεο.' }
    },
    {
      question: { en: 'Which band performed "Hotel California"?', el: 'Ποιο συγκρότημα ερμήνευσε το "Hotel California";' },
      options: { en: ['The Eagles', 'Fleetwood Mac', 'Journey', 'Boston'], el: ['The Eagles', 'Fleetwood Mac', 'Journey', 'Boston'] },
      correct: { en: 'The Eagles', el: 'The Eagles' },
      explanation: { en: 'The song is on the 1976 album of the same name.', el: 'Το τραγούδι είναι στο άλμπουμ του 1976 με το ίδιο όνομα.' }
    },
    {
      question: { en: 'Who directed "2001: A Space Odyssey"?', el: 'Ποιος σκηνοθέτησε το "2001: Οδύσσεια του Διαστήματος";' },
      options: { en: ['Steven Spielberg', 'Stanley Kubrick', 'Ridley Scott', 'James Cameron'], el: ['Στίβεν Σπίλμπεργκ', 'Στάνλεϊ Κούμπρικ', 'Ridley Scott', 'Τζέιμς Κάμερον'] },
      correct: { en: 'Stanley Kubrick', el: 'Στάνλεϊ Κούμπρικ' },
      explanation: { en: 'Kubrick co-wrote and directed the 1968 sci-fi masterpiece.', el: 'Ο Κούμπρικ συνέγραψε και σκηνοθέτησε το αριστούργημα του 1968.' }
    },
  ],
  history: [
    {
      question: { en: 'In which year did the Berlin Wall fall?', el: 'Σε ποιο έτος έπεσε το Τείχος του Βερολίνου;' },
      options: { en: ['1987', '1989', '1991', '1985'], el: ['1987', '1989', '1991', '1985'] },
      correct: { en: '1989', el: '1989' },
      explanation: { en: 'The wall fell on November 9, 1989, symbolizing the end of the Cold War.', el: 'Το τείχος έπεσε στις 9 Νοεμβρίου 1989, συμβολίζοντας το τέλος του Ψυχρού Πολέμου.' }
    },
    {
      question: { en: 'Who was the first emperor of unified China?', el: 'Ποιος ήταν ο πρώτος αυτοκράτορας της ενωμένης Κίνας;' },
      options: { en: ['Han Wudi', 'Qin Shi Huang', 'Emperor Wen', 'Wu Zetian'], el: ['Han Wudi', 'Qin Shi Huang', 'Αυτοκράτορας Wen', 'Wu Zetian'] },
      correct: { en: 'Qin Shi Huang', el: 'Qin Shi Huang' },
      explanation: { en: 'Qin Shi Huang unified China in 221 BCE and ordered the Terracotta Army.', el: 'Ο Qin Shi Huang ενώθηκε την Κίνα το 221 π.Χ. και διέταξε τον Τερακότα Στρατό.' }
    },
    {
      question: { en: 'Which ancient civilization built Machu Picchu?', el: 'Ποιος αρχαίος πολιτισμός έκτισε το Ματσού Πίτσου;' },
      options: { en: ['Aztec', 'Maya', 'Inca', 'Olmec'], el: ['Άζτεκοι', 'Μάγια', 'Ίνκα', 'Όλμεκ'] },
      correct: { en: 'Inca', el: 'Ίνκα' },
      explanation: { en: 'The Incas built Machu Picchu in the 15th century in Peru.', el: 'Οι Ίνκα έκτισαν το Ματσού Πίτσου τον 15ο αιώνα στο Περού.' }
    },
    {
      question: { en: 'When did World War I begin?', el: 'Πότε ξεκίνησε ο Α\' Παγκόσμιος Πόλεμος;' },
      options: { en: ['1912', '1914', '1916', '1918'], el: ['1912', '1914', '1916', '1918'] },
      correct: { en: '1914', el: '1914' },
      explanation: { en: 'WWI began in July 1914 after the assassination of Archduke Franz Ferdinand.', el: 'Ο Α\' ΠΠ ξεκίνησε τον Ιούλιο 1914 μετά τη δολοφονία του Αρχιδούκα Φραντς Φερδινάνδου.' }
    },
    {
      question: { en: 'Which treaty ended World War I?', el: 'Ποια συνθήκη τερμάτισε τον Α\' Παγκόσμιο Πόλεμο;' },
      options: { en: ['Treaty of Vienna', 'Treaty of Versailles', 'Treaty of Paris', 'Treaty of London'], el: ['Συνθήκη της Βιέννης', 'Συνθήκη των Βερσαλλιών', 'Συνθήκη του Παρισιού', 'Συνθήκη του Λονδίνου'] },
      correct: { en: 'Treaty of Versailles', el: 'Συνθήκη των Βερσαλλιών' },
      explanation: { en: 'Signed in 1919, it imposed harsh reparations on Germany.', el: 'Υπογράφηκε το 1919 και επέβαλε σοβαρές επανορθώσεις στη Γερμανία.' }
    },
    {
      question: { en: 'Who led the Soviet Union during most of World War II?', el: 'Ποιος ηγήθηκε της Σοβιετικής Ένωσης το μεγαλύτερο μέρος του Β\' Παγκόσμιου Πολέμου;' },
      options: { en: ['Lenin', 'Stalin', 'Khrushchev', 'Trotsky'], el: ['Λένιν', 'Στάλιν', 'Χρουστσόφ', 'Τρότσκι'] },
      correct: { en: 'Stalin', el: 'Στάλιν' },
      explanation: { en: 'Stalin led the USSR from 1922 until his death in 1953.', el: 'Ο Στάλιν ηγήθηκε της ΕΣΣΔ από το 1922 μέχρι τον θάνατό του το 1953.' }
    },
    {
      question: { en: 'In which year did Christopher Columbus reach the Americas?', el: 'Σε ποιο έτος ο Χριστόφορος Κολόμβος έφθασε στην Αμερική;' },
      options: { en: ['1482', '1492', '1502', '1472'], el: ['1482', '1492', '1502', '1472'] },
      correct: { en: '1492', el: '1492' },
      explanation: { en: 'Columbus landed in the Bahamas in October 1492.', el: 'Ο Κολόμβος προσγειώθηκε στις Μπαχάμες τον Οκτώβριο 1492.' }
    },
    {
      question: { en: 'Which empire built the Colosseum in Rome?', el: 'Ποια αυτοκρατορία έκτισε το Κολοσσαίο στη Ρώμη;' },
      options: { en: ['Greek', 'Roman', 'Byzantine', 'Etruscan'], el: ['Ελληνική', 'Ρωμαϊκή', 'Βυζαντινή', 'Ετρουσκική'] },
      correct: { en: 'Roman', el: 'Ρωμαϊκή' },
      explanation: { en: 'The Colosseum was completed under Emperor Titus in 80 CE.', el: 'Το Κολοσσαίο ολοκληρώθηκε επί Αυτοκράτορα Τίτου το 80 μ.Χ.' }
    },
    {
      question: { en: 'Who was the leader of the French Revolution\'s Reign of Terror?', el: 'Ποιος ήταν ο ηγέτης της Τρομοκρατίας της Γαλλικής Επανάστασης;' },
      options: { en: ['Napoleon', 'Robespierre', 'Danton', 'Marat'], el: ['Ναπολέων', 'Ροβεσπιέρος', 'Νταντόν', 'Μαρά'] },
      correct: { en: 'Robespierre', el: 'Ροβεσπιέρος' },
      explanation: { en: 'Maximilien Robespierre led the Committee of Public Safety.', el: 'Ο Μαξιμιλιάνος Ροβεσπιέρος ηγήθηκε της Επιτροπής Δημόσιας Ασφάλειας.' }
    },
    {
      question: { en: 'Which country did Napoleon invade in 1812, leading to disaster?', el: 'Ποια χώρα εισέβαλε ο Ναπολέων το 1812, με καταστροφικό αποτέλεσμα;' },
      options: { en: ['Britain', 'Austria', 'Russia', 'Prussia'], el: ['Βρετανία', 'Αυστρία', 'Ρωσία', 'Πρωσία'] },
      correct: { en: 'Russia', el: 'Ρωσία' },
      explanation: { en: 'The Russian campaign and winter devastated Napoleon\'s Grande Armée.', el: 'Η ρωσική εκστρατεία και ο χειμώνας κατέστρεψαν τη Grande Armée του Ναπολέοντα.' }
    },
    {
      question: { en: 'When did the Roman Empire officially fall (Western)?', el: 'Πότε έπεσε επίσημα η Δυτική Ρωμαϊκή Αυτοκρατορία;' },
      options: { en: ['376 CE', '410 CE', '476 CE', '565 CE'], el: ['376 μ.Χ.', '410 μ.Χ.', '476 μ.Χ.', '565 μ.Χ.'] },
      correct: { en: '476 CE', el: '476 μ.Χ.' },
      explanation: { en: 'Romulus Augustulus was deposed in 476, traditionally marking the fall.', el: 'Ο Ρομύλος Αυγουστύλος ανατράπηκε το 476, σημειώνοντας την πτώση.' }
    },
    {
      question: { en: 'Who discovered the sea route to India in 1498?', el: 'Ποιος ανακάλυψε τη θαλάσσια οδό προς την Ινδία το 1498;' },
      options: { en: ['Columbus', 'Magellan', 'Vasco da Gama', 'Cabot'], el: ['Κολόμβος', 'Μαγγελάνος', 'Βάσκο ντα Γκάμα', 'Κάμποτ'] },
      correct: { en: 'Vasco da Gama', el: 'Βάσκο ντα Γκάμα' },
      explanation: { en: 'Da Gama reached Calicut, India, opening the spice trade route.', el: 'Ο ντα Γκάμα έφθασε στην Καλικούτ της Ινδίας, ανοίγοντας το εμπόριο μπαχαρικών.' }
    },
    {
      question: { en: 'Which revolution began with the storming of the Bastille?', el: 'Ποια επανάσταση ξεκίνησε με την επίθεση στη Βαστίλη;' },
      options: { en: ['American', 'Russian', 'French', 'Industrial'], el: ['Αμερικανική', 'Ρωσική', 'Γαλλική', 'Βιομηχανική'] },
      correct: { en: 'French', el: 'Γαλλική' },
      explanation: { en: 'The Bastille fell on July 14, 1789—now France\'s national day.', el: 'Η Βαστίλη έπεσε στις 14 Ιουλίου 1789—σημερινή εθνική εορτή της Γαλλίας.' }
    },
    {
      question: { en: 'Who was the last tsar of Russia?', el: 'Ποιος ήταν ο τελευταίος τσάρος της Ρωσίας;' },
      options: { en: ['Alexander II', 'Alexander III', 'Nicholas II', 'Nicholas I'], el: ['Αλέξανδρος Β\'', 'Αλέξανδρος Γ\'', 'Νικόλαος Β\'', 'Νικόλαος Α\''] },
      correct: { en: 'Nicholas II', el: 'Νικόλαος Β\'' },
      explanation: { en: 'Nicholas II abdicated in 1917 and was executed with his family in 1918.', el: 'Ο Νικόλαος Β\' παραιτήθηκε το 1917 και εκτελέστηκε με την οικογένειά του το 1918.' }
    },
    {
      question: { en: 'Which ancient city was buried by the eruption of Vesuvius in 79 CE?', el: 'Ποια αρχαία πόλη θάφτηκε από την έκρηξη του Βεζούβιου το 79 μ.Χ.;' },
      options: { en: ['Herculaneum only', 'Pompeii and Herculaneum', 'Rome', 'Naples'], el: ['Μόνο η Ερκολάνο', 'Πομπηία και Ερκολάνο', 'Ρώμη', 'Νάπολη'] },
      correct: { en: 'Pompeii and Herculaneum', el: 'Πομπηία και Ερκολάνο' },
      explanation: { en: 'Both cities were buried; Pompeii is more famous for its preservation.', el: 'Και οι δύο πόλεις θάφτηκαν· η Πομπηία είναι πιο γνωστή για τη συντήρησή της.' }
    },
    {
      question: { en: 'In which year did India gain independence from Britain?', el: 'Σε ποιο έτος η Ινδία απέκτησε ανεξαρτησία από τη Βρετανία;' },
      options: { en: ['1945', '1947', '1949', '1950'], el: ['1945', '1947', '1949', '1950'] },
      correct: { en: '1947', el: '1947' },
      explanation: { en: 'India became independent on August 15, 1947; Pakistan was created simultaneously.', el: 'Η Ινδία απέκτησε ανεξαρτησία στις 15 Αυγούστου 1947.' }
    },
    {
      question: { en: 'Who was the first president of the United States?', el: 'Ποιος ήταν ο πρώτος πρόεδρος των ΗΠΑ;' },
      options: { en: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'], el: ['Τζον Άνταμς', 'Θωμάς Τζέφερσον', 'Τζορτζ Ουάσινγκτον', 'Βενιαμίν Φραγκλίνος'] },
      correct: { en: 'George Washington', el: 'Τζορτζ Ουάσινγκτον' },
      explanation: { en: 'Washington served from 1789 to 1797.', el: 'Ο Ουάσινγκτον υπηρέτησε από το 1789 έως το 1797.' }
    },
    {
      question: { en: 'Which empire was ruled by Genghis Khan?', el: 'Ποια αυτοκρατορία κυβερνήθηκε από τον Τζένγκις Χαν;' },
      options: { en: ['Ottoman', 'Mongol', 'Mughal', 'Persian'], el: ['Οθωμανική', 'Μογγολική', 'Μουγαλική', 'Περσική'] },
      correct: { en: 'Mongol', el: 'Μογγολική' },
      explanation: { en: 'Genghis Khan founded the Mongol Empire in the early 13th century.', el: 'Ο Τζένγκις Χαν ίδρυσε την Μογγολική Αυτοκρατορία στις αρχές του 13ου αιώνα.' }
    },
    {
      question: { en: 'When did the Cuban Missile Crisis occur?', el: 'Πότε συνέβη η Κρίση των Πυραύλων της Κούβας;' },
      options: { en: ['1959', '1961', '1962', '1964'], el: ['1959', '1961', '1962', '1964'] },
      correct: { en: '1962', el: '1962' },
      explanation: { en: 'The 13-day standoff in October 1962 brought the world close to nuclear war.', el: 'Η 13ήμερη αναμέτρηση τον Οκτώβριο του 1962 έφερε τον κόσμο κοντά σε πυρηνικό πόλεμο.' }
    },
    {
      question: { en: 'Who led the civil rights movement with "I Have a Dream"?', el: 'Ποιος ηγήθηκε του κινήματος πολιτικών δικαιωμάτων με το "I Have a Dream";' },
      options: { en: ['Malcolm X', 'Martin Luther King Jr.', 'Rosa Parks', 'Jesse Jackson'], el: ['Μάλκολμ Εξ', 'Μάρτιν Λούθερ Κινγκ Τζούνιορ', 'Ρόζα Παρκς', 'Τζέσι Τζάκσον'] },
      correct: { en: 'Martin Luther King Jr.', el: 'Μάρτιν Λούθερ Κινγκ Τζούνιορ' },
      explanation: { en: 'King delivered the speech at the March on Washington in 1963.', el: 'Ο King έδωσε την ομιλία στη Διαδήλωση της Ουάσινγκτον το 1963.' }
    },
    {
      question: { en: 'Which pharaoh\'s tomb was discovered by Howard Carter in 1922?', el: 'Ποιος φαραώ ο τάφος του ανακάλυψε ο Χάουαρντ Κάρτερ το 1922;' },
      options: { en: ['Ramesses II', 'Cleopatra', 'Tutankhamun', 'Khufu'], el: ['Ραμσής Β\'', 'Κλεοπάτρα', 'Τουταγχαμών', 'Χεόπας'] },
      correct: { en: 'Tutankhamun', el: 'Τουταγχαμών' },
      explanation: { en: 'King Tut\'s tomb was nearly intact, revealing countless treasures.', el: 'Ο τάφος του Βασιλιά Tut ήταν σχεδόν άθικτος με αμέτρητους θησαυρούς.' }
    },
    {
      question: { en: 'When did the Renaissance begin (approximately)?', el: 'Πότε ξεκίνησε περίπου η Αναγέννηση;' },
      options: { en: ['1200s', '1300s', '1400s', '1500s'], el: ['1200s', '1300s', '1400s', '1500s'] },
      correct: { en: '1300s', el: '1300s' },
      explanation: { en: 'The Renaissance is typically dated from the 14th century in Italy.', el: 'Η Αναγέννηση χρονολογείται typically από τον 14ο αιώνα στην Ιταλία.' }
    },
    {
      question: { en: 'Who was the British prime minister during most of WWII?', el: 'Ποιος ήταν Βρετανός πρωθυπουργός το μεγαλύτερο μέρος του Β\' ΠΠ;' },
      options: { en: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Anthony Eden'], el: ['Νέβιλ Τσάμπερλεϊν', 'Γουίνστον Τσόρτσιλ', 'Κλέμεντ Άτλη', 'Άντονι Ίντεν'] },
      correct: { en: 'Winston Churchill', el: 'Γουίνστον Τσόρτσιλ' },
      explanation: { en: 'Churchill led Britain from 1940 to 1945.', el: 'Ο Τσόρτσιλ ηγήθηκε της Βρετανίας από το 1940 έως το 1945.' }
    },
    {
      question: { en: 'Which war was fought between 1950 and 1953?', el: 'Ποιος πόλεμος διεξήχθη μεταξύ 1950 και 1953;' },
      options: { en: ['Vietnam War', 'Korean War', 'Cold War conflicts', 'Suez Crisis'], el: ['Πόλεμος του Βιετνάμ', 'Πόλεμος της Κορέας', 'Ψυχρός Πόλεμος', 'Κρίση του Σουέζ'] },
      correct: { en: 'Korean War', el: 'Πόλεμος της Κορέας' },
      explanation: { en: 'The Korean War ended in an armistice; the peninsula remains divided.', el: 'Ο Πόλεμος της Κορέας τελείωσε με ανακωχή· η χερσόνησος παραμένει διαιρεμένη.' }
    },
    {
      question: { en: 'Who assassinated Abraham Lincoln?', el: 'Ποιος δολοφόνησε τον Αμπραάμ Λίνκολν;' },
      options: { en: ['Lee Harvey Oswald', 'John Wilkes Booth', 'James Earl Ray', 'Charles Guiteau'], el: ['Λι Χάρβεϊ Όσβαλντ', 'Τζον Γουίλκς Μπουθ', 'Τζέιμς Ερλ Ρέι', 'Charles Guiteau'] },
      correct: { en: 'John Wilkes Booth', el: 'Τζον Γουίλκς Μπουθ' },
      explanation: { en: 'Booth shot Lincoln at Ford\'s Theatre in April 1865.', el: 'Ο Μπουθ πυροβόλησε τον Λίνκολν στο Θέατρο Ford τον Απρίλιο 1865.' }
    },
    {
      question: { en: 'Which ancient civilization invented democracy?', el: 'Ποιος αρχαίος πολιτισμός εφηύρε τη δημοκρατία;' },
      options: { en: ['Roman', 'Egyptian', 'Athenian (Greek)', 'Persian'], el: ['Ρωμαϊκός', 'Αιγύπτιος', 'Αθηναϊκός (Ελληνικός)', 'Περσικός'] },
      correct: { en: 'Athenian (Greek)', el: 'Αθηναϊκός (Ελληνικός)' },
      explanation: { en: 'Athens developed democracy in the 5th century BCE.', el: 'Η Αθήνα ανέπτυξε τη δημοκρατία τον 5ο αιώνα π.Χ.' }
    },
    {
      question: { en: 'When did the Ottoman Empire fall?', el: 'Πότε έπεσε η Οθωμανική Αυτοκρατορία;' },
      options: { en: ['1918', '1922', '1924', '1914'], el: ['1918', '1922', '1924', '1914'] },
      correct: { en: '1922', el: '1922' },
      explanation: { en: 'The empire was abolished in 1922; the Republic of Turkey was declared.', el: 'Η αυτοκρατορία καταργήθηκε το 1922· διακηρύχθηκε η Δημοκρατία της Τουρκίας.' }
    },
    {
      question: { en: 'Who was the leader of the Bolshevik Revolution?', el: 'Ποιος ήταν ο ηγέτης της Μπολσεβικικής Επανάστασης;' },
      options: { en: ['Stalin', 'Trotsky', 'Lenin', 'Marx'], el: ['Στάλιν', 'Τρότσκι', 'Λένιν', 'Μαρξ'] },
      correct: { en: 'Lenin', el: 'Λένιν' },
      explanation: { en: 'Vladimir Lenin led the October Revolution of 1917.', el: 'Ο Βλαντίμιρ Λένιν ηγήθηκε της Οκτωβριανής Επανάστασης του 1917.' }
    },
    {
      question: { en: 'Which empire controlled most of the Indian subcontinent before British rule?', el: 'Ποια αυτοκρατορία κυβέρνησε το μεγαλύτερο μέρος της Ινδικής υποήπειρου πριν τη βρετανική κυριαρχία;' },
      options: { en: ['Mughal Empire', 'Maurya Empire', 'Gupta Empire', 'Delhi Sultanate'], el: ['Αυτοκρατορία των Μουγούλ', 'Αυτοκρατορία Maurya', 'Αυτοκρατορία Gupta', 'Σουλτανάτο του Δελχί'] },
      correct: { en: 'Mughal Empire', el: 'Αυτοκρατορία των Μουγούλ' },
      explanation: { en: 'The Mughals ruled from the 16th to mid-19th century.', el: 'Οι Μουγούλ κυβέρνησαν από τον 16ο μέχρι τα μέσα του 19ου αιώνα.' }
    },
    {
      question: { en: 'In which year did man first land on the Moon?', el: 'Σε ποιο έτος ο άνθρωπος πάτησε για πρώτη φορά στη Σελήνη;' },
      options: { en: ['1967', '1969', '1971', '1973'], el: ['1967', '1969', '1971', '1973'] },
      correct: { en: '1969', el: '1969' },
      explanation: { en: 'Apollo 11 landed on July 20, 1969; Neil Armstrong took the first step.', el: 'Το Apollo 11 προσγειώθηκε στις 20 Ιουλίου 1969· ο Νeil Armstrong πάτησε πρώτος.' }
    },
  ],
  science: [
    {
      question: { en: 'What is the chemical symbol for gold?', el: 'Ποιο είναι το χημικό σύμβολο του χρυσού;' },
      options: { en: ['Go', 'Gd', 'Au', 'Ag'], el: ['Go', 'Gd', 'Au', 'Ag'] },
      correct: { en: 'Au', el: 'Au' },
      explanation: { en: 'Au comes from the Latin "aurum" meaning gold.', el: 'Το Au προέρχεται από το λατινικό "aurum" που σημαίνει χρυσός.' }
    },
    {
      question: { en: 'What is the speed of light in a vacuum (approximately)?', el: 'Ποια είναι η ταχύτητα του φωτός στο κενό (περίπου);' },
      options: { en: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '200,000 km/s'], el: ['300.000 χλμ/δ', '150.000 χλμ/δ', '500.000 χλμ/δ', '200.000 χλμ/δ'] },
      correct: { en: '300,000 km/s', el: '300.000 χλμ/δ' },
      explanation: { en: 'Light travels at approximately 299,792 km per second.', el: 'Το φως ταξιδεύει με περίπου 299.792 χλμ ανά δευτερόλεπτο.' }
    },
    {
      question: { en: 'What is the powerhouse of the cell?', el: 'Ποιο είναι το "εργοστάσιο ενέργειας" του κυττάρου;' },
      options: { en: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], el: ['Πυρήνας', 'Ριβόσωμα', 'Μιτοχόνδριο', 'Σωμάτιο Golgi'] },
      correct: { en: 'Mitochondria', el: 'Μιτοχόνδριο' },
      explanation: { en: 'Mitochondria produce ATP, the cell\'s energy currency.', el: 'Τα μιτοχόνδρια παράγουν ATP, το ενεργειακό νόμισμα του κυττάρου.' }
    },
    {
      question: { en: 'Who developed the theory of general relativity?', el: 'Ποιος ανέπτυξε τη θεωρία της γενικής σχετικότητας;' },
      options: { en: ['Newton', 'Einstein', 'Hawking', 'Bohr'], el: ['Νεύτων', 'Αϊνστάιν', 'Χόκινγκ', 'Μπορ'] },
      correct: { en: 'Einstein', el: 'Αϊνστάιν' },
      explanation: { en: 'Einstein published the theory in 1915, revolutionizing physics.', el: 'Ο Αϊνστάιν δημοσίευσε τη θεωρία το 1915.' }
    },
    {
      question: { en: 'What is the hardest natural substance on Earth?', el: 'Ποια είναι η σκληρότερη φυσική ουσία στη Γη;' },
      options: { en: ['Steel', 'Diamond', 'Titanium', 'Quartz'], el: ['Ατσαλί', 'Διαμάντι', 'Τιτάνιο', 'Χαλαζίας'] },
      correct: { en: 'Diamond', el: 'Διαμάντι' },
      explanation: { en: 'Diamond is a 10 on the Mohs scale of mineral hardness.', el: 'Το διαμάντι είναι 10 στην κλίμακα Mohs της σκληρότητας ορυκτών.' }
    },
    {
      question: { en: 'What gas do plants absorb from the air for photosynthesis?', el: 'Ποιο αέριο απορροφούν τα φυτά από τον αέρα για τη φωτοσύνθεση;' },
      options: { en: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], el: ['Οξυγόνο', 'Άζωτο', 'Διοξείδιο του άνθρακα', 'Υδρογόνο'] },
      correct: { en: 'Carbon dioxide', el: 'Διοξείδιο του άνθρακα' },
      explanation: { en: 'Plants use CO2 and sunlight to produce glucose and oxygen.', el: 'Τα φυτά χρησιμοποιούν CO2 και ηλιακό φως για γλυκόζη και οξυγόνο.' }
    },
    {
      question: { en: 'How many planets are in our solar system?', el: 'Πόσοι πλανήτες υπάρχουν στο ηλιακό μας σύστημα;' },
      options: { en: ['7', '8', '9', '10'], el: ['7', '8', '9', '10'] },
      correct: { en: '8', el: '8' },
      explanation: { en: 'Pluto was reclassified as a dwarf planet in 2006.', el: 'Ο Πλούτων αναταξινομήθηκε ως πλανήτης νάνος το 2006.' }
    },
    {
      question: { en: 'What does DNA stand for?', el: 'Τι σημαίνει το DNA;' },
      options: { en: ['Deoxyribonucleic Acid', 'Dynamic Nuclear Algorithm', 'Diamine Nucleotide Array', 'Digital Nucleic Acid'], el: ['Δεοξυριβονουκλεϊκό Οξύ', 'Dynamic Nuclear Algorithm', 'Diamine Nucleotide Array', 'Digital Nucleic Acid'] },
      correct: { en: 'Deoxyribonucleic Acid', el: 'Δεοξυριβονουκλεϊκό Οξύ' },
      explanation: { en: 'DNA carries genetic instructions for all living organisms.', el: 'Το DNA μεταφέρει γενετικές οδηγίες για όλους τους ζώντες οργανισμούς.' }
    },
    {
      question: { en: 'Who invented the telephone?', el: 'Ποιος εφηύρε τηλέφωνο;' },
      options: { en: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Guglielmo Marconi'], el: ['Τόμας Έντισον', 'Άλεξαντερ Γκράχαμ Μπελ', 'Νίκολα Τέσλα', 'Γουλιέλμο Μάρκονι'] },
      correct: { en: 'Alexander Graham Bell', el: 'Άλεξαντερ Γκράχαμ Μπελ' },
      explanation: { en: 'Bell patented the telephone in 1876.', el: 'Ο Bell κατοχύρωσε με δίπλωμα ευρεσιτεχνίας τηλέφωνο το 1876.' }
    },
    {
      question: { en: 'What is the most abundant element in the universe?', el: 'Ποιο είναι το πιο άφθονο στοιχείο στο σύμπαν;' },
      options: { en: ['Helium', 'Carbon', 'Hydrogen', 'Oxygen'], el: ['Ήλιο', 'Άνθρακας', 'Υδρογόνο', 'Οξυγόνο'] },
      correct: { en: 'Hydrogen', el: 'Υδρογόνο' },
      explanation: { en: 'Hydrogen makes up about 75% of the universe\'s elemental mass.', el: 'Το υδρογόνο αποτελεί περίπου το 75% της στοιχειακής μάζας του σύμπαντος.' }
    },
    {
      question: { en: 'What is the chemical formula for water?', el: 'Ποιος είναι ο χημικός τύπος του νερού;' },
      options: { en: ['CO2', 'H2O', 'O2', 'H2O2'], el: ['CO2', 'H2O', 'O2', 'H2O2'] },
      correct: { en: 'H2O', el: 'H2O' },
      explanation: { en: 'Water consists of two hydrogen atoms and one oxygen atom.', el: 'Το νερό αποτελείται από δύο άτομα υδρογόνου και ένα οξυγόνου.' }
    },
    {
      question: { en: 'Which planet is known as the Red Planet?', el: 'Ποιος πλανήτης είναι γνωστός ως ο Κόκκινος Πλανήτης;' },
      options: { en: ['Venus', 'Jupiter', 'Mars', 'Saturn'], el: ['Αφροδίτη', 'Δίας', 'Άρης', 'Κρόνος'] },
      correct: { en: 'Mars', el: 'Άρης' },
      explanation: { en: 'Mars appears red due to iron oxide (rust) on its surface.', el: 'Ο Άρης φαίνεται κόκκινος λόγω του οξειδίου του σιδήρου στην επιφάνειά του.' }
    },
    {
      question: { en: 'What is the smallest prime number?', el: 'Ποιος είναι ο μικρότερος πρώτος αριθμός;' },
      options: { en: ['0', '1', '2', '3'], el: ['0', '1', '2', '3'] },
      correct: { en: '2', el: '2' },
      explanation: { en: '2 is the only even prime number.', el: 'Το 2 είναι ο μόνος ζυγός πρώτος αριθμός.' }
    },
    {
      question: { en: 'Who discovered penicillin?', el: 'Ποιος ανακάλυψε την πενικιλλίνη;' },
      options: { en: ['Louis Pasteur', 'Alexander Fleming', 'Marie Curie', 'Robert Koch'], el: ['Louis Pasteur', 'Αλεξάντερ Φλέμινγκ', 'Μαρί Κιουρί', 'Ρόμπερτ Κόχ'] },
      correct: { en: 'Alexander Fleming', el: 'Αλεξάντερ Φλέμινγκ' },
      explanation: { en: 'Fleming discovered penicillin in 1928 by accident in his lab.', el: 'Ο Φλέμινγκ ανακάλυψε την πενικιλλίνη το 1928 κατά τύχη.' }
    },
    {
      question: { en: 'What is the boiling point of water at sea level (in Celsius)?', el: 'Ποια είναι η θερμοκρασία βρασμού του νερού στο επίπεδο της θάλασσας (σε Κελσίου);' },
      options: { en: ['90°C', '100°C', '110°C', '212°C'], el: ['90°C', '100°C', '110°C', '212°C'] },
      correct: { en: '100°C', el: '100°C' },
      explanation: { en: 'Water boils at 100°C (212°F) at standard atmospheric pressure.', el: 'Το νερό βράζει στους 100°C υπό τυπική ατμοσφαιρική πίεση.' }
    },
    {
      question: { en: 'What does "HTTP" stand for?', el: 'Τι σημαίνει το "HTTP";' },
      options: { en: ['HyperText Transfer Protocol', 'High Tech Transfer Program', 'Home Terminal Transfer Protocol', 'Hybrid Text Transport Protocol'], el: ['HyperText Transfer Protocol', 'High Tech Transfer Program', 'Home Terminal Transfer Protocol', 'Hybrid Text Transport Protocol'] },
      correct: { en: 'HyperText Transfer Protocol', el: 'HyperText Transfer Protocol' },
      explanation: { en: 'HTTP is the foundation of data communication on the World Wide Web.', el: 'Το HTTP είναι η βάση της επικοινωνίας δεδομένων στον Παγκόσμιο Ιστό.' }
    },
    {
      question: { en: 'Which scientist proposed the heliocentric model of the solar system?', el: 'Ποιος επιστήμονας πρότεινε το ηλιοκεντρικό μοντέλο του ηλιακού συστήματος;' },
      options: { en: ['Aristotle', 'Ptolemy', 'Copernicus', 'Galileo'], el: ['Αριστοτέλης', 'Πτολεμαίος', 'Κοπέρνικος', 'Γαλιλαίος'] },
      correct: { en: 'Copernicus', el: 'Κοπέρνικος' },
      explanation: { en: 'Copernicus published his heliocentric theory in 1543.', el: 'Ο Κοπέρνικος δημοσίευσε τη θεωρία του το 1543.' }
    },
    {
      question: { en: 'What is the main gas in Earth\'s atmosphere?', el: 'Ποιο είναι το κύριο αέριο στην ατμόσφαιρα της Γης;' },
      options: { en: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], el: ['Οξυγόνο', 'Διοξείδιο άνθρακα', 'Άζωτο', 'Αργό'] },
      correct: { en: 'Nitrogen', el: 'Άζωτο' },
      explanation: { en: 'Nitrogen makes up about 78% of Earth\'s atmosphere.', el: 'Το άζωτο αποτελεί περίπου το 78% της ατμόσφαιρας της Γης.' }
    },
    {
      question: { en: 'What does "CPU" stand for?', el: 'Τι σημαίνει το "CPU";' },
      options: { en: ['Central Processing Unit', 'Computer Personal Unit', 'Core Processing Unit', 'Central Program Utility'], el: ['Central Processing Unit', 'Computer Personal Unit', 'Core Processing Unit', 'Central Program Utility'] },
      correct: { en: 'Central Processing Unit', el: 'Central Processing Unit' },
      explanation: { en: 'The CPU is the brain of the computer that executes instructions.', el: 'Η CPU είναι ο "εγκέφαλος" του υπολογιστή που εκτελεί τις οδηγίες.' }
    },
    {
      question: { en: 'Which vitamin is produced when skin is exposed to sunlight?', el: 'Ποια βιταμίνη παράγεται όταν το δέρμα εκτίθεται στον ήλιο;' },
      options: { en: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], el: ['Βιταμίνη Α', 'Βιταμίνη C', 'Βιταμίνη D', 'Βιταμίνη K'] },
      correct: { en: 'Vitamin D', el: 'Βιταμίνη D' },
      explanation: { en: 'Sunlight triggers vitamin D synthesis in the skin.', el: 'Το ηλιακό φως ενεργοποιεί τη σύνθεση βιταμίνης D στο δέρμα.' }
    },
    {
      question: { en: 'What is the atomic number of carbon?', el: 'Ποιος είναι ο ατομικός αριθμός του άνθρακα;' },
      options: { en: ['4', '6', '8', '12'], el: ['4', '6', '8', '12'] },
      correct: { en: '6', el: '6' },
      explanation: { en: 'Carbon has 6 protons, defining its place in the periodic table.', el: 'Ο άνθρακας έχει 6 πρωτόνια, ορίζοντας τη θέση του στον πίνακα.' }
    },
    {
      question: { en: 'Who developed the first practical polio vaccine?', el: 'Ποιος ανέπτυξε το πρώτο πρακτικό εμβόλιο κατά της πολιομυελίτιδας;' },
      options: { en: ['Louis Pasteur', 'Jonas Salk', 'Edward Jenner', 'Robert Koch'], el: ['Louis Pasteur', 'Τζόνας Σολκ', 'Έντουαρντ Τζένερ', 'Ρόμπερτ Κόχ'] },
      correct: { en: 'Jonas Salk', el: 'Τζόνας Σολκ' },
      explanation: { en: 'Salk\'s inactivated vaccine was declared safe in 1955.', el: 'Το αδρανοποιημένο εμβόλιο του Σολκ κηρύχθηκε ασφαλές το 1955.' }
    },
    {
      question: { en: 'What is the powerhouse unit of energy in cells?', el: 'Ποια είναι η μονάδα ενέργειας στα κύτταρα;' },
      options: { en: ['Glucose', 'ATP', 'NADH', 'FADH2'], el: ['Γλυκόζη', 'ATP', 'NADH', 'FADH2'] },
      correct: { en: 'ATP', el: 'ATP' },
      explanation: { en: 'ATP (adenosine triphosphate) stores and transports chemical energy.', el: 'Το ATP (αδενοσίνη τριφωσφορική) αποθηκεύει και μεταφέρει χημική ενέργεια.' }
    },
    {
      question: { en: 'Which gas is responsible for the greenhouse effect?', el: 'Ποιο αέριο είναι υπεύθυνο για το φαινόμενο του θερμοκηπίου;' },
      options: { en: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], el: ['Οξυγόνο', 'Άζωτο', 'Διοξείδιο άνθρακα', 'Ήλιο'] },
      correct: { en: 'Carbon dioxide', el: 'Διοξείδιο άνθρακα' },
      explanation: { en: 'CO2 and other greenhouse gases trap heat in the atmosphere.', el: 'Το CO2 και άλλα αέρια θερμοκηπίου παγιδεύουν τη θερμότητα.' }
    },
    {
      question: { en: 'Who invented the world\'s first computer algorithm?', el: 'Ποιος έφτιαξε τον πρώτο αλγόριθμο υπολογιστή στον κόσμο;' },
      options: { en: ['Alan Turing', 'Ada Lovelace', 'Charles Babbage', 'John von Neumann'], el: ['Άλαν Τούρινγκ', 'Άντα Λάβλεϊς', 'Τσάρλς Μπάμπατζ', 'Τζον βον Νόιμαν'] },
      correct: { en: 'Ada Lovelace', el: 'Άντα Λάβλεϊς' },
      explanation: { en: 'Lovelace wrote the first algorithm for Babbage\'s Analytical Engine.', el: 'Η Λάβλεϊς έγραψε τον πρώτο αλγόριθμο για τη Μηχανή Αναλυτική του Μπάμπατζ.' }
    },
    {
      question: { en: 'What is the pH of pure water?', el: 'Ποιο είναι το pH του καθαρού νερού;' },
      options: { en: ['5', '6', '7', '8'], el: ['5', '6', '7', '8'] },
      correct: { en: '7', el: '7' },
      explanation: { en: 'pH 7 is neutral; pure water is neither acidic nor basic.', el: 'Το pH 7 είναι ουδέτερο· το καθαρό νερό δεν είναι όξινο ούτε αλκαλικό.' }
    },
    {
      question: { en: 'Which planet has the Great Red Spot?', el: 'Ποιος πλανήτης έχει τη Μεγάλη Ερυθρή Κηλίδα;' },
      options: { en: ['Mars', 'Jupiter', 'Saturn', 'Neptune'], el: ['Άρης', 'Δίας', 'Κρόνος', 'Ποσειδώνας'] },
      correct: { en: 'Jupiter', el: 'Δίας' },
      explanation: { en: 'The Great Red Spot is a massive storm on Jupiter.', el: 'Η Μεγάλη Ερυθρά Κηλίδα είναι μια τεράστια καταιγίδα στον Δία.' }
    },
    {
      question: { en: 'What is the chemical symbol for iron?', el: 'Ποιο είναι το χημικό σύμβολο του σιδήρου;' },
      options: { en: ['Ir', 'Fe', 'Fi', 'Sn'], el: ['Ir', 'Fe', 'Fi', 'Sn'] },
      correct: { en: 'Fe', el: 'Fe' },
      explanation: { en: 'Fe comes from the Latin "ferrum" for iron.', el: 'Το Fe προέρχεται από το λατινικό "ferrum" για σίδερο.' }
    },
    {
      question: { en: 'How many bones are in the adult human body?', el: 'Πόσα οστά υπάρχουν στο σώμα ενός ενήλικα;' },
      options: { en: ['186', '206', '226', '246'], el: ['186', '206', '226', '246'] },
      correct: { en: '206', el: '206' },
      explanation: { en: 'Adults have 206 bones; babies have more that fuse as they grow.', el: 'Οι ενήλικες έχουν 206 οστά· τα μωρά έχουν περισσότερα που συγχωνεύονται.' }
    },
    {
      question: { en: 'What type of wave is sound?', el: 'Τι είδους κύμα είναι ο ήχος;' },
      options: { en: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Surface'], el: ['Εγκάρσιο', 'Διαμήκες', 'Ηλεκτρομαγνητικό', 'Επιφανειακό'] },
      correct: { en: 'Longitudinal', el: 'Διαμήκες' },
      explanation: { en: 'Sound travels as longitudinal waves through compression and rarefaction.', el: 'Ο ήχος ταξιδεύει ως διαμήκη κύματα μέσω συμπίεσης και αραίωσης.' }
    },
  ],
  art: [
    {
      question: { en: 'Who painted the Mona Lisa?', el: 'Ποιος ζωγράφισε τη Μόνα Λίζα;' },
      options: { en: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], el: ['Μιχαήλ Άγγελος', 'Λεονάρντο ντα Βίντσι', 'Ραφαήλ', 'Ντονατέλλο'] },
      correct: { en: 'Leonardo da Vinci', el: 'Λεονάρντο ντα Βίντσι' },
      explanation: { en: 'The Mona Lisa was painted in the early 16th century and hangs in the Louvre.', el: 'Η Μόνα Λίζα ζωγραφίστηκε στις αρχές του 16ου αιώνα και βρίσκεται στο Λούβρο.' }
    },
    {
      question: { en: 'Which artist cut off his own ear?', el: 'Ποιος καλλιτέχνης έκοψε το δικό του αφτί;' },
      options: { en: ['Monet', 'Picasso', 'Van Gogh', 'Gauguin'], el: ['Μονέ', 'Πικάσο', 'Βαν Γκογκ', 'Γκωγκέν'] },
      correct: { en: 'Van Gogh', el: 'Βαν Γκογκ' },
      explanation: { en: 'Van Gogh severed part of his left ear in 1888 during a mental health crisis.', el: 'Ο Βαν Γκογκ έκοψε μέρος του αριστερού του αφτιού το 1888.' }
    },
    {
      question: { en: 'Who painted "The Starry Night"?', el: 'Ποιος ζωγράφισε τη "Αστεροφεγγιά";' },
      options: { en: ['Monet', 'Van Gogh', 'Dalí', 'Kandinsky'], el: ['Μονέ', 'Βαν Γκογκ', 'Νταλί', 'Καντίνσκι'] },
      correct: { en: 'Van Gogh', el: 'Βαν Γκογκ' },
      explanation: { en: 'Van Gogh painted it in 1889 while at the Saint-Rémy asylum.', el: 'Ο Βαν Γκογκ τη ζωγράφισε το 1889 στο άσυλο του Saint-Rémy.' }
    },
    {
      question: { en: 'Which architect designed the Parthenon?', el: 'Ποιος αρχιτέκτονας σχεδίασε τον Παρθενώνα;' },
      options: { en: ['Vitruvius', 'Ictinus and Callicrates', 'Phidias', 'Polykleitos'], el: ['Βιτρούβιος', 'Ικτίνος και Καλλικράτης', 'Φειδίας', 'Πολύκλειτος'] },
      correct: { en: 'Ictinus and Callicrates', el: 'Ικτίνος και Καλλικράτης' },
      explanation: { en: 'The Parthenon was built under Pericles; Phidias oversaw sculpture.', el: 'Ο Παρθενώνας κτίστηκε υπό τον Περικλή· ο Φειδίας επόπτευε τη γλυπτική.' }
    },
    {
      question: { en: 'Who wrote "Romeo and Juliet"?', el: 'Ποιος έγραψε το "Ρωμαίος και Ιουλιέτα";' },
      options: { en: ['Christopher Marlowe', 'William Shakespeare', 'Ben Jonson', 'John Donne'], el: ['Κρίστοφερ Μάρλοου', 'Ουίλιαμ Σαίξπηρ', 'Μπεν Τζόνσον', 'Τζον Ντον'] },
      correct: { en: 'William Shakespeare', el: 'Ουίλιαμ Σαίξπηρ' },
      explanation: { en: 'Shakespeare wrote the tragedy in the 1590s.', el: 'Ο Σαίξπηρ έγραψε την τραγωδία τη δεκαετία του 1590.' }
    },
    {
      question: { en: 'Which artist is known for melting clocks in "The Persistence of Memory"?', el: 'Ποιος καλλιτέχνης είναι γνωστός για τα λιωμένα ρολόγια στο "Η Διάρκεια της Μνήμης";' },
      options: { en: ['Magritte', 'Dalí', 'Ernst', 'Miró'], el: ['Μαγκρίτ', 'Νταλί', 'Ερνστ', 'Μιρό'] },
      correct: { en: 'Dalí', el: 'Νταλί' },
      explanation: { en: 'Dalí\'s 1931 painting is a landmark of Surrealism.', el: 'Ο πίνακας του Νταλί του 1931 είναι ορόσημο του Σουρεαλισμού.' }
    },
    {
      question: { en: 'Who wrote "1984"?', el: 'Ποιος έγραψε το "1984";' },
      options: { en: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H.G. Wells'], el: ['Άλντους Χάξλεϊ', 'Τζορτζ Όργουελ', 'Ρέι Μπράντμπερι', 'H.G. Wells'] },
      correct: { en: 'George Orwell', el: 'Τζορτζ Όργουελ' },
      explanation: { en: 'Orwell published the dystopian novel in 1949.', el: 'Ο Όργουελ δημοσίευσε το δυστοπικό μυθιστόρημα το 1949.' }
    },
    {
      question: { en: 'Which ancient Greek poet wrote the "Iliad" and "Odyssey"?', el: 'Ποιος αρχαίος Έλληνας ποιητής έγραψε την "Ιλιάδα" και την "Οδύσσεια";' },
      options: { en: ['Hesiod', 'Homer', 'Virgil', 'Ovid'], el: ['Ησίοδος', 'Όμηρος', 'Βιργίλιος', 'Οβίδιος'] },
      correct: { en: 'Homer', el: 'Όμηρος' },
      explanation: { en: 'The Homeric epics are foundational to Western literature.', el: 'Τα ομηρικά έπη είναι θεμελιώδη για τη δυτική λογοτεχνία.' }
    },
    {
      question: { en: 'Who sculpted "David"?', el: 'Ποιος γλύψε το "Δαβίδ";' },
      options: { en: ['Donatello', 'Michelangelo', 'Bernini', 'Verrocchio'], el: ['Ντονατέλλο', 'Μιχαήλ Άγγελος', 'Μπερνίνι', 'Βεροκκίο'] },
      correct: { en: 'Michelangelo', el: 'Μιχαήλ Άγγελος' },
      explanation: { en: 'Michelangelo\'s David (1504) is in the Accademia in Florence.', el: 'Ο Δαβίδ του Μιχαήλ Άγγελος (1504) βρίσκεται στην Ακαδημία της Φλωρεντίας.' }
    },
    {
      question: { en: 'Which painter founded the Impressionist movement?', el: 'Ποιος ζωγράφος ίδρυσε το κίνημα του Ιμπρεσιονισμού;' },
      options: { en: ['Monet', 'Manet', 'Renoir', 'Degas'], el: ['Μονέ', 'Μανέ', 'Ρενουάρ', 'Ντεγκά'] },
      correct: { en: 'Monet', el: 'Μονέ' },
      explanation: { en: 'Monet\'s "Impression, Sunrise" (1872) gave the movement its name.', el: 'Το "Έντυπωση, Ανατολή" του Μονέ (1872) έδωσε το όνομα στο κίνημα.' }
    },
    {
      question: { en: 'Who wrote "Pride and Prejudice"?', el: 'Ποια έγραψε το "Υπερηφάνεια και Προκατάληψη";' },
      options: { en: ['Charlotte Brontë', 'Jane Austen', 'George Eliot', 'Virginia Woolf'], el: ['Σαρλότ Μπροντέ', 'Τζέιν Όστεν', 'Τζορτζ Έλιοτ', 'Βιρτζίνια Γουλφ'] },
      correct: { en: 'Jane Austen', el: 'Τζέιν Όστεν' },
      explanation: { en: 'Austen published the novel in 1813.', el: 'Η Όστεν δημοσίευσε το μυθιστόρημα το 1813.' }
    },
    {
      question: { en: 'Which artist painted the Sistine Chapel ceiling?', el: 'Ποιος ζωγράφισε την οροφή της Καπέλα Σιστίνα;' },
      options: { en: ['Raphael', 'Michelangelo', 'Leonardo', 'Botticelli'], el: ['Ραφαήλ', 'Μιχαήλ Άγγελος', 'Λεονάρντο', 'Μποττιτσέλλι'] },
      correct: { en: 'Michelangelo', el: 'Μιχαήλ Άγγελος' },
      explanation: { en: 'Michelangelo painted it between 1508 and 1512.', el: 'Ο Μιχαήλ Άγγελος το ζωγράφισε μεταξύ 1508 και 1512.' }
    },
    {
      question: { en: 'Who wrote "Hamlet"?', el: 'Ποιος έγραψε το "Άμλετ";' },
      options: { en: ['Marlowe', 'Shakespeare', 'Jonson', 'Webster'], el: ['Μάρλοου', 'Σαίξπηρ', 'Τζόνσον', 'Γουέμπστερ'] },
      correct: { en: 'Shakespeare', el: 'Ουίλιαμ Σαίξπηρ' },
      explanation: { en: 'Hamlet is one of Shakespeare\'s most famous tragedies.', el: 'Το Άμλετ είναι μία από τις πιο διάσημες τραγωδίες του Σαίξπηρ.' }
    },
    {
      question: { en: 'Which ballet features the "Dance of the Sugar Plum Fairy"?', el: 'Ποιο μπαλέτο περιλαμβάνει το "Χορό της Ζαχαρένιας Νεράιδας";' },
      options: { en: ['Swan Lake', 'The Nutcracker', 'Sleeping Beauty', 'Giselle'], el: ['Η Λίμνη των Κύκνων', 'Ο Καρυοθραύστης', 'Η Ωραία Κοιμωμένη', 'Ζιζέλ'] },
      correct: { en: 'The Nutcracker', el: 'Ο Καρυοθραύστης' },
      explanation: { en: 'Tchaikovsky composed the music; the ballet premiered in 1892.', el: 'Ο Τσαϊκόφσκι συνέθεσε τη μουσική· το μπαλέτο έκανε πρεμιέρα το 1892.' }
    },
    {
      question: { en: 'Who painted "The Birth of Venus"?', el: 'Ποιος ζωγράφισε τη "Γέννηση της Αφροδίτης";' },
      options: { en: ['Michelangelo', 'Raphael', 'Botticelli', 'Titian'], el: ['Μιχαήλ Άγγελος', 'Ραφαήλ', 'Μποττιτσέλλι', 'Τιτσιάνο'] },
      correct: { en: 'Botticelli', el: 'Μποττιτσέλλι' },
      explanation: { en: 'Botticelli\'s painting (c. 1485) is a Renaissance masterpiece.', el: 'Ο πίνακας του Μποττιτσέλλι (περ. 1485) είναι αριστούργημα της Αναγέννησης.' }
    },
    {
      question: { en: 'Which artist created "Guernica"?', el: 'Ποιος δημιούργησε τη "Γκουέρνικα";' },
      options: { en: ['Dalí', 'Miró', 'Picasso', 'Matisse'], el: ['Νταλί', 'Μιρό', 'Πικάσο', 'Ματίς'] },
      correct: { en: 'Picasso', el: 'Πικάσο' },
      explanation: { en: 'Picasso painted it in 1937 in response to the bombing of Guernica.', el: 'Ο Πικάσο τη ζωγράφισε το 1937 ως απάντηση στο βομβαρδισμό της Γκουέρνικα.' }
    },
    {
      question: { en: 'Who wrote "The Great Gatsby"?', el: 'Ποιος έγραψε το "Ο Μεγάλος Γκάτσμπι";' },
      options: { en: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'], el: ['Έρνεστ Χέμινγουεϊ', 'Φ. Σκοτ Φιτζεράλντ', 'Τζον Στάινμπεκ', 'Γουίλιαμ Φόκνερ'] },
      correct: { en: 'F. Scott Fitzgerald', el: 'Φ. Σκοτ Φιτζεράλντ' },
      explanation: { en: 'Fitzgerald published the novel in 1925.', el: 'Ο Φιτζεράλντ δημοσίευσε το μυθιστόρημα το 1925.' }
    },
    {
      question: { en: 'Which designer founded the fashion house Chanel?', el: 'Ποιος σχεδιαστής ίδρυσε τον οίκο μόδας Chanel;' },
      options: { en: ['Christian Dior', 'Coco Chanel', 'Yves Saint Laurent', 'Hubert de Givenchy'], el: ['Christian Dior', 'Κόκο Σανέλ', 'Yves Saint Laurent', 'Hubert de Givenchy'] },
      correct: { en: 'Coco Chanel', el: 'Κόκο Σανέλ' },
      explanation: { en: 'Gabrielle "Coco" Chanel founded the brand in 1910.', el: 'Η Γκαμπριέλ "Κόκο" Σανέλ ίδρυσε την ετικέτα το 1910.' }
    },
    {
      question: { en: 'Who painted "The Scream"?', el: 'Ποιος ζωγράφισε τη "Κραυγή";' },
      options: { en: ['Klimt', 'Munch', 'Monet', 'Degas'], el: ['Κλιμτ', 'Μουνκ', 'Μονέ', 'Ντεγκά'] },
      correct: { en: 'Munch', el: 'Μουνκ' },
      explanation: { en: 'Edvard Munch created several versions between 1893 and 1910.', el: 'Ο Έντβαρντ Μουνκ δημιούργησε πολλές εκδοχές μεταξύ 1893 και 1910.' }
    },
    {
      question: { en: 'Which poet wrote "The Raven"?', el: 'Ποιος ποιητής έγραψε το "Το Κοράκι";' },
      options: { en: ['Walt Whitman', 'Emily Dickinson', 'Edgar Allan Poe', 'Robert Frost'], el: ['Walt Whitman', 'Έμιλυ Ντίκινσον', 'Έντγκαρ Άλλαν Πόε', 'Ρόμπερτ Φροστ'] },
      correct: { en: 'Edgar Allan Poe', el: 'Έντγκαρ Άλλαν Πόε' },
      explanation: { en: 'Poe published the poem in 1845.', el: 'Ο Πόε δημοσίευσε το ποίημα το 1845.' }
    },
    {
      question: { en: 'Who designed the Guggenheim Museum in Bilbao?', el: 'Ποιος σχεδίασε το Μουσείο Γκουγκενχάιμ στη Βιλμπάο;' },
      options: { en: ['Frank Gehry', 'Zaha Hadid', 'Norman Foster', 'Rem Koolhaas'], el: ['Φρανκ Γκέρι', 'Ζαχά Χαντίντ', 'Norman Foster', 'Rem Koolhaas'] },
      correct: { en: 'Frank Gehry', el: 'Φρανκ Γκέρι' },
      explanation: { en: 'The titanium-clad building opened in 1997.', el: 'Το κτίριο με τιτάνιο άνοιξε το 1997.' }
    },
    {
      question: { en: 'Which artist is associated with "camp" and pop art?', el: 'Ποιος καλλιτέχνης συσχετίζεται με το "camp" και τη pop art;' },
      options: { en: ['Andy Warhol', 'Roy Lichtenstein', 'Keith Haring', 'Jeff Koons'], el: ['Andy Warhol', 'Roy Lichtenstein', 'Keith Haring', 'Jeff Koons'] },
      correct: { en: 'Andy Warhol', el: 'Andy Warhol' },
      explanation: { en: 'Warhol\'s soup cans and celebrity silkscreens defined 1960s pop art.', el: 'Οι κονσέρβες και τα celebrity silkscreens του Warhol όρισαν την pop art.' }
    },
    {
      question: { en: 'Who wrote "Don Quixote"?', el: 'Ποιος έγραψε το "Δον Κιχώτης";' },
      options: { en: ['Miguel de Cervantes', 'García Márquez', 'Borges', 'Pablo Neruda'], el: ['Μιγκέλ ντε Θερβάντες', 'Γκαρσία Μάρκες', 'Μπόρχες', 'Πάμπλο Νερούδα'] },
      correct: { en: 'Miguel de Cervantes', el: 'Μιγκέλ ντε Θερβάντες' },
      explanation: { en: 'Cervantes published Part I in 1605 and Part II in 1615.', el: 'Ο Θερβάντες δημοσίευσε το Μέρος Α το 1605 και το Μέρος Β το 1615.' }
    },
    {
      question: { en: 'Which sculptor created "The Thinker"?', el: 'Ποιος γλύπτης δημιούργησε τον "Σκεπτόμενο";' },
      options: { en: ['Michelangelo', 'Donatello', 'Rodin', 'Bernini'], el: ['Μιχαήλ Άγγελος', 'Ντονατέλλο', 'Ροντέν', 'Μπερνίνι'] },
      correct: { en: 'Rodin', el: 'Ροντέν' },
      explanation: { en: 'Auguste Rodin created it as part of "The Gates of Hell".', el: 'Ο Ωγκύστ Ροντέν τον δημιούργησε ως μέρος των "Πυλών της Κόλασης".' }
    },
    {
      question: { en: 'Who painted "Girl with a Pearl Earring"?', el: 'Ποιος ζωγράφισε το "Κορίτσι με Περλεντένιο Σκουλαρί";' },
      options: { en: ['Rembrandt', 'Vermeer', 'Frans Hals', 'Pieter de Hooch'], el: ['Ρέμπραντ', 'Βερμέερ', 'Φρανς Χαλς', 'Πίτερ ντε Χόοχ'] },
      correct: { en: 'Vermeer', el: 'Βερμέερ' },
      explanation: { en: 'Johannes Vermeer painted it around 1665.', el: 'Ο Γιοχάνες Βερμέερ τον ζωγράφισε περίπου το 1665.' }
    },
    {
      question: { en: 'Which architect designed the Sydney Opera House?', el: 'Ποιος αρχιτέκτονας σχεδίασε το Όπερα Χάουζ της Σίδνεϊ;' },
      options: { en: ['Frank Lloyd Wright', 'Jørn Utzon', 'Le Corbusier', 'I.M. Pei'], el: ['Φρανκ Λόιντ Ράιτ', 'Γιερν Ούτσον', 'Λε Κορμπυζιέ', 'I.M. Pei'] },
      correct: { en: 'Jørn Utzon', el: 'Γιερν Ούτσον' },
      explanation: { en: 'The Danish architect won the competition in 1957.', el: 'Ο Δανός αρχιτέκτονας κέρδισε τον διαγωνισμό το 1957.' }
    },
    {
      question: { en: 'Who wrote "Odyssey"?', el: 'Ποιος έγραψε την "Οδύσσεια";' },
      options: { en: ['Virgil', 'Homer', 'Hesiod', 'Sophocles'], el: ['Βιργίλιος', 'Όμηρος', 'Ησίοδος', 'Σοφοκλής'] },
      correct: { en: 'Homer', el: 'Όμηρος' },
      explanation: { en: 'The Odyssey follows Odysseus\' journey home after the Trojan War.', el: 'Η Οδύσσεια ακολουθεί το ταξίδι του Οδυσσέα κατά την επιστροφή του.' }
    },
    {
      question: { en: 'Which art movement did Picasso co-found?', el: 'Ποιο καλλιτεχνικό κίνημα συνίδρυσε ο Πικάσο;' },
      options: { en: ['Surrealism', 'Impressionism', 'Cubism', 'Expressionism'], el: ['Σουρεαλισμός', 'Ιμπρεσιονισμός', 'Κυβισμός', 'Εξπρεσιονισμός'] },
      correct: { en: 'Cubism', el: 'Κυβισμός' },
      explanation: { en: 'Picasso and Braque developed Cubism around 1907.', el: 'Ο Πικάσο και ο Μπρακ ανέπτυξαν τον Κυβισμό περίπου το 1907.' }
    },
    {
      question: { en: 'Which Renaissance artist painted "The Last Supper"?', el: 'Ποιος καλλιτέχνης της Αναγέννησης ζωγράφισε το "Μυστικό Δείπνο";' },
      options: { en: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Titian'], el: ['Μιχαήλ Άγγελος', 'Ραφαήλ', 'Λεονάρντο ντα Βίντσι', 'Τιτσιάνο'] },
      correct: { en: 'Leonardo da Vinci', el: 'Λεονάρντο ντα Βίντσι' },
      explanation: { en: 'Leonardo painted it in Milan around 1495–1498.', el: 'Ο Λεονάρντο τον ζωγράφισε στο Μιλάνο περίπου 1495–1498.' }
    },
    {
      question: { en: 'Which photographer took "Migrant Mother"?', el: 'Ποιος φωτογράφος τράβηξε τη "Μητέρα μετανάστρια";' },
      options: { en: ['Ansel Adams', 'Dorothea Lange', 'Walker Evans', 'Margaret Bourke-White'], el: ['Ansel Adams', 'Ντοροθέα Λανγκ', 'Walker Evans', 'Margaret Bourke-White'] },
      correct: { en: 'Dorothea Lange', el: 'Ντοροθέα Λανγκ' },
      explanation: { en: 'Lange captured it in 1936 during the Great Depression.', el: 'Η Λανγκ την τράβηξε το 1936 κατά τη Μεγάλη Ύφεση.' }
    },
  ],
  sports: [
    {
      question: { en: 'How many players are on a soccer team on the field?', el: 'Πόσοι παίκτες υπάρχουν σε μια ομάδα ποδοσφαίρου στο γήπεδο;' },
      options: { en: ['9', '10', '11', '12'], el: ['9', '10', '11', '12'] },
      correct: { en: '11', el: '11' },
      explanation: { en: 'Each soccer team has 11 players including the goalkeeper.', el: 'Κάθε ομάδα ποδοσφαίρου έχει 11 παίκτες συμπεριλαμβανομένου του τερματοφύλακα.' }
    },
    {
      question: { en: 'In which country did modern football (soccer) originate?', el: 'Σε ποια χώρα ξεκίνησε το σύγχρονο ποδόσφαιρο;' },
      options: { en: ['France', 'Italy', 'England', 'Germany'], el: ['Γαλλία', 'Ιταλία', 'Αγγλία', 'Γερμανία'] },
      correct: { en: 'England', el: 'Αγγλία' },
      explanation: { en: 'The FA and modern rules were established in England in 1863.', el: 'Η FA και οι σύγχρονοι κανόνες καθιερώθηκαν στην Αγγλία το 1863.' }
    },
    {
      question: { en: 'How many Grand Slam tournaments are there in tennis per year?', el: 'Πόσα τουρνουά Grand Slam γίνονται στο τένις ανά έτος;' },
      options: { en: ['2', '3', '4', '5'], el: ['2', '3', '4', '5'] },
      correct: { en: '4', el: '4' },
      explanation: { en: 'Australian Open, French Open, Wimbledon, and US Open.', el: 'Australian Open, Γαλλικά Όπεν, Wimbledon και US Open.' }
    },
    {
      question: { en: 'Who has won the most Olympic gold medals in history?', el: 'Ποιος έχει κερδίσει τα περισσότερα χρυσά Ολυμπιακά μετάλλια στην ιστορία;' },
      options: { en: ['Usain Bolt', 'Michael Phelps', 'Carl Lewis', 'Simone Biles'], el: ['Γιουσέιν Μπολτ', 'Μάικλ Φελπς', 'Καρλ Λιούις', 'Σιμόν Μπάιλς'] },
      correct: { en: 'Michael Phelps', el: 'Μάικλ Φελπς' },
      explanation: { en: 'Phelps won 23 Olympic gold medals in swimming.', el: 'Ο Φελπς κέρδισε 23 χρυσά Ολυμπιακά μετάλλια στην κολύμβηση.' }
    },
    {
      question: { en: 'In which city were the first modern Olympics held?', el: 'Σε ποια πόλη πραγματοποιήθηκαν οι πρώτοι σύγχρονοι Ολυμπιακοί Αγώνες;' },
      options: { en: ['Rome', 'Paris', 'Athens', 'London'], el: ['Ρώμη', 'Παρίσι', 'Αθήνα', 'Λονδίνο'] },
      correct: { en: 'Athens', el: 'Αθήνα' },
      explanation: { en: 'The 1896 Summer Olympics took place in Athens.', el: 'Οι Ολυμπιακοί του 1896 πραγματοποιήθηκαν στην Αθήνα.' }
    },
    {
      question: { en: 'How many points is a touchdown worth in American football?', el: 'Πόσους πόντους αξίζει ένα touchdown στο αμερικανικό ποδόσφαιρο;' },
      options: { en: ['5', '6', '7', '8'], el: ['5', '6', '7', '8'] },
      correct: { en: '6', el: '6' },
      explanation: { en: 'A touchdown is 6 points; the extra point adds 1 or 2 more.', el: 'Το touchdown αξίζει 6 πόντους· το extra point προσθέτει 1 ή 2 ακόμα.' }
    },
    {
      question: { en: 'Which country has won the most FIFA World Cups?', el: 'Ποια χώρα έχει κερδίσει τα περισσότερα Παγκόσμια Κύπελλα FIFA;' },
      options: { en: ['Germany', 'Italy', 'Brazil', 'Argentina'], el: ['Γερμανία', 'Ιταλία', 'Βραζιλία', 'Αργεντινή'] },
      correct: { en: 'Brazil', el: 'Βραζιλία' },
      explanation: { en: 'Brazil has won 5 World Cups (1958, 1962, 1970, 1994, 2002).', el: 'Η Βραζιλία έχει κερδίσει 5 Παγκόσμια Κύπελλα.' }
    },
    {
      question: { en: 'What is the name of the trophy for the soccer World Cup?', el: 'Ποιο είναι το όνομα του τροπαίου για το Παγκόσμιο Κύπελλο Ποδοσφαίρου;' },
      options: { en: ['Jules Rimet Trophy', 'FIFA Trophy', 'World Cup Trophy', 'Golden Ball'], el: ['Τρόπαιο Ζυλ Ριμέ', 'Τρόπαιο FIFA', 'Τρόπαιο Παγκόσμιου Κυπέλλου', 'Χρυσή Μπάλα'] },
      correct: { en: 'World Cup Trophy', el: 'Τρόπαιο Παγκόσμιου Κυπέλλου' },
      explanation: { en: 'The current trophy has been used since 1974; the original was the Jules Rimet.', el: 'Το τρέχον τρόπαιο χρησιμοποιείται από το 1974.' }
    },
    {
      question: { en: 'How long is a marathon in kilometers?', el: 'Πόσο μακρύ είναι ένας μαραθώνιος σε χιλιόμετρα;' },
      options: { en: ['40.195', '41.195', '42.195', '43.195'], el: ['40,195', '41,195', '42,195', '43,195'] },
      correct: { en: '42.195', el: '42,195' },
      explanation: { en: 'A marathon is 42.195 km (26.2 miles).', el: 'Ο μαραθώνιος είναι 42,195 χλμ (26,2 μίλια).' }
    },
    {
      question: { en: 'Which sport is known as "the sport of kings"?', el: 'Ποιο άθλημα είναι γνωστό ως "το άθλημα των βασιλιάδων";' },
      options: { en: ['Polo', 'Tennis', 'Golf', 'Horse racing'], el: ['Πόλο', 'Τένις', 'Γκολφ', 'Ιπποδρομίες'] },
      correct: { en: 'Horse racing', el: 'Ιπποδρομίες' },
      explanation: { en: 'Horse racing has long been associated with royalty and nobility.', el: 'Οι ιπποδρομίες συνδέθηκαν εδώ και καιρό με τη βασιλεία και την αριστοκρατία.' }
    },
    {
      question: { en: 'Who holds the record for most career home runs in MLB?', el: 'Ποιος κατέχει το ρεκόρ περισσότερων home runs στην καριέρα στο MLB;' },
      options: { en: ['Babe Ruth', 'Hank Aaron', 'Barry Bonds', 'Willie Mays'], el: ['Babe Ruth', 'Hank Aaron', 'Barry Bonds', 'Willie Mays'] },
      correct: { en: 'Barry Bonds', el: 'Barry Bonds' },
      explanation: { en: 'Bonds hit 762 home runs, though his record is debated due to PEDs.', el: 'Ο Bonds έκανε 762 home runs.' }
    },
    {
      question: { en: 'In which year did the first Tour de France take place?', el: 'Σε ποιο έτος πραγματοποιήθηκε ο πρώτος Γύρος της Γαλλίας;' },
      options: { en: ['1898', '1903', '1913', '1923'], el: ['1898', '1903', '1913', '1923'] },
      correct: { en: '1903', el: '1903' },
      explanation: { en: 'The Tour de France began in 1903 to promote a newspaper.', el: 'Ο Γύρος της Γαλλίας ξεκίνησε το 1903 για να προωθήσει μια εφημερίδα.' }
    },
    {
      question: { en: 'How many players are on a basketball team on the court?', el: 'Πόσοι παίκτες μιας ομάδας μπάσκετ είναι στο παρκέ;' },
      options: { en: ['4', '5', '6', '7'], el: ['4', '5', '6', '7'] },
      correct: { en: '5', el: '5' },
      explanation: { en: 'Each basketball team has 5 players on the court.', el: 'Κάθε ομάδα μπάσκετ έχει 5 παίκτες στο παρκέ.' }
    },
    {
      question: { en: 'Which boxer was known as "The Greatest"?', el: 'Ποιος πυγμάχος ήταν γνωστός ως "Ο Μεγαλύτερος";' },
      options: { en: ['Mike Tyson', 'Muhammad Ali', 'George Foreman', 'Joe Frazier'], el: ['Μάικ Τάισον', 'Μοχάμεντ Άλι', 'Τζορτζ Φόρμαν', 'Τζο Φρέιζερ'] },
      correct: { en: 'Muhammad Ali', el: 'Μοχάμεντ Άλι' },
      explanation: { en: 'Muhammad Ali gave himself the nickname.', el: 'Ο Μοχάμεντ Άλι έδωσε στον εαυτό του το παρατσούκλι.' }
    },
    {
      question: { en: 'What color is the jersey of the leader in the Tour de France?', el: 'Ποιο χρώμα έχει τη φανέλα του ηγέτη στον Γύρο της Γαλλίας;' },
      options: { en: ['Green', 'Polka dot', 'Yellow', 'White'], el: ['Πράσινο', 'Πολύχρωμες κουκίδες', 'Κίτρινο', 'Λευκό'] },
      correct: { en: 'Yellow', el: 'Κίτρινο' },
      explanation: { en: 'The yellow jersey (maillot jaune) goes to the overall leader.', el: 'Η κίτρινη φανέλα πηγαίνει στον συνολικό ηγέτη.' }
    },
    {
      question: { en: 'Which country invented the sport of badminton?', el: 'Ποια χώρα εφηύρε το άθλημα του μπάντμιντον;' },
      options: { en: ['China', 'India', 'England', 'Indonesia'], el: ['Κίνα', 'Ινδία', 'Αγγλία', 'Ινδονησία'] },
      correct: { en: 'England', el: 'Αγγλία' },
      explanation: { en: 'Badminton developed in England in the 19th century from battledore.', el: 'Το μπάντμιντον αναπτύχθηκε στην Αγγλία τον 19ο αιώνα.' }
    },
    {
      question: { en: 'Who won the most Grand Slam singles titles in tennis (male)?', el: 'Ποιος κέρδισε τα περισσότερα Grand Slam απλών (άνδρες) στο τένις;' },
      options: { en: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'], el: ['Ρότζερ Φένερερ', 'Ραφαέλ Ναδάλ', 'Νόβακ Τζόκοβιτς', 'Πιτ Σάμπρας'] },
      correct: { en: 'Novak Djokovic', el: 'Νόβακ Τζόκοβιτς' },
      explanation: { en: 'Djokovic has won 24 Grand Slam singles titles.', el: 'Ο Τζόκοβιτς έχει κερδίσει 24 τίτλους Grand Slam απλών.' }
    },
    {
      question: { en: 'In swimming, how many strokes are used in the individual medley?', el: 'Στην κολύμβηση, πόσα στυλ χρησιμοποιούνται στο ατομικό μέντλεϊ;' },
      options: { en: ['2', '3', '4', '5'], el: ['2', '3', '4', '5'] },
      correct: { en: '4', el: '4' },
      explanation: { en: 'Butterfly, backstroke, breaststroke, and freestyle.', el: 'Πεταλούδα, ύπτια, πρόσθιο και ελεύθερο.' }
    },
    {
      question: { en: 'Which country has won the most Winter Olympics medals?', el: 'Ποια χώρα έχει κερδίσει τα περισσότερα μετάλλια στους Χειμερινούς Ολυμπιακούς;' },
      options: { en: ['USA', 'Russia', 'Norway', 'Germany'], el: ['ΗΠΑ', 'Ρωσία', 'Νορβηγία', 'Γερμανία'] },
      correct: { en: 'Norway', el: 'Νορβηγία' },
      explanation: { en: 'Norway leads the all-time Winter Olympics medal count.', el: 'Η Νορβηγία προηγείται στο σύνολο μεταλλίων Χειμερινών Ολυμπιακών.' }
    },
    {
      question: { en: 'What is the maximum break in snooker?', el: 'Ποιο είναι το μέγιστο break στο snooker;' },
      options: { en: ['147', '155', '167', '180'], el: ['147', '155', '167', '180'] },
      correct: { en: '147', el: '147' },
      explanation: { en: 'A maximum break of 147 is achieved by potting all 15 reds with blacks.', el: 'Το μέγιστο break 147 επιτυγχάνεται με όλα τα κόκκινα και μαύρα.' }
    },
    {
      question: { en: 'Which Formula 1 driver has won the most World Championships?', el: 'Ποιος οδηγός Formula 1 έχει κερδίσει τα περισσότερα Παγκόσμια Πρωταθλήματα;' },
      options: { en: ['Ayrton Senna', 'Michael Schumacher', 'Lewis Hamilton', 'Lewis Hamilton and Michael Schumacher'], el: ['Άιρτον Σένα', 'Μίκαελ Σουμάχερ', 'Λιούις Χάμιλτον', 'Λιούις Χάμιλτον και Μίκαελ Σουμάχερ'] },
      correct: { en: 'Lewis Hamilton and Michael Schumacher', el: 'Λιούις Χάμιλτον και Μίκαελ Σουμάχερ' },
      explanation: { en: 'Both Hamilton and Schumacher have 7 titles each.', el: 'Και οι δύο έχουν 7 τίτλους ο καθένας.' }
    },
    {
      question: { en: 'In cricket, how many balls are in one over?', el: 'Στο κρίκετ, πόσες μπάλες υπάρχουν σε ένα over;' },
      options: { en: ['4', '5', '6', '7'], el: ['4', '5', '6', '7'] },
      correct: { en: '6', el: '6' },
      explanation: { en: 'An over consists of 6 legal deliveries.', el: 'Ένα over αποτελείται από 6 νόμιμες βολές.' }
    },
    {
      question: { en: 'Which NBA team has won the most championships?', el: 'Ποια ομάδα NBA έχει κερδίσει τα περισσότερα πρωταθλήματα;' },
      options: { en: ['Chicago Bulls', 'Boston Celtics', 'Los Angeles Lakers', 'Golden State Warriors'], el: ['Chicago Bulls', 'Boston Celtics', 'Los Angeles Lakers', 'Golden State Warriors'] },
      correct: { en: 'Boston Celtics', el: 'Boston Celtics' },
      explanation: { en: 'The Celtics have 17 titles; the Lakers also have 17.', el: 'Οι Celtics έχουν 17 τίτλους· οι Lakers επίσης 17.' }
    },
    {
      question: { en: 'Who holds the 100m sprint world record?', el: 'Ποιος κατέχει το παγκόσμιο ρεκόρ στα 100 μέτρα;' },
      options: { en: ['Usain Bolt', 'Carl Lewis', 'Justin Gatlin', 'Tyson Gay'], el: ['Γιουσέιν Μπολτ', 'Καρλ Λιούις', 'Justin Gatlin', 'Tyson Gay'] },
      correct: { en: 'Usain Bolt', el: 'Γιουσέιν Μπολτ' },
      explanation: { en: 'Bolt ran 9.58 seconds in Berlin in 2009.', el: 'Ο Μπολτ έτρεξε 9,58 δευτερόλεπτα στο Βερολίνο το 2009.' }
    },
    {
      question: { en: 'Which country hosted the 2016 Summer Olympics?', el: 'Ποια χώρα φιλοξένησε τους Θερινούς Ολυμπιακούς του 2016;' },
      options: { en: ['China', 'Brazil', 'UK', 'Japan'], el: ['Κίνα', 'Βραζιλία', 'ΗΒ', 'Ιαπωνία'] },
      correct: { en: 'Brazil', el: 'Βραζιλία' },
      explanation: { en: 'Rio de Janeiro hosted the 2016 Olympics.', el: 'Το Ρίο ντε Τζανέιρο φιλοξένησε τους Ολυμπιακούς του 2016.' }
    },
    {
      question: { en: 'What is the diameter of a basketball hoop in inches?', el: 'Ποια είναι η διάμετρος ενός καλαθιού μπάσκετ σε ίντσες;' },
      options: { en: ['16', '17', '18', '19'], el: ['16', '17', '18', '19'] },
      correct: { en: '18', el: '18' },
      explanation: { en: 'The standard hoop diameter is 18 inches.', el: 'Η τυπική διάμετρος του καλαθιού είναι 18 ίντσες.' }
    },
    {
      question: { en: 'Which sport uses a "birdie" or "shuttlecock"?', el: 'Ποιο άθλημα χρησιμοποιεί "birdie" ή "shuttlecock";' },
      options: { en: ['Tennis', 'Badminton', 'Squash', 'Table tennis'], el: ['Τένις', 'Μπάντμιντον', 'Σκουάς', 'Πινγκ-πονγκ'] },
      correct: { en: 'Badminton', el: 'Μπάντμιντον' },
      explanation: { en: 'The shuttlecock is the projectile used in badminton.', el: 'Το shuttlecock είναι το βλήμα που χρησιμοποιείται στο μπάντμιντον.' }
    },
    {
      question: { en: 'How many sets are needed to win a match in men\'s Grand Slam tennis?', el: 'Πόσα σετ χρειάζονται για να κερδίσει κανείς έναν αγώνα στους άνδρες στο Grand Slam τένις;' },
      options: { en: ['2', '3', '4', '5'], el: ['2', '3', '4', '5'] },
      correct: { en: '3', el: '3' },
      explanation: { en: 'Men play best-of-five at Grand Slams; first to 3 sets wins.', el: 'Οι άνδρες παίζουν best-of-five στα Grand Slam· πρώτος στα 3 σετ κερδίζει.' }
    },
    {
      question: { en: 'Which country won the first ever Cricket World Cup?', el: 'Ποια χώρα κέρδισε το πρώτο Παγκόσμιο Κύπελλο Κρίκετ;' },
      options: { en: ['Australia', 'England', 'West Indies', 'India'], el: ['Αυστραλία', 'Αγγλία', 'Δυτικές Ινδίες', 'Ινδία'] },
      correct: { en: 'West Indies', el: 'Δυτικές Ινδίες' },
      explanation: { en: 'The West Indies won the inaugural 1975 Cricket World Cup.', el: 'Οι Δυτικές Ινδίες κέρδισαν το πρώτο Παγκόσμιο Κύπελλο το 1975.' }
    },
    {
      question: { en: 'Who is known as the "King of Clay" in tennis?', el: 'Ποιος είναι γνωστός ως ο "Βασιλιάς του Χωματόδρομου" στο τένις;' },
      options: { en: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Björn Borg'], el: ['Ρότζερ Φένερερ', 'Ραφαέλ Ναδάλ', 'Νόβακ Τζόκοβιτς', 'Μπιέρν Μποργκ'] },
      correct: { en: 'Rafael Nadal', el: 'Ραφαέλ Ναδάλ' },
      explanation: { en: 'Nadal has won the French Open 14 times, the most at any single Grand Slam.', el: 'Ο Ναδάλ έχει κερδίσει το Γαλλικό Όπεν 14 φορές.' }
    }
  ]
};
