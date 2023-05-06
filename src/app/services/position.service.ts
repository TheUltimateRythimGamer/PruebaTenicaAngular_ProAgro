import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private _isReady$ = new BehaviorSubject<any>({});
  isReady$ = this._isReady$.asObservable();

  constructor(
    protected http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'fsq3eU6PW6xJGGWZ6WReQJYeSFjgEAfaKrCUCRs4893DYZ4='
    }),
  };

  setIsReady(isReady: boolean) {
    this._isReady$.next(isReady);
  }

  getPosition(): Observable<any> {
    return new Observable<GeolocationCoordinates>(
      (observer: any) => {
        window.navigator.geolocation.getCurrentPosition(position => {
          observer.next(position);
          observer.complete();
        }, (err: any) => {
          observer.error(err)
          observer.complete();
        })
      })
      .pipe(
        retry(1),
        catchError((error) => {
          console.log(error)
          return throwError(error);
        })
      );
  }

  getInfoByOriginalLatLng(lat: number, lng: number, meters: number = 1000): Observable<any> {
    return this.http.get<any>(`${enviroment.placesApi}search?ll=${lat}%2C${lng}&radius=1000`, this.httpOptions);
  }


}
