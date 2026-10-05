import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicianNavbar } from './technician-navbar';

describe('TechnicianNavbar', () => {
  let component: TechnicianNavbar;
  let fixture: ComponentFixture<TechnicianNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicianNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
