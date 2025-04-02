import { Component } from '@angular/core';

import { SliderComponent } from '../../shares/slider/slider.component';
import { SliderCardComponent } from '../slider-card/slider-card.component';
import { BaraInfoSupComponent } from "../../shares/bara-info-sup/bara-info-sup.component";


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [SliderComponent, SliderCardComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
