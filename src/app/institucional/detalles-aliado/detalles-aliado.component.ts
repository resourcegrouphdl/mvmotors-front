import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthServiceService } from '../../acces-data-services/auth-service.service';
import { BaseUser } from '../../models/model-auth';

interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  avatar?: string;
  rol: 'vendedor' | 'supervisor' | 'admin';
  tienda?: string;
}

interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  active: boolean;
  badge?: number;
  visible: boolean;
}

@Component({
  selector: 'app-detalles-aliado',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './detalles-aliado.component.html',
  styleUrl: './detalles-aliado.component.css'
})
export class DetallesAliadoComponent {
  // ================================================================
  // DEPENDENCY INJECTION
  // ================================================================
  
  private router = inject(Router);
  private auth = inject(AuthServiceService); 
  // private authService = inject(AuthService);           // Se implementará
  // private notificationService = inject(NotificationService); // Se implementará
  // private userService = inject(UserService);           // Se implementará
  
  // ================================================================
  // SIGNALS Y STATE MANAGEMENT
  // ================================================================

  userActivo = signal<BaseUser | null>(null);

  isAuthenticated = this.auth.isAuthenticated$;

  // User state
  currentUser = signal<Usuario | null>({
    id: '1',
    nombre: 'Juan',
    apellidos: 'Pérez González',
    email: 'juan.perez@financiera.com',
    rol: 'vendedor',
    tienda: 'Sucursal Centro'
  });
  
  // UI state
  showUserMenu = signal(false);
  showNotifications = signal(false);
  showMobileMenu = signal(false);
  
  // Current route
  currentRoute = signal('dashboard');
  
  // Notifications
  notifications = signal<any[]>([]);
  notificationCount = computed(() => 
    this.notifications().filter(n => !n.leido).length
  );
  
