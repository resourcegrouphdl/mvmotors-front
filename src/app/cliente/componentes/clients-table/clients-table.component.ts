import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StatusBadgeComponent } from "../status-badge/status-badge.component";
import { CommonModule, NgClass } from '@angular/common';
import { ClientDetailModalComponent } from '../client-detail-modal/client-detail-modal.component';



// Interfaces y tipos
interface ClienteTabla {
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
  vendedorId?: string;
  observaciones?: string;
}

interface ColumnaTabla {
  key: keyof ClienteTabla | 'acciones';
  titulo: string;
  ordenable: boolean;
  visible: boolean;
  ancho?: string;
  alineacion?: 'left' | 'center' | 'right';
}

interface FiltroTabla {
  busqueda: string;
  estado?: EstadoCliente;
  tipoCliente?: 'titular' | 'fiador';
  fechaDesde?: Date;
  fechaHasta?: Date;
}

interface OrdenTabla {
  campo: keyof ClienteTabla;
  direccion: 'asc' | 'desc';
}

enum EstadoCliente {
  NUEVO = 'nuevo',
  EN_EVALUACION = 'en_evaluacion',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  DOCUMENTOS_PENDIENTES = 'documentos_pendientes',
  ENTREVISTAS = 'entrevistas',
  CERRADO = 'cerrado'
}


@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, 
    RouterModule, 
    FormsModule,
    StatusBadgeComponent,
    ClientDetailModalComponent
  ],
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.css'
})
export class ClientsTableComponent implements OnInit {

  // ================================================================
  // DEPENDENCY INJECTION
  // ================================================================
  
  private router = inject(Router);
  
  // ================================================================
  // INPUTS Y OUTPUTS
  // ================================================================
  
  @Input() titulo: string = 'Clientes Recientes';
  @Input() clientesData: ClienteTabla[] = [];
  @Input() mostrarFiltros: boolean = true;
  @Input() mostrarPaginacion: boolean = true;
  @Input() itemsPorPaginaInicial: number = 10;
  
  @Output() clienteSeleccionado = new EventEmitter<ClienteTabla>();
  @Output() clienteEditado = new EventEmitter<ClienteTabla>();
  @Output() clienteEliminado = new EventEmitter<string>();
  @Output() estadoCambiado = new EventEmitter<{cliente: ClienteTabla, nuevoEstado: EstadoCliente}>();
  
  // ================================================================
  // SIGNALS Y STATE
  // ================================================================
  
  // Data
  clientes = signal<ClienteTabla[]>([
    {
      id: '1',
      nombre: 'María Andrés',
      apellidos: 'García López',
      dni: '72345678',
      telefono: '987654321',
      email: 'maria@email.com',
      estado: EstadoCliente.APROBADO,
      porcentajeAvance: 85,
      fechaUltimaActualizacion: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas
      tipoCliente: 'titular',
      vendedorId: 'v1'
    },
    {
      id: '2',
      nombre: 'Carlos',
      apellidos: 'Rodríguez Vásquez',
      dni: '78901234',
      telefono: '912345678',
      estado: EstadoCliente.ENTREVISTAS,
      porcentajeAvance: 60,
      fechaUltimaActualizacion: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día
      tipoCliente: 'titular',
      vendedorId: 'v1'
    },
    {
      id: '3',
      nombre: 'Ana',
      apellidos: 'López Martínez',
      dni: '56789012',
      telefono: '923456789',
      estado: EstadoCliente.DOCUMENTOS_PENDIENTES,
      porcentajeAvance: 35,
      fechaUltimaActualizacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días
      tipoCliente: 'titular',
      vendedorId: 'v1'
    }
  ]);
  
  // Filtros
  filtros = signal<FiltroTabla>({
    busqueda: '',
    estado: undefined,
    tipoCliente: undefined
  });
  
  // Ordenamiento
  ordenActual = signal<OrdenTabla>({
    campo: 'fechaUltimaActualizacion',
    direccion: 'desc'
  });
  
