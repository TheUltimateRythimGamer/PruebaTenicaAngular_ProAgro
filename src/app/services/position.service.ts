import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroment } from 'src/environments/enviroment';
import { MarkerModel } from 'src/models/marker.model';
import { Location } from 'src/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private _isReady$ = new BehaviorSubject<any>({});
  isReady$ = this._isReady$.asObservable();

  private _detail$ = new BehaviorSubject<any>({});
  detail$ = this._detail$.asObservable();

  private _location$ = new BehaviorSubject<any>({});
  location$ = this._location$.asObservable();

  constructor(
    protected http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'fsq3eU6PW6xJGGWZ6WReQJYeSFjgEAfaKrCUCRs4893DYZ4=',
      'X-Api-Key': '8q+cIOx/o8FiGNWsvgIeBg==B8SS0imRmTxoYmJy'
    }),
  };

  setIsReady(isReady: boolean) {
    this._isReady$.next(isReady);
  }

  setDetail(detail: MarkerModel | null) {
    this._detail$.next(detail);
  }

  setLocation(location: Location) {
    this._location$.next(location);
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

  getInfoByOriginalLatLng(lat: number, lng: number, meters: number = 5000): Observable<any> {
    return this.http.get<any>(`${enviroment.placesApi}search?ll=${lat}%2C${lng}&radius=${5000}`, this.httpOptions);
  }

  getDetailInfo(id: string): Observable<any> {
    return this.http.get<any>(`${enviroment.placesApi}${id}`, this.httpOptions);
  }

  getDetailPhoto(id: string): Observable<any> {
    return this.http.get<any>(`${enviroment.placesApi}${id}/photos`, this.httpOptions);
  }

  getLocationName(name: string): Observable<any> {
    return this.http.get<any>(`${enviroment.ninjaApi}?name=${name}`, this.httpOptions);
  }

  saveRating(json: any): Observable<any> {
    return this.http.post<any>(`${enviroment.rootApi}`, json, this.httpOptions);
  }

  getDetailDBInfo(id: string): Observable<any> {
    return this.http.get<any>(`${enviroment.rootApi}${id}`, this.httpOptions);
  }

  getLocationsList(): Observable<any> {
    return this.http.get<any>(`${enviroment.rootApi}`, this.httpOptions);
  }
}
