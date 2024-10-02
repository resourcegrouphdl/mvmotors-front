import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoSolicitadoComponent } from './produto-solicitado.component';

describe('ProdutoSolicitadoComponent', () => {
  let component: ProdutoSolicitadoComponent;
  let fixture: ComponentFixture<ProdutoSolicitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoSolicitadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoSolicitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
