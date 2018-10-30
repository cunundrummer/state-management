import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, finalize, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {GlobalService} from './global.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient, private globalService: GlobalService) {}

  getLocation(lat: number | string, lng: number | string): Observable<any> {
    // todo: define interface for location
    // required from http options - must be strings and not numbers
    if (typeof lat !== 'string' || typeof lng !== 'string') {
      lat = lat.toString();
      lng = lng.toString();
    }

    const HOST = 'http://localhost:3000/';

    const OPTIONS = {
      params: new HttpParams()
        .set('latitude', lat)
        .set('longitude', lng)
    };

    return this.http.get(HOST + 'locations', OPTIONS).pipe(
      tap(res => {
        console.log('received response from DB...');
        console.log(res);
      }),
      catchError(err => {
        console.log(err);
        return of(err);
      }),
      finalize(() => {
        console.log('Completed subscription in getLocation().');
      })
    );
  }
}
