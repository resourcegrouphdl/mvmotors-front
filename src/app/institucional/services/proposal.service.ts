import { inject, Injectable, signal, computed } from '@angular/core';
import { Proposal, Negotiation, NewProposal } from '../detalles-tienda/detalles-tienda.component';

import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Query,
  Unsubscribe,
} from '@angular/fire/firestore';

// Interface para productos en lista oficial
export interface OfficialProduct {
  id: string;
  uidTienda: string;
  marca: string;
  modelo: string;
  precio: number;
  fechaAprobacion: string;
  propuestaOriginalId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  private _firestore = inject(Firestore);
  private _proposalsCollection = collection(this._firestore, 'proposals');
  private _officialProductsCollection = collection(this._firestore, 'official_products');
  
  // Signals para propuestas
  private _proposalsSignal = signal<Proposal[]>([]);
  private _loadingProposalsSignal = signal<boolean>(false);
  private _errorProposalsSignal = signal<string | null>(null);
  
  // Signals para productos oficiales
  private _officialProductsSignal = signal<OfficialProduct[]>([]);
  private _loadingOfficialSignal = signal<boolean>(false);
  private _errorOfficialSignal = signal<string | null>(null);
  
  // Listeners activos
  private _proposalsListener: Unsubscribe | null = null;
  private _officialProductsListener: Unsubscribe | null = null;

  // Computed signals públicos
  public readonly proposals = this._proposalsSignal.asReadonly();
  public readonly officialProducts = this._officialProductsSignal.asReadonly();
  
  // Filtros por estado (solo para propuestas)
  public readonly pendingProposals = computed(() => 
    this._proposalsSignal().filter(p => p.estado === 'pendiente')
  );
  public readonly rejectedProposals = computed(() => 
    this._proposalsSignal().filter(p => p.estado === 'rechazado')
  );

  constructor() {
    console.log('ProposalService inicializado');
  }

  /**
   * Inicializar listeners para una tienda específica
   */
  initializeForStore(uidTienda: string): void {
    console.log('Inicializando listeners para tienda:', uidTienda);
    this.startProposalsListener(uidTienda);
    this.startOfficialProductsListener(uidTienda);
  }

