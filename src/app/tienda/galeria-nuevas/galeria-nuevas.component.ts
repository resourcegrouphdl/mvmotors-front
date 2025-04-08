import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galeria-nuevas',
  standalone: true,
  imports: [],
  templateUrl: './galeria-nuevas.component.html',
  styleUrl: './galeria-nuevas.component.css'
})
export class GaleriaNuevasComponent implements OnInit {

   currentImageIndex: number = 0;
  intervalId: any;
  isImageVisible: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.isImageVisible = false; // Oculta la imagen actual
      setTimeout(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.publicidad.length;
        this.isImageVisible = true; // Muestra la nueva imagen
      }, 1500); // Tiempo para la transición de opacidad
    }, 4000); // Cambia la imagen cada 5 segundos
  }
  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruya
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  get currentImage(): string {
    return this.publicidad[this.currentImageIndex];
  }

  marcas: string[] = ['JHC', 'DUCONDA', 'LIFAN', 'BERA', 'SSENDA', 'POLUX', 'HERO', 'KTM' ];
  categorias: string[] = ['Pistera', 'Naked', 'Custom', 'Scooter', 'Cafe Racer', 'Cub', 'Utilitaria', 'Urbana', 'Enduro', 'Touring'];

  motos = [
    { nombre: 'JCH WORKMAN 150', precio: 1300, imagen: 'https://carsaperupoc.vtexassets.com/arquivos/ids/162749/moto-ssenda-viper-200-dkr-016001126_1.png?v=638769150636370000' },
    { nombre: 'KTM DUKE 200', precio: 7500, imagen: 'https://www.motocorp.pe/wp-content/uploads/2024/04/MATE-AZUL-SF250-sf-e1712851653377.png' },
    { nombre: 'HERO IGNITOR 125', precio: 1300, imagen: 'https://api-motos.daytonamotos.com/files/images/full-X6bISv3KcH-1719258315.png?width=450' }
  ];

 


  publicidad:string[] = ["https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/publicidad%2FPUBLICIDAD%201-100.jpg?alt=media&token=4c158e47-41a1-4f08-bf3d-9d5918f67a03",
    "https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/publicidad%2FPUBLICIDAD%202-100.jpg?alt=media&token=c2819ed1-dc7f-4281-9bdf-c9e123cea72f"
  ] 


  goToDetail(){
    this.router.navigate(['/motos-nuevas']);
  }

}
