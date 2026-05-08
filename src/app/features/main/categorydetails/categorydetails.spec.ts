import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categorydetails } from './categorydetails';

describe('Categorydetails', () => {
  let component: Categorydetails;
  let fixture: ComponentFixture<Categorydetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categorydetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Categorydetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
