import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy,
  deleteDoc,
  writeBatch
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from '@angular/fire/storage';
import { Observable, from, combineLatest, map } from 'rxjs';
import { Cliente } from '../model/cliente';
import { Referencia } from '../model/referencia';
import { VehiculoSolicitado } from '../model/vehiculo-solicitado';
import { SolicitudDeCredito } from '../model/solicitud-de-credito';
import { FormularioEstado } from '../componentes/solicitud-financiamiento/solicitud-financiamiento.component';
import { EstadoSolicitud, TipoDeCliente } from '../model/enums';
import { environment } from '../../acces-data-services/envinments';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFotmularioService {

  

   constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  // =============== CLIENTES ===============
  
  async crearCliente(cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const clientesRef = collection(this.firestore, environment.PATH_TABLE_CLIENTES_v1);
    const nuevoCliente = {
      ...cliente,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(clientesRef, nuevoCliente);
    return docRef.id;
  }

  async actualizarCliente(id: string, datos: Partial<Cliente>): Promise<void> {
    const clienteRef = doc(this.firestore, environment.PATH_TABLE_CLIENTES_v1, id);
    await updateDoc(clienteRef, {
      ...datos,
      updatedAt: new Date()
    });
  }

  async buscarClientePorDNI(documentNumber: string): Promise<Cliente | null> {
    const q = query(
      collection(this.firestore, environment.PATH_TABLE_CLIENTES_v1),
      where('documentNumber', '==', documentNumber)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Cliente;
  }

  async obtenerCliente(id: string): Promise<Cliente | null> {
    const clienteRef = doc(this.firestore, environment.PATH_TABLE_CLIENTES_v1, id);
    const clienteSnap = await getDoc(clienteRef);
    
    if (clienteSnap.exists()) {
      return { id: clienteSnap.id, ...clienteSnap.data() } as Cliente;
    }
    return null;
  }

  // =============== REFERENCIAS ===============

  async crearReferencia(referencia: Omit<Referencia, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const referenciasRef = collection(this.firestore, environment.PATH_TABLE_REFERENCIAS);
    const nuevaReferencia = {
      ...referencia,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(referenciasRef, nuevaReferencia);
    return docRef.id;
  }

  async obtenerReferenciasPorTitular(titularId: string): Promise<Referencia[]> {
    const q = query(
      collection(this.firestore, environment.PATH_TABLE_REFERENCIAS),
      where('titularId', '==', titularId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Referencia[];
  }

  async eliminarReferencia(id: string): Promise<void> {
    const referenciaRef = doc(this.firestore, environment.PATH_TABLE_REFERENCIAS, id);
    await deleteDoc(referenciaRef);
  }

  // =============== VEHÍCULOS ===============

  async crearVehiculo(vehiculo: Omit<VehiculoSolicitado, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const vehiculosRef = collection(this.firestore, environment.PATH_TABLE_VEHICULOS);
    const nuevoVehiculo = {
      ...vehiculo,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(vehiculosRef, nuevoVehiculo);
    return docRef.id;
  }

  async obtenerVehiculo(id: string): Promise<VehiculoSolicitado | null> {
    const vehiculoRef = doc(this.firestore, environment.PATH_TABLE_VEHICULOS, id);
    const vehiculoSnap = await getDoc(vehiculoRef);
    
    if (vehiculoSnap.exists()) {
      return { id: vehiculoSnap.id, ...vehiculoSnap.data() } as VehiculoSolicitado;
    }
    return null;
  }

  // =============== SOLICITUDES ===============

  async crearSolicitud(solicitud: Omit<SolicitudDeCredito, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const solicitudesRef = collection(this.firestore, 'solicitudes');
    const nuevaSolicitud = {
      ...solicitud,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(solicitudesRef, nuevaSolicitud);
    return docRef.id;
  }

  async actualizarSolicitud(id: string, datos: Partial<SolicitudDeCredito>): Promise<void> {
    const solicitudRef = doc(this.firestore, environment.PATH_TABLE_SOLICITUDES, id);
    await updateDoc(solicitudRef, {
      ...datos,
      updatedAt: new Date()
    });
  }

  async obtenerSolicitud(id: string): Promise<SolicitudDeCredito | null> {
    const solicitudRef = doc(this.firestore, environment.PATH_TABLE_SOLICITUDES, id);
    const solicitudSnap = await getDoc(solicitudRef);
    
    if (solicitudSnap.exists()) {
      return { id: solicitudSnap.id, ...solicitudSnap.data() } as SolicitudDeCredito;
    }
    return null;
  }

  async obtenerSolicitudesPorCliente(clienteId: string): Promise<SolicitudDeCredito[]> {
    const q = query(
      collection(this.firestore, environment.PATH_TABLE_SOLICITUDES),
      where('titularId', '==', clienteId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SolicitudDeCredito[];
  }

  // =============== ARCHIVOS ===============

  async subirArchivo(archivo: File, ruta: string): Promise<string> {
    const archivoRef = ref(this.storage, ruta);
    const snapshot = await uploadBytes(archivoRef, archivo);
    return await getDownloadURL(snapshot.ref);
  }

  async eliminarArchivo(ruta: string): Promise<void> {
    const archivoRef = ref(this.storage, ruta);
    await deleteObject(archivoRef);
  }

  // =============== PROCESO COMPLETO ===============

  async guardarSolicitudCompleta(formulario: FormularioEstado): Promise<string> {
    const batch = writeBatch(this.firestore);
    
    try {
      // 1. Crear o actualizar titular
      let titularId: string;
      const titularExistente = await this.buscarClientePorDNI(formulario.datosCliente.documentNumber!);
      
      if (titularExistente) {
        titularId = titularExistente.id;
        await this.actualizarCliente(titularId, {
          ...formulario.datosCliente,
          tipo: TipoDeCliente.TITULAR
        });
      } else {
        titularId = await this.crearCliente({
          ...formulario.datosCliente as Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>,
          tipo: TipoDeCliente.TITULAR
        });
      }

      // 2. Subir archivos del titular si existen
      if (formulario.archivosSubidos && Object.keys(formulario.archivosSubidos).length > 0) {
        const archivosUrls: any = {};
        
        for (const [tipo, archivo] of Object.entries(formulario.archivosSubidos)) {
          if (archivo) {
            const ruta = `${environment.PATH_STORAGE_CLIENTES}/${titularId}/${tipo}_${Date.now()}`;
            archivosUrls[tipo] = await this.subirArchivo(archivo, ruta);
          }
        }

        await this.actualizarCliente(titularId, { archivos: archivosUrls });
      }

      // 3. Crear fiador si existe
      let fiadorId: string | undefined;
      if (formulario.datosFiador && formulario.datosFiador.documentNumber) {
        const fiadorExistente = await this.buscarClientePorDNI(formulario.datosFiador.documentNumber);
        
        if (fiadorExistente) {
          fiadorId = fiadorExistente.id;
          await this.actualizarCliente(fiadorId, {
            ...formulario.datosFiador,
            tipo: TipoDeCliente.FIADOR
          });
        } else {
          fiadorId = await this.crearCliente({
            ...formulario.datosFiador as Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>,
            tipo: TipoDeCliente.FIADOR
          });
        }
      }

      // 4. Crear referencias
      const referenciasIds: string[] = [];
      for (const referencia of formulario.referencias) {
        const referenciaId = await this.crearReferencia({
          ...referencia,
          titularId
        });
        referenciasIds.push(referenciaId);
      }

      // 5. Crear vehículo
      const vehiculoId = await this.crearVehiculo(
        formulario.vehiculo as Omit<VehiculoSolicitado, 'id' | 'createdAt' | 'updatedAt'>
      );

      // 6. Crear solicitud
      const solicitudId = await this.crearSolicitud({
        ...formulario.solicitud as Omit<SolicitudDeCredito, 'id' | 'createdAt' | 'updatedAt'>,
        titularId,
        fiadorId,
        vehiculoId,
        referenciasIds,
        estado: EstadoSolicitud.PENDIENTE
      });

      return solicitudId;

    } catch (error) {
      console.error('Error al guardar solicitud completa:', error);
      throw error;
    }
  }

  // =============== UTILIDADES ===============

  calcularMontoCuota(precio: number, inicial: number, plazoQuincenas: number): number {
    const montoFinanciar = precio - inicial;
    // Aquí puedes agregar la lógica de intereses
    return montoFinanciar / plazoQuincenas;
  }

  generarIdSolicitud(): string {
    return `SOL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

