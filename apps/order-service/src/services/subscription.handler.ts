import { pubSubClient, types } from "@repo/service-config/src";
import createOrderHelper from "../helpers/vendorOrders.helper";
import getProductDetails, {
  getVendorDetails,
} from "../helpers/productInfo.helper";

const subscriptionHandler = () => {
  const codOrder = async (evMsg: string) => {
    /*
     * handle the cod order here;
     * notify vendor and get order status, accepted or rejected
     * till then make a db call to create entry in orders table with the status pending
     */
    const parsedMessage = JSON.parse(evMsg);
    const { success, message, data } = await createOrderHelper(parsedMessage);

    //sends the result of the order, and let user wait for the acceptance here
    await pubSubClient.publish(
      types.RedisMessage.CHECKOUT_RESULT,
      JSON.stringify({
        requestId: parsedMessage.requestId,
        success,
        message,
      })
    );

    // TODO: here, notify vendor about the order and ask to accept or reject!

    //early return order creation failed
    if (!success || !data) return;

    const products = await Promise.all(
      parsedMessage.cart.metadata.items.map(
        async (item: {
          productId: string;
          quantity: number;
          price: number;
        }) => {
          const productDetails = await getProductDetails(item.productId);
          return {
            product: productDetails,
            quantity: item.quantity,
          };
        }
      )
    );

    const vendor = await getVendorDetails(data.vendorOrder.vendorProfileId);

    await pubSubClient.publish(
      types.RedisMessage.VENDOR_MSG,
      JSON.stringify({
        type: types.SocketMessage.VENDOR_MSG,
        data: {
          type: types.OrderMessage.ORDER_INITIATED,
          data: {
            products,
            vendorUserId: vendor.data ? vendor.data.id : null,
            vendorOrderId: data?.vendorOrder.id,
            userOrderId: data?.userOrder.id,
          },
        },
      })
    );
  };

  const prepaidOrder = async (evmsg: string) => {
    // handle the message here, this payment initiated channel will be suscribed by payment service
    pubSubClient.publish(
      types.PaymentMessage.PAYMENT_INITIATED,
      JSON.stringify({
        payment_status: types.PaymentMessage.PAYMENT_INITIATED,
      })
    );
  };

  const paymentResult = (evMsg: string) => {
    // handle the result about the payment here
    // if payment is successfull then notify vendor, create order,
    // else ask user to pay again and create order with failed payment status
    console.log(evMsg);
  };
  return { codOrder, prepaidOrder, paymentResult };
};

export default subscriptionHandler;
