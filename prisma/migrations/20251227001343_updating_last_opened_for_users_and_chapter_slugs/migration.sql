/*
  Warnings:

  - You are about to drop the column `lastOpenedBook` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastOpenedChapter` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[book_id,slug]` on the table `chapters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `chapters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chapters" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastOpenedBook",
DROP COLUMN "lastOpenedChapter",
ADD COLUMN     "lastOpenedBibleId" TEXT,
ADD COLUMN     "lastOpenedBookId" TEXT,
ADD COLUMN     "lastOpenedChapterId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "chapters_book_id_slug_key" ON "chapters"("book_id", "slug");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lastOpenedBibleId_fkey" FOREIGN KEY ("lastOpenedBibleId") REFERENCES "bibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lastOpenedBookId_fkey" FOREIGN KEY ("lastOpenedBookId") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lastOpenedChapterId_fkey" FOREIGN KEY ("lastOpenedChapterId") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
