import { Component, inject } from '@angular/core';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';
import { NgClass } from '@angular/common';

export interface BanersModel {
  id: string;
  baner: string;
}

@Component({
  selector: 'app-baner-publicitario',
  standalone: true,
  imports: [],
  templateUrl: './baner-publicitario.component.html',
  styleUrl: './baner-publicitario.component.css',
})
export class BanerPublicitarioComponent {
  private _config = inject(ConfiguracionFrontService);

  baners: BanersModel[] = [];

  intervalId: any;
  currentIndex: number = 0;
  isImageVisible: boolean = true;

  ngOnInit(): void {
    this.getBaners();
  }

  getBaners(): void {
    this._config.getBaners().subscribe((baners) => {
      this.baners = baners;
      if (baners.length > 1) {
        this.startAutoSlide();
      }
    });
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // cada 5 segundos
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.baners.length;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}