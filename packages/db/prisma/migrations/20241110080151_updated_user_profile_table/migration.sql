/*
  Warnings:

  - You are about to drop the column `userCartId` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userOrdersId` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userProfileId]` on the table `UserCart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userProfileId]` on the table `UserOrders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "userCartId",
DROP COLUMN "userOrdersId";

-- CreateIndex
CREATE UNIQUE INDEX "UserCart_userProfileId_key" ON "UserCart"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrders_userProfileId_key" ON "UserOrders"("userProfileId");