  // Paginación
  paginaActual = signal(1);
  itemsPorPagina = signal(10);
  
  // UI State
  menuAccionesAbierto = signal<string | null>(null);
  modalAbierto = signal(false);
  clienteSeleccionadoModal = signal<ClienteTabla | null>(null);
  
  // Configuración de columnas
  columnas = signal<ColumnaTabla[]>([
    { key: 'nombre', titulo: 'CLIENTE', ordenable: true, visible: true, ancho: '25%', alineacion: 'left' },
    { key: 'estado', titulo: 'ESTADO', ordenable: true, visible: true, ancho: '15%', alineacion: 'left' },
    { key: 'porcentajeAvance', titulo: 'AVANCE', ordenable: true, visible: true, ancho: '20%', alineacion: 'left' },
    { key: 'fechaUltimaActualizacion', titulo: 'ÚLTIMA ACTUALIZACIÓN', ordenable: true, visible: true, ancho: '25%', alineacion: 'left' },
    { key: 'acciones', titulo: 'ACCIONES', ordenable: false, visible: true, ancho: '15%', alineacion: 'right' }
  ]);
  
  // Computed values
  columnasVisibles = computed(() => this.columnas().filter(c => c.visible));
  
  clientesFiltrados = computed(() => {
    let resultado = [...this.clientes()];
    const filtro = this.filtros();
    
    // Filtro por búsqueda
    if (filtro.busqueda) {
      const busqueda = filtro.busqueda.toLowerCase();
      resultado = resultado.filter(cliente => 
        cliente.nombre.toLowerCase().includes(busqueda) ||
        cliente.apellidos.toLowerCase().includes(busqueda) ||
        cliente.dni.includes(busqueda) ||
        cliente.telefono?.includes(busqueda) ||
        cliente.email?.toLowerCase().includes(busqueda)
      );
    }
    
    // Filtro por estado
    if (filtro.estado) {
      resultado = resultado.filter(cliente => cliente.estado === filtro.estado);
    }
    
    // Filtro por tipo
    if (filtro.tipoCliente) {
      resultado = resultado.filter(cliente => cliente.tipoCliente === filtro.tipoCliente);
    }
    
    // Ordenamiento
    const orden = this.ordenActual();
    resultado.sort((a, b) => {
      const valorA = a[orden.campo];
      const valorB = b[orden.campo];
      
      let comparacion = 0;
      
      if (valorA instanceof Date && valorB instanceof Date) {
        comparacion = valorA.getTime() - valorB.getTime();
      } else if (typeof valorA === 'string' && typeof valorB === 'string') {
        comparacion = valorA.localeCompare(valorB);
      } else if (typeof valorA === 'number' && typeof valorB === 'number') {
        comparacion = valorA - valorB;
      }
      
      return orden.direccion === 'desc' ? -comparacion : comparacion;
    });
    
    return resultado;
  });
  
  totalPaginas = computed(() => 
    Math.ceil(this.clientesFiltrados().length / this.itemsPorPagina())
  );
  
  indicePaginaInicio = computed(() => 
    (this.paginaActual() - 1) * this.itemsPorPagina()
  );
  
  indicePaginaFin = computed(() => 
    this.indicePaginaInicio() + this.itemsPorPagina()
  );
  
  clientesPaginados = computed(() => 
    this.clientesFiltrados().slice(this.indicePaginaInicio(), this.indicePaginaFin())
  );
  
  // Helper para Math en template
  Math = Math;
  
  // Filtros como propiedades separadas para ngModel
  filtrosBusqueda = '';
  filtrosEstado: EstadoCliente | '' = '';
  
  // ================================================================
  // LIFECYCLE
  // ================================================================
  
  ngOnInit(): void {
    this.initializeComponent();
    this.itemsPorPagina.set(this.itemsPorPaginaInicial);
    
    if (this.clientesData.length > 0) {
      this.clientes.set(this.clientesData);
    }
  }
  
