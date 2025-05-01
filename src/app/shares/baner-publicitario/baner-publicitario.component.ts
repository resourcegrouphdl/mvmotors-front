import { Component } from '@angular/core';

@Component({
  selector: 'app-baner-publicitario',
  standalone: true,
  imports: [],
  templateUrl: './baner-publicitario.component.html',
  styleUrl: './baner-publicitario.component.css'
})
export class BanerPublicitarioComponent {

  currentImageIndex: number = 0;
  intervalId: any;
  isImageVisible: boolean = true;


  publicidad:string[] = ["https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/publicidad%2FPUBLICIDAD%201-100.jpg?alt=media&token=4c158e47-41a1-4f08-bf3d-9d5918f67a03",
    "https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/publicidad%2FPUBLICIDAD%202-100.jpg?alt=media&token=c2819ed1-dc7f-4281-9bdf-c9e123cea72f"
  ] 

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

}
