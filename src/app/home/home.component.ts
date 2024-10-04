import { Component } from '@angular/core';
import { SingInComponent } from '../auth/sing-in/sing-in.component';
import { ClienteComponent } from '../clientes/cliente/cliente.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SingInComponent, ClienteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
