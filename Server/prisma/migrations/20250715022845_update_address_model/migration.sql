/*
  Warnings:

  - You are about to drop the `adress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "adress";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "addres" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "parish" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "addres_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
