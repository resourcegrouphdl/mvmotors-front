import { Component } from '@angular/core';
import { NavbarComponent } from '../../shares/navbar/navbar.component';
import { FormularioComponent } from '../formulario/formulario.component';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [NavbarComponent, FormularioComponent, RouterOutlet],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent {}
