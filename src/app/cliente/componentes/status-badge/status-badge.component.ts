import { Component, computed, Input } from '@angular/core';

// Enums de estados (deben coincidir con tus modelos)
export enum EstadoCliente {
  NUEVO = 'nuevo',
  EN_EVALUACION = 'en_evaluacion',
  APROBADO = 'aprobado', 
  RECHAZADO = 'rechazado',
  DOCUMENTOS_PENDIENTES = 'documentos_pendientes',
  ENTREVISTAS = 'entrevistas',
  APORTE_SUBIDO = 'aporte_subido',
  FACTURA_SUBIDA = 'factura_subida',
  CONTRATO_ENVIADO = 'contrato_enviado',
  EVIDENCIA_OK = 'evidencia_ok',
  COMISION_ASIGNADA = 'comision_asignada',
  TARJETA_OK = 'tarjeta_ok',
  SOAT_OK = 'soat_ok',
  TITULO_OK = 'titulo_ok',
  CERRADO = 'cerrado'
}

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  EN_EVALUACION = 'en_evaluacion'
}

export enum EstadoDocumento {
  PENDIENTE = 'pendiente',
  SUBIDO = 'subido',
  EN_VALIDACION = 'en_validacion',
  VALIDO = 'valido',
  RECHAZADO = 'rechazado',
  VENCIDO = 'vencido'
}

export enum EstadoTramite {
  NO_INICIADO = 'no_iniciado',
  EN_TRAMITE = 'en_tramite',
  ESPERANDO_DOCUMENTOS = 'esperando_documentos',
  COMPLETADO = 'completado',
  RECHAZADO = 'rechazado',
  VENCIDO = 'vencido'
}

type EstadoType = EstadoCliente | EstadoSolicitud | EstadoDocumento | EstadoTramite | string;

interface BadgeConfig {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
  icon?: string;
  pulseAnimation?: boolean;
}


@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css'
})
export class StatusBadgeComponent {
// ================================================================
  // INPUTS
  // ================================================================
  
  @Input({ required: true }) estado!: EstadoType;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'outline' | 'solid' = 'default';
  @Input() showIcon: boolean = false;
  @Input() showDot: boolean = true;
  @Input() customLabel?: string;
  
  // ================================================================
  // COMPUTED PROPERTIES
  // ================================================================
  
  badgeConfig = computed((): BadgeConfig => {
    const config = this.getEstadoConfig(this.estado);
    
    // Override label si se proporciona uno personalizado
    if (this.customLabel) {
      config.label = this.customLabel;
    }
    
    return config;
  });
  
  badgeClasses = computed((): string => {
    const config = this.badgeConfig();
    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses(config);
    
    return `inline-flex items-center rounded-full transition-all duration-200 ${sizeClasses} ${variantClasses}`;
  });
  
  dotClasses = computed((): string => {
    const config = this.badgeConfig();
    const baseClasses = 'rounded-full';
    const sizeClass = this.size === 'sm' ? 'w-1.5 h-1.5' : this.size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';
    const marginClass = this.size === 'sm' ? 'mr-1' : this.size === 'lg' ? 'mr-2' : 'mr-1.5';
    const pulseClass = config.pulseAnimation ? 'animate-pulse' : '';
    
    if (!this.showDot) {
      return 'hidden';
    }
    
    return `${baseClasses} ${sizeClass} ${marginClass} ${config.dotColor} ${pulseClass}`;
  });
  
  // ================================================================
  // CONFIGURATION METHODS
  // ================================================================
  
