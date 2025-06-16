import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharAulaComponent } from './detalhar-aula.component';

describe('DetalharAulaComponent', () => {
  let component: DetalharAulaComponent;
  let fixture: ComponentFixture<DetalharAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalharAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
