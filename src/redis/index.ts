import redis, { RedisClient } from "redis";

export const connect = (url: string, callback: () => void) => {
  let client: RedisClient;

  try {
    client = redis.createClient(url);

    client.on('connect', () => {
      console.log('connected to redis');
      callback();
    });

    client.on('error', (error) => {
      console.log('redis on error', error);
    });
  } catch (e) {
    console.error('redis error', e);

    throw e;
  }

  return client;
};
