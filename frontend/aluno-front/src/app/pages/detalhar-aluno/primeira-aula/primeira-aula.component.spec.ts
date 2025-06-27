import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeiraAulaComponent } from './primeira-aula.component';

describe('PrimeiraAulaComponent', () => {
  let component: PrimeiraAulaComponent;
  let fixture: ComponentFixture<PrimeiraAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeiraAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeiraAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
