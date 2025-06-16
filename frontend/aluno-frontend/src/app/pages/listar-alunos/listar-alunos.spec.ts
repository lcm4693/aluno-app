import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAlunos } from './listar-alunos';

describe('ListarAlunos', () => {
  let component: ListarAlunos;
  let fixture: ComponentFixture<ListarAlunos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAlunos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAlunos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
