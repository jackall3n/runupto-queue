import { Document, model, Schema } from 'mongoose';

export interface IActivity extends Document {
  id: number;
  type: string;
  external_id: string;
  athlete: {
    id: string;
  }
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  start_date_local: string;
  deleted: boolean;
  source: string;
}

const ActivitySchema = new Schema({
  id: Number,
  type: String,
  external_id: String,
  athlete: Schema.Types.Mixed,
  name: String,
  distance: Number,
  moving_time: Number,
  elapsed_time: Number,
  start_date: String,
  start_date_local: String,
  deleted: Boolean,
  metadata: Schema.Types.Mixed,
  source: String,
});

export const Activity = model<IActivity>('Activity', ActivitySchema, 'activities');
