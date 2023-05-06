import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, PartialObserver, Subscription, catchError, flatMap, map, mergeMap, switchMap, throwError } from 'rxjs';
import { PositionService } from '../services/position.service';
import { Result, Root } from 'src/models/place.model';
import { MarkerModel } from 'src/models/marker.model';
import Swal from 'sweetalert2';

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
    zoomControl: false,
    scrollwheel: false,
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

  constructor(
    private _positionService: PositionService
  ) {

  }

  ngOnInit(): void {
    this._positionService.setIsReady(true);
    this.getLocation();
  }

  ngOnDestroy(): void {
    if (this.subscrption)
      this.subscrption.unsubscribe();
  }

  zoomIn() {
    if (this.options.maxZoom != null && this.zoom < this.options.maxZoom)
      this.zoom++;
  }

  zoomOut() {
    if (this.options.minZoom && this.zoom > this.options.minZoom)
      this.zoom--;
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
        ).subscribe((data: Result[]) => {
          console.log(data)
          if (data.length > 0)
            this.markers = data.map((x, i) => {
              return {
                title: x.name,
                label: {
                  color: 'black',
                  text: x.name
                },
                options: {
                  animation: google.maps.Animation.BOUNCE,
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
          console.log(this.markers);
        });

    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

}