  // ================================================================
  // INITIALIZATION
  // ================================================================
  
  private initializeComponent(): void {
    console.log('Clients Table Component initialized');
    // this.loadClientes();
    this.subscribeToClickOutside();
  }
  
  private subscribeToClickOutside(): void {
    document.addEventListener('click', () => {
      this.menuAccionesAbierto.set(null);
    });
  }
  
  irACalculadora(): void {
    this.router.navigate(['quienes-somos/vendor/calculadora']);
  }
  
  // ================================================================
  // EVENT HANDLERS
  // ================================================================
  
  onHeaderClick(columna: ColumnaTabla): void {
    if (columna.ordenable && columna.key !== 'acciones') {
      this.cambiarOrden(columna.key as keyof ClienteTabla);
    }
  }
  
  actualizarFiltros(tipo: 'busqueda' | 'estado', valor: any): void {
    const filtrosActuales = this.filtros();
    
    if (tipo === 'busqueda') {
      this.filtrosBusqueda = valor;
      this.filtros.set({
        ...filtrosActuales,
        busqueda: valor
      });
    } else if (tipo === 'estado') {
      this.filtrosEstado = valor;
      this.filtros.set({
        ...filtrosActuales,
        estado: valor || undefined
      });
    }
    
    this.paginaActual.set(1); // Reset a primera página
    console.log('Filtros aplicados:', this.filtros());
  }
  
  aplicarFiltros(): void {
    this.paginaActual.set(1); // Reset a primera página
    console.log('Filtros aplicados:', this.filtros());
  }
  
  limpiarFiltros(): void {
    this.filtrosBusqueda = '';
    this.filtrosEstado = '';
    this.filtros.set({
      busqueda: '',
      estado: undefined,
      tipoCliente: undefined
    });
    this.paginaActual.set(1);
  }
  
