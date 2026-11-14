import { localDateKey } from './dates.js';

export function completeLearningPlanStep(setPlan, stepId)
{
  const today = localDateKey();
  setPlan((current) =>
  {
    const completed = current?.date === today ? current.completed || [] : [];
    return {
      date: today,
      completed: completed.includes(stepId) ? completed : [...completed, stepId]
    };
  });
}
