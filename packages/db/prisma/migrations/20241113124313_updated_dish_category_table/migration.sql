/*
  Warnings:

  - A unique constraint covering the columns `[categoryName]` on the table `DishCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DishCategory_categoryName_key" ON "DishCategory"("categoryName");
