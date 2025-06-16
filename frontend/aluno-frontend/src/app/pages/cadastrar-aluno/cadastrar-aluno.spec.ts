import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarAluno } from './cadastrar-aluno';

describe('CadastrarAluno', () => {
  let component: CadastrarAluno;
  let fixture: ComponentFixture<CadastrarAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarAluno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarAluno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
