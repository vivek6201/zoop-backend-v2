/*
  Warnings:

  - The values [Cash] on the enum `OrderPaymentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Cooking] on the enum `VendorOrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderPaymentType_new" AS ENUM ('Prepaid', 'COD');
ALTER TABLE "VendorOrders" ALTER COLUMN "orderPaymentType" TYPE "OrderPaymentType_new" USING ("orderPaymentType"::text::"OrderPaymentType_new");
ALTER TYPE "OrderPaymentType" RENAME TO "OrderPaymentType_old";
ALTER TYPE "OrderPaymentType_new" RENAME TO "OrderPaymentType";
DROP TYPE "OrderPaymentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "VendorOrderStatus_new" AS ENUM ('Pending', 'Accepted', 'Processing', 'Finished', 'Cancelled', 'Returned');
ALTER TABLE "VendorOrders" ALTER COLUMN "orderStatus" TYPE "VendorOrderStatus_new" USING ("orderStatus"::text::"VendorOrderStatus_new");
ALTER TYPE "VendorOrderStatus" RENAME TO "VendorOrderStatus_old";
ALTER TYPE "VendorOrderStatus_new" RENAME TO "VendorOrderStatus";
DROP TYPE "VendorOrderStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "VendorOrders" DROP CONSTRAINT "VendorOrders_deliveryPartnerProfileId_fkey";

-- AlterTable
ALTER TABLE "VendorOrders" ALTER COLUMN "deliveryPartnerProfileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "VendorOrders" ADD CONSTRAINT "VendorOrders_deliveryPartnerProfileId_fkey" FOREIGN KEY ("deliveryPartnerProfileId") REFERENCES "DeliveryPartnerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
