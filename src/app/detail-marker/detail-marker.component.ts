import { Component, OnDestroy, OnInit } from '@angular/core';
import { PositionService } from '../services/position.service';
import { PartialObserver, Subscription, forkJoin } from 'rxjs';
import { MarkerModel } from 'src/models/marker.model';
import { Detail, PhotoDetail } from 'src/models/detail.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-marker',
  templateUrl: './detail-marker.component.html',
  styleUrls: ['./detail-marker.component.css']
})
export class DetailMarkerComponent implements OnInit, OnDestroy {

  detail: Detail = {} as Detail;
  detailPhoto = {} as PhotoDetail;

  formDetalle = this.fb.group({
    TxtNombre: ['', [Validators.required]],
    TxtDireccion: ['', [Validators.required]],
    TxtCiudad: ['', [Validators.required]],
    TxtEstado: ['', [Validators.required]],
  });

  get TxtNombre() { return this.formDetalle.get('TxtNombre') }
  get TxtDireccion() { return this.formDetalle.get('TxtDireccion') }
  get TxtCiudad() { return this.formDetalle.get('TxtCiudad') }
  get TxtEstado() { return this.formDetalle.get('TxtEstado') }

  private detailSubscription: Subscription = new Subscription();
  private detailObserver: PartialObserver<any> = {
    next: (data: any) => {
      setTimeout(() => {
        this._positionService.setIsReady(true);
      }, 500);

      this.detail = data[0];
      this.detailPhoto = data[1][0];
      console.log(this.detailPhoto);
      this.TxtNombre?.setValue(this.detail.name);
      this.TxtDireccion?.setValue(this.detail.location.formatted_address);
      this.TxtCiudad?.setValue(this.detail.location.locality);
      this.TxtEstado?.setValue(this.detail.location.region);
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

  private getDetail(marker: MarkerModel): void {
    this.detailSubscription = forkJoin([
      this._positionService.getDetailInfo(marker.id),
      this._positionService.getDetailPhoto(marker.id),
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
