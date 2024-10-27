import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { toast } from 'ngx-sonner';
import { RouterLink } from '@angular/router';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';
import { catchError, of, tap } from 'rxjs';
import { SlidesModel } from '../../models/slides-model';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements  OnInit , OnDestroy {

 public slides:SlidesModel[] = []

 thumbnails:any[]=[];

  constructor(private _config: ConfiguracionFrontService) {}

  ngOnInit(): void {
    this._config
      .getSlides()
      .pipe(
        tap((slides) => {
          if (slides && slides.length > 0) {
           
            this.slides = slides;
            this.thumbnails = [...slides]; // Copia de las imágenes para los thumbnails

          //  this.sliderAdminForm.setValue(slides); // Asignamos directamente si el formato es correcto
          } else {
            console.log('No slides data available');
          }
        }),
        catchError((error) => {
          console.error('Error CARGANDO SLIDES:', error);
          // this.showErrorMessage('No se pudieron cargar los slides. Por favor, inténtelo de nuevo más tarde.');
          return of([]); // Devuelve un array vacío si hay un error
        })
      )
      .subscribe();
  }
  
  
  
  

 
    
  
    // Copia de las imágenes para los thumbnails
  // Métodos de control del carrusel (ya definidos en la lógica original)

  slidecontrol: string = '';

  @ViewChild('itemTUmbnail') itemThumbnail!: ElementRef;
  @ViewChild('carousel') carousel!: ElementRef;
  @ViewChild('list') list!: ElementRef;
  @ViewChild('thumbnail') thumbnail!: ElementRef;
  @ViewChild('time') time!: ElementRef;

  currentSlideIndex: number = 0;
  timeRunning = 3000;
  timeAutoNext = 7000;
  runTimeOut: any;
  runNextAuto: any;

  ngAfterViewInit(): void {
    this.runNextAuto = setTimeout(() => {
      this.nextSlide();
    }, this.timeAutoNext);
  }
  nextSlide(): void {
    this.showSlider('next');
  }
  prevSlide(): void {
    this.showSlider('prev');
  }

  showSlider( type:string ) :void {
    const sliderItems = this.list.nativeElement.querySelectorAll('.item');
    const thumbnailItems = this.thumbnail.nativeElement.querySelectorAll('.item');

    if (type === 'next') {
      // Mover al siguiente slide
      this.slides.push(this.slides.shift()!);  // Mueve el primer elemento al final
      this.thumbnails.push(this.thumbnails.shift()!);  // Lo mismo con las miniaturas
      this.carousel.nativeElement.classList.add('next');
    } else {
      // Mover al slide anterior
      this.slides.unshift(this.slides.pop()!);  // Mueve el último elemento al principio
      this.thumbnails.unshift(this.thumbnails.pop()!);  // Lo mismo con las miniaturas
      this.carousel.nativeElement.classList.add('prev');
    }


    clearTimeout(this.runTimeOut);
    this.runTimeOut = setTimeout(() => {
      this.carousel.nativeElement.classList.remove('next');
      this.carousel.nativeElement.classList.remove('prev');
    }, this.timeRunning);

    clearTimeout(this.runNextAuto);
    this.runNextAuto = setTimeout(() => {
      this.nextSlide();
    }, this.timeAutoNext);
  

  }

  ngOnDestroy(): void {
    // Limpiar los temporizadores al destruir el componente
    clearTimeout(this.runNextAuto);
    clearTimeout(this.runTimeOut);
  }

}
