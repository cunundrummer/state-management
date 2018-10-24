import {Injectable} from '@angular/core';
import {CookieStates, ICookie} from '../models/cookie';
import {IGeolocation} from '../models/geolocation';
import {Observable, Observer, of} from 'rxjs';
import {catchError, distinctUntilChanged, finalize, share, tap} from 'rxjs/operators';
import {AcquiredStates} from '../models/acquired-states-enum';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private locationCookie: ICookie = {} as ICookie;
  private geolocation: IGeolocation = {
    coords: {
      latitude: null,
      longitude: null,
      speed: null, heading: null,
      altitudeAccuracy: null,
      accuracy: null, altitude: null
    },
    timestamp: null,
    geolocationState: {state: AcquiredStates.NOT_ACQUIRED, reason: 'Start up'},
    options: {enableHighAccuracy: true, maximumAge: Number.MAX_SAFE_INTEGER, timeout: Number.MAX_SAFE_INTEGER}
  } as IGeolocation;
  private userLocation: any = {};

  constructor() {
    console.log('Global service initiated.');
    this.setCookie();
  }

  setCookie() {
    this.locationCookie.name = 'location-cookie';
    this.locationCookie.cookieState = {state: CookieStates.NEW_INSTANCE, reason: 'app start'};
  }

  getCookie(name?: string): ICookie {
    return this.locationCookie;
    // todo: function to search for cookie by name
  }

  setGeolocation(options?: any): Observable<IGeolocation> {
    console.log('setting geolocation...');
    if (this.geolocation.geolocationState.state === AcquiredStates.ACQUIRED) {
      console.log('No need to re-acquire geolocation...');
    }
    this.geolocation.geolocationState = {state: AcquiredStates.ACQUIRING, reason: 'was asked to acquire'};

    return Observable.create((observer: Observer<IGeolocation>) => {
      if (navigator.geolocation) {
        console.log('navigator.geolocation called...');
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log('navigator.geolocation has successfully retrieved position, assigning...');
            this.geolocation.coords = position.coords;
            this.geolocation.timestamp = position.timestamp;
            this.geolocation.geolocationState = {state: AcquiredStates.ACQUIRED, reason: 'geolocation successfully retrieved'};
            observer.next(this.geolocation);
            observer.complete();
            console.log('assigned.');
          },
          error => {
            // error.code can be:
            //   0: unknown error
            //   1: permission denied
            //   2: position unavailable (error response from location provider)
            //   3: timed out
            console.log('Geolocation received error!');
            console.log(error);
            this.geolocation.geolocationState = {state: AcquiredStates.NOT_ACQUIRED_BC_ERROR, reason: error.message};
            observer.error(error);
            observer.complete();
          },
          options || {enableHighAccuracy: true, maximumAge: Number.MAX_SAFE_INTEGER, timeout: Number.MAX_SAFE_INTEGER}
        );
      }
      else {
        console.log('Geolocation not available.');
        observer.complete();
      }
    })
      .pipe(
        distinctUntilChanged(),
        share(),
        tap(geolocation => {
          console.log('Geolocation: ', geolocation);
        }),
        catchError(err => {
          return of(err);
        }),
        finalize(() => {
          console.log('getGeolocation() has completed subscription.');
        })
      );
  }

  getGeolocation(): IGeolocation {
    return this.geolocation;
  }
}
