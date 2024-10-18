import { Component } from '@angular/core';
import { BaraInfoSupComponent } from '../../shares/bara-info-sup/bara-info-sup.component';
import { NavbarComponent } from '../../shares/navbar/navbar.component';
import { SliderComponent } from '../../shares/slider/slider.component';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [BaraInfoSupComponent, NavbarComponent,SliderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
