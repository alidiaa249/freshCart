import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productshiping } from './productshiping';

describe('Productshiping', () => {
  let component: Productshiping;
  let fixture: ComponentFixture<Productshiping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productshiping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productshiping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
