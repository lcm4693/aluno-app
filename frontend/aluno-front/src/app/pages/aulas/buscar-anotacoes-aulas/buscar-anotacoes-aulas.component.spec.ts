import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAnotacoesAulasComponent } from './buscar-anotacoes-aulas.component';

describe('BuscarAnotacoesAulasComponent', () => {
  let component: BuscarAnotacoesAulasComponent;
  let fixture: ComponentFixture<BuscarAnotacoesAulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarAnotacoesAulasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarAnotacoesAulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
