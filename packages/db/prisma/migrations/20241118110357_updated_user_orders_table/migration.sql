/*
  Warnings:

  - Made the column `metadata` on table `UserCart` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `metadata` to the `UserOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCart" ALTER COLUMN "metadata" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserOrders" ADD COLUMN     "metadata" JSONB NOT NULL;
