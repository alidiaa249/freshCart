import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wishlistpage } from './wishlistpage';

describe('Wishlistpage', () => {
  let component: Wishlistpage;
  let fixture: ComponentFixture<Wishlistpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wishlistpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wishlistpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
