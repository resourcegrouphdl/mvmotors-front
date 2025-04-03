import { Component } from '@angular/core';

import { SliderComponent } from '../../shares/slider/slider.component';
import { SliderCardComponent } from '../slider-card/slider-card.component';
import { SeccionSorteoComponent } from '../seccion-sorteo/seccion-sorteo.component';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [SliderComponent,
            SliderCardComponent, 
            SeccionSorteoComponent,],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
