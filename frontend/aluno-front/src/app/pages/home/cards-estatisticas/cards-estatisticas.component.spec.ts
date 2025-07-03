import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsEstatisticasComponent } from './cards-estatisticas.component';

describe('CardsEstatisticasComponent', () => {
  let component: CardsEstatisticasComponent;
  let fixture: ComponentFixture<CardsEstatisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsEstatisticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsEstatisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