  // Menu items
  menuItems = signal<MenuItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: 'quienes-somos/vendor/info',
      icon: 'fas fa-chart-line',
      active: false,
      visible: true
    },
    {
      id: 'cliente-rapido',
      label: 'Cliente Rápido',
      route: 'quienes-somos/vendor/formulario-cliente',
      icon: 'fas fa-user-plus',
      active: false,
      badge: 0,
      visible: true
    },
    {
      id: 'cliente-completo',
      label: 'Cliente Completo',
      route: 'quienes-somos/vendor/formulario-cliente',
      icon: 'fas fa-user-edit',
      active: false,
      visible: true
    }
    
  ]);
  
  // ================================================================
  // LIFECYCLE HOOKS
  // ================================================================
  
  ngOnInit(): void {
    this.initializeComponent();
    this.subscribeToRouteChanges();
    this.subscribeToClickOutside();
    
    // this.loadCurrentUser();
    // this.loadNotifications();
  }
  
  // ================================================================
  // INITIALIZATION METHODS
  // ================================================================
  
  private initializeComponent(): void {
    // Configuración inicial del componente
    this.updateActiveRoute();
    this.auth.currentUser$.subscribe(user => this.userActivo.set(user));
    console.log('Header Navigation Component initialized');
  }
  
  private subscribeToRouteChanges(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    ).subscribe(url => {
      this.currentRoute.set(url);
      this.updateActiveRoute();
      this.closeMobileMenu();
    });
  }
  
  private subscribeToClickOutside(): void {
    // Cerrar menús al hacer click fuera
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.showUserMenu.set(false);
        this.showNotifications.set(false);
      }
    });
  }
  
  // ================================================================
  // NAVIGATION METHODS
  // ================================================================
  
  navigateToHome(): void {
    this.router.navigate(['quienes-somos/vendor/info']);
  }
  
  navigateToRoute(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }
  
  navigateToProfile(): void {
    this.router.navigate(['/perfil']);
    this.showUserMenu.set(false);
  }
  
  navigateToSettings(): void {
    this.router.navigate(['/configuracion']);
    this.showUserMenu.set(false);
  }
  
  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
    this.showUserMenu.set(false);
  }
  
  // ================================================================
  // MENU METHODS
  // ================================================================
  
  toggleUserMenu(): void {
    this.showUserMenu.update(show => !show);
    this.showNotifications.set(false);
  }
  
  toggleNotifications(): void {
    this.showNotifications.update(show => !show);
    this.showUserMenu.set(false);
    // this.loadNotifications(); // Cargar notificaciones al abrir
  }
  
  closeNotifications(): void {
    this.showNotifications.set(false);
  }
  
  toggleMobileMenu(): void {
    this.showMobileMenu.update(show => !show);
  }
  
  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }
  
  private updateActiveRoute(): void {
    const currentUrl = this.currentRoute();
    this.menuItems.update(items => 
      items.map(item => ({
        ...item,
        active: currentUrl.includes(item.route.split('/').pop() || '')
      }))
    );
  }
  
  // ================================================================
  // USER METHODS
  // ================================================================
  
  getUserInitials(): string {
    const user = this.userActivo;
    if (!user) return 'U';

    const nombres = this.userActivo()?.firstName?.charAt(0) || '';
    const apellidos = this.userActivo()?.lastName?.charAt(0) || '';
    return (nombres + apellidos).toUpperCase();
  }
  
  getRolLabel(): string {
    const rol = this.userActivo()?.userType;
    const labels: Record<string, string> = {
      'STORE': 'Aliado',
      'SUPERVISOR': 'Supervisor',
      'ADMIN': 'Administrador'
    };
    return labels[rol || 'STORE'] || 'Aliado';
  }
  
  
  
  async logout(): Promise<void> {
    try {
      // await this.authService.logout();
      console.log('Cerrando sesión...');
      this.router.navigate(['/quienes-somos/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  
  // ================================================================
  // NOTIFICATION METHODS
  // ================================================================
  
  markAllAsRead(): void {
    // this.notificationService.markAllAsRead();
    this.notifications.update(notifications =>
      notifications.map(n => ({ ...n, leido: true }))
    );
  }
  
  handleNotificationClick(notification: any): void {
    // Marcar como leída
    if (!notification.leido) {
      // this.notificationService.markAsRead(notification.id);
      this.notifications.update(notifications =>
        notifications.map(n => 
          n.id === notification.id ? { ...n, leido: true } : n
        )
      );
    }
    
    // Navegar si tiene acción
    if (notification.metadatos?.route) {
      this.router.navigate([notification.metadatos.route]);
      this.closeNotifications();
    }
  }
  
  formatNotificationTime(date: Date): string {
    // Implementar formato de tiempo relativo
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    
    return date.toLocaleDateString();
  }
  
  // ================================================================
  // STYLING METHODS
  // ================================================================
  
  getMenuItemClasses(item: MenuItem): string {
    const baseClasses = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center';
    const activeClasses = 'bg-blue-100 text-blue-700';
    const inactiveClasses = 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
    
    return `${baseClasses} ${item.active ? activeClasses : inactiveClasses}`;
  }
  
  getMobileMenuItemClasses(item: MenuItem): string {
    const baseClasses = 'w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 flex items-center';
    const activeClasses = 'bg-blue-100 text-blue-700';
    const inactiveClasses = 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
    
    return `${baseClasses} ${item.active ? activeClasses : inactiveClasses}`;
  }
  
  getNotificationClasses(notification: any): string {
    const baseClasses = 'p-3 rounded-lg cursor-pointer transition-colors duration-200';
    const readClasses = 'bg-gray-50 hover:bg-gray-100';
    const unreadClasses = 'bg-blue-50 hover:bg-blue-100';
    
    return `${baseClasses} ${notification.leido ? readClasses : unreadClasses}`;
  }
  
  getNotificationIconClasses(tipo: string): string {
    const baseClasses = 'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm';
    
    const typeClasses = {
      'nueva_solicitud': 'bg-blue-100 text-blue-600',
      'solicitud_aprobada': 'bg-green-100 text-green-600',
      'solicitud_rechazada': 'bg-red-100 text-red-600',
      'documento_pendiente': 'bg-yellow-100 text-yellow-600',
      'default': 'bg-gray-100 text-gray-600'
    };
    
    return `${baseClasses} ${typeClasses[tipo as keyof typeof typeClasses] || typeClasses.default}`;
  }
  
  getNotificationIcon(tipo: string): string {
    const icons = {
      'nueva_solicitud': 'fas fa-file-plus',
      'solicitud_aprobada': 'fas fa-check-circle',
      'solicitud_rechazada': 'fas fa-times-circle',
      'documento_pendiente': 'fas fa-exclamation-triangle',
      'default': 'fas fa-bell'
    };
    
    return icons[tipo as keyof typeof icons] || icons.default;
  }
  
  // ================================================================
  // SERVICE INTEGRATION METHODS (Para implementar)
  // ================================================================
  
  private async loadCurrentUser(): Promise<void> {
    try {
      // const user = await this.userService.getCurrentUser();
      // this.currentUser.set(user);
      console.log('Usuario cargado desde Firebase');
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  }
  
  private async loadNotifications(): Promise<void> {
    try {
      // const notifications = await this.notificationService.getUserNotifications();
      // this.notifications.set(notifications);
      console.log('Notificaciones cargadas desde Firebase');
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  }
  
  // Método para actualizar badges dinámicamente
  updateMenuBadges(): void {
    // Este método se llamará desde los servicios para actualizar contadores
    // Por ejemplo: documentos pendientes, solicitudes nuevas, etc.
    console.log('Actualizando badges del menú');
  }
}
