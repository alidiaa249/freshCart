import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categorypage } from './categorypage';

describe('Categorypage', () => {
  let component: Categorypage;
  let fixture: ComponentFixture<Categorypage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categorypage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Categorypage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
