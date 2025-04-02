import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './shares/notfound/notfound.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { FormularioComponent } from './clientes/formulario/formulario.component';
import { ProdutoSolicitadoComponent } from './clientes/produto-solicitado/produto-solicitado.component';
import { InicioComponent } from './inicio/inicio/inicio.component';
import { GaleriaNuevasComponent } from './tienda/galeria-nuevas/galeria-nuevas.component';
import { GaleriaSegundaComponent } from './tienda/galeria-segunda/galeria-segunda.component';
import { QuienesSomosComponent } from './institucional/quienes-somos/quienes-somos.component';
import { ContactanosComponent } from './contact/contactanos/contactanos.component';
import { NoticiasComponent } from './blog/noticias/noticias.component';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { SignInComponent } from './auth/sign-in1/sign-in.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { adminguardGuard } from './guards/adminguard.guard';



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
        path: 'motos-nuevas',
        component: GaleriaNuevasComponent
    },
    {
        path: 'motos-seminuevas',
        component: GaleriaSegundaComponent
    },
    {
        path: 'quienes-somos',
        component:QuienesSomosComponent
    },
    {
        path: 'contacto',
        component:ContactanosComponent
    },
    {
        path: 'blog',
        component: NoticiasComponent
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
            
        ]
       
    },
    {
        path: '**',
        component:NotfoundComponent,
       
    }

];
