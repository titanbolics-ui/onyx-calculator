export interface BloodLevel {
  day: number;
  level: number;
}

export function calculateBloodLevels(
  doseMg: number,
  halfLifeDays: number,
  frequencyDays: number,
  totalDays: number,
): BloodLevel[] {
  const results: BloodLevel[] = [];
  let currentLevel = 0;

  for (let day = 0; day < totalDays; day++) {
    if (day % frequencyDays === 0) {
      currentLevel += doseMg;
    }

    results.push({ day, level: Math.round(currentLevel * 100) / 100 });

    currentLevel *= Math.pow(0.5, 1 / halfLifeDays);
  }

  return results;
}
