import { createClient, RedisClientType } from "redis";

class Redis {
  private static _instance: Redis;
  private client: RedisClientType | null = null;

  private constructor() {
    this.client = createClient();
  }

  public static getInstance(uri?: string) {
    if (!this._instance) {
      this._instance = new Redis();
      return this._instance;
    }

    return this._instance;
  }

  get redisClient() {
    return this.client;
  }
}

export const redisClient = Redis.getInstance().redisClient;
