import { socketService } from "../..";

const vendorActions = (message: string) => {
  const response: {
    type: string;
    data: Record<string, any>;
  } = JSON.parse(message);

  console.log({ response });

  socketService.sendMessage(response.data.data.vendorUserId, response);
};

export default vendorActions;
