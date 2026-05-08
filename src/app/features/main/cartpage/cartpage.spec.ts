import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cartpage } from './cartpage';

describe('Cartpage', () => {
  let component: Cartpage;
  let fixture: ComponentFixture<Cartpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cartpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cartpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
