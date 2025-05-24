import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';
import { BanerPublicitarioComponent } from '../../shares/baner-publicitario/baner-publicitario.component';


@Component({
  selector: 'app-galeria-nuevas',
  standalone: true,
  imports: [BanerPublicitarioComponent,],
  templateUrl: './galeria-nuevas.component.html',
  styleUrl: './galeria-nuevas.component.css'
})
export class GaleriaNuevasComponent implements OnInit {

   currentImageIndex: number = 0;
  intervalId: any;
  isImageVisible: boolean = true;

  constructor(private router: Router, private productService: ProductosService) { }

  ngOnInit(): void {
    
    this.llenarCards(); // Llama a la función para llenar las tarjetas
  }
  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruya
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  

  marcas: string[] = ['JCH', 'DUCONDA', 'LIFAN', 'BERA', 'SSENDA', 'POLUX', 'HERO', 'KTM' ];
  categorias: string[] = ['Pistera', 'Naked', 'Custom', 'Scooter', 'Cafe Racer', 'Cub', 'Utilitaria', 'Urbana', 'Enduro', 'Touring'];

  motos: MotocicletaProduct[] = [];

 



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
