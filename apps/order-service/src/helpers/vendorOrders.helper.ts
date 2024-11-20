import prisma, {
  OrderPaymentType,
  Prisma,
  UserOrders,
  VendorOrders,
  VendorOrderStatus,
} from "@repo/db/src";

const createOrderHelper: (orderData: any) => Promise<{
  success: boolean;
  message: string;
  data?: {
    vendorOrder: VendorOrders;
    userOrder: UserOrders;
  };
}> = async (orderData: any) => {
  const { payment_type, order_status, cart } = orderData;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const userOrder = await tx.userOrders.create({
        data: {
          userProfileId: cart.userProfileId,
          metadata: {
            ...cart.metadata,
            orderStatus: order_status,
          },
        },
      });

      const vendorOrder = await tx.vendorOrders.create({
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

      return { vendorOrder, userOrder };
    });
    return {
      success: true,
      message: "Order created successfully!",
      data: result,
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
