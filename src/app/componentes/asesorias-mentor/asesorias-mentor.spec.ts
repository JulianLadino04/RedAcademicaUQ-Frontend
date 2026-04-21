import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesoriasMentor } from './asesorias-mentor';

describe('AsesoriasMentor', () => {
  let component: AsesoriasMentor;
  let fixture: ComponentFixture<AsesoriasMentor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsesoriasMentor],
    }).compileComponents();

    fixture = TestBed.createComponent(AsesoriasMentor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
