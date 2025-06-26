import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAulasComponent } from './calendario-aulas.component';

describe('CalendarioAulasComponent', () => {
  let component: CalendarioAulasComponent;
  let fixture: ComponentFixture<CalendarioAulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioAulasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioAulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
