import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';

@Component({
  selector: 'app-slider-card',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './slider-card.component.html',
  styleUrl: './slider-card.component.css'
})
export class SliderCardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('carousel') carousel!: ElementRef;

  // Estado del slider
  slideActual = 0;
  motos: MotocicletaProduct[] = [];
  motosDestacadas: MotocicletaProduct[] = [];
  loading = false;
  error = false;
  
  // Configuración del carrusel
  private readonly CONFIG = {
    autoScrollDelay: 4500,
    transitionDuration: 700,
    slideWidth: 344, // 320px card + 24px gap
    touchThreshold: 60
  };
  
  // Control de estado
  private intervalId: any;
  private isTransitioning = false;
  private userInteracting = false;
  private touchStartX = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private productoService: ProductosService,
    private cdr: ChangeDetectorRef // AGREGAR ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductosDestacados();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.inicializarSlider(), 600);
  }

  ngOnDestroy(): void {
    this.detenerAutoScroll();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // === INICIALIZACIÓN ===

  private inicializarSlider(): void {
    if (this.tieneProductos && this.totalProductos > 1) {
      this.configurarEventos();
      this.iniciarAutoScroll();
      console.log(`Slider inicializado con ${this.totalProductos} productos`);
    }
  }

  private configurarEventos(): void {
    const container = this.carousel?.nativeElement;
    if (!container) return;

    container.style.scrollBehavior = 'smooth';
    
    // Observador de scroll con debounce
    let scrollTimeout: any;
    container.addEventListener('scroll', () => {
      if (this.isTransitioning) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.actualizarSlideActual();
      }, 100);
    });

    // Responsive
    window.addEventListener('resize', () => {
      if (!this.isTransitioning && this.tieneProductos) {
        this.navegarASlide(this.slideActual);
      }
    });
  }

  // === CARGA DE DATOS CORREGIDA ===

  private cargarProductosDestacados(): void {
    console.log('Iniciando carga de productos destacados...');
    this.loading = true;
    this.error = false;
    this.cdr.markForCheck(); // FORZAR DETECCIÓN DE CAMBIOS

    this.productoService.getProductosDestacados()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          console.log('Loading finalizado, estado:', { loading: this.loading, productos: this.motos.length });
          this.cdr.detectChanges(); // FORZAR DETECCIÓN DE CAMBIOS
        })
      )
      .subscribe({
        next: (productos) => {
          console.log('Productos recibidos:', productos);
          console.log('Cantidad de productos:', productos.length);
          console.log('Primer producto:', productos[0]);
          
          this.motos = [...productos]; // CREAR NUEVA REFERENCIA
          this.motosDestacadas = [...productos]; // CREAR NUEVA REFERENCIA
          this.loading = false;
          
          console.log(`${productos.length} productos destacados cargados`);
          console.log('Estado actual:', { 
            loading: this.loading, 
            error: this.error, 
            motosLength: this.motos.length,
            tieneProductos: this.tieneProductos
          });
          
          this.cdr.detectChanges(); // FORZAR DETECCIÓN DE CAMBIOS
          
          // Inicializar slider después de cargar datos
          setTimeout(() => {
            this.inicializarSlider();
          }, 100);
        },
        error: (error) => {
          console.error('Error cargando productos:', error);
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges(); // FORZAR DETECCIÓN DE CAMBIOS
          this.intentarUsarCache();
        }
      });
  }

  private intentarUsarCache(): void {
    console.log('Intentando usar caché...');
    if (this.productoService.tieneDatosEnCache()) {
      const productosCache = this.productoService.getProductosDestacadosSync();
      console.log('Productos desde caché:', productosCache);
      
      this.motos = [...productosCache]; // CREAR NUEVA REFERENCIA
      this.motosDestacadas = [...productosCache]; // CREAR NUEVA REFERENCIA
      this.error = false;
      this.loading = false;
      
      console.log('Datos cargados desde caché:', this.motos.length);
      this.cdr.detectChanges(); // FORZAR DETECCIÓN DE CAMBIOS
    } else {
      console.log('No hay datos en caché disponibles');
    }
  }

  recargarProductos(): void {
    console.log('Recargando productos...');
    this.detenerAutoScroll();
    this.cargarProductosDestacados();
  }

  // === MÉTODO DE DEBUG MEJORADO ===
  
  debugEstado(): void {
    console.group('=== DEBUG SLIDER ===');
    console.log('Estado del componente:', {
      loading: this.loading,
      error: this.error,
      motosLength: this.motos?.length || 0,
      motosDestacadasLength: this.motosDestacadas?.length || 0,
      tieneProductos: this.tieneProductos,
      totalProductos: this.totalProductos,
      slideActual: this.slideActual,
      autoScrollActivo: this.autoScrollActivo,
      isTransitioning: this.isTransitioning,
      userInteracting: this.userInteracting
    });
    
    console.log('Productos cargados:', this.motos);
    console.log('ViewChild carousel:', this.carousel);
    console.log('Elemento DOM carousel:', this.carousel?.nativeElement);
    
    if (this.motos && this.motos.length > 0) {
      console.log('Primer producto:', this.motos[0]);
      console.log('Estructura primer producto:', Object.keys(this.motos[0]));
    }
    
    // Verificar servicio
    console.log('Estado del servicio:', {
      tieneDatosEnCache: this.productoService.tieneDatosEnCache(),
      productosSync: this.productoService.getProductosDestacadosSync()?.length || 0
    });
    
    console.groupEnd();
  }

  // === AUTO-SCROLL ===

  private iniciarAutoScroll(): void {
    this.detenerAutoScroll();
    
    if (this.userInteracting || this.totalProductos <= 1) return;

    this.intervalId = setInterval(() => {
      if (!this.userInteracting && !this.isTransitioning) {
        const siguienteSlide = (this.slideActual + 1) % this.totalProductos;
        this.transicionarASlide(siguienteSlide);
      }
    }, this.CONFIG.autoScrollDelay);
  }

  private detenerAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // === NAVEGACIÓN ===

  private transicionarASlide(indice: number): void {
    if (this.isTransitioning || !this.carousel?.nativeElement) return;
    if (indice < 0 || indice >= this.totalProductos) return;

    this.isTransitioning = true;
    const container = this.carousel.nativeElement;
    const targetScroll = this.CONFIG.slideWidth * indice;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    this.slideActual = indice;

    // Resetear flag después de la transición
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.CONFIG.transitionDuration);
  }

  scroll(direccion: 'left' | 'right'): void {
    if (this.isTransitioning) return;

    this.pausarInteraccion();
    
    const nuevoIndice = direccion === 'right' 
      ? (this.slideActual + 1) % this.totalProductos
      : this.slideActual === 0 ? this.totalProductos - 1 : this.slideActual - 1;
    
    this.transicionarASlide(nuevoIndice);
    this.reanudarDespuesDe(3000);
  }

  navegarASlide(indice: number): void {
    if (indice === this.slideActual || this.isTransitioning) return;
    
    this.pausarInteraccion();
    this.transicionarASlide(indice);
    this.reanudarDespuesDe(4000);
  }

  private actualizarSlideActual(): void {
    const container = this.carousel?.nativeElement;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const slideCalculado = Math.round(scrollLeft / this.CONFIG.slideWidth);
    const nuevoSlide = Math.max(0, Math.min(slideCalculado, this.totalProductos - 1));
    
    if (nuevoSlide !== this.slideActual) {
      this.slideActual = nuevoSlide;
    }
  }

  // === TOUCH EVENTS ===

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.pausarInteraccion();
  }

  handleTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const diferencia = this.touchStartX - touchEndX;
    
    if (Math.abs(diferencia) > this.CONFIG.touchThreshold) {
      const direccion = diferencia > 0 ? 'right' : 'left';
      this.scroll(direccion);
    } else {
      this.reanudarDespuesDe(1500);
    }
  }

  onMouseEnter(): void {
    this.pausarInteraccion();
  }

  onMouseLeave(): void {
    this.reanudarDespuesDe(800);
  }

  // === CONTROL DE INTERACCIÓN ===

  private pausarInteraccion(): void {
    this.userInteracting = true;
    this.detenerAutoScroll();
  }

  private reanudarDespuesDe(delay: number): void {
    setTimeout(() => {
      this.userInteracting = false;
      this.iniciarAutoScroll();
    }, delay);
  }

  // === NAVEGACIÓN Y UTILIDADES ===

  verDetalleProducto(producto: MotocicletaProduct): void {
    this.productoService.setProducto(producto);
    this.router.navigate(['/detalles-tecnicos']);
  }

  goToCatalogo(): void {
    this.router.navigate(['/galeria']);
  }

  getImagenPrincipal(producto: MotocicletaProduct): string {
    return producto.imagen_principal || 
           (producto.imagenes?.[0]) ||
           '/assets/images/moto-default.jpg';
  }

  getPrecioFormateado(producto: MotocicletaProduct, campo: 'precioWeb' | 'precioInicial' = 'precioWeb'): string {
    const precio = campo === 'precioWeb' ? producto.precioWeb : producto.precioInicial;
    
    if (!precio) {
      return campo === 'precioInicial' ? 'Consultar' : 'No disponible';
    }

    if (precio.includes('S/') || precio.includes('$')) {
      return precio;
    }

    const numero = parseInt(precio.replace(/\D/g, ''));
    if (!isNaN(numero) && numero > 0) {
      return `S/ ${numero.toLocaleString('es-PE')}`;
    }

    return precio;
  }

  trackByProductoId(index: number, producto: MotocicletaProduct): string {
    return producto.id;
  }

  // === GETTERS ===

  get tieneProductos(): boolean {
    return this.motos?.length > 0;
  }

  get totalProductos(): number {
    return this.motos?.length || 0;
  }

  get puedeHacerScroll(): boolean {
    return this.totalProductos > 1;
  }

  get autoScrollActivo(): boolean {
    return !!this.intervalId;
  }

  // === DEBUG ===

  getEstadoSlider(): object {
    return {
      slides: this.totalProductos,
      actual: this.slideActual,
      autoScroll: this.autoScrollActivo,
      transicionando: this.isTransitioning,
      interactuando: this.userInteracting,
      loading: this.loading,
      error: this.error
    };
  }
}