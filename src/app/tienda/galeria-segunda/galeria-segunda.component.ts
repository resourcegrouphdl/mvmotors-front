import { NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';
import { Route, Router, Routes } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
export interface subMenu {

  nombre: string;
  icono: string;

}

export interface subMenu2 {
  nombre: string;
  icono: string;
  contenido: string;

}

@Component({
  selector: 'app-galeria-segunda',
  standalone: true,
  imports: [NgClass, RouterLink,NgStyle],
  templateUrl: './galeria-segunda.component.html',
  styleUrl: './galeria-segunda.component.css'
})


export class GaleriaSegundaComponent implements OnInit {

  isImageVisible: boolean = false;
  colores: string[] = ['#FF5733', '#33FF57', '#3357FF']; // Colores para el fondo de la ruleta

  productoMotocicleta: MotocicletaProduct | null = null; // Variable para almacenar el producto seleccionado
  urlIconos: string = 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2F'; // url de los iconos

  moto1:string = 'https://carsaperupoc.vtexassets.com/arquivos/ids/162749/moto-ssenda-viper-200-dkr-016001126_1.png?v=638769150636370000'; // imagenes mok de la ruleta


  submenu: subMenu[] = [
    { nombre: 'Características', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FMOTOR%20(1).png?alt=media&token=0f6ce721-3fe8-42b5-a64d-a68b9a14b85e' },
    { nombre: 'Rendimiento', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FRENDIMIENTO.png?alt=media&token=1fd45da9-c0f0-4ff2-9ce0-7c4ff47baf53' },
    { nombre: 'Suspensión', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FSUSPENSI%C3%93N.png?alt=media&token=6391926d-c68e-4051-b029-597e80065573' },
    { nombre: 'Transmisión', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FTRANSMISION.png?alt=media&token=d193fe3a-b6bb-494f-b960-d39475dc5a85' },
    { nombre: 'Dimensiones', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FDIMENSIONESC.png?alt=media&token=3b8d1b06-c0ab-4e76-b160-4a2fe5a500bf' },
    { nombre: 'Ruedas', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FRUEDAS.png?alt=media&token=bcb6b2d0-1fdf-4154-bad6-50243f98e10e' }
  ]


  motor: subMenu2[] = []
  conbustible: subMenu2[] = []
  suspencion: subMenu2[] = []
  transmision: subMenu2[] = []
  dimenciones: subMenu2[] = []
  freno: subMenu2[] = []


    @ViewChild('carousel') carousel!: ElementRef;
    private intervalId: any;
    private touchStartX = 0;
    private touchEndX = 0;


  constructor(private productoService: ProductosService ,private router: Router) { }

  ngOnInit(): void {

    this.inicializarComponente();
  }




  activeIndex = 0;

  secciones: any[] = [
  ];



  setActive(index: number) {
    this.activeIndex = index;
  }

  async inicializarComponente() {
    // Esperar a que se recupere el producto
    await this.recuperarProducto();


    // Verificar si productoMotocicleta tiene contenido
    if (this.productoMotocicleta) {
      // Ejecutar settearCaracteristicas solo si productoMotocicleta tiene datos
      await this.settearCaracteristicas();

      // Activar la animación después de un breve retraso
      setTimeout(() => {
        this.isImageVisible = true;
      }, 100); // Retraso de 100ms para que la animación sea visible
    } else {

      console.log('No se pudo recuperar el producto.');
      this.router.navigate(['/galeria']);
    }
  }

  async recuperarProducto(): Promise<void> {
    const producto = this.productoService.getProducto(); // Obtener el producto desde el servicio
    if (producto) {
      this.productoMotocicleta = producto; // Asignar el producto a la variable local
      console.log('Producto recuperado:', producto);
    } else {
      console.log('No hay producto seleccionado.');
    }
  }

  async settearCaracteristicas() {
    const fichaTecnica =await this.productoMotocicleta?.fichaTecnica;
    console.log(fichaTecnica);

    if (!fichaTecnica) {
      console.log('Ficha técnica no disponible.');
      return;
    }


      this.motor = [
        { nombre: 'Motor', icono: this.urlIconos +'CILINDRADA.png?alt=media&token=a225ddcd-f7ae-4e2e-9560-ac6338871239', contenido: fichaTecnica.motor },
        { nombre: 'Arranque', icono: this.urlIconos +'CILINDRADA.png?alt=media&token=a225ddcd-f7ae-4e2e-9560-ac6338871239', contenido: fichaTecnica.arranque },
        { nombre: 'Potencia',   icono: this.urlIconos +'VELOCIDAD%20-%20RENDIMIENTO%20-%20POTENCIA%20-%20AUTONOMIA.png?alt=media&token=d4d3c59c-ed80-4332-8aa8-f0acb8cbfbef', contenido: fichaTecnica.potencia },
        { nombre: 'Cilindrada',     icono: this.urlIconos +'TORQUE.png?alt=media&token=19e9ff62-a5ea-40b3-9acd-39de91253173', contenido: fichaTecnica.cilindrada }
      ]

      this.conbustible = [

        { nombre: 'Tanque', icono: this.urlIconos +'TANQUE.png?alt=media&token=d6bffb63-86e5-4d9b-a1b0-8f5898c9d3ed', contenido: fichaTecnica.tanque },
        { nombre: 'Rendimiento', icono: this.urlIconos +'VELOCIDAD%20-%20RENDIMIENTO%20-%20POTENCIA%20-%20AUTONOMIA.png?alt=media&token=d4d3c59c-ed80-4332-8aa8-f0acb8cbfbef', contenido: fichaTecnica.rendimiento },

      ]

      this.suspencion = [
        { nombre: 'Suspensión Delantera', icono: this.urlIconos +'SUSPENSIÓN%20DELAN%20Y%20TRASE.png?alt=media&token=2d06e0fd-2219-45e1-aa4e-48336369c190', contenido: fichaTecnica.suspencionDelantera },
        { nombre: 'Suspensión Posterior',   icono: this.urlIconos +'SUSPENSIÓN%20DELAN%20Y%20TRASE.png?alt=media&token=2d06e0fd-2219-45e1-aa4e-48336369c190', contenido: fichaTecnica.suspencionTrasera }
      ]
      this.transmision = [
        { nombre: 'Transmisión', icono: this.urlIconos +'TRANSMISIÓN.png?alt=media&token=19865ff9-3a95-4f51-b857-43b16e1f17a9', contenido: fichaTecnica.transmision },
        { nombre: 'Velocidad Máxima', icono:this.urlIconos + 'TRANSMISIÓN.png?alt=media&token=19865ff9-3a95-4f51-b857-43b16e1f17a9', contenido: fichaTecnica.velocidadMaxima }

      ]
      this.dimenciones = [
        { nombre: 'Peso', icono: this.urlIconos +'PESO.png?alt=media&token=ae9068f3-4971-4ef4-9796-89290c1330e1', contenido: fichaTecnica.peso },
        { nombre: 'Dimensiones', icono: this.urlIconos +'DIMENSIONES.png?alt=media&token=6d467050-a1f2-4abe-9e38-3675642ac583', contenido: fichaTecnica.dimenciones }

      ]
      this.freno = [
        { nombre: 'Freno Delantero', icono: this.urlIconos +'FRENOS%20DELAN%20Y%20TRASE.png?alt=media&token=bbb75c6e-bd06-4465-9260-7b0bd5ea8ec3', contenido: fichaTecnica.frenoDelantero },
        { nombre: 'Freno Posterior', icono:this.urlIconos + 'FRENOS%20DELAN%20Y%20TRASE.png?alt=media&token=bbb75c6e-bd06-4465-9260-7b0bd5ea8ec3', contenido: fichaTecnica.frenoTrasero },
        { nombre: 'Rueda Delantera', icono:this.urlIconos + 'RUEDASBLAK.png?alt=media&token=d785050f-b1d9-4eee-a153-ce3996870f99', contenido: fichaTecnica.ruedaDelantera },
        { nombre: 'Rueda Posterior', icono:this.urlIconos + 'RUEDASBLAK.png?alt=media&token=d785050f-b1d9-4eee-a153-ce3996870f99', contenido: fichaTecnica.ruedaTrasera },

      ]

      this.secciones = [
        this.motor,
        this.conbustible,
        this.suspencion,
        this.transmision,
        this.dimenciones,
        this.freno
      ];

      console.log('Características seteadas:', this.secciones);

  }


  ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  startAutoScroll(): void {
    this.intervalId = setInterval(() => {
      this.scroll('right');
    }, 5000); // Cambia cada 3 segundos
  }

  stopAutoScroll(): void {
    clearInterval(this.intervalId);
  }

  scroll(direction: 'left' | 'right'): void {
    const container = this.carousel.nativeElement;
    const scrollAmount = 300;
    container.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  }

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    if (this.touchEndX < this.touchStartX) {
      this.scroll('right');
    } else if (this.touchEndX > this.touchStartX) {
      this.scroll('left');
    }
  }


  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

}
