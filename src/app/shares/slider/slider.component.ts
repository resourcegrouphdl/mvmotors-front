import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';
import { CarrucelModel } from '../../models/slides-model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [ NgFor ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements OnInit , OnDestroy {
  slides: CarrucelModel[] = []; // Lista de diapositivas
  isLoading = true; // Estado de carga
  loadedImages = 0; // Contador de imágenes cargadas
  currentSlide = 0; // Índice de la diapositiva actual
  intervalId: any;


  constructor(private _config: ConfiguracionFrontService) {}

  ngOnInit(): void {
    this._config.getSlides().subscribe((slides) => {
    this.slides = slides || [];
    console.log('Slides cargados:', this.slides); // Verifica que los datos sean correctos
    });

    this.startCarousel();
  }
  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000); // Cambia cada 5 segundos
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

 
  }



}
