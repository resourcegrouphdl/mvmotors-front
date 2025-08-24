import { Component, inject, OnInit, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ProposalService, OfficialProduct } from '../services/proposal.service';
import { AuthServiceService } from '../../acces-data-services/auth-service.service';
import { BaseProfile } from '../../models/model-auth';
import { Subject, takeUntil } from 'rxjs';

// Interfaces
export interface Proposal {
  id: string;
  uidTienda: string;
  marca: string;
  modelo: string;
  precio: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaCreacion: string;
  fechaAprobacion?: string;
  motivoRechazo?: string;
  negociaciones: Negotiation[];
}

export interface Negotiation {
  id: string;
  mensaje: string;
  autor: 'tienda' | 'financiera';
  fecha: string;
}

export interface NewProposal {
  marca: string;
  modelo: string;
  precio: string;
}

@Component({
  selector: 'app-detalles-tienda',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './detalles-tienda.component.html',
  styleUrl: './detalles-tienda.component.css',
})
export class DetallesTiendaComponent implements OnInit, OnDestroy {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthServiceService);
  public proposalService = inject(ProposalService);

  // Formulario
  formularioPropuestas: FormGroup;

  // Signals para estado del componente
  activeTab = signal<'nueva' | 'pendientes' | 'aprobadas' | 'rechazadas'>('nueva');
  showNegotiation = signal<string | null>(null);
  negotiationMessage = signal<string>('');
  usuarioLogueado = signal<BaseProfile | null>(null);
  isSubmitting = signal<boolean>(false);
  
  private destroy$ = new Subject<void>();

  constructor() {
    this.formularioPropuestas = this._fb.group({
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      precio: ['', [Validators.required, Validators.min(1)]],
    });

    // Effect para logging de cambios de estado
    effect(() => {
      const stats = this.stats;
      console.log('Estado actualizado:', stats);
    });
  }

  ngOnInit(): void {
    this._authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user) {
            this.usuarioLogueado.set(user);
            this.proposalService.initializeForStore(user.uid);
          }
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalService.stopAllListeners();
  }

  /**
   * Cambiar tab activo
   */
  setActiveTab(tab: 'nueva' | 'pendientes' | 'aprobadas' | 'rechazadas'): void {
    this.activeTab.set(tab);
  }

  /**
   * Obtener datos según el tab activo
   */
  getCurrentTabData(): (Proposal | OfficialProduct)[] {
    const currentTab = this.activeTab();
    
    switch (currentTab) {
      case 'pendientes':
        return this.proposalService.getProposalsByStatus('pendiente');
      case 'rechazadas':
        return this.proposalService.getProposalsByStatus('rechazado');
      case 'aprobadas':
        return this.proposalService.officialProducts();
      default:
        return [];
    }
  }

  /**
   * Type guard para distinguir propuestas de productos oficiales
   */
  isProposal(item: Proposal | OfficialProduct): item is Proposal {
    return 'estado' in item;
  }

  /**
   * Crear nueva propuesta
   */
  async submitProposal(): Promise<void> {
    if (!this.formularioPropuestas.valid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const user = this.usuarioLogueado();
    if (!user) {
      alert('Error: Usuario no autenticado');
      return;
    }

    this.isSubmitting.set(true);
    
    try {
      const formValues = this.formularioPropuestas.value;
      
      const newProposal: NewProposal = {
        marca: formValues.marca,
        modelo: formValues.modelo,
        precio: formValues.precio.toString(),
      };

      await this.proposalService.addProposal(newProposal, user.uid);
      
      this.formularioPropuestas.reset();
      this.activeTab.set('pendientes');
      alert('Propuesta enviada exitosamente');
      
    } catch (error) {
      console.error('Error al enviar propuesta:', error);
      alert('Error al enviar la propuesta. Inténtalo de nuevo.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Enviar negociación para propuesta rechazada
   */
  async sendNegotiation(proposalId: string): Promise<void> {
    const message = this.negotiationMessage();
    
    if (!message.trim()) return;

    try {
      await this.proposalService.addNegotiation(proposalId, message, 'tienda');
      
      this.negotiationMessage.set('');
      this.showNegotiation.set(null);
      alert('Mensaje de negociación enviado');
      
    } catch (error) {
      console.error('Error al enviar negociación:', error);
      alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    }
  }

  /**
   * Mostrar/ocultar modal de negociación
   */
  toggleNegotiation(proposalId: string | null): void {
    this.showNegotiation.set(proposalId);
    if (!proposalId) {
      this.negotiationMessage.set('');
    }
  }

  /**
   * Actualizar mensaje de negociación
   */
  updateNegotiationMessage(message: string): void {
    this.negotiationMessage.set(message);
  }

  /**
   * Manejar cambio en textarea de negociación
   */
  onNegotiationMessageChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
      this.updateNegotiationMessage(target.value);
    }
  }

  /**
   * Marcar campos como tocados para mostrar errores
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.formularioPropuestas.controls).forEach((key) => {
      this.formularioPropuestas.get(key)?.markAsTouched();
    });
  }

  // Getters para controles de formulario
  get marcaControl() {
    return this.formularioPropuestas.get('marca');
  }

  get modeloControl() {
    return this.formularioPropuestas.get('modelo');
  }

  get precioControl() {
    return this.formularioPropuestas.get('precio');
  }

  // Métodos para obtener errores de validación
  getMarcaError(): string {
    const control = this.marcaControl;
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La marca es requerida';
      if (control.errors['minlength']) return 'La marca debe tener al menos 2 caracteres';
    }
    return '';
  }

  getModeloError(): string {
    const control = this.modeloControl;
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El modelo es requerido';
      if (control.errors['minlength']) return 'El modelo debe tener al menos 2 caracteres';
    }
    return '';
  }

  getPrecioError(): string {
    const control = this.precioControl;
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El precio es requerido';
      if (control.errors['min']) return 'El precio debe ser mayor a 0';
    }
    return '';
  }

  // Métodos para clases CSS
  getTabClass(tab: string): string {
    return this.activeTab() === tab
      ? 'px-4 py-2 rounded-md font-medium transition-colors bg-blue-500 text-white'
      : 'px-4 py-2 rounded-md font-medium transition-colors text-gray-500 hover:text-gray-700';
  }

  getStatusClass(status: string): string {
    const baseClass = 'px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ';
    switch (status) {
      case 'pendiente':
        return baseClass + 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rechazado':
        return baseClass + 'bg-red-100 text-red-800 border-red-300';
      default:
        return baseClass + 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  // Métodos de utilidad para el template
  formatPrice(price: number): string {
    return this.proposalService.formatPrice(price);
  }

  formatDate(dateString: string): string {
    return this.proposalService.formatDate(dateString);
  }

  // Getters para acceder a datos del service
  get isLoading(): boolean {
    return this.proposalService.isLoading;
  }

  get hasError(): boolean {
    return this.proposalService.hasError;
  }

  get errorMessage(): string | null {
    return this.proposalService.errorMessage;
  }

  get stats() {
    return this.proposalService.stats();
  }

  clearError(): void {
    this.proposalService.clearErrors();
  }
}