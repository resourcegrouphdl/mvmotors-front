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

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements AfterViewInit {
  
  
  
  

  public slides = [
    {
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/slider%2FKTM-RC-200b.jpg?alt=media&token=664f738c-1eae-4744-87ed-d738af19a66d',
      author: 'Indian',
      title: 'Moto Custom',
      dtopic: 'Otra moto chevere',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      shortDescription: 'Breve reseña de la imagen',
    },
    {
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/slider%2Fduke-200.webp?alt=media&token=53202855-353f-4c0c-be15-33914ad93b06',
      author: 'KTM Motos',
      title: 'Duke 200',
      dtopic: 'Está bien chevere',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      shortDescription: 'Breve reseña de la imagen',
    },
    {
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/slider%2FMoto_JCH_Volt_150.jpg?alt=media&token=9657c224-4dc9-4c60-9cfb-7d7e233f82d4',
      author: 'KTM',
      title: 'Otra KTM',
      dtopic: 'Otra moto chevere',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium',
      shortDescription: 'Breve reseña de la imagen',
    },
    {
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/motoya-form.appspot.com/o/slider%2Fmoto-custom-3.webp?alt=media&token=ac7929f0-8519-42a7-9332-4c447c17acb5',
      author: 'Indian',
      title: 'Moto Custom',
      dtopic: 'Para viajar',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      shortDescription: 'Breve reseña de la imagen',
    },
  ];


  thumbnails = [...this.slides];  // Copia de las imágenes para los thumbnails
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
