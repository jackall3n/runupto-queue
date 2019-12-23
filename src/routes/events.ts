import express from 'express';
import { App } from "../app";

const events = express.Router();

const STRAVA_EVENTS_KEY = "strava:events";

events.get('/queue', (req, res) => {
  const { redis } = req.app.locals as App['locals'];

  try {
    redis.lrange(STRAVA_EVENTS_KEY, 0, -1, (e, events) => {
      res.send(events)
    });
  } catch (e) {
    res.send(e.message);
  }
});

events.post('/callback', (req, res) => {
  const { redis } = req.app.locals as App['locals'];

  redis.rpush(STRAVA_EVENTS_KEY, JSON.stringify(req.body), (error) => {
    res.status(error !== null ? 500 : 200).send();
  });
});

events.get('/callback', (req, res) => {
  const challenge = req.query['hub.challenge'];
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];

  console.log('events', { challenge, mode, token });

  res.json({
    'hub.challenge': challenge
  })
});

export default events;
