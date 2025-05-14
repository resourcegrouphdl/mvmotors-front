import { NgClass, NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';

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
  imports: [NgClass,NgFor],
  templateUrl: './galeria-segunda.component.html',
  styleUrl: './galeria-segunda.component.css'
})


export class GaleriaSegundaComponent implements OnInit {

  isImageVisible: boolean = false;

  productoMotocicleta: MotocicletaProduct | null = null; // Variable para almacenar el producto seleccionado
  urlIconos: string = 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2F'; // url de los iconos

  moto1:string = 'https://carsaperupoc.vtexassets.com/arquivos/ids/162749/moto-ssenda-viper-200-dkr-016001126_1.png?v=638769150636370000'; // imagenes mok de la ruleta


  submenu: subMenu[] = [
    { nombre: 'Características', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FMOTOR%20(1).png?alt=media&token=0f6ce721-3fe8-42b5-a64d-a68b9a14b85e' },
    { nombre: 'Rendimiento', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FRENDIMIENTO.png?alt=media&token=1fd45da9-c0f0-4ff2-9ce0-7c4ff47baf53' },
    { nombre: 'Suspensión', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FSUSPENSI%C3%93N.png?alt=media&token=6391926d-c68e-4051-b029-597e80065573' },
    { nombre: 'Transmisión', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FTRANSMISION.png?alt=media&token=d193fe3a-b6bb-494f-b960-d39475dc5a85' },
    { nombre: 'Dimensiones', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FDIMENSIONES.png?alt=media&token=51301fbb-c6bf-46c4-af69-f043be7848f0' },
    { nombre: 'Frenos', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FFRENOS.png?alt=media&token=98ab6089-b9ec-48f3-8534-2b0eec7b9029' }
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
     

  constructor(private productoService: ProductosService) { }

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
        { nombre: 'Cilindrada', icono: this.urlIconos +'CILINDRADA.png?alt=media&token=a225ddcd-f7ae-4e2e-9560-ac6338871239', contenido: fichaTecnica.cilindrada },
        { nombre: 'Potencia',   icono: this.urlIconos +'VELOCIDAD%20-%20RENDIMIENTO%20-%20POTENCIA%20-%20AUTONOMIA.png?alt=media&token=d4d3c59c-ed80-4332-8aa8-f0acb8cbfbef', contenido: fichaTecnica.potencia },
        { nombre: 'Torque',     icono: this.urlIconos +'TORQUE.png?alt=media&token=19e9ff62-a5ea-40b3-9acd-39de91253173', contenido: fichaTecnica.torque }
      ]

      this.conbustible = [
        { nombre: 'Combustible', icono: this.urlIconos +'COMBUSTIBLE.png?alt=media&token=4e7873a2-89cb-48eb-99ad-5256ae2b4d41', contenido: fichaTecnica.combustible },
        { nombre: 'Tanque', icono: this.urlIconos +'TANQUE.png?alt=media&token=d6bffb63-86e5-4d9b-a1b0-8f5898c9d3ed', contenido: fichaTecnica.tanque },
        { nombre: 'Rendimiento', icono: this.urlIconos +'VELOCIDAD%20-%20RENDIMIENTO%20-%20POTENCIA%20-%20AUTONOMIA.png?alt=media&token=d4d3c59c-ed80-4332-8aa8-f0acb8cbfbef', contenido: fichaTecnica.rendimiento },
        { nombre: 'Autonomía', icono: this.urlIconos +'VELOCIDAD%20-%20RENDIMIENTO%20-%20POTENCIA%20-%20AUTONOMIA.png?alt=media&token=d4d3c59c-ed80-4332-8aa8-f0acb8cbfbef', contenido: fichaTecnica.autonomia }
      ]

      this.suspencion = [
        { nombre: 'Suspensión Delantera', icono: this.urlIconos +'SUSPENSIÓN%20DELAN%20Y%20TRASE.png?alt=media&token=2d06e0fd-2219-45e1-aa4e-48336369c190', contenido: fichaTecnica.suspencionDelantera },
        { nombre: 'Suspensión Trasera',   icono: this.urlIconos +'SUSPENSIÓN%20DELAN%20Y%20TRASE.png?alt=media&token=2d06e0fd-2219-45e1-aa4e-48336369c190', contenido: fichaTecnica.suspencionTrasera }
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
        { nombre: 'Freno Trasero', icono:this.urlIconos + 'FRENOS%20DELAN%20Y%20TRASE.png?alt=media&token=bbb75c6e-bd06-4465-9260-7b0bd5ea8ec3', contenido: fichaTecnica.frenoTrasero }
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
