import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';

export interface subMenu {

  nombre: string;
  icono: string;

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

  moto1:string = 'https://carsaperupoc.vtexassets.com/arquivos/ids/162749/moto-ssenda-viper-200-dkr-016001126_1.png?v=638769150636370000'

  iconos: string[] = ["motor","rendimiento","suspencion","transmision","dimenciones","frenos"]

  submenu: subMenu[] = [
    { nombre: 'Características', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FMOTOR%20(1).png?alt=media&token=0f6ce721-3fe8-42b5-a64d-a68b9a14b85e' },
    { nombre: 'Rendimiento', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FRENDIMIENTO.png?alt=media&token=1fd45da9-c0f0-4ff2-9ce0-7c4ff47baf53' },
    { nombre: 'Suspensión', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FSUSPENSI%C3%93N.png?alt=media&token=6391926d-c68e-4051-b029-597e80065573' },
    { nombre: 'Transmisión', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FTRANSMISION.png?alt=media&token=d193fe3a-b6bb-494f-b960-d39475dc5a85' },
    { nombre: 'Dimensiones', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FDIMENSIONES.png?alt=media&token=51301fbb-c6bf-46c4-af69-f043be7848f0' },
    { nombre: 'Frenos', icono: 'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/iconos%2FFRENOS.png?alt=media&token=98ab6089-b9ec-48f3-8534-2b0eec7b9029' }
  ]

  constructor(private productoService: ProductosService) { }

  ngOnInit(): void {
    this.recuperarProducto()
    // Activa la animación después de un breve retraso
    setTimeout(() => {
      this.isImageVisible = true;
    }, 100); // Retraso de 100ms para que la animación sea visible
  }
  caracteristicas(){
    
  }

  activeIndex = 0;

  secciones = [
    'Contenido de la Sección 1',
    'Contenido de la Sección 2',
    'Contenido de la Sección 3',
    'Contenido de la Sección 4',
    'Contenido de la Sección 5',
    'Contenido de la Sección 6',
  ];

  setActive(index: number) {
    this.activeIndex = index;
  }

  recuperarProducto() {
    const producto = this.productoService.getProducto(); // Obtener el producto desde el servicio
    if (producto) {
      this.productoMotocicleta = producto; // Asignar el producto a la variable local
      console.log('Producto recuperado:', producto);
      // Aquí puedes hacer lo que necesites con el producto recuperado
    } else {
      console.log('No hay producto seleccionado.');
    }
  }
}
