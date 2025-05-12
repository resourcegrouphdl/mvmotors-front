import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';
import { CarrucelModel } from '../../models/slides-model';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [ NgFor, NgIf, NgClass],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements OnInit  {


  
  slides: CarrucelModel[] = [];
  currentIndex = 0;
  intervalId: any;

  constructor(private _config: ConfiguracionFrontService) {}

  ngOnInit(): void {
    this._config.getSlides().subscribe((slides) => {
      this.slides = slides;
      this.startAutoSlide();
    });
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // cada 5 segundos
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }



}
