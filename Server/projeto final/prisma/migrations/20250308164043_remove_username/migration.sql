/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBlocked` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publicationYear" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "supplierId" TEXT,
    CONSTRAINT "book_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_book" ("author", "genre", "id", "isbn", "price", "publicationYear", "title") SELECT "author", "genre", "id", "isbn", "price", "publicationYear", "title" FROM "book";
DROP TABLE "book";
ALTER TABLE "new_book" RENAME TO "book";
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilephoto" TEXT,
    "isBlocked" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL
);
INSERT INTO "new_user" ("email", "firstname", "id", "lastname", "password", "profilephoto") SELECT "email", "firstname", "id", "lastname", "password", "profilephoto" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
