import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PositionService } from './services/position.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'angular';
  search: string = "";
  isReadySubscription: Subscription = new Subscription();
  detailSubscription: Subscription = new Subscription();
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

  ngOnDestroy(): void {
    if (this.isReadySubscription)
      this.isReadySubscription.unsubscribe();
  }
}