  cambiarOrden(campo: keyof ClienteTabla): void {
    const ordenActual = this.ordenActual();
    
    if (ordenActual.campo === campo) {
      // Cambiar dirección
      this.ordenActual.update(orden => ({
        ...orden,
        direccion: orden.direccion === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      // Nuevo campo
      this.ordenActual.set({
        campo,
        direccion: 'asc'
      });
    }
  }
  
  // ================================================================
  // PAGINATION METHODS
  // ================================================================
  
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }
  
  cambiarItemsPorPagina(): void {
    this.paginaActual.set(1);
  }
  
  getPaginasVisibles(): number[] {
    const total = this.totalPaginas();
    const actual = this.paginaActual();
    const paginas: number[] = [];
    
    // Lógica para mostrar páginas relevantes
    const inicio = Math.max(1, actual - 2);
    const fin = Math.min(total, inicio + 4);
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }
  
  // ================================================================
  // CLIENT ACTIONS
  // ================================================================
  
  verDetalleCliente(cliente: ClienteTabla, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    console.log('Ver detalle cliente:', cliente.id);
    
    // Abrir modal en lugar de navegar
    this.clienteSeleccionadoModal.set(cliente);
    this.modalAbierto.set(true);
    this.clienteSeleccionado.emit(cliente);
  }
  
  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.clienteSeleccionadoModal.set(null);
  }
  
  editarClienteDesdeModal(clienteId: string): void {
    console.log('Editar cliente desde modal:', clienteId);
    this.router.navigate(['/clientes', clienteId, 'editar']);
  }
  
  verDetalleCompletoDesdeModal(clienteId: string): void {
    console.log('Ver detalle completo desde modal:', clienteId);
    this.router.navigate(['/clientes', clienteId]);
  }
  
  editarCliente(cliente: ClienteTabla, event: Event): void {
    event.stopPropagation();
    console.log('Editar cliente:', cliente.id);
    this.clienteEditado.emit(cliente);
    this.router.navigate(['/clientes', cliente.id, 'editar']);
  }
  
  duplicarCliente(cliente: ClienteTabla): void {
    console.log('Duplicar cliente:', cliente.id);
    // Lógica para duplicar cliente
    this.menuAccionesAbierto.set(null);
  }
  
  cambiarEstado(cliente: ClienteTabla): void {
    console.log('Cambiar estado cliente:', cliente.id);
    // Lógica para mostrar modal de cambio de estado
    this.menuAccionesAbierto.set(null);
  }
  
  exportarCliente(cliente: ClienteTabla): void {
    console.log('Exportar cliente:', cliente.id);
    // Lógica para exportar datos del cliente
    this.menuAccionesAbierto.set(null);
  }
  
  eliminarCliente(cliente: ClienteTabla): void {
    console.log('Eliminar cliente:', cliente.id);
    
    // Confirmación antes de eliminar
    if (confirm(`¿Estás seguro de que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellidos}?`)) {
      this.clienteEliminado.emit(cliente.id);
      
      // Remover de la lista local
      this.clientes.update(clientes => 
        clientes.filter(c => c.id !== cliente.id)
      );
    }
    
    this.menuAccionesAbierto.set(null);
  }
  
  toggleMenuAcciones(clienteId: string, event: Event): void {
    event.stopPropagation();
    
    this.menuAccionesAbierto.update(actual => 
      actual === clienteId ? null : clienteId
    );
  }
  
  crearClienteRapido(): void {
    this.router.navigate(['quienes-somos/vendor/formulario-cliente']);
  }
  
  crearClienteCompleto(): void {
    this.router.navigate(['quienes-somos/vendor/formulario-cliente']);
  }
  
  exportarTabla(): void {
    console.log('Exportar tabla completa');
    // Lógica para exportar todos los datos filtrados
  }
  
  // ================================================================
  // UTILITY METHODS
  // ================================================================
  
  getClienteInitials(cliente: ClienteTabla): string {
    const nombres = cliente.nombre.charAt(0);
    const apellidos = cliente.apellidos.charAt(0);
    return (nombres + apellidos).toUpperCase();
  }
  
  puedeEditar(cliente: ClienteTabla): boolean {
    // Lógica para determinar si se puede editar
    return cliente.estado !== EstadoCliente.CERRADO && 
           cliente.estado !== EstadoCliente.RECHAZADO;
  }
  
  formatearFechaRelativa(fecha: Date): string {
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffWeeks === 1) return 'Hace 1 semana';
    if (diffWeeks < 4) return `Hace ${diffWeeks} semanas`;
    if (diffMonths === 1) return 'Hace 1 mes';
    if (diffMonths < 12) return `Hace ${diffMonths} meses`;
    
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // ================================================================
  // STYLING METHODS
  // ================================================================
  
  getHeaderClasses(columna: ColumnaTabla): string {
    const baseClasses = 'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider';
    const alignClasses = {
      'left': 'text-left',
      'center': 'text-center', 
      'right': 'text-right'
    };
    const cursorClass = columna.ordenable ? 'cursor-pointer hover:bg-gray-100' : '';
    
    return `${baseClasses} ${alignClasses[columna.alineacion || 'left']} ${cursorClass}`;
  }
  
  getOrdenIconClass(campo: keyof ClienteTabla, direccion: 'asc' | 'desc'): string {
    const orden = this.ordenActual();
    const isActive = orden.campo === campo && orden.direccion === direccion;
    const directionClass = direccion === 'desc' ? 'fa-caret-down' : 'fa-caret-up';
    const activeClass = isActive ? 'text-orange-500' : 'text-gray-300';
    
    return `fas ${directionClass} text-xs ${activeClass}`;
  }
  
  // Métodos auxiliares para el template
  getOrdenIconAsc(key: string): string {
    if (key === 'acciones') return '';
    return this.getOrdenIconClass(key as keyof ClienteTabla, 'asc');
  }
  
  getOrdenIconDesc(key: string): string {
    if (key === 'acciones') return '';
    return this.getOrdenIconClass(key as keyof ClienteTabla, 'desc');
  }
  
  getAvatarClasses(estado: EstadoCliente): string {
    const baseClasses = 'h-10 w-10 rounded-full flex items-center justify-center text-white font-medium';
    
    const estadoClasses = {
      [EstadoCliente.NUEVO]: 'bg-gradient-to-br from-blue-500 to-blue-600',
      [EstadoCliente.EN_EVALUACION]: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      [EstadoCliente.APROBADO]: 'bg-gradient-to-br from-green-500 to-green-600',
      [EstadoCliente.RECHAZADO]: 'bg-gradient-to-br from-red-500 to-red-600',
      [EstadoCliente.DOCUMENTOS_PENDIENTES]: 'bg-gradient-to-br from-orange-500 to-orange-600',
      [EstadoCliente.ENTREVISTAS]: 'bg-gradient-to-br from-purple-500 to-purple-600',
      [EstadoCliente.CERRADO]: 'bg-gradient-to-br from-gray-500 to-gray-600'
    };
    
    return `${baseClasses} ${estadoClasses[estado] || estadoClasses[EstadoCliente.NUEVO]}`;
  }
  
  getProgressBarClass(porcentaje: number): string {
    const baseClass = 'h-2 rounded-full transition-all duration-500';
    
    if (porcentaje >= 80) return `${baseClass} bg-gradient-to-r from-green-500 to-green-600`;
    if (porcentaje >= 60) return `${baseClass} bg-gradient-to-r from-blue-500 to-blue-600`;
    if (porcentaje >= 40) return `${baseClass} bg-gradient-to-r from-yellow-500 to-yellow-600`;
    if (porcentaje >= 20) return `${baseClass} bg-gradient-to-r from-orange-500 to-orange-600`;
    
    return `${baseClass} bg-gradient-to-r from-red-500 to-red-600`;
  }
  
  getClasePaginaBoton(pagina: number): string {
    const baseClasses = 'px-3 py-1 text-sm border rounded-lg transition-colors';
    const isActive = pagina === this.paginaActual();
    
    if (isActive) {
      return `${baseClasses} bg-orange-500 text-white border-orange-500`;
    }
    
    return `${baseClasses} border-gray-300 text-gray-700 hover:bg-gray-100`;
  }
  
  // ================================================================
  // DATA LOADING METHODS (Para integrar con servicios)
  // ================================================================
  
  private async loadClientes(): Promise<void> {
    try {
      // const clientes = await this.clienteService.getClientes();
      // this.clientes.set(clientes);
      console.log('Cargando clientes desde Firebase');
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }
  
  async refreshData(): Promise<void> {
    await this.loadClientes();
  }
  
  // Método público para actualizar un cliente específico
  updateCliente(clienteActualizado: ClienteTabla): void {
    this.clientes.update(clientes =>
      clientes.map(c => 
        c.id === clienteActualizado.id ? clienteActualizado : c
      )
    );
  }
  
  // Método público para agregar un nuevo cliente
  addCliente(nuevoCliente: ClienteTabla): void {
    this.clientes.update(clientes => [...clientes, nuevoCliente]);
  }
  
  // Método público para remover un cliente
  removeCliente(clienteId: string): void {
    this.clientes.update(clientes => 
      clientes.filter(c => c.id !== clienteId)
    );
  }
  
  // Transformar ClienteTabla a ClienteDetalle para el modal
  transformClienteToDetalle(cliente: ClienteTabla | null): any {
    if (!cliente) return null;
    
    return {
      ...cliente,
      ocupacion: 'Comerciante', // Mock data
      direccion: 'Av. Ejemplo 123, Lima',
      ingresos: 1200,
      precioMoto: 8500,
      cuotaMensual: 350,
      plazoMeses: 24,
      vendedor: {
        nombre: 'Juan Pérez',
        tienda: 'Sucursal Centro'
      }
    };
  }
}