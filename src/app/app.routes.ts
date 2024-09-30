import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './shares/notfound/notfound.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    
    },
    {
        path: 'cliente',
        component: ClienteComponent,

    },
    {
        path: '**',
        component:NotfoundComponent,
    }

];
