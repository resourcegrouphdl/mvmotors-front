import { Component, computed, inject, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBadgeComponent } from "../status-badge/status-badge.component";
// Interfaces
interface KpiData {
  id: string;
  titulo: string;
  valor: number;
  tendencia?: number;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'purple';
  icono?: string;
  descripcion?: string;
}

interface ClienteResumen {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  estado: EstadoCliente;
  porcentajeAvance: number;
  fechaUltimaActualizacion: Date;
  tipoCliente: 'titular' | 'fiador';
}

interface TabItem {
  id: string;
  label: string;
  active: boolean;
  count?: number;
}

enum EstadoCliente {
  NUEVO = 'nuevo',
  EN_EVALUACION = 'en_evaluacion', 
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  DOCUMENTOS_PENDIENTES = 'documentos_pendientes'
}

@Component({
  selector: 'app-dashboard-overview-component',
  standalone: true,
  imports: [StatusBadgeComponent],
  templateUrl: './dashboard-overview-component.component.html',
  styleUrl: './dashboard-overview-component.component.css'
})
export class DashboardOverviewComponentComponent {
 // ================================================================
  // DEPENDENCY INJECTION
  // ================================================================
  
  private router = inject(Router);
  
  // ================================================================
  // INPUTS
  // ================================================================
  
  @Input() mostrarCliente: boolean = false;
  @Input() clienteId?: string;
  
  // ================================================================
  // SIGNALS Y STATE
  // ================================================================
  
  // KPI Data
  kpiData = signal<KpiData[]>([
    {
      id: 'nuevos',
      titulo: 'Nuevos',
      valor: 12,
      tendencia: 8,
      color: 'blue',
      icono: 'fas fa-user-plus',
      descripcion: 'Este mes'
    },
    {
      id: 'en_evaluacion',
      titulo: 'En Evaluación',
      valor: 7,
      color: 'yellow',
      icono: 'fas fa-clock',
      descripcion: 'Pendientes'
    },
    {
      id: 'aprobados',
      titulo: 'Aprobados',
      valor: 23,
      tendencia: 15,
      color: 'green',
      icono: 'fas fa-check-circle',
      descripcion: 'Total mes'
    },
    {
      id: 'rechazados',
      titulo: 'Rechazados',
      valor: 3,
      color: 'red',
      icono: 'fas fa-times-circle',
      descripcion: 'Total mes'
    },
    {
      id: 'documentos_pendientes',
      titulo: 'Pend. Documentos',
      valor: 5,
      color: 'purple',
      icono: 'fas fa-file-upload',
      descripcion: 'Requieren acción'
    }
  ]);
  
  // Cliente seleccionado
  clienteSeleccionado = signal<ClienteResumen | null>({
    id: '1',
    nombre: 'María Andrés',
    apellidos: 'García',
    dni: '72345678',
    estado: EstadoCliente.APROBADO,
    porcentajeAvance: 85,
    fechaUltimaActualizacion: new Date(),
    tipoCliente: 'titular'
  });
  
  // Navigation tabs
  tabItems = signal<TabItem[]>([
    { id: 'resumen', label: 'Resumen', active: true },
    { id: 'timeline', label: 'Timeline', active: false },
    { id: 'documentos', label: 'Documentos', active: false, count: 8 },
    { id: 'evidencias', label: 'Evidencias', active: false, count: 3 }
  ]);
  
  // Computed values
  activeTab = computed(() => 
    this.tabItems().find(tab => tab.active)?.id || 'resumen'
  );
  
  // Helper para Math en template
  Math = Math;
  
  // ================================================================
  // LIFECYCLE
  // ================================================================
  
  ngOnInit(): void {
    this.initializeComponent();
    if (this.clienteId) {
      this.loadCliente(this.clienteId);
    }
  }
  
  // ================================================================
  // INITIALIZATION
  // ================================================================
  
  private initializeComponent(): void {
    console.log('Dashboard Overview Component initialized');
    // this.loadKpiData();
    // this.subscribeToUpdates();
  }
  
  // ================================================================
  // DATA METHODS
  // ================================================================
  
