import prisma from "@repo/db/src";
import { Request, RequestHandler, Response } from "express";
import { STATUS_CODES } from "../../constants/statusCodes";
import { cache, getOrdersKey, OrderKey } from "@repo/service-config/src";

export const getUserOrdersControllers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { profileId } = req.params;
  try {
    let orders = await cache.get(`orders/user`);

    if (!orders) {
      orders = await prisma.userOrders.findMany({
        where: {
          userProfileId: profileId,
        },
      });
      await cache.set(`orders/user`, orders, 1500);
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
      message: "Error while fetching user orders!",
    });
  }
};

export const getOrderDetailsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { orderId } = req.params;

  try {
    let order = await cache.get(getOrdersKey(OrderKey.USER_ORDERS, orderId));

    if (!order) {
      order = await prisma.userOrders.findUnique({
        where: {
          id: orderId,
        },
      });
      await cache.set(getOrdersKey(OrderKey.USER_ORDERS, orderId), order, 1500);
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
      message: "Error while fetching user order data!",
    });
  }
};
