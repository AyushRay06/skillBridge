/*
  Warnings:

  - Added the required column `jobDescription` to the `resumes` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `resumes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `skills` on table `resumes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projects` on table `resumes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `education` on table `resumes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."resumes" ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "portfolio" TEXT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "skills" SET NOT NULL,
ALTER COLUMN "projects" SET NOT NULL,
ALTER COLUMN "education" SET NOT NULL;
