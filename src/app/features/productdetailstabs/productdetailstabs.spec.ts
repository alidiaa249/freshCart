import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productdetailstabs } from './productdetailstabs';

describe('Productdetailstabs', () => {
  let component: Productdetailstabs;
  let fixture: ComponentFixture<Productdetailstabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productdetailstabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productdetailstabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
