import { createClient, RedisClientType } from "redis";
import crypto from "crypto";
let client: RedisClientType;

export async function ConnectRedis() {
  client = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
    database: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  console.log("Redis connected");
}

export async function getCatch(key: string): Promise<string | null> {
  if (!client.isOpen) {
    await ConnectRedis();
  }
  const value = await client.get(key);
  console.log(`Cache hit for key: ${key}`);
  return value;
}
export async function setCatch(
  key: string,
  value: string,
  duration_min: number = 10
): Promise<void> {
  console.log(`Setting cache for key: ${key}`);
  await client.set(key, value, { EX: duration_min * 60 });
}

export async function deleteCatch(key: string): Promise<void> {
    if (!client?.isOpen) {
        console.warn('Redis client is not connected');
        return;
    }
    console.log(`Deleting cache for key: ${key}`);
    await client.del(key);
}

export { client };
