import { Component } from '@angular/core';
import { NavbarComponent } from '../../shares/navbar/navbar.component';
import {BaraInfoSupComponent} from '../../shares/bara-info-sup/bara-info-sup.component';
import { RouterOutlet,RouterLink,RouterLinkActive } from '@angular/router';
import { VideoPlayComponent } from '../../shares/video-play/video-play.component';
import { FooterComponent } from '../../shares/footer/footer.component';
import { FormularioComponent } from '../formulario/formulario.component';
import { TablaclientesComponent } from "../../shares/tablaclientes/tablaclientes.component";
@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [NavbarComponent,
    RouterOutlet, RouterLink,
    RouterLinkActive,
    BaraInfoSupComponent,
    VideoPlayComponent,
    FooterComponent,
    FormularioComponent, TablaclientesComponent], 
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {

}
