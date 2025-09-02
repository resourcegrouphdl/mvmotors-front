import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { Router } from '@angular/router';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

interface ClienteDetalle {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  email?: string;
  estado: EstadoCliente;
  porcentajeAvance: number;
  fechaUltimaActualizacion: Date;
  tipoCliente: 'titular' | 'fiador';
  ocupacion?: string;
  direccion?: string;
  ingresos?: number;
  precioMoto?: number;
  cuotaMensual?: number;
  plazoMeses?: number;
  vendedor?: {
    nombre: string;
    tienda: string;
  };
}

interface TimelineItem {
  etapa: string;
  descripcion: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado: 'completado' | 'en-progreso' | 'pendiente' | 'bloqueado';
}

interface TabItem {
  id: string;
  label: string;
  active: boolean;
  count?: number;
}

interface DocumentoItem {
  tipo: string;
  estado: 'pendiente' | 'subido' | 'validado' | 'rechazado';
  fechaSubida?: string;
  observaciones?: string;
}

interface EvidenciaItem {
  tipo: string;
  url: string;
  miniatura?: string;
  fecha: string;
  descripcion?: string;
}

enum EstadoCliente {
  NUEVO = 'nuevo',
  EN_EVALUACION = 'en_evaluacion',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  DOCUMENTOS_PENDIENTES = 'documentos_pendientes',
  ENTREVISTAS = 'entrevistas',
  CERRADO = 'cerrado',
}

@Component({
  selector: 'app-client-detail-modal',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, ProgressBarComponent],
  templateUrl: './client-detail-modal.component.html',
  styleUrl: './client-detail-modal.component.css',
})
export class ClientDetailModalComponent {
  // ================================================================
  // DEPENDENCY INJECTION
  // ================================================================

  private router = inject(Router);

  // ================================================================
  // INPUTS Y OUTPUTS
  // ================================================================

  @Input() isOpen: boolean = false;
  @Input() cliente: ClienteDetalle | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() editCliente = new EventEmitter<string>();
  @Output() viewFullDetail = new EventEmitter<string>();

  // ================================================================
  // SIGNALS Y STATE
  // ================================================================

  tabItems = signal<TabItem[]>([
    { id: 'resumen', label: 'Resumen', active: true },
    { id: 'timeline', label: 'Timeline', active: false },
    { id: 'documentos', label: 'Documentos', active: false, count: 8 },
    { id: 'evidencias', label: 'Evidencias', active: false, count: 3 },
  ]);

  timelineItems = signal<TimelineItem[]>([
    {
      etapa: 'Evaluación Inicial',
      descripcion: 'Cliente registrado y evaluación preliminar aprobada',
      fechaFin: '2024-12-15T09:30:00',
      estado: 'completado',
    },
    {
      etapa: 'Ficha Completa',
      descripcion: 'Datos completos del titular y fiador registrados',
      fechaFin: '2024-12-15T14:15:00',
      estado: 'completado',
    },
    {
      etapa: 'Carta de Aprobación',
      descripcion: 'Generando carta de aprobación para envío al cliente',
      fechaInicio: '2024-12-22T09:00:00',
      estado: 'en-progreso',
    },
    {
      etapa: 'Subida de Voucher',
      descripcion: 'Cliente debe subir comprobante de pago inicial',
      estado: 'pendiente',
    },
  ]);

  documentos = signal<DocumentoItem[]>([
    { tipo: 'DNI Titular', estado: 'validado', fechaSubida: '2024-12-15' },
    { tipo: 'DNI Fiador', estado: 'validado', fechaSubida: '2024-12-16' },
    {
      tipo: 'Recibo de Servicios',
      estado: 'validado',
      fechaSubida: '2024-12-16',
    },
    { tipo: 'Boletas de Pago', estado: 'validado', fechaSubida: '2024-12-17' },
    { tipo: 'Certificado Laboral', estado: 'pendiente' },
    { tipo: 'Voucher de Pago', estado: 'pendiente' },
  ]);

  evidencias = signal<EvidenciaItem[]>([
    { tipo: 'Firma de Contrato', url: '#', fecha: '2024-12-21' },
    { tipo: 'Entrega de Vehículo', url: '#', fecha: '2024-12-22' },
    { tipo: 'Documentación Completa', url: '#', fecha: '2024-12-22' },
  ]);

  activeTab = computed(
    () => this.tabItems().find((tab) => tab.active)?.id || 'resumen'
  );

