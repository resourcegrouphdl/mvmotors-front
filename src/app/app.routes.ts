import { Routes } from '@angular/router';
import { NotfoundComponent } from './shares/notfound/notfound.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { FormularioComponent } from './clientes/formulario/formulario.component';
import { ProdutoSolicitadoComponent } from './clientes/produto-solicitado/produto-solicitado.component';
import { InicioComponent } from './inicio/inicio/inicio.component';
import { GaleriaNuevasComponent } from './tienda/galeria-nuevas/galeria-nuevas.component';
import { GaleriaSegundaComponent } from './tienda/galeria-segunda/galeria-segunda.component';
import { QuienesSomosComponent } from './institucional/quienes-somos/quienes-somos.component';
import { ContactanosComponent } from './contact/contactanos/contactanos.component';
import { SorteoComponent } from './sorteo/sorteo/sorteo.component';
import { TerminosCondicionesComponent } from './shares/terminos-condiciones/terminos-condiciones.component';
import { LibroDeReclamacionesComponent } from './shares/libro-de-reclamaciones/libro-de-reclamaciones.component';
import { PoliticasDePrivacidadComponent } from './shares/politicas-de-privacidad/politicas-de-privacidad.component';
import { FormularioPrimerCOntactoComponent } from './contacto/formulario-primer-contacto/formulario-primer-contacto.component';
import { LoginComponentComponent } from './institucional/login-component/login-component.component';
import { DetallesTiendaComponent } from './institucional/detalles-tienda/detalles-tienda.component';
import { DetallesAliadoComponent } from './institucional/detalles-aliado/detalles-aliado.component';
import { ChangePasswordComponent } from './institucional/change-password/change-password.component';
import { DashboardOverviewComponentComponent } from './cliente/componentes/dashboard-overview-component/dashboard-overview-component.component';
import { DashboardCreditosComponent } from './cliente/componentes/dashboard-creditos/dashboard-creditos.component';
import { SolicitudFinanciamientoComponent } from './cliente/componentes/solicitud-financiamiento/solicitud-financiamiento.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: InicioComponent,
  },
  {
    path: 'formato/:id',
    component: ProdutoSolicitadoComponent,
  },
  {
    path: 'motos-nuevas',
    component: SorteoComponent,
    
  },
  {
    path: 'galeria',
    component: GaleriaNuevasComponent,
  },
  {
    path: 'quienes-somos',
    component: LoginComponentComponent,
    children: [
      {path: "",
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: QuienesSomosComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'store',
        component: DetallesTiendaComponent,
      },
      {
        path: 'vendor',
        component: DetallesAliadoComponent,
        children: [
          {
            path: '',
            redirectTo: 'info',
            pathMatch: 'full',
          },
          {
            path: 'info',
            component: DashboardCreditosComponent,
          },
          {
            path: 'formulario-cliente',
            component: SolicitudFinanciamientoComponent,
          },
        ]

      }

    ]
  },
  {
    path: 'contacto',
    component: ContactanosComponent,
  },
  {
    path: 'terminos-y-condiciones',
    component: TerminosCondicionesComponent,
  },
  {
    path: 'libro-de-reclamaciones',
    component: LibroDeReclamacionesComponent,
  },
  {
    path: 'politicas-de-privacidad',
    component: PoliticasDePrivacidadComponent,
  },
  {
    path: 'cliente',
    component: ClienteComponent,
    children: [
      {
        path: '',
        redirectTo: 'formulario',
        pathMatch: 'full',
      },
      {
        path: 'formulario',
        component: FormularioComponent,
      },
    ],
  },
  {
    path: 'contactenos',
    component: FormularioPrimerCOntactoComponent,
  },

  {
    path: 'detalles-tecnicos',
    component: GaleriaSegundaComponent,
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
  
];
