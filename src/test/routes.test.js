import { describe, it, expect } from 'vitest';
import {
  age2_3ObjectiveRoutes,
  age4_5ObjectiveRoutes,
  age6ObjectiveRoutes,
  age7_8ObjectiveRoutes,
  age9_10ObjectiveRoutes,
  age11_12ObjectiveRoutes,
} from '../config/quizRoutes';

const allRouteObjects = {
  '2-3':  age2_3ObjectiveRoutes,
  '4-5':  age4_5ObjectiveRoutes,
  '6':    age6ObjectiveRoutes,
  '7-8':  age7_8ObjectiveRoutes,
  '9-10': age9_10ObjectiveRoutes,
  '11-12': age11_12ObjectiveRoutes,
};

describe('Quiz Routes', () => {
  for (const [age, routes] of Object.entries(allRouteObjects)) {
    describe(`Age ${age} routes`, () => {
      it('has school route', () => {
        expect(routes.school).toBeTruthy();
        expect(routes.school).toContain('/play/');
      });

      it('has fun route', () => {
        expect(routes.fun).toBeTruthy();
        expect(routes.fun).toContain('/play/');
      });

      it('has logic route', () => {
        expect(routes.logic).toBeTruthy();
        expect(routes.logic).toContain('/play/');
      });

      it('has at least 3 distinct routes', () => {
        const vals = Object.values(routes);
        expect(new Set(vals).size).toBeGreaterThanOrEqual(3);
      });
    });
  }

  it('core routes (school/fun/logic) are unique across all age groups', () => {
    const coreRoutes = Object.values(allRouteObjects).flatMap(r =>
      [r.school, r.fun, r.logic]
    );
    expect(new Set(coreRoutes).size).toBe(coreRoutes.length);
  });
});
