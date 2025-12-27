/*
  Warnings:

  - Added the required column `order` to the `note_verses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "note_verses" ADD COLUMN     "order" INTEGER NOT NULL;
