import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';

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

  motos : MotocicletaProduct[] =[];



  constructor(private router:Router ,private productoService:ProductosService) { 

  }
  ngOnInit(): void {
   this.llenarCards();
  }


  
   
  

  llenarCards(){
    this.productoService.getAllProducts().subscribe((data) => {
      this.motos = data;
      console.log(this.motos);
    });
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

  

  

  goToCatalogo(): void {
    // Lógica para redirigir al catálogo de motos
    console.log('Ir al catálogo de motos');
    this.router.navigate (['/galeria']);
  }

  

  

}