  /**
   * Listener para propuestas (pendientes y rechazadas solamente)
   */
  private startProposalsListener(uidTienda: string): void {
    this.stopProposalsListener();
    
    this._loadingProposalsSignal.set(true);
    this._errorProposalsSignal.set(null);

    const q = query(
      this._proposalsCollection, 
      where('uidTienda', '==', uidTienda)
    );

    this._proposalsListener = onSnapshot(
      q,
      (querySnapshot) => {
        console.log('Propuestas recibidas:', querySnapshot.size);
        
        const proposals: Proposal[] = [];
        
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          
          if (!data['marca'] || !data['modelo']) {
            console.warn('Propuesta con datos incompletos:', docSnapshot.id);
            return;
          }
          
          const proposal: Proposal = {
            id: docSnapshot.id,
            uidTienda: data['uidTienda'] || '',
            marca: data['marca'] || '',
            modelo: data['modelo'] || '',
            precio: typeof data['precio'] === 'number' ? data['precio'] : 0,
            estado: data['estado'] || 'pendiente',
            fechaCreacion: data['fechaCreacion'] || this.getCurrentISOString(),
            fechaAprobacion: data['fechaAprobacion'],
            motivoRechazo: data['motivoRechazo'],
            negociaciones: Array.isArray(data['negociaciones']) ? data['negociaciones'] : [],
          };
          
          // Solo incluir propuestas no aprobadas (las aprobadas están en official_products)
          if (proposal.estado !== 'aprobado') {
            proposals.push(proposal);
          }
        });

        // Ordenar por fecha (más recientes primero)
        proposals.sort((a, b) => {
          const dateA = new Date(a.fechaCreacion);
          const dateB = new Date(b.fechaCreacion);
          return dateB.getTime() - dateA.getTime();
        });

        this._proposalsSignal.set(proposals);
        this._loadingProposalsSignal.set(false);
        
        console.log('Propuestas actualizadas:', {
          pendientes: proposals.filter(p => p.estado === 'pendiente').length,
          rechazadas: proposals.filter(p => p.estado === 'rechazado').length
        });
      },
      (error) => {
        console.error('Error en listener propuestas:', error);
        this._errorProposalsSignal.set('Error al cargar propuestas');
        this._loadingProposalsSignal.set(false);
      }
    );
  }

  /**
   * Listener para productos oficiales (aprobados)
   */
  private startOfficialProductsListener(uidTienda: string): void {
    this.stopOfficialProductsListener();
    
    this._loadingOfficialSignal.set(true);
    this._errorOfficialSignal.set(null);

    const q = query(
      this._officialProductsCollection, 
      where('uidTienda', '==', uidTienda)
    );

    this._officialProductsListener = onSnapshot(
      q,
      (querySnapshot) => {
        console.log('Productos oficiales recibidos:', querySnapshot.size);
        
        const products: OfficialProduct[] = [];
        
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          
          const product: OfficialProduct = {
            id: docSnapshot.id,
            uidTienda: data['uidTienda'] || '',
            marca: data['marca'] || '',
            modelo: data['modelo'] || '',
            precio: typeof data['precio'] === 'number' ? data['precio'] : 0,
            fechaAprobacion: data['fechaAprobacion'] || this.getCurrentISOString(),
            propuestaOriginalId: data['propuestaOriginalId'] || '',
          };
          
          products.push(product);
        });

        // Ordenar por fecha de aprobación (más recientes primero)
        products.sort((a, b) => {
          const dateA = new Date(a.fechaAprobacion);
          const dateB = new Date(b.fechaAprobacion);
          return dateB.getTime() - dateA.getTime();
        });

        this._officialProductsSignal.set(products);
        this._loadingOfficialSignal.set(false);
        
        console.log('Productos oficiales actualizados:', products.length);
      },
      (error) => {
        console.error('Error en listener productos oficiales:', error);
        this._errorOfficialSignal.set('Error al cargar productos oficiales');
        this._loadingOfficialSignal.set(false);
      }
    );
  }

  /**
   * Crear nueva propuesta (solo función de tienda)
   */
  async addProposal(newProposal: NewProposal, uidTienda: string): Promise<string> {
    console.log('Creando nueva propuesta:', { ...newProposal, uidTienda });
    this._loadingProposalsSignal.set(true);
    this._errorProposalsSignal.set(null);

    try {
      const proposalData = {
        uidTienda,
        marca: newProposal.marca,
        modelo: newProposal.modelo,
        precio: parseFloat(newProposal.precio),
        estado: 'pendiente' as const,
        fechaCreacion: this.getCurrentISOString(),
        negociaciones: [],
        _serverTimestamp: serverTimestamp(),
      };

      const docRef = await addDoc(this._proposalsCollection, proposalData);
      
      console.log('Propuesta creada con ID:', docRef.id);
      this._loadingProposalsSignal.set(false);
      
      return docRef.id;
    } catch (error) {
      console.error('Error al crear propuesta:', error);
      this._errorProposalsSignal.set('Error al crear la propuesta');
      this._loadingProposalsSignal.set(false);
      throw error;
    }
  }

  /**
   * Agregar negociación a propuesta rechazada
   */
  async addNegotiation(
    proposalId: string, 
    mensaje: string, 
    autor: 'tienda' | 'financiera' = 'tienda'
  ): Promise<void> {
    console.log('Agregando negociación:', proposalId, { mensaje, autor });
    this._loadingProposalsSignal.set(true);

    try {
      const proposal = await this.getProposalById(proposalId);
      if (!proposal) {
        throw new Error(`Propuesta con ID ${proposalId} no encontrada`);
      }

      const negotiation: Negotiation = {
        id: crypto.randomUUID(),
        mensaje,
        autor,
        fecha: this.getCurrentISOString(),
      };

      const updatedNegotiations = [...proposal.negociaciones, negotiation];

      await updateDoc(doc(this._firestore, 'proposals', proposalId), {
        negociaciones: updatedNegotiations,
        _lastUpdated: serverTimestamp(),
      });

      console.log('Negociación agregada');
      this._loadingProposalsSignal.set(false);
    } catch (error) {
      console.error('Error al agregar negociación:', error);
      this._errorProposalsSignal.set('Error al agregar negociación');
      this._loadingProposalsSignal.set(false);
      throw error;
    }
  }

  /**
   * Obtener propuesta por ID (método interno)
   */
  private async getProposalById(proposalId: string): Promise<Proposal | null> {
    try {
      const docSnap = await getDoc(doc(this._firestore, 'proposals', proposalId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          uidTienda: data['uidTienda'],
          marca: data['marca'],
          modelo: data['modelo'],
          precio: data['precio'],
          estado: data['estado'],
          fechaCreacion: data['fechaCreacion'],
          fechaAprobacion: data['fechaAprobacion'],
          motivoRechazo: data['motivoRechazo'],
          negociaciones: data['negociaciones'] || [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener propuesta:', error);
      throw error;
    }
  }

  /**
   * Filtrar propuestas por estado
   */
  getProposalsByStatus(estado: 'pendiente' | 'rechazado'): Proposal[] {
    return this._proposalsSignal().filter(p => p.estado === estado);
  }

  /**
   * Detener listeners
   */
  stopProposalsListener(): void {
    if (this._proposalsListener) {
      console.log('Deteniendo listener propuestas');
      this._proposalsListener();
      this._proposalsListener = null;
    }
  }

  stopOfficialProductsListener(): void {
    if (this._officialProductsListener) {
      console.log('Deteniendo listener productos oficiales');
      this._officialProductsListener();
      this._officialProductsListener = null;
    }
  }

  stopAllListeners(): void {
    this.stopProposalsListener();
    this.stopOfficialProductsListener();
  }

  /**
   * Utilidades de formateo
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  }

  formatDate(isoDateString: string): string {
    if (!isoDateString) return 'Fecha no disponible';
    
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private getCurrentISOString(): string {
    return new Date().toISOString();
  }

  /**
   * Estadísticas combinadas
   */
  get stats() {
    return computed(() => {
      const proposals = this._proposalsSignal();
      const officialProducts = this._officialProductsSignal();
      
      return {
        total: proposals.length + officialProducts.length,
        pendientes: proposals.filter(p => p.estado === 'pendiente').length,
        aprobadas: officialProducts.length,
        rechazadas: proposals.filter(p => p.estado === 'rechazado').length,
      };
    });
  }

  // Getters de estado
  get isLoading(): boolean {
    return this._loadingProposalsSignal() || this._loadingOfficialSignal();
  }

  get hasError(): boolean {
    return this._errorProposalsSignal() !== null || this._errorOfficialSignal() !== null;
  }

  get errorMessage(): string | null {
    return this._errorProposalsSignal() || this._errorOfficialSignal();
  }

  clearErrors(): void {
    this._errorProposalsSignal.set(null);
    this._errorOfficialSignal.set(null);
  }

  ngOnDestroy(): void {
    console.log('Limpiando ProposalService');
    this.stopAllListeners();
  }
}