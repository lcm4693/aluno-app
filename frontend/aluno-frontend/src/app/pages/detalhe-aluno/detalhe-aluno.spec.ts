import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheAluno } from './detalhe-aluno';

describe('DetalheAluno', () => {
  let component: DetalheAluno;
  let fixture: ComponentFixture<DetalheAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheAluno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheAluno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
