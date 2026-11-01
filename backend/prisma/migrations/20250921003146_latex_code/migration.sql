/*
  Warnings:

  - Added the required column `latexCode` to the `resumes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."resumes" ADD COLUMN     "latexCode" TEXT NOT NULL;
