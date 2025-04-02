import { Component, OnInit } from '@angular/core';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';
import { catchError, of, tap } from 'rxjs';
import { CarrucelModel, SlidesModel } from '../../models/slides-model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements OnInit {
  public slides: CarrucelModel[] = [];

  constructor(private _config: ConfiguracionFrontService) {}

  ngOnInit(): void {
    this._config
      .getSlides()
      .pipe(
        tap((slides) => {
          if (slides && slides.length > 0) {
            this.slides = slides;

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



  currentIndex = 0;
  isLoading = true;

  trackByIndex(index: number, item: any) {
    return index;
  }

  hideLoader() {
    this.isLoading = false;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }
  

}
