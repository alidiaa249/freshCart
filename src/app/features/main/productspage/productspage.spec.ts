import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productspage } from './productspage';

describe('Productspage', () => {
  let component: Productspage;
  let fixture: ComponentFixture<Productspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productspage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productspage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
