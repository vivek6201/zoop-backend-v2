import { createClient, RedisClientType } from "redis";

type MessageCallback = (message: string) => void;

class PubSub {
  private static _instance: PubSub;
  private pubClient?: RedisClientType;
  private subClient?: RedisClientType;

  private constructor() {}

  public static getInstance() {
    if (!this._instance) {
      this._instance = new PubSub();
    }

    return this._instance;
  }

  private async getPubClient(): Promise<RedisClientType> {
    if (!this.pubClient) {
      this.pubClient = createClient();
      this.pubClient.on("error", (err) =>
        console.error("Redis client error:", err)
      );
      await this.pubClient.connect();
    }

    return this.pubClient;
  }

  private async getSubClient(): Promise<RedisClientType> {
    if (!this.subClient) {
      this.subClient = (await this.getPubClient()).duplicate();
      this.subClient.on("error", (err) =>
        console.error("Redis Pub/Sub client error:", err)
      );
      await this.subClient.connect();
    }

    return this.subClient;
  }

  public async publish(channel: string, message: string) {
    try {
      const client = await this.getPubClient();
      await client.publish(channel, message);
    } catch (err) {
      console.error(`Error publishing to channel ${channel}:`, err);
    }
  }

  public async subscribe(channel: string, callback: MessageCallback) {
    try {
      const subClient = await this.getSubClient();
      await subClient.subscribe(channel, callback);
    } catch (err) {
      console.error(`Error subscribing to channel ${channel}:`, err);
    }
  }

  // Unsubscribe from a channel
  public async unsubscribe(channel: string) {
    try {
      if (this.subClient) {
        await this.subClient.unsubscribe(channel);
      }
    } catch (err) {
      console.error(`Error unsubscribing from channel ${channel}:`, err);
    }
  }

  // Graceful shutdown of Redis clients
  public async disconnect() {
    try {
      if (this.subClient) {
        await this.subClient.quit();
        this.subClient = undefined;
      }
      if (this.pubClient) {
        await this.pubClient.quit();
        this.pubClient = undefined;
      }
    } catch (err) {
      console.error('Error disconnecting Redis clients:', err);
    }
  }
}

export const pubSubClient = PubSub.getInstance();
