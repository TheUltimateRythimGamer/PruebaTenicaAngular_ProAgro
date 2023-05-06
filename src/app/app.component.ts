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

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private _positionService: PositionService
  ) {
  }


  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      // this.isReadySubscription = this._positionService.isReady$.subscribe((isReady) => {
      //   if (isReady)
      this.spinner.hide();
      // });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.isReadySubscription)
      this.isReadySubscription.unsubscribe();
  }
}
