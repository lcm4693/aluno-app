import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarAulaComponent } from './criar-aula.component';

describe('CriarAulaComponent', () => {
  let component: CriarAulaComponent;
  let fixture: ComponentFixture<CriarAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
