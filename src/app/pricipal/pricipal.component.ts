import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { PositionService } from '../services/position.service';
import Swal from 'sweetalert2';
import { Location } from 'src/models/location.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricipal',
  templateUrl: './pricipal.component.html',
  styleUrls: ['./pricipal.component.css']
})
export class PricipalComponent implements OnInit, OnDestroy {

  search: string = "";
  isReadySubscription: Subscription = new Subscription();
  detailSubscription: Subscription = new Subscription();
  locationSubscription: Subscription = new Subscription();
  showDetail: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private _positionService: PositionService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    // setTimeout(() => {
    this.isReadySubscription = this._positionService.isReady$.subscribe((isReady) => {
      if (isReady)
        this.spinner.hide();
      else
        this.spinner.show();
    });

    this.detailSubscription = this._positionService.detail$.subscribe((detail) => {
      if (detail != null && Object.keys(detail).length > 0)
        this.showDetail = true;
      else
        this.showDetail = false;
    })
    // }, 1000);
  }

  searchTerm(): void {
    console.log(this.search);
    this._positionService.getLocationName(this.search).subscribe(
      (data: Location[]) => {
        if (data.length == 0)
          Swal.fire({
            title: 'Advertencia!',
            text: "No se han encontrado ubicaciones con dicho nombre",
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        else {
          this._positionService.setDetail(null)
          this._positionService.setLocation(data[0]);
          this._positionService.setIsReady(false);
        }
      },
      (error) => {
        Swal.fire({
          title: 'Advertencia!',
          text: "No se han encontrado ubicaciones con dicho nombre",
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      });
  }

  SendList(): void {
    this.router.navigate(['list']);
  }

  ngOnDestroy(): void {
    if (this.isReadySubscription)
      this.isReadySubscription.unsubscribe();
  }
}