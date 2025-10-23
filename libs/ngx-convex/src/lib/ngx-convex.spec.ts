import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RobmanganellyNgxConvex } from './ngx-convex';

describe('RobmanganellyNgxConvex', () => {
  let component: RobmanganellyNgxConvex;
  let fixture: ComponentFixture<RobmanganellyNgxConvex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobmanganellyNgxConvex],
    }).compileComponents();

    fixture = TestBed.createComponent(RobmanganellyNgxConvex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
