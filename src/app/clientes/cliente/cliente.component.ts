import { Component } from '@angular/core';
import { NavbarComponent } from '../../shares/navbar/navbar.component';
import { RouterOutlet,RouterLink,RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet,RouterLink,RouterLinkActive], 
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {

}
