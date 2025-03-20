import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPessoasDetalheComponent } from './cadastro-pessoas-detalhe.component';

describe('CadastroPessoasDetalheComponent', () => {
  let component: CadastroPessoasDetalheComponent;
  let fixture: ComponentFixture<CadastroPessoasDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPessoasDetalheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPessoasDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
