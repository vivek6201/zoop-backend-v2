import { pubSubClient, types } from "@repo/service-config/src";
import vendorActions from "./vendor.action";
import userActions from "./user.actions";
import deliveryActions from "./delivery.actions";
import adminActions from "./admin.action";

// this event handler will handler internal backend communications that are based on events
const eventHandler = async () => {
  await pubSubClient.subscribe(types.RedisMessage.VENDOR_MSG, vendorActions);

  await pubSubClient.subscribe(types.RedisMessage.USER_MSG, userActions);

  await pubSubClient.subscribe(
    types.RedisMessage.DELIVERY_MSG,
    deliveryActions
  );

  await pubSubClient.subscribe(types.RedisMessage.ADMIN_MSG, adminActions);
};

export default eventHandler;
