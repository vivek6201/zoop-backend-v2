import prisma from "@repo/db/src";
import { cache, getOrdersKey, OrderKey } from "@repo/service-config/src";
import { Request, RequestHandler, Response } from "express";
import { STATUS_CODES } from "../../constants/statusCodes";

export const getVendorOrderControllers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { profileId } = req.params;
  try {
    let orders = await cache.get(`orders/vendor`);

    if (!orders) {
      orders = await prisma.vendorOrders.findMany({
        where: {
          vendorProfileId: profileId,
        },
      });
      await cache.set(`orders/vendor`, orders, 1500);
    }

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "orders fetched successfully!",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching vendor orders!",
    });
  }
};

export const getOrderDetailsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { orderId } = req.params;

  try {
    let order = await cache.get(getOrdersKey(OrderKey.VENDOR_ORDERS, orderId));

    if (!order) {
      order = await prisma.vendorOrders.findUnique({
        where: {
          id: orderId,
        },
      });
      await cache.set(
        getOrdersKey(OrderKey.VENDOR_ORDERS, orderId),
        order,
        1500
      );
    }

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Order fetched successfully!",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching vendor order data!",
    });
  }
};
