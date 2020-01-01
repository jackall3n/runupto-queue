import env from "./constants/env";
import middleware from './middleware';
import routes from './routes';
import applyMiddleware from "./utils/applyMiddleware";
import applyRoutes from "./utils/applyRoutes";
import app from "./app";
import { connect } from "./redis";
import connectMongo from "./mongo";
import ActivityService from "./services/ActivityService";
import { KnownStravaEvents } from "./types/StravaTypes";

process.on("uncaughtException", e => {
  console.error('uncaughtException', e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.error('unhandledRejection', e);
  process.exit(1);
});

applyMiddleware(app, middleware);
applyRoutes(app, routes);

app.listen(env.port, () => {
  console.log('started queue handler');

  app.locals.services = {
    activity: new ActivityService()
  };
  app.locals.startup = new Date();
  app.locals.redis = connect(env.redis_url, () => {
    connectMongo(env.mongo_url, env.mongo_username, env.mongo_password).then(() => {
      console.log('connected to mongo');
      processQueue();
    });
  });


});

function processQueue() {
  console.log('blocking on queue for 30');

  try {

    app.locals.redis.brpoplpush("strava:events:queued", "strava:events:processing", 30, (error, value) => {
      if (error) {
        console.error(error);
      }

      if (value) {
        console.log('found:', value);

        processEvent(value).then(() => {
          console.log('processed, remove?');
        });
      }

      processQueue();
    });
  } catch (e) {
    console.error('error', e);
  }
}

async function processEvent(eventString: string) {
  try {
    const activityService = app.locals.services.activity;

    const event: KnownStravaEvents = JSON.parse(eventString);
    console.log(event);

    switch (event.object_type) {
      case "activity":
        await activityService.process(event);
        break;
      case "athlete":
        console.log('unhandled athlete event');
        break;
    }
  } catch (e) {
    console.log('errored processing event', e);
  }
}
