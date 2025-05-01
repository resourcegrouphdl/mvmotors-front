import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';
import { BanerPublicitarioComponent } from '../../shares/baner-publicitario/baner-publicitario.component';

@Component({
  selector: 'app-galeria-nuevas',
  standalone: true,
  imports: [BanerPublicitarioComponent],
  templateUrl: './galeria-nuevas.component.html',
  styleUrl: './galeria-nuevas.component.css'
})
export class GaleriaNuevasComponent implements OnInit {

   currentImageIndex: number = 0;
  intervalId: any;
  isImageVisible: boolean = true;

  constructor(private router: Router, private productService: ProductosService) { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.isImageVisible = false; // Oculta la imagen actual
      setTimeout(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.publicidad.length;
        this.isImageVisible = true; // Muestra la nueva imagen
      }, 1500); // Tiempo para la transición de opacidad
    }, 4000); // Cambia la imagen cada 5 segundos


    this.llenarCards(); // Llama a la función para llenar las tarjetas
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

  motos: MotocicletaProduct[] = [];

 


  publicidad:string[] = ["https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/publicidad%2FPUBLICIDAD%201-100.jpg?alt=media&token=4c158e47-41a1-4f08-bf3d-9d5918f67a03",
    "https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/publicidad%2FPUBLICIDAD%202-100.jpg?alt=media&token=c2819ed1-dc7f-4281-9bdf-c9e123cea72f"
  ] 


  goToDetail(producto: MotocicletaProduct) {
    this.productService.setProducto(producto); // Almacena el producto seleccionado en el servicio
    this.router.navigate(['/detalles-tecnicos']);
  }

  llenarCards(){
    this.productService.getAllProducts().subscribe((data) => {
      this.motos = data;
      console.log(this.motos);
    });
  }

}
