import prisma, { OrderPaymentType, VendorOrderStatus } from "@repo/db/src";

const createOrderHelper = async (orderData: any) => {
  const { payment_type, order_status, cart } = orderData;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.userOrders.create({
        data: {
          userProfileId: cart.userProfileId,
          metadata: {
            ...orderData.metadata,
            orderStatus: order_status,
          },
        },
      });

      await tx.vendorOrders.create({
        data: {
          vendorProfileId: cart.metadata.vendorProfileId,
          orderStatus: VendorOrderStatus.Pending,
          orderPaymentType:
            payment_type === "COD"
              ? OrderPaymentType.COD
              : OrderPaymentType.Prepaid,
          orderDetail: {
            items: cart.metadata.items,
            total: cart.metadata.total,
          },
        },
      });
    });
    return {
      success: true,
      message: "Order created successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error while creating order",
    };
  }
};

export default createOrderHelper;
