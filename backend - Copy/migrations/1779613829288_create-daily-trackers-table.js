export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "DailyTrackers" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
      "totalCalories" FLOAT DEFAULT 0,
      "totalProtein" FLOAT DEFAULT 0,
      "totalCarbs" FLOAT DEFAULT 0,
      "totalFat" FLOAT DEFAULT 0,
      "date" DATE DEFAULT CURRENT_DATE,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS "DailyTrackers" CASCADE;`);
};