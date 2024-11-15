/*
  Warnings:

  - You are about to drop the column `updateAt` on the `UserCart` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `UserOrders` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `UserCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCart" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserOrders" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
