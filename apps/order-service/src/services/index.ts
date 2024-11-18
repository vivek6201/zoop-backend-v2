import { pubSubClient, types } from "@repo/service-config/src";
import subscriptionHandler from "./subscription.handler";

const handler = subscriptionHandler();

export const eventHandler = async () => {
  //handles cod order
  await pubSubClient.subscribe(types.RedisMessage.COD_ORDER, handler.codOrder);

  //handles prepaid orders
  await pubSubClient.subscribe(
    types.RedisMessage.PREPAID_ORDER,
    handler.prepaidOrder
  );

  await pubSubClient.subscribe(
    types.RedisMessage.PAYMENT_RESULT,
    handler.paymentResult
  );
};
