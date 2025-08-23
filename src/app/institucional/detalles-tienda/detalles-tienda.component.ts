import { Component, inject, OnInit } from '@angular/core';

import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorUser } from '../../models/model-auth';
import { AuthServiceService } from '../../acces-data-services/auth-service.service';
import { Router } from '@angular/router';

// Interfaces para el manejo de clientes
export interface ClientStatus {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  registrationDate: Date;
  currentStage: EvaluationStage;
  stageHistory: StageHistory[];
  priority: 'high' | 'medium' | 'low';
  estimatedValue: number;
  notes?: string;
}

export interface StageHistory {
  stage: EvaluationStage;
  date: Date;
  notes?: string;
  completedBy?: string;
}

export enum EvaluationStage {
  INITIAL_CONTACT = 'initial_contact',
  QUALIFICATION = 'qualification',
  NEEDS_ANALYSIS = 'needs_analysis',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

@Component({
  selector: 'app-detalles-tienda',
  standalone: true,
  imports: [ FormsModule, NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './detalles-tienda.component.html',
  styleUrl: './detalles-tienda.component.css',
})
export class DetallesTiendaComponent implements OnInit {
logout() {
throw new Error('Method not implemented.');
}
getStageText(arg0: EvaluationStage) {
throw new Error('Method not implemented.');
}
viewClientDetails(_t108: ClientStatus) {
throw new Error('Method not implemented.');
}
updateStage(_t108: ClientStatus) {
throw new Error('Method not implemented.');
}
getProgressBarClass(arg0: EvaluationStage) {
throw new Error('Method not implemented.');
}
getStageProgress(arg0: EvaluationStage) {
throw new Error('Method not implemented.');
}
submitNewClient() {
throw new Error('Method not implemented.');
}
cancelNewClient() {
throw new Error('Method not implemented.');
}



  currentUser: VendorUser | null = null;
  clients: ClientStatus[] = [];
  filteredClients: ClientStatus[] = [];
  showNewClientForm = false;
  newClientForm: FormGroup;
  selectedStageFilter = '';
  selectedPriorityFilter = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.newClientForm = this.fb.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      priority: ['medium'],
      estimatedValue: ['', [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    // Inicializar con datos mock
    this.initializeMockData();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.userType === 'vendor') {
        this.currentUser = user as VendorUser;
      } else if (user && user.userType !== 'vendor') {
        this.router.navigate(['/dashboard/store']);
      }
    });

    this.applyFilters();
  }
  applyFilters() {
    throw new Error('Method not implemented.');
  }

