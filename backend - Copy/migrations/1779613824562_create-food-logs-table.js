export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "FoodLogs" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "foodName" VARCHAR(255) NOT NULL,
        "calories" FLOAT DEFAULT 0,
        "protein" FLOAT DEFAULT 0,
        "carbs" FLOAT DEFAULT 0,
        "fat" FLOAT DEFAULT 0,
        "healthWarning" TEXT NULL,
        "loggedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_foodlogs_user FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS "FoodLogs";`);
};