  private getEstadoConfig(estado: EstadoType): BadgeConfig {
    
    // Estados de Cliente
    const clienteConfigs: Record<string, BadgeConfig> = {
      [EstadoCliente.NUEVO]: {
        label: 'Nuevo',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
        icon: this.showIcon ? 'fas fa-star' : undefined
      },
      [EstadoCliente.EN_EVALUACION]: {
        label: 'En Evaluación',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        dotColor: 'bg-yellow-500',
        icon: this.showIcon ? 'fas fa-clock' : undefined,
        pulseAnimation: true
      },
      [EstadoCliente.APROBADO]: {
        label: 'Aprobado',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-check-circle' : undefined
      },
      [EstadoCliente.RECHAZADO]: {
        label: 'Rechazado',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        dotColor: 'bg-red-500',
        icon: this.showIcon ? 'fas fa-times-circle' : undefined
      },
      [EstadoCliente.DOCUMENTOS_PENDIENTES]: {
        label: 'Docs. Pendientes',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        dotColor: 'bg-orange-500',
        icon: this.showIcon ? 'fas fa-file-upload' : undefined
      },
      [EstadoCliente.ENTREVISTAS]: {
        label: 'En Entrevistas',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        dotColor: 'bg-purple-500',
        icon: this.showIcon ? 'fas fa-comments' : undefined,
        pulseAnimation: true
      },
      [EstadoCliente.APORTE_SUBIDO]: {
        label: 'Aporte Subido',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-700',
        dotColor: 'bg-teal-500',
        icon: this.showIcon ? 'fas fa-money-bill' : undefined
      },
      [EstadoCliente.FACTURA_SUBIDA]: {
        label: 'Factura Subida',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        dotColor: 'bg-indigo-500',
        icon: this.showIcon ? 'fas fa-receipt' : undefined
      },
      [EstadoCliente.CONTRATO_ENVIADO]: {
        label: 'Contrato Enviado',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
        icon: this.showIcon ? 'fas fa-file-contract' : undefined
      },
      [EstadoCliente.EVIDENCIA_OK]: {
        label: 'Evidencias OK',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-camera' : undefined
      },
      [EstadoCliente.COMISION_ASIGNADA]: {
        label: 'Comisión Asignada',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        dotColor: 'bg-emerald-500',
        icon: this.showIcon ? 'fas fa-dollar-sign' : undefined
      },
      [EstadoCliente.TARJETA_OK]: {
        label: 'Tarjeta OK',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-id-card' : undefined
      },
      [EstadoCliente.SOAT_OK]: {
        label: 'SOAT OK',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-shield-alt' : undefined
      },
      [EstadoCliente.TITULO_OK]: {
        label: 'Título OK',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-certificate' : undefined
      },
      [EstadoCliente.CERRADO]: {
        label: 'Cerrado',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        dotColor: 'bg-gray-500',
        icon: this.showIcon ? 'fas fa-check-double' : undefined
      }
    };
    
    // Estados de Solicitud
    const solicitudConfigs: Record<string, BadgeConfig> = {
      [EstadoSolicitud.PENDIENTE]: {
        label: 'Pendiente',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        dotColor: 'bg-yellow-500',
        icon: this.showIcon ? 'fas fa-hourglass-half' : undefined
      },
      [EstadoSolicitud.EN_EVALUACION]: {
        label: 'En Evaluación',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
        icon: this.showIcon ? 'fas fa-search' : undefined,
        pulseAnimation: true
      },
      [EstadoSolicitud.APROBADO]: {
        label: 'Aprobado',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-thumbs-up' : undefined
      },
      [EstadoSolicitud.RECHAZADO]: {
        label: 'Rechazado',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        dotColor: 'bg-red-500',
        icon: this.showIcon ? 'fas fa-thumbs-down' : undefined
      }
    };
    
    // Estados de Documento
    const documentoConfigs: Record<string, BadgeConfig> = {
      [EstadoDocumento.PENDIENTE]: {
        label: 'Pendiente',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        dotColor: 'bg-gray-400',
        icon: this.showIcon ? 'fas fa-clock' : undefined
      },
      [EstadoDocumento.SUBIDO]: {
        label: 'Subido',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
        icon: this.showIcon ? 'fas fa-upload' : undefined
      },
      [EstadoDocumento.EN_VALIDACION]: {
        label: 'En Validación',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        dotColor: 'bg-yellow-500',
        icon: this.showIcon ? 'fas fa-eye' : undefined,
        pulseAnimation: true
      },
      [EstadoDocumento.VALIDO]: {
        label: 'Válido',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-check' : undefined
      },
      [EstadoDocumento.RECHAZADO]: {
        label: 'Rechazado',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        dotColor: 'bg-red-500',
        icon: this.showIcon ? 'fas fa-times' : undefined
      },
      [EstadoDocumento.VENCIDO]: {
        label: 'Vencido',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        dotColor: 'bg-orange-500',
        icon: this.showIcon ? 'fas fa-exclamation-triangle' : undefined
      }
    };
    
    // Estados de Trámite
    const tramiteConfigs: Record<string, BadgeConfig> = {
      [EstadoTramite.NO_INICIADO]: {
        label: 'No Iniciado',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        dotColor: 'bg-gray-400',
        icon: this.showIcon ? 'fas fa-pause' : undefined
      },
      [EstadoTramite.EN_TRAMITE]: {
        label: 'En Trámite',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
        icon: this.showIcon ? 'fas fa-cog' : undefined,
        pulseAnimation: true
      },
      [EstadoTramite.ESPERANDO_DOCUMENTOS]: {
        label: 'Esperando Docs.',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        dotColor: 'bg-yellow-500',
        icon: this.showIcon ? 'fas fa-file-import' : undefined
      },
      [EstadoTramite.COMPLETADO]: {
        label: 'Completado',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: this.showIcon ? 'fas fa-check-circle' : undefined
      },
      [EstadoTramite.RECHAZADO]: {
        label: 'Rechazado',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        dotColor: 'bg-red-500',
        icon: this.showIcon ? 'fas fa-ban' : undefined
      },
      [EstadoTramite.VENCIDO]: {
        label: 'Vencido',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        dotColor: 'bg-orange-500',
        icon: this.showIcon ? 'fas fa-calendar-times' : undefined
      }
    };
    
    // Combinar todas las configuraciones
    const allConfigs = {
      ...clienteConfigs,
      ...solicitudConfigs,
      ...documentoConfigs,
      ...tramiteConfigs
    };
    
    // Devolver configuración o default
    return allConfigs[estado] || {
      label: estado.toString(),
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      dotColor: 'bg-gray-400',
      icon: this.showIcon ? 'fas fa-question' : undefined
    };
  }
  
  private getSizeClasses(): string {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base'
    };
    return sizes[this.size];
  }
  
  private getVariantClasses(config: BadgeConfig): string {
    switch (this.variant) {
      case 'outline':
        return `border ${config.textColor} ${config.bgColor} bg-opacity-50`;
      case 'solid':
        return `${config.dotColor} text-white border-transparent`;
      default:
        return `${config.bgColor} ${config.textColor} border border-transparent`;
    }
  }
}
