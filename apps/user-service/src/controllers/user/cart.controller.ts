import { Request, RequestHandler, Response } from "express";
import { tokenExtractor } from "@repo/service-config/src";
import prisma, { User, UserProfile } from "@repo/db/src";
import { cartService } from "../../services/cart.service";
import { STATUS_CODES } from "../../constants/statusCodes";
import { checkoutSchema, updateCartSchema, z } from "@repo/validations/src";
import { types } from "@repo/service-config/src";
import { pubSubClient } from "@repo/service-config/src";

const cartInstance = cartService();

export const getUserCartController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id: userId } = tokenExtractor(req.headers);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProfile: {
          select: { id: true },
        },
      },
    });

    if (!user || !user.userProfile) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Insufficiant user data",
      });
      return;
    }

    const cart = await cartInstance.getCart(user.userProfile.id);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Cart data fetched successfully!",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while getting cart details",
    });
  }
};

export const updateUserCartController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id: userId } = tokenExtractor(req.headers);
  const reqData = req.body;

  const { success, error, data } =
    await updateCartSchema.safeParseAsync(reqData);

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  let user: (User & { userProfile: UserProfile | null }) | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProfile: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while getting user data!",
    });
    return;
  }

  try {
    if (!user?.userProfile?.id) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "User profile ID is missing",
      });
      return;
    }

    const cart = await cartInstance.updateCart(
      user.userProfile.id,
      data.vendorProfileId,
      data.items
    );

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Cart updated successfully!",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Failed to update cart!",
    });
  }
};

export const checkoutUserController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof checkoutSchema> = req.body;
  const { id } = tokenExtractor(req.headers);

  const { success, error, data } = await checkoutSchema.safeParseAsync(reqBody);

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  let user: (User & { userProfile: UserProfile | null }) | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id },
      include: {
        userProfile: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while getting user data!",
    });
    return;
  }

  if (data.paymentType === "COD") {
    const requestId = Math.random().toString(36).substring(7);

    // Create timeout handler
    const timeoutId = setTimeout(() => {
      res.status(408).json({
        success: false,
        message: "Checkout timeout",
      });
      pubSubClient.unsubscribe(types.RedisMessage.CHECKOUT_RESULT);
    }, 10000);

    // Subscribe first to ensure we don't miss the response
    await pubSubClient.subscribe(
      types.RedisMessage.CHECKOUT_RESULT,
      (evMsg) => {
        const response = JSON.parse(evMsg);

        // Only process if response matches our request
        if (response.requestId === requestId) {
          clearTimeout(timeoutId);
          pubSubClient.unsubscribe(types.RedisMessage.CHECKOUT_RESULT);

          res
            .status(
              response.success
                ? STATUS_CODES.SUCCESS
                : STATUS_CODES.SERVER_ERROR
            )
            .json({
              success: response.success,
              message: response.message,
            });
        }
      }
    );

    //sends event to order service to create order.
    await pubSubClient.publish(
      types.RedisMessage.COD_ORDER,
      JSON.stringify({
        requestId,
        payment_type: data.paymentType,
        order_status: types.OrderMessage.ORDER_INITIATED,
        cart: await cartInstance.checkout(user?.userProfile?.id),
      })
    );
  } else {
    /**
     * TODO: implement payment service which will validate and initiate order creation
     * by sending an event message to order service
     */

    await pubSubClient.publish(
      types.RedisMessage.PREPAID_ORDER,
      JSON.stringify({
        payment_type: data.paymentType,
        order_status: types.OrderMessage.ORDER_INITIATED,
      })
    );
  }
};
