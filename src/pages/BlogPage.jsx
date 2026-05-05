import React, { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const ARTICLES = [
  {
    slug: "math-magic-tricks",
    gradient: "from-blue-400 to-indigo-500",
    icon: "🧮",
    tag: { el: "Μαθηματικά", en: "Math" },
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    readTime: { el: "3 λεπτά", en: "3 min read" },
    title: {
      el: "5 μαθηματικά κόλπα που θα εντυπωσιάσουν το παιδί σας",
      en: "5 math magic tricks that will impress your child",
    },
    intro: {
      el: "Τα μαθηματικά δεν χρειάζεται να είναι βαρετά! Με λίγη δημιουργικότητα, μπορείτε να μετατρέψετε απλές πράξεις σε μαγικά κόλπα που θα κάνουν τα παιδιά σας να αγαπήσουν τους αριθμούς.",
      en: "Math doesn't have to be boring! With a little creativity, you can turn simple operations into magic tricks that will make your kids fall in love with numbers.",
    },
    sections: {
      el: [
        {
          title: "1. Το κόλπο του 9",
          content: "Ζητήστε από το παιδί να σκεφτεί έναν αριθμό, να τον πολλαπλασιάσει με 9 και να αθροίσει τα ψηφία του αποτελέσματος. Το αποτέλεσμα θα είναι πάντα 9! Για παράδειγμα: 7 × 9 = 63, 6 + 3 = 9. Αυτό ισχύει για κάθε αριθμό και τα παιδιά το θεωρούν μαγεία!",
        },
        {
          title: "2. Μάντεψε τον αριθμό",
          content: "Πείτε στο παιδί: «Σκέψου έναν αριθμό. Πρόσθεσε 5. Πολλαπλασίασε με 2. Αφαίρεσε 10. Διαίρεσε με 2.» Το αποτέλεσμα είναι πάντα ο αρχικός αριθμός! Η μαγεία κρύβεται στην αλγεβρική απλοποίηση: (2(x+5) - 10) / 2 = x.",
        },
        {
          title: "3. Ο μαγικός αριθμός 1089",
          content: "Γράψτε έναν τριψήφιο αριθμό (π.χ. 532). Αντιστρέψτε τα ψηφία (235). Αφαιρέστε τον μικρότερο από τον μεγαλύτερο (532-235=297). Αντιστρέψτε ξανά τα ψηφία (792). Προσθέστε τα (297+792). Το αποτέλεσμα είναι πάντα 1089!",
        },
        {
          title: "4. Μαγική πρόσθεση στα δάχτυλα",
          content: "Για τον πίνακα πολλαπλασιασμού του 9 χρησιμοποιήστε τα δάχτυλα! Αριθμήστε τα δάχτυλα 1-10. Για 9×3, κατεβάστε το 3ο δάχτυλο. Αριστερά μένουν 2 δάχτυλα, δεξιά 7. Απάντηση: 27!",
        },
        {
          title: "5. Η μαγική ημερομηνία",
          content: "Ζητήστε από κάποιον τη γενέθλια ημερομηνία του. «Πολλαπλασίασε τον μήνα × 5, πρόσθεσε 6, πολλαπλασίασε × 4, πρόσθεσε 9, πολλαπλασίασε × 5, πρόσθεσε την ημέρα.» Αφαιρέστε 165 από το αποτέλεσμα — οι πρώτοι αριθμοί είναι ο μήνας, οι τελευταίοι η ημέρα!",
        },
      ],
      en: [
        {
          title: "1. The trick of 9",
          content: "Ask your child to think of a number, multiply it by 9, and add up the digits of the result. The result will always be 9! For example: 7 × 9 = 63, 6 + 3 = 9. This works for any number and kids think it's pure magic!",
        },
        {
          title: "2. Guess the number",
          content: "Tell your child: 'Think of a number. Add 5. Multiply by 2. Subtract 10. Divide by 2.' The result is always the original number! The magic lies in algebraic simplification: (2(x+5) - 10) / 2 = x.",
        },
        {
          title: "3. The magic number 1089",
          content: "Write a three-digit number (e.g. 532). Reverse the digits (235). Subtract the smaller from the larger (532-235=297). Reverse again (792). Add them (297+792). The result is always 1089!",
        },
        {
          title: "4. Finger multiplication magic",
          content: "For the 9 times table, use your fingers! Number your fingers 1-10. For 9×3, lower the 3rd finger. On the left you have 2 fingers, on the right 7. Answer: 27!",
        },
        {
          title: "5. The magic birthday",
          content: "Ask someone their birthday. 'Multiply the month × 5, add 6, multiply × 4, add 9, multiply × 5, add the day.' Subtract 165 from the result — the first digits are the month, the last ones are the day!",
        },
      ],
    },
    tip: {
      el: "Δοκιμάστε αυτά τα κόλπα στην ώρα του φαγητού ή στο αυτοκίνητο. Τα παιδιά θα ζητήσουν κι άλλα!",
      en: "Try these tricks at dinner or in the car. Kids will ask for more!",
    },
  },
  {
    slug: "word-games-school-performance",
    gradient: "from-emerald-400 to-teal-500",
    icon: "🎲",
    tag: { el: "Λεκτικά παιχνίδια", en: "Word games" },
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    readTime: { el: "4 λεπτά", en: "4 min read" },
    title: {
      el: "6 λεκτικά παιχνίδια που αυξάνουν τη σχολική επίδοση",
      en: "6 word games that boost school performance",
    },
    intro: {
      el: "Τα παιχνίδια με λέξεις δεν είναι απλά διασκεδαστικά — αναπτύσσουν λεξιλόγιο, ορθογραφία, κατανόηση κειμένου και γλωσσική ευελιξία. Ιδού 6 παιχνίδια που μπορείτε να παίξετε αμέσως!",
      en: "Word games aren't just fun — they develop vocabulary, spelling, reading comprehension, and language fluency. Here are 6 games you can play right away!",
    },
    sections: {
      el: [
        {
          title: "1. Αλυσίδα λέξεων",
          content: "Ο πρώτος παίκτης λέει μια λέξη. Ο επόμενος πρέπει να πει μια λέξη που αρχίζει από το τελευταίο γράμμα της προηγούμενης. Π.χ.: σπίτι → ιστορία → αστέρι → ιπποπόταμος. Ιδανικό για να εξασκηθεί η φωνολογική ενημερότητα!",
        },
        {
          title: "2. 20 ερωτήσεις",
          content: "Ένα παιδί σκέφτεται ένα αντικείμενο. Οι υπόλοιποι κάνουν ερωτήσεις με ναι/όχι για να το μαντέψουν. Μέγιστο 20 ερωτήσεις! Αναπτύσσει κατηγοριοποίηση, λογική σκέψη και λεξιλόγιο.",
        },
        {
          title: "3. Ιστορία αλυσίδα",
          content: "Ξεκινήστε μια πρόταση: «Μια μέρα, ένα σκυλάκι...». Κάθε παίκτης προσθέτει μια πρόταση. Η ιστορία γίνεται τρελή, αστεία και δημιουργική. Αναπτύσσει αφηγηματικές ικανότητες και φαντασία.",
        },
        {
          title: "4. Κρυμμένες λέξεις",
          content: "Γράψτε μια μεγάλη λέξη (π.χ. ΗΛΕΚΤΡΙΣΜΟΣ). Πόσες μικρότερες λέξεις μπορεί να βρει το παιδί; (ήλιος, τρίο, λέξη, ρήμα...). Ιδανικό για ορθογραφία και αναγνώριση μορφών!",
        },
        {
          title: "5. Αντίθετα σε 10 δευτερόλεπτα",
          content: "Πείτε μια λέξη και το παιδί πρέπει να βρει το αντίθετό της σε 10 δευτερόλεπτα. Μεγάλο → Μικρό, Γρήγορο → Αργό, Σκοτεινό → Φωτεινό. Αυξήστε σταδιακά τη δυσκολία!",
        },
        {
          title: "6. Ρίμες",
          content: "Ποιος βρίσκει περισσότερες λέξεις που ομοιοκαταληκτούν; Γάτα → πατάτα, μπάτα, σαλάτα, πλάτα. Ιδανικό για φωνολογική ενημερότητα και ρυθμό, δεξιότητες βασικές για την ανάγνωση.",
        },
      ],
      en: [
        {
          title: "1. Word chain",
          content: "The first player says a word. The next must say a word starting with the last letter of the previous one. E.g.: house → elephant → tiger → rabbit. Perfect for phonological awareness!",
        },
        {
          title: "2. 20 questions",
          content: "One child thinks of an object. Others ask yes/no questions to guess it. Maximum 20 questions! Develops categorization, logical thinking, and vocabulary.",
        },
        {
          title: "3. Story chain",
          content: "Start a sentence: 'One day, a little dog...' Each player adds a sentence. The story gets wild, funny, and creative. Develops narrative skills and imagination.",
        },
        {
          title: "4. Hidden words",
          content: "Write a big word (e.g. ELECTRICITY). How many smaller words can your child find? (electric, city, rice, trick...). Perfect for spelling and pattern recognition!",
        },
        {
          title: "5. Opposites in 10 seconds",
          content: "Say a word and the child must find its opposite in 10 seconds. Big → Small, Fast → Slow, Dark → Bright. Gradually increase difficulty!",
        },
        {
          title: "6. Rhymes",
          content: "Who can find more rhyming words? Cat → hat, bat, mat, sat. Perfect for phonological awareness and rhythm, skills essential for reading.",
        },
      ],
    },
    tip: {
      el: "Παίξτε αυτά τα παιχνίδια στο αυτοκίνητο, στην ουρά ή πριν τον ύπνο. Δεν χρειάζεται κανένα υλικό!",
      en: "Play these games in the car, in the queue, or before bedtime. No materials needed!",
    },
  },
  {
    slug: "puzzles-make-kids-smarter",
    gradient: "from-violet-400 to-purple-500",
    icon: "🧩",
    tag: { el: "Λογική", en: "Logic" },
    tagColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    readTime: { el: "3 λεπτά", en: "3 min read" },
    title: {
      el: "Γιατί τα puzzles κάνουν τα παιδιά πιο έξυπνα",
      en: "Why puzzles make children smarter",
    },
    intro: {
      el: "Η έρευνα δείχνει ότι τα παιδιά που λύνουν puzzles αναπτύσσουν ισχυρότερες χωρικές, μαθηματικές και λογικές δεξιότητες. Ας δούμε γιατί.",
      en: "Research shows that children who solve puzzles develop stronger spatial, mathematical, and logical skills. Let's see why.",
    },
    sections: {
      el: [
        {
          title: "Χωρική αντίληψη",
          content: "Τα puzzles αναγκάζουν τα παιδιά να περιστρέφουν νοητικά κομμάτια, να αναγνωρίζουν μοτίβα και να αντιλαμβάνονται πώς τα μέρη σχηματίζουν ένα σύνολο. Αυτές οι δεξιότητες συνδέονται άμεσα με επιδόσεις στα μαθηματικά και τις φυσικές επιστήμες.",
        },
        {
          title: "Μνήμη εργασίας",
          content: "Κρατώντας νοητικά πολλές πληροφορίες ταυτόχρονα (χρώμα, σχήμα, θέση), τα παιδιά εξασκούν τη μνήμη εργασίας τους — μια από τις πιο κρίσιμες γνωστικές ικανότητες για τη σχολική επιτυχία.",
        },
        {
          title: "Υπομονή & επιμονή",
          content: "Ένα puzzle δεν λύνεται αμέσως. Η διαδικασία δοκιμής-και-λάθους διδάσκει υπομονή, ανθεκτικότητα στη ματαίωση και την ικανοποίηση που φέρνει η ολοκλήρωση μιας δύσκολης εργασίας.",
        },
        {
          title: "Ποια puzzles είναι κατάλληλα ανά ηλικία;",
          content: "2-3 ετών: Ξύλινα puzzles με λαβές (4-6 κομμάτια). 4-5 ετών: Jigsaw 20-50 κομμάτια. 6-8 ετών: Sudoku για αρχάριους, tangram, λογικά μοτίβα. 9+: Rubik's cube, σύνθετα jigsaw 100+, στρατηγικά επιτραπέζια.",
        },
      ],
      en: [
        {
          title: "Spatial awareness",
          content: "Puzzles force children to mentally rotate pieces, recognize patterns, and understand how parts form a whole. These skills are directly linked to performance in math and science.",
        },
        {
          title: "Working memory",
          content: "By mentally holding multiple pieces of information simultaneously (color, shape, position), children exercise their working memory — one of the most critical cognitive abilities for school success.",
        },
        {
          title: "Patience & persistence",
          content: "A puzzle isn't solved immediately. The trial-and-error process teaches patience, resilience to frustration, and the satisfaction of completing a difficult task.",
        },
        {
          title: "Which puzzles are appropriate by age?",
          content: "Ages 2-3: Wooden puzzles with handles (4-6 pieces). Ages 4-5: Jigsaw 20-50 pieces. Ages 6-8: Beginner sudoku, tangram, logic patterns. Ages 9+: Rubik's cube, complex jigsaw 100+, strategy board games.",
        },
      ],
    },
    tip: {
      el: "Ξεκινήστε με εύκολα puzzles και αυξήστε σταδιακά τη δυσκολία. Η επιτυχία χτίζει αυτοπεποίθηση!",
      en: "Start with easy puzzles and gradually increase difficulty. Success builds confidence!",
    },
  },
  {
    slug: "teaching-kids-to-lose",
    gradient: "from-amber-400 to-orange-500",
    icon: "💪",
    tag: { el: "Ανάπτυξη", en: "Growth" },
    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    readTime: { el: "5 λεπτά", en: "5 min read" },
    title: {
      el: "Να μάθουμε στα παιδιά να χάνουν — το κλειδί για την επιτυχία",
      en: "Teaching kids to lose — the key to success",
    },
    intro: {
      el: "Κανένας γονιός δεν θέλει να δει το παιδί του να στεναχωριέται. Αλλά η ικανότητα να αντιμετωπίζει κανείς την ήττα είναι ίσως η πιο σημαντική δεξιότητα ζωής.",
      en: "No parent wants to see their child upset. But the ability to handle defeat is perhaps the most important life skill.",
    },
    sections: {
      el: [
        {
          title: "Γιατί είναι σημαντικό να χάνουμε",
          content: "Η ήττα διδάσκει ανθεκτικότητα, αυτογνωσία και τη δύναμη να προσπαθούμε ξανά. Τα παιδιά που μαθαίνουν νωρίς ότι η αποτυχία είναι μέρος της μάθησης, αναπτύσσουν αυτό που η ψυχολόγος Carol Dweck ονομάζει «growth mindset» — την πεποίθηση ότι οι ικανότητες αναπτύσσονται με την προσπάθεια.",
        },
        {
          title: "Μην αφήνετε πάντα το παιδί να κερδίζει",
          content: "Αν αφήνετε συνεχώς το παιδί να κερδίζει, του στέλνετε το μήνυμα ότι πρέπει πάντα να κερδίζει για να νιώθει καλά. Αυτό δημιουργεί ευθραυστότητα. Αντίθετα, παίξτε δίκαια και δείξτε πώς αντιμετωπίζετε εσείς την ήττα.",
        },
        {
          title: "Πώς να βοηθήσετε μετά μια ήττα",
          content: "Αναγνωρίστε τα συναισθήματα: «Καταλαβαίνω ότι στεναχωρήθηκες.» Μην μικρύνετε το πρόβλημα: «Δεν πειράζει» μπορεί να ακούγεται σαν να μην σας ενδιαφέρει. Εστιάστε στη διαδικασία: «Παρατήρησα ότι σκέφτηκες πολύ καλά αυτή τη στρατηγική!»",
        },
        {
          title: "Τα παιχνίδια ως εργαλείο",
          content: "Τα επιτραπέζια και ψηφιακά παιχνίδια είναι ασφαλές περιβάλλον για να εξασκηθεί κανείς στην ήττα. Τα XP, badges και levels βοηθούν τα παιδιά να δουν ότι η πρόοδος έρχεται σταδιακά, ακόμα κι αν δεν κερδίζεις κάθε φορά.",
        },
      ],
      en: [
        {
          title: "Why losing matters",
          content: "Defeat teaches resilience, self-awareness, and the strength to try again. Children who learn early that failure is part of learning develop what psychologist Carol Dweck calls a 'growth mindset' — the belief that abilities grow with effort.",
        },
        {
          title: "Don't always let your child win",
          content: "If you always let your child win, you send the message that they need to always win to feel good. This creates fragility. Instead, play fairly and show how you handle defeat yourself.",
        },
        {
          title: "How to help after a loss",
          content: "Acknowledge feelings: 'I understand you're upset.' Don't minimize: 'It doesn't matter' can sound like you don't care. Focus on process: 'I noticed you thought really well about that strategy!'",
        },
        {
          title: "Games as a tool",
          content: "Board games and digital games are a safe environment to practice losing. XP, badges, and levels help children see that progress comes gradually, even when you don't win every time.",
        },
      ],
    },
    tip: {
      el: "Η επόμενη φορά που θα παίξετε ένα παιχνίδι, πείτε στο παιδί: «Ας δούμε τι μπορούμε να μάθουμε, ανεξάρτητα από το ποιος θα κερδίσει!»",
      en: "Next time you play a game, tell your child: 'Let's see what we can learn, regardless of who wins!'",
    },
  },
  {
    slug: "school-readiness-checklist",
    gradient: "from-rose-400 to-pink-500",
    icon: "📋",
    tag: { el: "Γονείς", en: "Parents" },
    tagColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    readTime: { el: "4 λεπτά", en: "4 min read" },
    title: {
      el: "Τι πρέπει να ξέρει ένα παιδί πριν το σχολείο: Checklist",
      en: "What your child needs to know before school: Checklist",
    },
    intro: {
      el: "Η μετάβαση στο σχολείο είναι μεγάλο βήμα. Αυτό το checklist θα σας βοηθήσει να εντοπίσετε τι γνωρίζει ήδη το παιδί σας και πού μπορεί να χρειαστεί λίγη ακόμα εξάσκηση.",
      en: "The transition to school is a big step. This checklist will help you identify what your child already knows and where they might need a bit more practice.",
    },
    sections: {
      el: [
        {
          title: "✅ Γλώσσα & επικοινωνία",
          content: "• Λέει το ονοματεπώνυμό του\n• Αφηγείται μια απλή ιστορία με σειρά\n• Ακολουθεί οδηγίες 2-3 βημάτων\n• Χρησιμοποιεί πλήρεις προτάσεις\n• Αναγνωρίζει τουλάχιστον μερικά γράμματα",
        },
        {
          title: "✅ Μαθηματικά & λογική",
          content: "• Μετράει μέχρι το 10 (ιδανικά μέχρι το 20)\n• Αναγνωρίζει βασικά σχήματα (κύκλος, τετράγωνο, τρίγωνο)\n• Ταξινομεί αντικείμενα κατά χρώμα, μέγεθος ή σχήμα\n• Κατανοεί τις έννοιες «περισσότερο/λιγότερο»\n• Αναγνωρίζει απλά μοτίβα (κόκκινο-μπλε-κόκκινο-μπλε...)",
        },
        {
          title: "✅ Κινητικές δεξιότητες",
          content: "• Κρατάει σωστά ένα μολύβι\n• Κόβει με ψαλίδι σε ευθεία γραμμή\n• Ζωγραφίζει έναν αναγνωρίσιμο άνθρωπο\n• Κουμπώνει τα ρούχα του\n• Χρησιμοποιεί κόλλα χωρίς βοήθεια",
        },
        {
          title: "✅ Κοινωνικές δεξιότητες",
          content: "• Μοιράζεται και περιμένει τη σειρά του\n• Αλληλεπιδρά με άλλα παιδιά\n• Ακολουθεί απλούς κανόνες\n• Εκφράζει τα συναισθήματά του με λέξεις\n• Μπορεί να αποχωριστεί τον γονιό για λίγο",
        },
      ],
      en: [
        {
          title: "✅ Language & communication",
          content: "• Says their full name\n• Tells a simple story in order\n• Follows 2-3 step instructions\n• Uses complete sentences\n• Recognizes at least some letters",
        },
        {
          title: "✅ Math & logic",
          content: "• Counts to 10 (ideally to 20)\n• Recognizes basic shapes (circle, square, triangle)\n• Sorts objects by color, size, or shape\n• Understands 'more/less' concepts\n• Recognizes simple patterns (red-blue-red-blue...)",
        },
        {
          title: "✅ Motor skills",
          content: "• Holds a pencil correctly\n• Cuts with scissors in a straight line\n• Draws a recognizable person\n• Buttons their clothes\n• Uses glue without help",
        },
        {
          title: "✅ Social skills",
          content: "• Shares and waits for their turn\n• Interacts with other children\n• Follows simple rules\n• Expresses feelings with words\n• Can be separated from parent briefly",
        },
      ],
    },
    tip: {
      el: "Μην ανησυχείτε αν το παιδί σας δεν γνωρίζει τα πάντα. Κάθε παιδί αναπτύσσεται διαφορετικά. Χρησιμοποιήστε αυτό το checklist ως οδηγό, όχι ως κριτήριο.",
      en: "Don't worry if your child doesn't know everything. Every child develops differently. Use this checklist as a guide, not a criterion.",
    },
  },
  {
    slug: "fun-educational-holidays",
    gradient: "from-cyan-400 to-blue-500",
    icon: "⏰",
    tag: { el: "Συμβουλές", en: "Tips" },
    tagColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    readTime: { el: "3 λεπτά", en: "3 min read" },
    title: {
      el: "Πώς να κάνετε τις διακοπές διασκεδαστικές ΚΑΙ εκπαιδευτικές",
      en: "How to make holidays fun AND educational",
    },
    intro: {
      el: "Οι διακοπές δεν σημαίνουν αυτόματα σταμάτημα στη μάθηση. Με τις σωστές δραστηριότητες, τα παιδιά μπορούν να μαθαίνουν χωρίς να το καταλαβαίνουν!",
      en: "Holidays don't automatically mean stopping learning. With the right activities, kids can learn without even realizing it!",
    },
    sections: {
      el: [
        {
          title: "1. Μαγειρέψτε μαζί",
          content: "Η μαγειρική κρύβει μαθηματικά (μέτρηση, ζύγισμα, κλάσματα), ανάγνωση (συνταγές), και φυσικές επιστήμες (τι γίνεται όταν ζεσταίνεται η ζάχαρη;). Αφήστε τα παιδιά να μετρούν τα υλικά!",
        },
        {
          title: "2. Φτιάξτε ένα ημερολόγιο διακοπών",
          content: "Δώστε ένα τετράδιο στο παιδί να γράφει ή ζωγραφίζει κάτι από κάθε μέρα. Στο τέλος των διακοπών θα έχει ένα δικό του βιβλίο! Εξασκεί γραφή, αφήγηση και μνήμη.",
        },
        {
          title: "3. Κυνήγι θησαυρού στη φύση",
          content: "Φτιάξτε μια λίστα: «Βρες ένα κόκκινο λουλούδι, ένα λείο βότσαλο, ένα σαλιγκάρι...» Τα παιδιά μαθαίνουν παρατηρητικότητα, κατηγοριοποίηση και λεξιλόγιο φύσης.",
        },
        {
          title: "4. Επιτραπέζια παιχνίδια",
          content: "Τα επιτραπέζια αναπτύσσουν στρατηγική σκέψη, υπομονή και κοινωνικές δεξιότητες. Bonus: ολόκληρη η οικογένεια παίζει μαζί. Δοκιμάστε κλασικά όπως Μονόπολη, Scrabble ή νεότερα strategy games.",
        },
        {
          title: "5. Επισκεφτείτε ένα μουσείο",
          content: "Τα μουσεία δεν είναι βαρετά — ειδικά τα μουσεία φυσικής ιστορίας, τεχνολογίας και τα παιδικά μουσεία. Ζητήστε από το παιδί να κρατήσει σημειώσεις ή να ζωγραφίσει κάτι που του άρεσε.",
        },
        {
          title: "6. 15 λεπτά εκπαιδευτικά παιχνίδια/μέρα",
          content: "Κρατήστε τη ρουτίνα μάθησης ζωντανή με μόνο 15 λεπτά εκπαιδευτικών παιχνιδιών τη μέρα. Αρκεί να αποφύγετε τη «θερινή ολίσθηση» και να ξεκινήσει η σχολική χρονιά πιο εύκολα.",
        },
        {
          title: "7. Αστρονομία βραδινή",
          content: "Οι καλοκαιρινές νύχτες είναι ιδανικές για παρατήρηση αστεριών. Κατεβάστε μια εφαρμογή αστρονομίας και αναγνωρίστε αστερισμούς. Τα παιδιά μαθαίνουν επιστήμη χωρίς βιβλία!",
        },
        {
          title: "8. DIY πειράματα",
          content: "Ηφαίστειο με ξύδι & μαγειρική σόδα, αόρατο μελάνι με λεμόνι, κρύσταλλοι από αλάτι. Απλά πειράματα που μαθαίνουν χημεία και φυσική μέσα από μαγεία!",
        },
      ],
      en: [
        {
          title: "1. Cook together",
          content: "Cooking hides math (measuring, weighing, fractions), reading (recipes), and science (what happens when sugar heats up?). Let the kids measure the ingredients!",
        },
        {
          title: "2. Create a holiday journal",
          content: "Give your child a notebook to write or draw something from each day. By the end of the holiday, they'll have their own book! Practices writing, storytelling, and memory.",
        },
        {
          title: "3. Nature treasure hunt",
          content: "Make a list: 'Find a red flower, a smooth pebble, a snail...' Kids learn observation, categorization, and nature vocabulary.",
        },
        {
          title: "4. Board games",
          content: "Board games develop strategic thinking, patience, and social skills. Bonus: the whole family plays together. Try classics like Monopoly, Scrabble, or newer strategy games.",
        },
        {
          title: "5. Visit a museum",
          content: "Museums aren't boring — especially natural history, technology, and children's museums. Ask your child to take notes or draw something they liked.",
        },
        {
          title: "6. 15 minutes of educational games/day",
          content: "Keep the learning routine alive with just 15 minutes of educational games per day. Enough to avoid 'summer slide' and start the school year more easily.",
        },
        {
          title: "7. Stargazing night",
          content: "Summer nights are perfect for stargazing. Download an astronomy app and identify constellations. Kids learn science without textbooks!",
        },
        {
          title: "8. DIY experiments",
          content: "Volcano with vinegar & baking soda, invisible ink with lemon, salt crystals. Simple experiments that teach chemistry and physics through magic!",
        },
      ],
    },
    tip: {
      el: "Το κλειδί είναι η ισορροπία: μάθηση + ξεκούραση + διασκέδαση. Μην πιέζετε — αφήστε τη μάθηση να έρθει φυσικά.",
      en: "The key is balance: learning + rest + fun. Don't push — let learning come naturally.",
    },
  },
  {
    slug: "screen-time-balance",
    gradient: "from-rose-400 to-orange-500",
    icon: "📱",
    tag: { el: "Γονείς", en: "Parents" },
    tagColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    readTime: { el: "4 λεπτά", en: "4 min read" },
    title: {
      el: "Πώς να βρείτε υγιή ισορροπία στον χρόνο μπροστά στην οθόνη",
      en: "How to find a healthy screen-time balance for kids",
    },
    intro: {
      el: "Δεν είναι όλος ο χρόνος μπροστά στην οθόνη ίδιος. Παθητική κατανάλωση (videos) διαφέρει από ενεργό μάθηση (παιχνίδια). Ορίστε όρια χωρίς ενοχές.",
      en: "Not all screen time is equal. Passive consumption (videos) differs from active learning (games). Set boundaries without guilt.",
    },
    sections: {
      el: [
        { title: "1. Ποιοτικός vs ποσοτικός χρόνος", content: "20 λεπτά εκπαιδευτικού παιχνιδιού αξίζουν περισσότερο από 1 ώρα παθητικών videos. Επιλέξτε apps που απαιτούν σκέψη, αλληλεπίδραση και δημιουργικότητα." },
        { title: "2. Συστάσεις WHO ανά ηλικία", content: "0-2 ετών: σχεδόν μηδέν. 3-5 ετών: έως 1 ώρα ποιοτικού περιεχομένου. 6+: μην υπερβαίνετε τις 2 ώρες ψυχαγωγικού screen time τη μέρα. Εκπαιδευτικό μετράει χωριστά." },
        { title: "3. Καθιερώστε «οθόνη-free» ζώνες", content: "Δωμάτιο ύπνου, τραπέζι φαγητού, 1 ώρα πριν τον ύπνο. Έτσι δημιουργείται φυσική ροή χωρίς αντιπαράθεση." },
        { title: "4. Παίξτε μαζί", content: "Όταν μπορείτε, παίξτε ένα εκπαιδευτικό παιχνίδι μαζί. Συζητήστε τι έμαθε. Μετατρέπει το screen time σε ποιοτικό χρόνο." },
        { title: "5. Χρησιμοποιήστε χρονόμετρο", content: "Αντί για «θα σταματήσεις σε 5 λεπτά» (που δεν τηρείται ποτέ), χρησιμοποιήστε visual timer. Όταν χτυπήσει, σταματάει." },
      ],
      en: [
        { title: "1. Quality vs quantity", content: "20 minutes of an educational game is worth more than 1 hour of passive videos. Choose apps that require thinking, interaction, and creativity." },
        { title: "2. WHO recommendations by age", content: "0-2: almost zero. 3-5: up to 1 hour of quality content. 6+: don't exceed 2 hours of recreational screen time per day. Educational counts separately." },
        { title: "3. Establish 'screen-free' zones", content: "Bedroom, dining table, 1 hour before bed. This creates natural flow without confrontation." },
        { title: "4. Play together", content: "When you can, play an educational game together. Discuss what they learned. Turns screen time into quality time." },
        { title: "5. Use a timer", content: "Instead of 'you'll stop in 5 minutes' (which never sticks), use a visual timer. When it rings, it stops." },
      ],
    },
    tip: {
      el: "Στο Kibloo όλο το περιεχόμενο είναι εκπαιδευτικό και ad-free, άρα κάθε λεπτό μετράει σε «ποιοτικό» screen time.",
      en: "On Kibloo, all content is educational and ad-free, so every minute counts as 'quality' screen time.",
    },
  },
  {
    slug: "learning-styles-explained",
    gradient: "from-purple-400 to-fuchsia-500",
    icon: "🧠",
    tag: { el: "Παιδαγωγικά", en: "Learning" },
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    readTime: { el: "5 λεπτά", en: "5 min read" },
    title: {
      el: "Στυλ μάθησης: Ποιο ταιριάζει στο παιδί σας;",
      en: "Learning styles: Which fits your child?",
    },
    intro: {
      el: "Κάθε παιδί μαθαίνει διαφορετικά. Κάποια χρειάζονται να βλέπουν, άλλα να ακούν, άλλα να αγγίζουν. Ανακαλύψτε το στυλ του παιδιού σας και προσαρμόστε τη μάθηση.",
      en: "Every child learns differently. Some need to see, others to hear, others to touch. Discover your child's style and adapt learning.",
    },
    sections: {
      el: [
        { title: "1. Οπτικός μαθητής (Visual)", content: "Μαθαίνει καλύτερα με εικόνες, διαγράμματα, χρώματα και βίντεο. Σημάδια: ζωγραφίζει συνεχώς, θυμάται πρόσωπα όχι ονόματα. Δοκιμάστε: εκπαιδευτικά videos, χάρτες, mind maps." },
        { title: "2. Ακουστικός μαθητής (Auditory)", content: "Μαθαίνει με ήχο και μουσική. Σημάδια: μιλάει στον εαυτό του, αγαπά τραγούδια & ιστορίες. Δοκιμάστε: audio books, εκπαιδευτικά τραγούδια, podcasts." },
        { title: "3. Κιναισθητικός μαθητής (Hands-on)", content: "Μαθαίνει κάνοντας. Σημάδια: δεν μπορεί να καθίσει ήσυχος, αγαπά αθλήματα και κατασκευές. Δοκιμάστε: επιστημονικά πειράματα, building blocks, role-play." },
        { title: "4. Αναγνωστικός/συγγραφικός", content: "Μαθαίνει διαβάζοντας και γράφοντας. Σημάδια: αγαπά βιβλία, κρατάει σημειώσεις. Δοκιμάστε: εκπαιδευτικά βιβλία, journaling, λίστες." },
        { title: "5. Πολλαπλά στυλ είναι ο κανόνας", content: "Τα περισσότερα παιδιά έχουν συνδυασμό 2-3 στυλ. Εστιάστε στο ισχυρότερο για δύσκολες έννοιες, αλλά εκθέστε τα και σε άλλα στυλ για πληρότητα." },
      ],
      en: [
        { title: "1. Visual learner", content: "Learns best with images, diagrams, colors and video. Signs: draws constantly, remembers faces not names. Try: educational videos, maps, mind maps." },
        { title: "2. Auditory learner", content: "Learns through sound and music. Signs: talks to themselves, loves songs & stories. Try: audio books, educational songs, podcasts." },
        { title: "3. Kinesthetic learner", content: "Learns by doing. Signs: can't sit still, loves sports and crafts. Try: science experiments, building blocks, role-play." },
        { title: "4. Reading/writing", content: "Learns by reading and writing. Signs: loves books, takes notes. Try: educational books, journaling, lists." },
        { title: "5. Multiple styles are the norm", content: "Most kids have a combination of 2-3 styles. Focus on the strongest for hard concepts, but expose them to others for completeness." },
      ],
    },
    tip: {
      el: "Το Kibloo προσφέρει και τα 4 στυλ: visual παιχνίδια, voice quiz, hands-on δραστηριότητες, και reading exercises.",
      en: "Kibloo offers all 4 styles: visual games, voice quiz, hands-on activities, and reading exercises.",
    },
  },
  {
    slug: "teacher-classroom-tips",
    gradient: "from-emerald-400 to-teal-500",
    icon: "👩‍🏫",
    tag: { el: "Δάσκαλοι", en: "Teachers" },
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    readTime: { el: "4 λεπτά", en: "4 min read" },
    title: {
      el: "5 τρόποι να εντάξετε εκπαιδευτικά παιχνίδια στην τάξη",
      en: "5 ways to integrate educational games into your classroom",
    },
    intro: {
      el: "Η μάθηση μέσα από παιχνίδι αυξάνει την κατανόηση μέχρι και 40%. Δείτε πώς μπορείτε να το κάνετε στην πράξη — χωρίς να χάνετε τον έλεγχο της τάξης.",
      en: "Game-based learning increases retention by up to 40%. Here's how to make it happen — without losing classroom control.",
    },
    sections: {
      el: [
        { title: "1. Warm-up 5 λεπτών", content: "Ξεκινήστε το μάθημα με ένα γρήγορο quiz/παιχνίδι που σχετίζεται με την προηγούμενη ύλη. Ενεργοποιεί τα παιδιά και ελέγχει την κατανόηση." },
        { title: "2. Διαχωρισμός σε ομάδες", content: "Χρησιμοποιήστε εκπαιδευτικά παιχνίδια ως ομαδικό challenge. Ενισχύει τη συνεργασία και τη φιλική ανταγωνιστικότητα." },
        { title: "3. Διαφοροποιημένη μάθηση", content: "Δώστε στους πιο γρήγορους μαθητές πιο δύσκολα παιχνίδια όσο εσείς υποστηρίζετε αυτούς που χρειάζονται περισσότερη βοήθεια." },
        { title: "4. Ανάθεση εργασίας ως παιχνίδι", content: "Αντί για παραδοσιακή εργασία, αναθέστε ένα παιχνίδι με συγκεκριμένο στόχο σκορ ή χρόνο. Τα παιδιά τη βλέπουν διαφορετικά." },
        { title: "5. Παρακολούθηση μέσω dashboard", content: "Στο Kibloo Teacher Dashboard βλέπετε ποια θέματα δυσκολεύουν τους μαθητές σας και προσαρμόζετε ανάλογα την ύλη." },
      ],
      en: [
        { title: "1. 5-minute warm-up", content: "Start your lesson with a quick quiz/game tied to last week's material. Energizes students and checks retention." },
        { title: "2. Group splits", content: "Use educational games as team challenges. Boosts cooperation and friendly competition." },
        { title: "3. Differentiated learning", content: "Give faster students harder games while you support those who need more help." },
        { title: "4. Homework as game", content: "Instead of traditional homework, assign a game with a target score or time. Kids see it differently." },
        { title: "5. Track via dashboard", content: "In the Kibloo Teacher Dashboard you see which topics are tough for your students and adjust the curriculum accordingly." },
      ],
    },
    tip: {
      el: "Δωρεάν για όλους τους δασκάλους: σχέδιο μαθήματος, αναθέσεις, στατιστικά. Ξεκινήστε από /for-teachers.",
      en: "Free for all teachers: lesson plans, assignments, stats. Start at /for-teachers.",
    },
  },
  {
    slug: "why-multiplayer-helps",
    gradient: "from-amber-400 to-yellow-500",
    icon: "🤝",
    tag: { el: "Έρευνα", en: "Research" },
    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    readTime: { el: "4 λεπτά", en: "4 min read" },
    title: {
      el: "Γιατί τα multiplayer παιχνίδια βοηθούν στη μάθηση",
      en: "Why multiplayer games boost learning",
    },
    intro: {
      el: "Η συνεργατική μάθηση αυξάνει τα αποτελέσματα κατά 25-40% σύμφωνα με μελέτες (Vygotsky, Slavin). Τα multiplayer εκπαιδευτικά παιχνίδια ενσωματώνουν αυτή την αρχή στο ψηφιακό περιβάλλον.",
      en: "Cooperative learning boosts outcomes by 25-40% according to research (Vygotsky, Slavin). Multiplayer educational games bring this principle into the digital realm.",
    },
    sections: {
      el: [
        { title: "1. Συνεργατική επίλυση προβλημάτων", content: "Όταν δύο παιδιά λύνουν μαζί, εκθέτουν διαφορετικές προσεγγίσεις και «διδάσκουν» το ένα στο άλλο. Αυτή είναι η βάση της θεωρίας του Vygotsky («zone of proximal development»)." },
        { title: "2. Φιλική ανταγωνιστικότητα", content: "Λίγος ανταγωνισμός αυξάνει την προσοχή και προσπάθεια. Με σωστό σχεδιασμό (χωρίς bullying), τα παιδιά πιέζονται προς τα πάνω." },
        { title: "3. Κοινωνικές δεξιότητες", content: "Multiplayer = επικοινωνία, διαπραγμάτευση, ομαδικότητα. Δεξιότητες που δεν μαθαίνονται από βιβλία αλλά από αλληλεπίδραση." },
        { title: "4. Κίνητρο διατήρησης", content: "Όταν παίζω με φίλο, δεν θέλω να σταματήσω. Παρατείνεται η ενεργός μάθηση χωρίς πίεση από τον γονέα." },
        { title: "5. Ασφαλής φιλία online", content: "Σε εκπαιδευτικό περιβάλλον (όπως το Kibloo Co-Play) τα παιδιά μαθαίνουν να επικοινωνούν online με ασφάλεια — βασική δεξιότητα για το μέλλον." },
      ],
      en: [
        { title: "1. Cooperative problem-solving", content: "When two kids solve together, they expose different approaches and 'teach' each other. This is the basis of Vygotsky's 'zone of proximal development'." },
        { title: "2. Friendly competition", content: "A little competition increases attention and effort. With proper design (no bullying), kids push themselves up." },
        { title: "3. Social skills", content: "Multiplayer = communication, negotiation, teamwork. Skills not learned from books but from interaction." },
        { title: "4. Sustained motivation", content: "When I play with a friend, I don't want to stop. Active learning is sustained without parental nagging." },
        { title: "5. Safe online friendship", content: "In an educational environment (like Kibloo Co-Play) kids learn to communicate online safely — a key future skill." },
      ],
    },
    tip: {
      el: "Δοκίμασε το Co-Play του Kibloo: παίζετε μαζί ένα παιχνίδι από διαφορετικές συσκευές, με voice/chat κουμπιά, σε ασφαλές περιβάλλον.",
      en: "Try Kibloo Co-Play: play a game together from different devices, with voice/chat buttons, in a safe environment.",
    },
  },
];

// Export so blog data can power RSS, sitemap, and other surfaces.
export { ARTICLES };

function ArticleView({ slug }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const navigate = useNavigate();
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="pt-24 text-center px-4">
          <p className="text-xl text-slate-500 dark:text-slate-400">
            {isEl ? "Το άρθρο δεν βρέθηκε." : "Article not found."}
          </p>
          <Link to="/blog" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            {isEl ? "← Πίσω στο Blog" : "← Back to Blog"}
          </Link>
        </div>
      </div>
    );
  }

  const l = isEl ? "el" : "en";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={article.title[l]}
        description={article.intro[l]}
        article={{ datePublished: "2026-04-27", readTime: article.readTime[l] }}
      />
      <Navbar />
      <div className="pt-20 pb-16">
        <article className="mx-auto max-w-3xl px-4">
          <button
            onClick={() => navigate("/blog")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isEl ? "Πίσω στο Blog" : "Back to Blog"}
          </button>

          <div className={`h-2 rounded-full bg-gradient-to-r ${article.gradient} mb-8`} />

          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${article.tagColor}`}>
              {article.tag[l]}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {article.readTime[l]}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-6 leading-tight">
            <span className="mr-3">{article.icon}</span>
            {article.title[l]}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 border-l-4 border-indigo-400 pl-4 italic">
            {article.intro[l]}
          </p>

          <div className="space-y-8">
            {article.sections[l].map((s, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                  {s.title}
                </h2>
                <div className="text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {s.content}
                </div>
              </section>
            ))}
          </div>

          <div className={`mt-12 rounded-2xl bg-gradient-to-r ${article.gradient} p-[2px]`}>
            <div className="bg-white dark:bg-slate-800 rounded-[14px] p-6">
              <p className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span>
                {isEl ? "Πρακτική συμβουλή" : "Practical tip"}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {article.tip[l]}
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {isEl ? "Όλα τα άρθρα" : "All articles"}
            </Link>
          </div>
        </article>
      </div>
      <FooterSection />
    </div>
  );
}

function BlogListView() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const l = isEl ? "el" : "en";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO
        title={isEl ? "Εκπαιδευτικό Blog" : "Educational Blog"}
        description={isEl ? "Χρήσιμα άρθρα και συμβουλές για γονείς και εκπαιδευτικούς" : "Useful articles and tips for parents and educators"}
      />
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
              {isEl ? "Εκπαιδευτικό Blog" : "Educational Blog"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
              {isEl ? "Χρήσιμα άρθρα & συμβουλές" : "Useful articles & tips"}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {isEl
                ? "Ιδέες, τεχνικές και πρακτικές συμβουλές για γονείς και εκπαιδευτικούς."
                : "Ideas, techniques, and practical tips for parents and educators."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ARTICLES.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${a.gradient}`} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${a.tagColor}`}>
                      {a.tag[l]}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                      {a.readTime[l]}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      {a.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base mb-1.5 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {a.title[l]}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {a.intro[l].slice(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                    {isEl ? "Διάβασε περισσότερα" : "Read more"}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}

export default function BlogPage() {
  const { slug } = useParams();
  return slug ? <ArticleView slug={slug} /> : <BlogListView />;
}
