import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PartialObserver, Subscription, forkJoin } from 'rxjs';
import { Detail, PhotoDetail } from 'src/models/detail.model';
import { MarkerModel } from 'src/models/marker.model';
import Swal from 'sweetalert2';
import { PositionService } from '../services/position.service';
import { LocationDto } from 'src/models/locationDto.model';

@Component({
  selector: 'app-detail-marker',
  templateUrl: './detail-marker.component.html',
  styleUrls: ['./detail-marker.component.css']
})
export class DetailMarkerComponent implements OnInit, OnDestroy {

  detail: Detail = {} as Detail;
  detailPhoto = {} as PhotoDetail;
  locationDto: LocationDto = {} as LocationDto;

  formDetalle = this.fb.group({
    TxtNombre: ['', [Validators.required]],
    TxtDireccion: ['', [Validators.required]],
    TxtCiudad: ['', [Validators.required]],
    TxtEstado: ['', [Validators.required]],
    rating: [0, Validators.required],
  });

  get TxtNombre() { return this.formDetalle.get('TxtNombre') }
  get TxtDireccion() { return this.formDetalle.get('TxtDireccion') }
  get TxtCiudad() { return this.formDetalle.get('TxtCiudad') }
  get TxtEstado() { return this.formDetalle.get('TxtEstado') }
  get rating() { return this.formDetalle.get('rating') }

  private detailSubscription: Subscription = new Subscription();
  private detailObserver: PartialObserver<any> = {
    next: (data: any) => {
      setTimeout(() => {
        this._positionService.setIsReady(true);
      }, 500);

      this.detail = data[0];
      this.detailPhoto = data[1][0];
      this.locationDto = data[2].result ? data[2].result : null;

      this.TxtNombre?.setValue(this.detail.name);
      this.TxtDireccion?.setValue(this.detail.location.formatted_address);
      this.TxtCiudad?.setValue(this.detail.location.locality);
      this.TxtEstado?.setValue(this.detail.location.region);
      this.rating?.setValue(this.locationDto ? this.locationDto.raking : 0);
    },
    error: (err) => {
      console.log(err)
    },
    complete: () => {
    }
  };

  private subscrption: Subscription = new Subscription();

  constructor(
    private _positionService: PositionService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.detailSubscription = this._positionService
      .detail$
      .subscribe((detail: MarkerModel) => {
        this.getDetail(detail)
      })
  }

  sendReview(): void {
    if (this.formDetalle.invalid)
      return;
    else
      console.log(this.formDetalle.value);
    let json = {
      id: this.detail.fsq_id,
      nombre: this.detail.name,
      rutaImagen: this.detailPhoto.prefix + this.detailPhoto.width + 'x' + this.detailPhoto.height + this.detailPhoto.suffix,
      raking: this.rating?.value
    };
    this._positionService.setIsReady(false);
    this._positionService.saveRating(json).subscribe(
      (data) => {
        this._positionService.setIsReady(true);
        Swal.fire({
          title: 'Exito!',
          text: "Se ha enviado la calificacion con exito",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      (err) => {
        this._positionService.setIsReady(true);
        Swal.fire({
          title: 'Error!',
          text: "Ocurrio un error",
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
      () => {
      });
  }

  private getDetail(marker: MarkerModel): void {
    this.detailSubscription = forkJoin([
      this._positionService.getDetailInfo(marker.id),
      this._positionService.getDetailPhoto(marker.id),
      this._positionService.getDetailDBInfo(marker.id)
    ])
      .subscribe(this.detailObserver);
  }

  ngOnDestroy(): void {
    if (this.subscrption)
      this.subscrption.unsubscribe();
    if (this.detailSubscription)
      this.detailSubscription.unsubscribe();
  }

}
