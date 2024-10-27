import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfiguracionFrontService } from '../../acces-data-services/configuracion-front.service';
import { catchError, from, of, tap } from 'rxjs';
import { SlidesModel } from '../../models/slides-model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-slide-admin',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor],
  templateUrl: './slide-admin.component.html',
  styleUrl: './slide-admin.component.css',
})
export class SlideAdminComponent {
  sliderAdminForm: FormGroup;

  slideTable:SlidesModel[] = [];

  selectedSlideId: string = '';

  constructor(
    private _fb: FormBuilder,
    private _config: ConfiguracionFrontService
  ) {
    this.sliderAdminForm = this._fb.group({
      imageUrl: ['' ],
      author: ['', Validators.required],
      title: ['', Validators.required],
      dtopic: ['', Validators.required],
      description: ['', Validators.required],
      shortDescription: ['', Validators.required],
      id: [''],
    });
  }

  ngOnInit(): void {
    this._config
      .getSlides()
      .pipe(
        tap((slides) => {
          if (slides && slides.length > 0) {
            console.log('Slides cargados');
            console.log(slides);
            this.slideTable = slides;

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


  onSubmit() {
    console.log(this.sliderAdminForm.value);
    const slide = this.sliderAdminForm.value;
    if (this.selectedSlideId) {
      this._config.putSlide(slide, this.selectedSlideId);
    } else {
      this._config.createSlide(slide);
    }
   
  }

  editar(slide: any): void {
    this.selectedSlideId = slide.id;
    console.log('Slide seleccionado:', slide);
    this.sliderAdminForm.setValue(slide);

  }
}