  // ================================================================
  // LIFECYCLE
  // ================================================================

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  // ================================================================
  // EVENT HANDLERS
  // ================================================================

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.closed.emit();
  }

  setActiveTab(tabId: string): void {
    this.tabItems.update((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        active: tab.id === tabId,
      }))
    );
  }

  editarCliente(): void {
    if (this.cliente?.id) {
      this.editCliente.emit(this.cliente.id);
      this.closeModal();
    }
  }

  verDetalleCompleto(): void {
    if (this.cliente?.id) {
      this.viewFullDetail.emit(this.cliente.id);
      this.closeModal();
    }
  }

  // ================================================================
  // UTILITY METHODS
  // ================================================================

  getClienteInitials(): string {
    if (!this.cliente) return 'CL';
    const nombres = this.cliente.nombre.charAt(0);
    const apellidos = this.cliente.apellidos.charAt(0);
    return (nombres + apellidos).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }

  // ================================================================
  // STYLING METHODS
  // ================================================================

  getTabClasses(tab: TabItem): string {
    const baseClasses =
      'py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 cursor-pointer';
    const activeClasses = 'border-orange-500 text-orange-600';
    const inactiveClasses =
      'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

    return `${baseClasses} ${tab.active ? activeClasses : inactiveClasses}`;
  }

  getTabBadgeClasses(tab: TabItem): string {
    const baseClasses =
      'ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
    const activeClasses = 'bg-orange-100 text-orange-600';
    const inactiveClasses = 'bg-gray-100 text-gray-600';

    return `${baseClasses} ${tab.active ? activeClasses : inactiveClasses}`;
  }

  getTimelineCircleClasses(estado: string): string {
    const baseClasses =
      'h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white relative z-10';

    const stateClasses = {
      completado: 'bg-green-500',
      'en-progreso': 'bg-blue-500 animate-pulse',
      pendiente: 'bg-gray-300',
      bloqueado: 'bg-red-500',
    };

    return `${baseClasses} ${
      stateClasses[estado as keyof typeof stateClasses] ||
      stateClasses.pendiente
    }`;
  }

  getDocumentCardClasses(estado: string): string {
    const baseClasses = 'p-4 rounded-lg border transition-colors';

    const stateClasses = {
      validado: 'bg-green-50 border-green-200',
      subido: 'bg-blue-50 border-blue-200',
      pendiente: 'bg-gray-50 border-gray-200',
      rechazado: 'bg-red-50 border-red-200',
    };

    return `${baseClasses} ${
      stateClasses[estado as keyof typeof stateClasses] ||
      stateClasses.pendiente
    }`;
  }

  getDocumentIconClasses(estado: string): string {
    const baseClasses = 'p-2 rounded-full';

    const stateClasses = {
      validado: 'bg-green-100 text-green-600',
      subido: 'bg-blue-100 text-blue-600',
      pendiente: 'bg-gray-100 text-gray-600',
      rechazado: 'bg-red-100 text-red-600',
    };

    return `${baseClasses} ${
      stateClasses[estado as keyof typeof stateClasses] ||
      stateClasses.pendiente
    }`;
  }

  getDocumentStatusClasses(estado: string): string {
    const baseClasses =
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    const stateClasses = {
      validado: 'bg-green-100 text-green-800',
      subido: 'bg-blue-100 text-blue-800',
      pendiente: 'bg-gray-100 text-gray-800',
      rechazado: 'bg-red-100 text-red-800',
    };

    return `${baseClasses} ${
      stateClasses[estado as keyof typeof stateClasses] ||
      stateClasses.pendiente
    }`;
  }

  getDocumentStatusLabel(estado: string): string {
    const labels = {
      validado: 'Validado',
      subido: 'Subido',
      pendiente: 'Pendiente',
      rechazado: 'Rechazado',
    };

    return labels[estado as keyof typeof labels] || 'Desconocido';
  }

  trackByTabId(index: number, tab: TabItem): string {
    return tab.id;
  }

  trackByTimelineEtapa(index: number, item: TimelineItem): string {
    return item.etapa;
  }

  trackByDocTipo(index: number, doc: DocumentoItem): string {
    return doc.tipo;
  }

  trackByEvidenciaUrl(index: number, evidencia: EvidenciaItem): string {
    return evidencia.url;
  }
  onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = 'none';
  }
}
}
