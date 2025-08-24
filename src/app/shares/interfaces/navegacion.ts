import path from 'path';
import { InicioComponent } from '../../inicio/inicio/inicio.component';

export interface Inavegacion {

  path: string;
  title: string;
  foco?: boolean;
}

export const RUTASNAVBAR = [
    { path: 'cliente/formulario', title: 'financiamiento',foco:true },
    { path: 'motos-nuevas', title: 'sorteos',foco:false },
    { path: 'galeria', title: 'Galeria',foco:false },
    { path: 'quienes-somos', title: 'aliado comercial',foco:false },
    { path: 'contactenos', title: 'contactenos',foco:false },
  
    
]
