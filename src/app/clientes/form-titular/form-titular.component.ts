import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { FormserviceService } from '../data-acces/services/formservice.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { IProvincias, Iregiones, PERU } from '../data-acces/peruregions';

@Component({
  selector: 'app-form-titular',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-titular.component.html',
  styleUrl: './form-titular.component.css'
})
export class FormTitularComponent implements OnInit {


  peruRegions:Iregiones[] = PERU;
  provincias: IProvincias[] = [];
  distritos: string[] = [];
  
  selectedDepartamento: string = '';
  selectedProvincia: string = '';
  selectedDistrito: string = '';
  selectedRadioButtons: string = '';

  formTitular: FormGroup ;
  isInvalidDate: boolean = false;
  licenciaStatus: any;

  constructor(private _fb:FormBuilder , private _formService: FormserviceService, private _router: Router, private cdr: ChangeDetectorRef) {

    this.formTitular = this._fb.group({
      nombre: ['',(Validators.required, Validators.minLength(3))],
      documentType: ['',(Validators.required, Validators.minLength(3))],
      documentNumber: ['',(Validators.required, Validators.minLength(3))],
      estadoCivil: ['',(Validators.required, Validators.minLength(3))],
      email: ['',(Validators.required, Validators.email)],
      departamento: ['',(Validators.required, Validators.minLength(3))],
      provincia: ['', (Validators.required, Validators.minLength(3))],
      distrito: ['', (Validators.required, Validators.minLength(3))],
      direccion: ['', (Validators.required, Validators.minLength(3))],
      fechaNacimiento: ['', (Validators.required, Validators.minLength(3))],
      telefono1: ['', (Validators.required, Validators.minLength(3))],
      telefono2: ['', (Validators.required, Validators.minLength(3))],
      licenciaStatus: ['', (Validators.required)],
      licenciaConducir: ['', (Validators.required, Validators.minLength(3))],
      dniFrenteuRL: ['',  (Validators.required, Validators.minLength(3))],
      dniReversoURL: ['', (Validators.required, Validators.minLength(3))],
      reciboDeServicioURL: ['', (Validators.required, Validators.minLength(3))],
      licConducirFrenteURL: ['', (Validators.required, Validators.minLength(3))],
      licConducirReversoURL: ['', (Validators.required, Validators.minLength(3))],
      fotoCasaURL: ['', (Validators.required, Validators.minLength(3))],
      serlfieURL: ['', (Validators.required, Validators.minLength(3))],
    });
   }

  ngOnInit(): void {
    initFlowbite();

    this.formTitular.get('licenciaStatus')!.valueChanges.subscribe(value => {
      this.selectedRadioButtons = value;
      if (value === 'si') {
        this.formTitular.get('licenciaConducir')!.setValidators([Validators.required]);
      } else {
        this.formTitular.get('licenciaConducir')!.clearValidators();
      };
      this.formTitular.get('licenciaConducir')!.updateValueAndValidity();
      this.cdr.markForCheck();
    });

  }


   saveSectionOne(){
    console.log('Form Data:', this.formTitular.value);
    // Aquí puedes manejar el envío del formulario

    this._formService.saveFormTiular(this.formTitular.value);
    this._router.navigate(['cliente/clientes']);
    
    toast('datos guardados');
    }

    consultarDniApi(){
      toast('Consultando API');
      
    }

    
  
    

    onDepartamentoChange(departamento: string) {
      this.selectedDepartamento = departamento;
      this.provincias = this.peruRegions.find(d => d.departamento === departamento)?.provincias || [];
      this.distritos = [];  // Reiniciar distritos cuando se cambia de departamento
      this.selectedProvincia = '';
    }
  
    onProvinciaChange(provincia: string) {
      this.selectedProvincia = provincia;
      this.distritos = this.provincias.find(p => p.provincia === provincia)?.distritos || [];
    }

   
}