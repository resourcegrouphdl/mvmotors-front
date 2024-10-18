import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './shares/notfound/notfound.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { FormularioComponent } from './clientes/formulario/formulario.component';
import { TablaclientesComponent } from './shares/tablaclientes/tablaclientes.component';
import { ProdutoSolicitadoComponent } from './clientes/produto-solicitado/produto-solicitado.component';
import { InicioComponent } from './inicio/inicio/inicio.component';


export const routes: Routes = [
    {
        path:'',
        redirectTo : 'home',
        pathMatch: 'full'
        
       
    },
    {
        path: 'home',
        component:InicioComponent
    },
    {
        path: 'formato/:id',
        component: ProdutoSolicitadoComponent

    },
    {
        path: 'cliente',
        component: ClienteComponent,
        children: [
            {
                path: '',
                redirectTo: 'formulario',
                pathMatch: 'full'
            },
            {
                path: 'formulario',
                component: FormularioComponent

            }
          
        ]
       
    },
    {
        path: '**',
        component:NotfoundComponent,
       
    }

];
