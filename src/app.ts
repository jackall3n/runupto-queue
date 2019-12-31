import express from "express";
import { RedisClient } from "redis";
import ActivityService from "./services/ActivityService";

export interface App extends express.Application {
  locals: {
    redis: RedisClient
    startup: Date;
    services: {
      activity: ActivityService;
    }
  }
}

export const app: App = express();

export default app;
