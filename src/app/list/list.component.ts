import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationDto } from 'src/models/locationDto.model';
import { PositionService } from '../services/position.service';
import { PartialObserver } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  data: LocationDto[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private _positionService: PositionService,
  ) {

  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadData();
  }

  private loadData(): void {
    let observer: PartialObserver<any> = {
      next: (res: any) => {
        console.log(res);
        this.data = res.listado;
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },
      error: (err) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        Swal.fire({
          title: 'Error!',
          text: "Se ha producido un error al momento de hacer la llamada",
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
    };
    this._positionService.getLocationsList().subscribe(observer)
  }

}
