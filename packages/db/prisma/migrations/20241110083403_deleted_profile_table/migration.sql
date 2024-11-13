/*
  Warnings:

  - You are about to drop the column `profileId` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `DeliveryPartnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `VendorProfile` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AdminProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `DeliveryPartnerProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `VendorProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AdminProfile" DROP CONSTRAINT "AdminProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryPartnerProfile" DROP CONSTRAINT "DeliveryPartnerProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_profileId_fkey";

-- DropIndex
DROP INDEX "AdminProfile_profileId_key";

-- DropIndex
DROP INDEX "DeliveryPartnerProfile_profileId_key";

-- DropIndex
DROP INDEX "UserProfile_profileId_key";

-- DropIndex
DROP INDEX "VendorProfile_profileId_key";

-- AlterTable
ALTER TABLE "AdminProfile" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "DeliveryPartnerProfile" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "VendorProfile" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "Profile";

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPartnerProfile_userId_key" ON "DeliveryPartnerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProfile_userId_key" ON "VendorProfile"("userId");

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPartnerProfile" ADD CONSTRAINT "DeliveryPartnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
