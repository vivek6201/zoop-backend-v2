import { RedisClient, redisClient } from "./redis"

class Cache {
  private static _instance: Cache;
  private client: RedisClient = null;

  private constructor() {
    this.connect();
  }

  //creates a singleton instance of the class
  public static getInstance() {
    if (!this._instance) {
      this._instance = new Cache();
    }

    return this._instance;
  }

  //a funtion to connect to redis client defined in the packages
  private async connect() {
    if (!redisClient) return;
    this.client = await redisClient.connect();
  }

  public async set(key: string, value: any, expiryTime: number) {
    //check if redis client is connected or not
    if (!this.client?.isOpen) {
      await this.connect();
    }

    // set data in the redis cache
    return this.client?.setEx(key, expiryTime, JSON.stringify(value)); // expires in 1 hour (3600 seconds)
  }

  public async get(key: string) {
    //checks if redis client is connected or not
    if (!this.client?.isOpen) {
      await this.connect();
    }

    // gets data from redis
    const data = await this.client?.get(key);

    //checks if data is null | undefined
    if (!data) return null;

    return JSON.parse(data);
  }
}

export const cache = Cache.getInstance();
