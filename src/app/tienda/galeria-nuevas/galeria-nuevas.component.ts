import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';
import { BanerPublicitarioComponent } from '../../shares/baner-publicitario/baner-publicitario.component';
import { DecimalPipe, NgIf } from '@angular/common';


@Component({
  selector: 'app-galeria-nuevas',
  standalone: true,
  imports: [BanerPublicitarioComponent,DecimalPipe,NgIf],
  templateUrl: './galeria-nuevas.component.html',
  styleUrl: './galeria-nuevas.component.css'
})
export class GaleriaNuevasComponent implements OnInit {

   currentImageIndex: number = 0;
  intervalId: any;
  isImageVisible: boolean = true;
   // Nuevas propiedades para scroll infinito
  displayedMotos: any[] = [];
  totalMotos = 0;
  isLoading = false;
  hasReachedEnd = false;
  
  // Configuración del scroll infinito
  private itemsPerPage = 12;
  private currentPage = 0;
  private scrollThreshold = 200;
  private loadingTimeout: any;

  // ViewChild para el contenedor de scroll
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;


  constructor(private router: Router, private productService: ProductosService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadInitialData()
   // this.llenarCards(); // Llama a la función para llenar las tarjetas
  }
  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruya
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Cargar datos iniciales
  loadInitialData() {
    // Aquí cargas tus datos desde el servicio
    // this.motorcycleService.getMotorcycles().subscribe(data => {
    //   this.motos = data;
    //   this.totalMotos = data.length;
    //   this.resetPagination();
    //   this.loadMoreMotos();
    // });
    this.productService.getAllProducts().subscribe(data => {
      this.motos = data;
      this.totalMotos = data.length;
      this.resetPagination();
      this.loadMoreMotos();
    });
    // Simulación temporal (reemplaza con tu lógica real)
    
  }

   // Resetear paginación
  resetPagination() {
    this.currentPage = 0;
    this.displayedMotos = [];
    this.hasReachedEnd = false;
    this.isLoading = false;
  }

  // Cargar más motocicletas
  loadMoreMotos() {
    if (this.isLoading || this.hasReachedEnd) {
      return;
    }

    this.isLoading = true;
    
    // Simular delay de red
    this.loadingTimeout = setTimeout(() => {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const newMotos = this.motos.slice(startIndex, endIndex);
      
      if (newMotos.length === 0) {
        this.hasReachedEnd = true;
      } else {
        // Agregar nuevas motocicletas con animación staggered
        newMotos.forEach((moto, index) => {
          setTimeout(() => {
            this.displayedMotos.push(moto);
            this.cdr.detectChanges();
          }, index * 100);
        });
        
        this.currentPage++;
      }
      
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 800);
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

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    
    // Detectar si está cerca del final
    if (scrollHeight - scrollPosition < this.scrollThreshold && !this.isLoading && !this.hasReachedEnd) {
      this.loadMoreMotos();
    }
  }

  // Filtrar por marca
  filterByMarca(marca: string) {
    console.log('Filtrando por marca:', marca);
    // Implementa tu lógica de filtrado aquí
    // Ejemplo:
    // this.motorcycleService.getMotorcyclesByBrand(marca).subscribe(data => {
    //   this.motos = data;
    //   this.totalMotos = data.length;
    //   this.resetPagination();
    //   this.loadMoreMotos();
    //   this.scrollToTop();
    // });
  }

  // Filtrar por categoría
  filterByCategoria(categoria: string) {
    console.log('Filtrando por categoría:', categoria);
    // Implementa tu lógica de filtrado aquí
    // Similar a filterByMarca
  }

  // Navegar al detalle
  

  // Scroll al inicio del contenedor
  scrollToTop() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  // TrackBy functions para optimización
  trackByMoto(index: number, moto: any): any {
    return moto.id || moto.modelo || index;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

}
