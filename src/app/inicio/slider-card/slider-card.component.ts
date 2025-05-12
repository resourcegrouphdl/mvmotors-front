import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';

@Component({
  selector: 'app-slider-card',
  standalone: true,
  imports: [NgFor],
  templateUrl: './slider-card.component.html',
  styleUrl: './slider-card.component.css'
})
export class SliderCardComponent implements AfterViewInit, OnDestroy,OnInit {

  @ViewChild('carousel') carousel!: ElementRef;
  private intervalId: any;
  private touchStartX = 0;
  private touchEndX = 0;


  constructor(private router:Router ,private _config:ConfiguracionFrontService) { 

  }
  ngOnInit(): void {
   
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

  motos = [
    { nombre: 'JCH WORKMAN 150', precio: 1300, imagen: 'https://carsaperupoc.vtexassets.com/arquivos/ids/162749/moto-ssenda-viper-200-dkr-016001126_1.png?v=638769150636370000' },
    { nombre: 'KTM DUKE 200', precio: 7500, imagen: 'https://www.motocorp.pe/wp-content/uploads/2024/04/MATE-AZUL-SF250-sf-e1712851653377.png' },
    { nombre: 'HERO IGNITOR 125', precio: 1300, imagen: 'https://api-motos.daytonamotos.com/files/images/full-X6bISv3KcH-1719258315.png?width=450' }
  ];

  currentIndex = 0;

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.motos.length) % this.motos.length;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.motos.length;
  }

  goToCatalogo(): void {
    // Lógica para redirigir al catálogo de motos
    console.log('Ir al catálogo de motos');
    this.router.navigate (['/motos-seminuevas']);
  }

  

}
