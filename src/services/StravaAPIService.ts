import axios from "axios";
import env from '../constants/env';
import { IStravaSessionSchema, IUserSchema } from "../mongo/models";
import { StravaActivity } from "../types/StravaTypes";
import queryString from 'querystring';

class StravaAPIService {
  async client(user: IUserSchema<IStravaSessionSchema>) {
    let { session } = user.strava;

    if (!session) {
      console.log('No session found for strava user');
    }

    const { expires_at } = session;

    if (expires_at < Math.round(new Date().getTime() / 1000)) {
      console.log('expired');
      session = await this.refreshSessionToken(session);
    }

    return axios.create({
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
  }

  async refreshSessionToken(session: IStravaSessionSchema) {
    if (!session) {
      throw new Error('No session found for strava user');
    }

    const { refresh_token } = session;

    const query = queryString.encode({
      client_id: env.strava_client_id,
      client_secret: env.strava_client_secret,
      grant_type: 'refresh_token',
      refresh_token
    });

    const response = await axios.post(`${env.strava_url}/api/v3/oauth/token?${query}`);

    return session.update(response.data);
  }

  async getActivity(id: number, user: IUserSchema) {
    const client = await this.client(user);

    const response = await client.get<StravaActivity>(`${env.strava_url}/api/v3/activities/${id}`);

    return response.data;
  }
}

export default StravaAPIService;
