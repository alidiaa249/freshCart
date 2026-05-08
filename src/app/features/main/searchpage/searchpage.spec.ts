import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Searchpage } from './searchpage';

describe('Searchpage', () => {
  let component: Searchpage;
  let fixture: ComponentFixture<Searchpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Searchpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Searchpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
