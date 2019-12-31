import { model, Schema, Document } from 'mongoose';
import { IStravaSession } from './StravaSession';

interface IUser extends Document {
  strava: {
    session: IStravaSession
  }
}

const UserSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  address: {
    city: String,
    state: String,
    country: String
  },
  sex: String,
  profile_picture: String,
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  strava: {
    id: Number,
    session: {
      type: Schema.Types.ObjectId,
      ref: 'StravaSession'
    }
  }
});

export const User = model<IUser>('User', UserSchema);
