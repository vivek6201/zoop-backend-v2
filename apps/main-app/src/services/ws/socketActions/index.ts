import { WebSocket } from "ws";
import vendorActions from "./vendor.actions";
import userActions from "./user.actions";
import deliveryActions from "./delivery.actions";
import adminActions from "./admin.action";
import { types } from "@repo/service-config/src";

// this handler will perform actions based on ws events recieved from the user, and forward the data to respected handlers.

const performActions = async (
  message: {
    type: string;
    data: {
      type: string;
      data: Record<string, any>
    };
  },
  ws: WebSocket
) => {
  switch (message.type) {
    case types.SocketMessage.VENDOR_MSG:
      vendorActions(message.data);
      break;
    case types.SocketMessage.USER_MSG:
      userActions(message.data);
      break;
    case types.SocketMessage.DELIVERY_MSG:
      deliveryActions(message.data);
      break;
    case types.SocketMessage.ADMIN_MSG:
      adminActions(message.data);
      break;
  }
};

export default performActions;
