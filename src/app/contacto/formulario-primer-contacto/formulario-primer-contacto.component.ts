import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { MotocicletaProduct } from '../../domain/models/Imotocicleta';
import {
  collection,
  Firestore,
  addDoc,
  doc,
  updateDoc,
  docData,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-primer-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-primer-contacto.component.html',
  styleUrl: './formulario-primer-contacto.component.css',
})
export class FormularioPrimerCOntactoComponent implements OnInit {
  tablaFirebase: string = 'clientesweb';
  _fb = inject(FormBuilder);
  _motocicletaService = inject(ProductosService);
  _firestore = inject(Firestore);
  _router = inject(Router);

  _collection = collection(this._firestore, this.tablaFirebase);

  cardVisible: boolean = false;
  motocicletaId: MotocicletaProduct | null = null;
  idMOtocicleta: string = this.motocicletaId?.id || '';
  enviado: boolean = false;

  formularioDeContacto: FormGroup;

  constructor() {
    this.formularioDeContacto = this._fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      genero: ['', Validators.required],
      preferenciaContacto: ['', Validators.required],
      horarioContacto: ['', Validators.required],
      mensaje: [''],
      producto: [''],
    });
  }

  ngOnInit(): void {
    this.recuperarProducto();
  }

  recuperarProducto() {
    this.motocicletaId = this._motocicletaService.getProducto();
    if (this.motocicletaId) {
      this.cardVisible = true;
    } else {
      this.cardVisible = false;
    }
  }
 onSubmit() {
  if (this.formularioDeContacto.valid) {
    this.enviado = true;
    console.log('Formulario enviado:', this.formularioDeContacto.value);
    this.formularioDeContacto.patchValue({
      producto: this.motocicletaId?.id || '',
    });
    // Asigna el ID de la motocicleta al cliente
    addDoc(this._collection, this.formularioDeContacto.value)
      .then(() => {
        // Navega a la página principal si se guardó correctamente
        this._router.navigate(['/home']);
        // Resetea el formulario después del envío
        this.formularioDeContacto.reset();
        this.motocicletaId = null;
        this.cardVisible = false;
        this.enviado = false;
      })
      .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert('Ocurrió un error al enviar el formulario. Intente nuevamente.');
        this.enviado = false;
      });

  } else {
    alert('Por favor, complete todos los campos requeridos.');
  }
}

}
