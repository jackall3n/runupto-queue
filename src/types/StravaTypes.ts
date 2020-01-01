export interface StravaEvent {
  object_id: number;
  aspect_type: 'create' | 'update' | 'delete';
  owner_id: number;
  subscription_id: number;
  event_time: number;
}

export interface StravaAthleteEvent extends StravaEvent {
  object_type: 'athlete';
  updates: any;
}


export interface StravaActivityEvent extends StravaEvent {
  object_type: 'activity';
  updates: {
    title?: string;
    type?: string;
  }
}

export interface StravaActivity {
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
}

export type KnownStravaEvents = StravaActivityEvent | StravaAthleteEvent;
