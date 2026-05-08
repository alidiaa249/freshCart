import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productdetailsabout } from './productdetailsabout';

describe('Productdetailsabout', () => {
  let component: Productdetailsabout;
  let fixture: ComponentFixture<Productdetailsabout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productdetailsabout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productdetailsabout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
