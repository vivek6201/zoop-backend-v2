/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `UserCart` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `UserOrders` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `UserCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `UserOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCart" DROP COLUMN "expiresAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserOrders" DROP COLUMN "expiresAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
