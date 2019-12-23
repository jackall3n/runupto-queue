import redis, { RedisClient } from "redis";

export const connect = (url: string, callback: () => void) => {
  let client: RedisClient;

  try {

    console.log('createClient')
    client = redis.createClient(url);

    console.log('connect');
    client.on('connect', () => {
      console.log('connected to redis');
      callback();
    });

    console.log('error');
    client.on('error', (error) => {
      console.log('redis on error', error);
    });
  } catch (e) {
    console.error('redis error', e);

    throw e;
  }

  return client;
};
