import { Activity } from "../mongo/models";
import { StravaActivity } from "../types/StravaTypes";

class ActivityRepository {

  mapStravaActivity(activity: StravaActivity) {
    const {
      id,
      external_id,
      type,
      athlete,
      name,
      distance,
      moving_time,
      elapsed_time,
      start_date,
      start_date_local,
      ...metadata
    } = activity;

    return {
      id,
      type,
      external_id,
      athlete,
      name,
      distance,
      moving_time,
      elapsed_time,
      start_date,
      start_date_local,
      metadata,
    }
  }

  async create(activity: StravaActivity) {
    console.log('creating activity');

    const mapped = this.mapStravaActivity(activity);

    const dbActivity = new Activity({
      ...mapped,
      source: 'strava',
      deleted: false
    });

    return await dbActivity.save();
  }

  async update(activity: StravaActivity) {
    console.log('updating activity');

    const mapped = this.mapStravaActivity(activity);

    let dbActivity = await Activity.findOneAndUpdate({ "id": activity.id }, mapped);
    if (!dbActivity) {
      return await this.create(activity);
    }

    return await dbActivity.save();
  }

  async archive(id: number) {
    return Activity.findOneAndUpdate({ "id": id }, { deleted: true });
  }
}

export { ActivityRepository };
