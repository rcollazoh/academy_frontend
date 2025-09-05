import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosDestacados } from './cursos-destacados';

describe('CursosDestacados', () => {
  let component: CursosDestacados;
  let fixture: ComponentFixture<CursosDestacados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosDestacados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosDestacados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
