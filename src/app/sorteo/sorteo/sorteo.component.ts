import { Component } from '@angular/core';
import { BanerPublicitarioComponent } from '../../shares/baner-publicitario/baner-publicitario.component';

@Component({
  selector: 'app-sorteo',
  standalone: true,
  imports: [BanerPublicitarioComponent, ],
  templateUrl: './sorteo.component.html',
  styleUrl: './sorteo.component.css'
})
export class SorteoComponent {

}
