import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Similarproducts } from './similarproducts';

describe('Similarproducts', () => {
  let component: Similarproducts;
  let fixture: ComponentFixture<Similarproducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Similarproducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Similarproducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
