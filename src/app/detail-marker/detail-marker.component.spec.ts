import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMarkerComponent } from './detail-marker.component';

describe('DetailMarkerComponent', () => {
  let component: DetailMarkerComponent;
  let fixture: ComponentFixture<DetailMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMarkerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
