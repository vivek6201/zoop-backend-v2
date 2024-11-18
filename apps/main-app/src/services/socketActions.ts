import { WebSocket } from "ws";

const performActions = async (
  message: {
    type: string;
    data: any;
  },
  ws: WebSocket
) => {
  // switch (message.type) {
  //   case "":
  //     break;
  // }
};

export default performActions;
