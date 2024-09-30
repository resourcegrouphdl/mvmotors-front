import { Component } from '@angular/core';
import { SingInComponent } from '../auth/sing-in/sing-in.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SingInComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
