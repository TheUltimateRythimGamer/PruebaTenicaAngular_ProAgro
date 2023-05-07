import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, PartialObserver, Subscription, catchError, flatMap, map, mergeMap, switchMap, throwError } from 'rxjs';
import { PositionService } from '../services/position.service';
import { Result, Root } from 'src/models/place.model';
import { MarkerModel } from 'src/models/marker.model';
import Swal from 'sweetalert2';
import { Location } from 'src/models/location.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  markers: MarkerModel[] = [];

  private lat: number = 0;
  private lng: number = 0;

  zoom = 15;

  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };

  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 200,
    minZoom: 8,
  };

  private locationObserver: PartialObserver<Root> = {
    next: (data) => {
      console.log(data.results);
    },
    error: (err) => {
      console.log(err)
    },
    complete: () => {
    }
  };

  private subscrption: Subscription = new Subscription();
  private subscrptionLocation: Subscription = new Subscription();

  constructor(
    private _positionService: PositionService
  ) {

  }

  ngOnInit(): void {
    this._positionService.setIsReady(true);
    this.getLocation();
    this.subscrptionLocation = this._positionService.location$.subscribe((position: Location) => {
      if (Object.keys(position).length > 0) {
        this.lat = position.latitude;
        this.lng = position.longitude;
        this.center = {
          lat: position.latitude,
          lng: position.longitude,
        };
        this.getMarkers();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscrption)
      this.subscrption.unsubscribe();
  }

  getDetails(marker: MarkerModel): void {
    this._positionService.setDetail(null);
    this._positionService.setIsReady(false);
    this._positionService.setDetail(marker);
  }

  private getLocation(): void {
    if (navigator.geolocation) {
      this.subscrption = this._positionService.getPosition()
        .pipe(
          map((position: any) => {
            if (position) {
              console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
              this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
            }
            return this.center;
          }),
          mergeMap((data: { lat: number, lng: number }) => {
            return this._positionService.getInfoByOriginalLatLng(data.lat, data.lng);
          }),
          catchError((error) => {
            console.log(error)
            return throwError(error);
          }),
        )
        .pipe(
          map((data: Root) => data.results)
        )
        .subscribe((data: Result[]) => {
          if (data.length > 0)
            this.markers = data.map((x, i) => {
              return {
                id: x.fsq_id,
                title: x.name,
                label: {
                  color: 'white',
                  text: x.name
                },
                options: {
                  animation: google.maps.Animation.BOUNCE,
                  opacity: 0.9,
                },
                position: {
                  lat: x.geocodes.main.latitude,
                  lng: x.geocodes.main.longitude
                }
              };
            });
          else
            Swal.fire({
              title: 'Advertencia!',
              text: "No se han encontrado ubicaciones cercanas",
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
        },
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: "Ocurrio un error",
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          },
          () => {
            this._positionService.setIsReady(true);
          });

    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  private getMarkers(): void {
    this._positionService.getInfoByOriginalLatLng(this.lat, this.lng, 10000)
      .pipe(
        map((data: Root) => data.results)
      )
      .subscribe((data: Result[]) => {
        if (data.length > 0)
          this.markers = data.map((x, i) => {
            return {
              id: x.fsq_id,
              title: x.name,
              label: {
                color: 'white',
                text: x.name
              },
              options: {
                animation: google.maps.Animation.BOUNCE,
                opacity: 0.9,
              },
              position: {
                lat: x.geocodes.main.latitude,
                lng: x.geocodes.main.longitude
              }
            };
          });
        else
          Swal.fire({
            title: 'Advertencia!',
            text: "No se han encontrado ubicaciones cercanas",
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
      },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: "Ocurrio un error",
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        },
        () => {
          this._positionService.setIsReady(true);
        });

  }

}
