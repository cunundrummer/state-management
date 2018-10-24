import {AcquiredStates} from './acquired-states-enum';

export interface IGeolocation {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  timestamp?: number;
  options?: {
    enableHighAccuracy: boolean,
    timeout?: number,
    maximumAge?: number
  };
  geolocationState: IGeolocationState;
}

export interface IGeolocationState {
  state: AcquiredStates;
  reason: string;
}

const GEOLOCATION_ERRORS = {
  'errors.location.unsupportedBrowser': 'Browser does not support location services',
  'errors.location.permissionDenied': 'You have rejected access to your location',
  'errors.location.positionUnavailable': 'Unable to determine your location',
  'errors.location.timeout': 'Service timeout has been reached'
};
