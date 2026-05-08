import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allorders } from './allorders';

describe('Allorders', () => {
  let component: Allorders;
  let fixture: ComponentFixture<Allorders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allorders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Allorders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