  private async loadCliente(clienteId: string): Promise<void> {
    try {
      // const cliente = await this.clienteService.getById(clienteId);
      // this.clienteSeleccionado.set(cliente);
      console.log('Cargando cliente:', clienteId);
    } catch (error) {
      console.error('Error cargando cliente:', error);
    }
  }
  
  private async loadKpiData(): Promise<void> {
    try {
      // const kpis = await this.dashboardService.getKpiData();
      // this.kpiData.set(kpis);
      console.log('Cargando KPIs del dashboard');
    } catch (error) {
      console.error('Error cargando KPIs:', error);
    }
  }
  
  // ================================================================
  // EVENT HANDLERS
  // ================================================================
  
  onKpiClick(kpi: KpiData): void {
    console.log('KPI clicked:', kpi.id);
    
    // Navegar según el tipo de KPI
    const routes: Record<string, string> = {
      'nuevos': '/clientes/lista?estado=nuevo',
      'en_evaluacion': '/clientes/lista?estado=en_evaluacion',
      'aprobados': '/clientes/lista?estado=aprobado',
      'rechazados': '/clientes/lista?estado=rechazado',
      'documentos_pendientes': '/clientes/lista?documentos=pendientes'
    };
    
    const route = routes[kpi.id];
    if (route) {
      this.router.navigate([route]);
    }
  }
  
  setActiveTab(tabId: string): void {
    this.tabItems.update(tabs =>
      tabs.map(tab => ({
        ...tab,
        active: tab.id === tabId
      }))
    );
    
    console.log('Active tab changed to:', tabId);
    // this.loadTabContent(tabId);
  }
  
  crearClienteRapido(): void {
    this.router.navigate(['/clientes/nuevo-rapido']);
  }
  
  crearClienteCompleto(): void {
    this.router.navigate(['/clientes/nuevo-completo']);
  }
  
  // ================================================================
  // UTILITY METHODS
  // ================================================================
  
  getClienteInitials(cliente: ClienteResumen): string {
    const nombres = cliente.nombre.charAt(0);
    const apellidos = cliente.apellidos.charAt(0);
    return (nombres + apellidos).toUpperCase();
  }
  
  getActiveTabLabel(): string {
    const activeTabItem = this.tabItems().find(tab => tab.active);
    return activeTabItem?.label || 'Contenido';
  }
  
  // ================================================================
  // STYLING METHODS
  // ================================================================
  
  getColorBarClass(color: string): string {
    const colors = {
      'blue': 'h-1 bg-gradient-to-r from-blue-500 to-blue-600',
      'yellow': 'h-1 bg-gradient-to-r from-yellow-400 to-yellow-500',
      'green': 'h-1 bg-gradient-to-r from-green-500 to-green-600',
      'red': 'h-1 bg-gradient-to-r from-red-500 to-red-600',
      'purple': 'h-1 bg-gradient-to-r from-purple-500 to-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  }
  
  getIconContainerClass(color: string): string {
    const colors = {
      'blue': 'w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center',
      'yellow': 'w-6 h-6 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center',
      'green': 'w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center',
      'red': 'w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center',
      'purple': 'w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  }
  
  getValueColorClass(color: string): string {
    const colors = {
      'blue': 'text-blue-600',
      'yellow': 'text-yellow-600',
      'green': 'text-green-600',
      'red': 'text-red-600',
      'purple': 'text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  }
  
  getTendenciaClass(tendencia: number): string {
    const baseClass = 'flex items-center text-xs font-medium';
    return tendencia >= 0 
      ? `${baseClass} text-green-600` 
      : `${baseClass} text-red-600`;
  }
  
  getTendenciaIcon(tendencia: number): string {
    return tendencia >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }
  
  getTabClasses(tab: TabItem): string {
    const baseClasses = 'py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200';
    const activeClasses = 'border-orange-500 text-orange-600';
    const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    
    return `${baseClasses} ${tab.active ? activeClasses : inactiveClasses}`;
  }
  
  getTabBadgeClasses(tab: TabItem): string {
    const baseClasses = 'ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
    const activeClasses = 'bg-orange-100 text-orange-600';
    const inactiveClasses = 'bg-gray-100 text-gray-600';
    
    return `${baseClasses} ${tab.active ? activeClasses : inactiveClasses}`;
  }
}

