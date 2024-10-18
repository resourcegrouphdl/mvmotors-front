import path from 'path';
import { InicioComponent } from '../../inicio/inicio/inicio.component';

export interface Inavegacion {

  path: string;
  title: string;
  foco?: boolean;
}

export const RUTASNAVBAR = [
  
    { path: 'motos-nuevas', title: 'motos nuevas',foco:false },
    { path: 'motos-seminuevas', title: 'motos semi nuevas',foco:false },
    { path: 'financiamiento', title: 'financiamiento',foco:true },
    { path: 'quienes-somos', title: 'quienes somos',foco:false },
    { path: 'contacto', title: 'contacto',foco:false },
    { path: 'blog', title: 'blog',foco:false },
  

]