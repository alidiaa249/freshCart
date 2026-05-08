import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productsdetails } from './productsdetails';

describe('Productsdetails', () => {
  let component: Productsdetails;
  let fixture: ComponentFixture<Productsdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productsdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productsdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