  private initializeMockData(): void {
    this.clients = [
      {
        id: '1',
        name: 'Carlos Mendoza',
        company: 'Tech Solutions S.A.',
        email: 'carlos.mendoza@techsolutions.com',
        phone: '+51 987 654 321',
        registrationDate: new Date('2024-01-15'),
        currentStage: EvaluationStage.NEEDS_ANALYSIS,
        stageHistory: [
          { stage: EvaluationStage.INITIAL_CONTACT, date: new Date('2024-01-15'), notes: 'Primer contacto telefónico' },
          { stage: EvaluationStage.QUALIFICATION, date: new Date('2024-01-18'), notes: 'Cliente calificado, interés alto' }
        ],
        priority: 'high',
        estimatedValue: 25000,
        notes: 'Cliente muy interesado en solución ERP'
      },
      {
        id: '2',
        name: 'María Rodriguez',
        company: 'Comercial Lima Norte',
        email: 'maria.rodriguez@comerciallima.com',
        phone: '+51 998 765 432',
        registrationDate: new Date('2024-02-01'),
        currentStage: EvaluationStage.PROPOSAL,
        stageHistory: [
          { stage: EvaluationStage.INITIAL_CONTACT, date: new Date('2024-02-01') },
          { stage: EvaluationStage.QUALIFICATION, date: new Date('2024-02-05') },
          { stage: EvaluationStage.NEEDS_ANALYSIS, date: new Date('2024-02-10') }
        ],
        priority: 'medium',
        estimatedValue: 15000,
        notes: 'Necesita aprobación del directorio'
      },
      {
        id: '3',
        name: 'Roberto Silva',
        company: 'Distribuidora El Centro',
        email: 'r.silva@distribuidora.com',
        phone: '+51 987 123 456',
        registrationDate: new Date('2024-02-10'),
        currentStage: EvaluationStage.INITIAL_CONTACT,
        stageHistory: [
          { stage: EvaluationStage.INITIAL_CONTACT, date: new Date('2024-02-10'), notes: 'Contacto por referencia' }
        ],
        priority: 'low',
        estimatedValue: 8000,
        notes: 'Referido por cliente existente'
      },
      {
        id: '4',
        name: 'Ana Gutierrez',
        company: 'Inversiones del Sur',
        email: 'ana.gutierrez@inversionesdelsur.com',
        phone: '+51 976 543 210',
        registrationDate: new Date('2024-01-28'),
        currentStage: EvaluationStage.NEGOTIATION,
        stageHistory: [
          { stage: EvaluationStage.INITIAL_CONTACT, date: new Date('2024-01-28') },
          { stage: EvaluationStage.QUALIFICATION, date: new Date('2024-02-02') },
          { stage: EvaluationStage.NEEDS_ANALYSIS, date: new Date('2024-02-08') },
          { stage: EvaluationStage.PROPOSAL, date: new Date('2024-02-15') }
        ],
        priority: 'high',
        estimatedValue: 35000,
        notes: 'En negociación final de contrato'
      },
      {
        id: '5',
        name: 'Luis Paredes',
        company: 'Servicios Múltiples SAC',
        email: 'luis.paredes@serviciosmultiples.com',
        phone: '+51 965 432 109',
        registrationDate: new Date('2024-02-12'),
        currentStage: EvaluationStage.QUALIFICATION,
        stageHistory: [
          { stage: EvaluationStage.INITIAL_CONTACT, date: new Date('2024-02-12') }
        ],
        priority: 'medium',
        estimatedValue: 12000,
        notes: 'Interés en módulo de inventarios'
      }
    ];
  }

  getTotalActiveClients(): number {
    return this.clients.filter(c => 
      ![EvaluationStage.CLOSED_WON, EvaluationStage.CLOSED_LOST].includes(c.currentStage)
    ).length;
  }

  getClientsInEvaluation(): number {
    return this.clients.filter(c => 
      ![EvaluationStage.CLOSED_WON, EvaluationStage.CLOSED_LOST, EvaluationStage.INITIAL_CONTACT].includes(c.currentStage)
    ).length;
  }

  getCompletedClients(): number {
    return this.clients.filter(c => c.currentStage === EvaluationStage.CLOSED_WON).length;
  }

  getTotalPipelineValue(): number {
    return this.clients
      .filter(c => ![EvaluationStage.CLOSED_WON, EvaluationStage.CLOSED_LOST].includes(c.currentStage))
      .reduce((sum, client) => sum + client.estimatedValue, 0);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getPriorityClass(priority: string): string {
    const classes = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-gray-100 text-gray-800'
    };
    return classes[priority as keyof typeof classes] || classes.medium;
  }

  getPriorityText(priority: string): string {
    const texts = {
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    return texts[priority as keyof typeof texts] || 'Media';
  }

  getStageClass(stage: EvaluationStage): string {
    const classes = {
      [EvaluationStage.INITIAL_CONTACT]: 'bg-blue-100 text-blue-800',
      [EvaluationStage.QUALIFICATION]: 'bg-purple-100 text-purple-800',
      [EvaluationStage.NEEDS_ANALYSIS]: 'bg-indigo-100 text-indigo-800',
      [EvaluationStage.PROPOSAL]: 'bg-orange-100 text-orange-800',
      [EvaluationStage.NEGOTIATION]: 'bg-yellow-100 text-yellow-800',
      [EvaluationStage.CLOSED_WON]: 'bg-green-100 text-green-800',
      [EvaluationStage.CLOSED_LOST]: 'bg-red-100 text-red-800'
    };
    return classes[stage] || 'bg-gray-100 text-gray-800';
  }
}
