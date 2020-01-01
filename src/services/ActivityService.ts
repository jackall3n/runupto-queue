import { StravaActivityEvent } from "../types/StravaTypes";
import { ActivityRepository, UserRepository } from "../repositories";
import StravaService from "./StravaAPIService";

class ActivityService {
  constructor(
    private stravaService = new StravaService(),
    private userRepository = new UserRepository(),
    private activityRepository = new ActivityRepository()
  ) {
  }

  private async getUser(id: number) {
    const user = await this.userRepository.getByStravaId(id);

    if (!user) {
      throw new Error(`No user found for ${id}`);
    }

    if (!user?.strava?.session) {
      throw new Error(`No session found for user ${id}`);
    }

    return user;
  }

  async create(event: StravaActivityEvent) {
    console.log('Activity: create');

    const { owner_id, object_id } = event;

    const user = await this.getUser(owner_id);

    const activity = await this.stravaService.getActivity(object_id, user);

    const a = await this.activityRepository.create(activity);

    user.activities.push(a);

    await user.save();
  }

  async update(event: StravaActivityEvent) {
    console.log('Activity: update');

    const { owner_id, object_id } = event;
    const user = await this.userRepository.getByStravaId(owner_id);

    if (!user) {
      throw new Error(`No user found for ${event.owner_id}`);
    }

    if (!user?.strava?.session) {
      throw new Error(`No session found for user ${event.owner_id}`);
    }

    const activity = await this.stravaService.getActivity(object_id, user);

    await this.activityRepository.update(activity);
  }

  async delete(event: StravaActivityEvent) {
    console.log('Activity: delete');

    const activity = await this.activityRepository.archive(event.object_id);

    if (!activity) {
      console.warn('no activity found for', event.object_id)
    }
  }

  async process(event: StravaActivityEvent) {
    try {
      switch (event.aspect_type) {
        case "create":
          await this.create(event);
          break;
        case "update":
          await this.update(event);
          break;
        case "delete":
          await this.delete(event);
          break;
      }
    } catch (e) {
      console.error(e)
    }
  }
}

export default ActivityService;
