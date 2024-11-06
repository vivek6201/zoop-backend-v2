import { redisClient } from "@repo/service-config/src/index";
import sendAuthEmail from "../services/email/auth";

const handleRedisActions = async () => {
  const client = await redisClient?.connect();

  // infinite loop which pop events from the queue
  while (1) {
    const result = await client?.brPop("utility", 0);

    // if data is null | undefined then skip the iteration
    if (!result) continue;

    const {
      action,
      data,
    }: {
      action: string;
      data: Record<string, any>;
    } = JSON.parse(result.element);

    switch (action) {
      case "auth-email": {
        await sendAuthEmail(data.reciever, data.emailType, data.data);
      }
    }
  }
};

export default handleRedisActions;
