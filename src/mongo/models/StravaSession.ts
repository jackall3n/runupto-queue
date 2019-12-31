import { model, Schema } from 'mongoose';

export interface IStravaSession {
  strava_id: string;
  token_type: string;
  refresh_token: string;
  access_token: string;
  scope: string[];
  expires_at: number;
  expires_in: number;
}

const StravaSessionSchema = new Schema({
  strava_id: Number,
  access_token: String,
  refresh_token: String,
  token_type: String,
  expires_at: Number,
  expires_in: Number,
  scope: String
});

export const StravaSession = model('StravaSession', StravaSessionSchema, 'strava_sessions');
