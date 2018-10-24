import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../shared-services/global.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ICookie} from '../models/cookie';
import {IGeolocation} from '../models/geolocation';
import {distinctUntilChanged, map, share, switchMap, take, tap} from 'rxjs/operators';
import {AcquiredStates} from '../models/acquired-states-enum';
import {LocationService} from '../shared-services/location.service';

@Component({
  selector: 'app-debug-info',
  templateUrl: './debug-info.component.html',
  styleUrls: ['./debug-info.component.css']
})
export class DebugInfoComponent implements OnInit {

  locationCookie$: Observable<ICookie>;
  geolocation$: Observable<IGeolocation>;
  clientLocation$: Observable<any>;
  locationRetrieved$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private globalService: GlobalService, private locationService: LocationService) { }

  ngOnInit() {
    this.locationCookie$ = Observable.create(observer => {
      observer.next(this.globalService.getCookie());
    });

    console.log('Attempting to setGeolocation()..');
    this.geolocation$ = this.globalService.setGeolocation({
      enableHighAccuracy: true,
      maximumAge: Number.MAX_SAFE_INTEGER,
      timeout: 10000
    }); // source (type of IGeolocation)

    console.log('Setting client location...');
    this.clientLocation$ = this.geolocation$
      .pipe(
        switchMap(sourceValue => {
          return this.getLocation(sourceValue.coords.latitude, sourceValue.coords.longitude);
        }),
        map(location => {
          console.log('LOCATION.location: ', location.location);
          console.log('location.length: ', location.location.length);
          const MAX_KINDS_OF_LOCATIONS = 4;
          const OFFSET = 1; // for keeping the nearest suburb (calculated in db)
          const NUMBER_OF_ELEMENTS_TO_NOT_DELETE = MAX_KINDS_OF_LOCATIONS - 1; // saves the country, region, city
          if (location.location.length > MAX_KINDS_OF_LOCATIONS) {
            console.log('truncating response...');
            location.location.splice(OFFSET, location.location.length - NUMBER_OF_ELEMENTS_TO_NOT_DELETE - OFFSET);
          }
          // return only the first (closest) location.  All other info is derived from this data in the db.
          return {
            suburb: location.location[0].asciiname || 'N/a',
            city: location.location[0].CITY || location.location[0].REGION || 'N/a',
            region: location.location[0].REGION || 'N/a',
            country: location.location[0].COUNTRY || 'N/a',
            continent: location.location[0].CONTINENT || 'N.a'
          };
        })
      );
  }

  getLocation(lat: number, lng: number): Observable<any> {
    return this.locationService.getLocation(lat, lng);
  }
}
