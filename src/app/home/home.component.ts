import { Component } from '@angular/core';
import { ClienteComponent } from '../clientes/cliente/cliente.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ClienteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
