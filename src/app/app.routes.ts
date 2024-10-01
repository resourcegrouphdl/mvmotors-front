import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './shares/notfound/notfound.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { FormularioComponent } from './clientes/formulario/formulario.component';
import { TablaclientesComponent } from './clientes/tablaclientes/tablaclientes.component';


export const routes: Routes = [
    {
        path:'',
        redirectTo : 'home',
        pathMatch: 'full'
        
       
    },
    {
        path: 'home',
        component: HomeComponent,
        
        
    
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

            },
            {
                path: 'clientes',
                component: TablaclientesComponent
            }
        ]
       

    },
    {
        path: '**',
        component:NotfoundComponent,
       
    }

];
