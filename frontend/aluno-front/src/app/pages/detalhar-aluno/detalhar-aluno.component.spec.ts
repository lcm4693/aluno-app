import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharAlunoComponent } from './detalhar-aluno.component';

describe('DetalharAlunoComponent', () => {
  let component: DetalharAlunoComponent;
  let fixture: ComponentFixture<DetalharAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalharAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
