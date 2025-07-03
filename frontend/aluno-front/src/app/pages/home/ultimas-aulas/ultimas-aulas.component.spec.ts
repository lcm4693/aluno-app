import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimasAulasComponent } from './ultimas-aulas.component';

describe('UltimasAulasComponent', () => {
  let component: UltimasAulasComponent;
  let fixture: ComponentFixture<UltimasAulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimasAulasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimasAulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
