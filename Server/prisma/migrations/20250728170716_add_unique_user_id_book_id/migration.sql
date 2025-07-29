/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `cart_item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cart_item_userId_bookId_key" ON "cart_item"("userId", "bookId");
