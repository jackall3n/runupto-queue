import dotEnv from 'dotenv';

dotEnv.config();

const { PORT = '8000', REDIS_URL = 'redis://127.0.0.1:6969', STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = process.env;

const env = {
  port: Number(PORT),
  redis_url: REDIS_URL,
  strava_client_id: STRAVA_CLIENT_ID,
  strava_client_secret: STRAVA_CLIENT_SECRET
};

console.log('env', env);

export default env;
