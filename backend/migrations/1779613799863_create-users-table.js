export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "Users" (
      "id" SERIAL PRIMARY KEY,
      "username" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "password" VARCHAR(255) NOT NULL,
      "dateOfBirth" DATE NULL,
      "gender" VARCHAR(255) NULL,
      "weight" FLOAT NULL,
      "height" FLOAT NULL,
      "profilePictureUrl" VARCHAR(255) NULL,
      "profilePicturePublicId" VARCHAR(255) NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};