import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Featureproducts } from './featureproducts';

describe('Featureproducts', () => {
  let component: Featureproducts;
  let fixture: ComponentFixture<Featureproducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Featureproducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Featureproducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
