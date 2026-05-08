import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productreview } from './productreview';

describe('Productreview', () => {
  let component: Productreview;
  let fixture: ComponentFixture<Productreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
