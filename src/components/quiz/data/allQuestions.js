// src/components/quiz/data/allQuestions.js
import { questionsLogicMath }     from './questionsLogicMath';
import { questionsNaturalWorld }  from './questionsNaturalWorld';
import { questionsAdventures }    from './questionsAdventures';
import { questionsBrainTeasers }  from './questionsBrainTeasers';
import { questionsEdutainment }   from './questionsEdutainment';

export const allQuestions = [
  ...questionsLogicMath,
  ...questionsNaturalWorld,
  ...questionsAdventures,
  ...questionsBrainTeasers,
  ...questionsEdutainment
];