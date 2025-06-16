import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaAulaComponent } from './nova-aula.component';

describe('NovaAulaComponent', () => {
  let component: NovaAulaComponent;
  let fixture: ComponentFixture<NovaAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaAulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
