import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResolvedTickets } from './resolved-tickets';

describe('ResolvedTickets', () => {
  let component: ResolvedTickets;
  let fixture: ComponentFixture<ResolvedTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolvedTickets],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolvedTickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
