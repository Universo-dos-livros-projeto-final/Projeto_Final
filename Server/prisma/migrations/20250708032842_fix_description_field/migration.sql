/*
  Warnings:

  - You are about to drop the column `desciption` on the `book` table. All the data in the column will be lost.
  - Added the required column `description` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "bookphoto" TEXT,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publicationYear" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "supplierId" TEXT,
    "userId" TEXT,
    CONSTRAINT "book_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_book" ("author", "bookphoto", "genre", "id", "isbn", "price", "publicationYear", "supplierId", "title", "userId") SELECT "author", "bookphoto", "genre", "id", "isbn", "price", "publicationYear", "supplierId", "title", "userId" FROM "book";
DROP TABLE "book";
ALTER TABLE "new_book" RENAME TO "book";
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
