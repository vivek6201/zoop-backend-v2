import { redisClient } from "@repo/service-config/src/index";

export const redisActions = async (key: string, data: Record<string, any>) => {
  try {
    if (!redisClient) {
      throw new Error("Redis client not found");
    }

    // Check if already connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Use the client directly since it's already connected
    await redisClient.lPush(key, JSON.stringify(data));
  } catch (error) {
    console.error("Redis action failed:", error);
    throw error; // Re-throw to handle in caller
  }
};

// Optional: Add cleanup function for graceful shutdown
export const closeRedisConnection = async () => {
  try {
    if (redisClient?.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    console.error("Redis disconnect failed:", error);
  }
};
