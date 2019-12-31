import { StravaActivityEvent } from "../types/StravaTypes";
import { User } from "../mongo/models";
import axios from 'axios';
import env from "../constants/env";

class ActivityService {
  async create(event: StravaActivityEvent) {
    console.log('activity create');

    const { owner_id, object_id } = event;

    console.log('finding user', owner_id);

    const user = await User.findOne({ strava_id: owner_id }).populate('strava.session').exec();

    console.log('here user', user);

    if (!user) {
      console.log('//todo: create user');
      return;
    }

    if (!user.strava.session) {
      console.log('//todo: no session user');
      return;
    }

    console.log('getting more data', object_id);

    const { data } = await axios.get(`${env.strava_url}/api/v3/activities/${object_id}`, {
      headers: {
        'Authorization': `Bearer ${user.strava.session.access_token}`
      }
    });

    console.log(data);
  }

  async update(event: StravaActivityEvent) {

  }

  async process(event: StravaActivityEvent) {
    switch (event.aspect_type) {
      case "create":
        await this.create(event);
        break;
      case "update":
        await this.update(event);
        break;
    }
  }
}

export default ActivityService;
