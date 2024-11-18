import { pubSubClient, types } from "@repo/service-config/src";
import createOrderHelper from "../helpers/vendorOrders.helper";

const subscriptionHandler = () => {
  const codOrder = async (evMsg: string) => {
    /*
     * handle the cod order here;
     * notify vendor and get order status, accepted or rejected
     * till then make a db call to create entry in orders table with the status pending
     */
    const parsedMessage = JSON.parse(evMsg);
    const { success, message } = await createOrderHelper(parsedMessage);

    // TODO: here, notify vendor about the order and ask to accept or reject!

    // -----------write code here------------

    //sends the result of the order, and let user wait for the acceptance here
    await pubSubClient.publish(
      types.RedisMessage.CHECKOUT_RESULT,
      JSON.stringify({
        requestId: parsedMessage.requestId,
        success,
        message,
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
