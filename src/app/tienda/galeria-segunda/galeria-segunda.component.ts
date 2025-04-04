import { Component } from '@angular/core';

@Component({
  selector: 'app-galeria-segunda',
  standalone: true,
  imports: [],
  templateUrl: './galeria-segunda.component.html',
  styleUrl: './galeria-segunda.component.css'
})
export class GaleriaSegundaComponent {

  motos = [
    { nombre: 'JCH WORKMAN 150', precio: 1300, imagen: 'https://carsaperupoc.vtexassets.com/arquivos/ids/162749/moto-ssenda-viper-200-dkr-016001126_1.png?v=638769150636370000' },
    { nombre: 'KTM DUKE 200', precio: 7500, imagen: 'https://www.motocorp.pe/wp-content/uploads/2024/04/MATE-AZUL-SF250-sf-e1712851653377.png' },
    { nombre: 'HERO IGNITOR 125', precio: 1300, imagen: 'https://api-motos.daytonamotos.com/files/images/full-X6bISv3KcH-1719258315.png?width=450' }
  ];

  moto1:string = 'https://carsaperupoc.vtexassets.com/arquivos/ids/162749/moto-ssenda-viper-200-dkr-016001126_1.png?v=638769150636370000'

  iconos: string[] = ["motor","rendimiento","suspencion","transmision","dimenciones","frenos"]

}
