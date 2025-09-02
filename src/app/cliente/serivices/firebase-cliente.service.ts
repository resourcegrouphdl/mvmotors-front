import { inject, Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signInAnonymously, user } from '@angular/fire/auth';
import { BehaviorSubject, catchError, combineLatest, finalize, from, map, Observable, switchMap, throwError } from 'rxjs';
import { Cliente } from '../model/cliente';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';
import { TipoDeCliente } from '../model/enums';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, increment, limit, orderBy, query, QueryDocumentSnapshot, serverTimestamp, startAfter, updateDoc, where } from '@angular/fire/firestore';
import { validarCliente } from '../model/auxiliares';
import { Storage } from '@angular/fire/storage';

export interface FirebaseResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
  id?: string;
}

export interface FileUploadProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
  downloadURL?: string;
  error?: any;
  completed: boolean;
}

export interface ClienteQueryOptions {
  tipo?: TipoDeCliente;
  departamento?: string;
  provincia?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  limite?: number;
  ultimoDoc?: QueryDocumentSnapshot;
}

export interface EstadisticasClientes {
  totalClientes: number;
  clientesPorTipo: { [key in TipoDeCliente]: number };
  clientesPorDepartamento: { [key: string]: number };
  clientesRecientes: number; // últimos 30 días
  documentosPendientes: number;
}

export interface DocumentoFirebase {
  id: string;
  clienteId: string;
  tipo: string;
  url: string;
  nombreOriginal: string;
  tamaño: number;
  mimeType: string;
  fechaSubida: Date;
  verificado: boolean;
  observaciones?: string;
  subidoPor?: string;
}


@Injectable({
  providedIn: 'root'
})
export class FirebaseClienteService {



// ========================================
// SERVICIO PRINCIPAL
// ========================================


  // INYECCIONES DE FIREBASE
  // ========================================
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private auth = inject(Auth);

  // ========================================
  // COLECCIONES DE FIRESTORE
  // ========================================
  private readonly CLIENTES_COLLECTION = 'clientes';
  private readonly DOCUMENTOS_COLLECTION = 'documentos';
  private readonly SOLICITUDES_COLLECTION = 'solicitudes';
  private readonly REFERENCIAS_COLLECTION = 'referencias';
  private readonly ESTADISTICAS_COLLECTION = 'estadisticas';

  // ========================================
  // SUBJECTS REACTIVOS
  // ========================================
  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  private cargandoSubject = new BehaviorSubject<boolean>(false);
  private clienteActualSubject = new BehaviorSubject<Cliente | null>(null);
  private estadisticasSubject = new BehaviorSubject<EstadisticasClientes | null>(null);

  // ========================================
  // OBSERVABLES PÚBLICOS
  // ========================================
  public clientes$ = this.clientesSubject.asObservable();
  public cargando$ = this.cargandoSubject.asObservable();
  public clienteActual$ = this.clienteActualSubject.asObservable();
  public estadisticas$ = this.estadisticasSubject.asObservable();
  public usuario$ = user(this.auth);

  // ========================================
  // CONSTRUCTOR
  // ========================================
  constructor() {
    this.inicializarAuth();
    this.cargarEstadisticas();
  }

  // ========================================
  // INICIALIZACIÓN Y AUTENTICACIÓN
  // ========================================
  private async inicializarAuth(): Promise<void> {
    try {
      // Autenticación anónima si no hay usuario
      onAuthStateChanged(this.auth, async (usuario) => {
        if (!usuario) {
          await signInAnonymously(this.auth);
        }
      });
    } catch (error) {
      console.error('Error en inicialización de auth:', error);
    }
  }

  // ========================================
  // CRUD DE CLIENTES
  // ========================================

  /**
   * Crear un nuevo cliente en Firestore
   */
  crearCliente(clienteData: Partial<Cliente>): Observable<FirebaseResponse<Cliente>> {
    return new Observable(observer => {
      this.cargandoSubject.next(true);
      
      // Validar datos
      const errores = validarCliente(clienteData);
      if (errores.length > 0) {
        observer.next({
          success: false,
          message: 'Datos inválidos',
          errors: errores
        });
        observer.complete();
        this.cargandoSubject.next(false);
        return;
      }

      // Preparar datos para Firestore
      const clienteParaFirestore = {
        ...clienteData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        activo: true,
        version: 1
      };

      // Guardar en Firestore
      const clientesRef = collection(this.firestore, this.CLIENTES_COLLECTION);
      
      from(addDoc(clientesRef, clienteParaFirestore))
        .pipe(
          switchMap(async (docRef) => {
            // Obtener el documento creado con su ID
            const docSnap = await getDoc(docRef);
            const clienteCreado: Cliente = {
              id: docRef.id,
              ...docSnap.data(),
              createdAt: docSnap.data()?.['createdAt']?.toDate() || new Date(),
              updatedAt: docSnap.data()?.['updatedAt']?.toDate() || new Date()
            } as Cliente;

            // Actualizar estadísticas
            await this.actualizarEstadisticas('nuevo_cliente', clienteCreado.tipo);

            return clienteCreado;
          }),
          catchError(error => {
            console.error('Error al crear cliente:', error);
            return throwError(() => ({
              success: false,
              message: 'Error al guardar el cliente en la base de datos',
              errors: [error.message]
            }));
          }),
          finalize(() => this.cargandoSubject.next(false))
        )
        .subscribe({
          next: (cliente) => {
            this.clienteActualSubject.next(cliente);
            observer.next({
              success: true,
              data: cliente,
              message: 'Cliente creado exitosamente',
              id: cliente.id
            });
            observer.complete();
          },
          error: (error) => {
            observer.next(error);
            observer.complete();
          }
        });
    });
  }

  /**
   * Obtener cliente por ID
   */
  obtenerCliente(id: string): Observable<FirebaseResponse<Cliente>> {
    this.cargandoSubject.next(true);
    
    const clienteRef = doc(this.firestore, this.CLIENTES_COLLECTION, id);
    
    return from(getDoc(clienteRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          return {
            success: false,
            message: 'Cliente no encontrado'
          };
        }

        const cliente: Cliente = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data()?.['createdAt']?.toDate() || new Date(),
          updatedAt: docSnap.data()?.['updatedAt']?.toDate() || new Date()
        } as Cliente;

        this.clienteActualSubject.next(cliente);

        return {
          success: true,
          data: cliente,
          message: 'Cliente obtenido exitosamente'
        };
      }),
      catchError(error => {
        console.error('Error al obtener cliente:', error);
        return throwError(() => ({
          success: false,
          message: 'Error al obtener el cliente',
          errors: [error.message]
        }));
      }),
      finalize(() => this.cargandoSubject.next(false))
    );
  }

  /**
   * Actualizar cliente existente
   */
  actualizarCliente(id: string, clienteData: Partial<Cliente>): Observable<FirebaseResponse<Cliente>> {
    this.cargandoSubject.next(true);

    const clienteRef = doc(this.firestore, this.CLIENTES_COLLECTION, id);
    const datosActualizacion = {
      ...clienteData,
      updatedAt: serverTimestamp(),
      version: increment(1)
    };

    return from(updateDoc(clienteRef, datosActualizacion)).pipe(
      switchMap(() => this.obtenerCliente(id)),
      map(response => ({
        ...response,
        message: 'Cliente actualizado exitosamente'
      })),
      catchError(error => {
        console.error('Error al actualizar cliente:', error);
        return throwError(() => ({
          success: false,
          message: 'Error al actualizar el cliente',
          errors: [error.message]
        }));
      }),
      finalize(() => this.cargandoSubject.next(false))
    );
  }

  /**
   * Eliminar cliente (soft delete)
   */
  eliminarCliente(id: string): Observable<FirebaseResponse<boolean>> {
    this.cargandoSubject.next(true);

    const clienteRef = doc(this.firestore, this.CLIENTES_COLLECTION, id);
    
    return from(updateDoc(clienteRef, { 
      activo: false, 
      eliminadoAt: serverTimestamp() 
    })).pipe(
      map(() => ({
        success: true,
        data: true,
        message: 'Cliente eliminado exitosamente'
      })),
      catchError(error => {
        console.error('Error al eliminar cliente:', error);
        return throwError(() => ({
          success: false,
          message: 'Error al eliminar el cliente',
          errors: [error.message]
        }));
      }),
      finalize(() => this.cargandoSubject.next(false))
    );
  }

  /**
   * Listar clientes con filtros y paginación
   */
  listarClientes(opciones: ClienteQueryOptions = {}): Observable<FirebaseResponse<Cliente[]>> {
    this.cargandoSubject.next(true);

    let consulta = query(
      collection(this.firestore, this.CLIENTES_COLLECTION),
      where('activo', '==', true),
      orderBy('createdAt', 'desc')
    );

    // Aplicar filtros
    if (opciones.tipo) {
      consulta = query(consulta, where('tipo', '==', opciones.tipo));
    }

    if (opciones.departamento) {
      consulta = query(consulta, where('departamento', '==', opciones.departamento));
    }

    if (opciones.provincia) {
      consulta = query(consulta, where('provincia', '==', opciones.provincia));
    }

    // Aplicar límite
    if (opciones.limite) {
      consulta = query(consulta, limit(opciones.limite));
    }

    // Aplicar paginación
    if (opciones.ultimoDoc) {
      consulta = query(consulta, startAfter(opciones.ultimoDoc));
    }

    return from(getDocs(consulta)).pipe(
      map(snapshot => {
        const clientes: Cliente[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date()
        })) as Cliente[];

        this.clientesSubject.next(clientes);

        return {
          success: true,
          data: clientes,
          message: `${clientes.length} clientes obtenidos exitosamente`
        };
      }),
      catchError(error => {
        console.error('Error al listar clientes:', error);
        return throwError(() => ({
          success: false,
          message: 'Error al obtener los clientes',
          errors: [error.message]
        }));
      }),
      finalize(() => this.cargandoSubject.next(false))
    );
  }

  /**
   * Buscar cliente por número de documento
   */
  buscarClientePorDocumento(tipoDocumento: string, numeroDocumento: string): Observable<FirebaseResponse<Cliente | null>> {
    this.cargandoSubject.next(true);

    const consulta = query(
      collection(this.firestore, this.CLIENTES_COLLECTION),
      where('documentType', '==', tipoDocumento),
      where('documentNumber', '==', numeroDocumento),
      where('activo', '==', true),
      limit(1)
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          return {
            success: true,
            data: null,
            message: 'No se encontró cliente con ese documento'
          };
        }

        const doc = snapshot.docs[0];
        const cliente: Cliente = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date()
        } as Cliente;

        return {
          success: true,
          data: cliente,
          message: 'Cliente encontrado'
        };
      }),
      catchError(error => {
        console.error('Error al buscar cliente:', error);
        return throwError(() => ({
          success: false,
          message: 'Error al buscar el cliente',
          errors: [error.message]
        }));
      }),
      finalize(() => this.cargandoSubject.next(false))
    );
  }

  // ========================================
  // MANEJO DE ARCHIVOS CON FIREBASE STORAGE
  // ========================================

  /**
   * Subir archivo a Firebase Storage
   */
  subirArchivo(
    archivo: File, 
    clienteId: string, 
    tipoArchivo: string
  ): Observable<FileUploadProgress> {
    
    return new Observable(observer => {
      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const extension = archivo.name.split('.').pop();
      const nombreArchivo = `${tipoArchivo}_${timestamp}.${extension}`;
      
      // Referencia en Storage
      const rutaArchivo = `clientes/${clienteId}/${nombreArchivo}`;
      const storageRef = ref(this.storage, rutaArchivo);

      // Subir archivo con progreso
      const uploadTask = uploadBytesResumable(storageRef, archivo);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progreso
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next({
            progress,
            snapshot,
            completed: false
          });
        },
        (error) => {
          // Error
          console.error('Error al subir archivo:', error);
          observer.next({
            progress: 0,
            snapshot: {} as UploadTaskSnapshot,
            error,
            completed: false
          });
          observer.error(error);
        },
        async () => {
          // Completado
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Guardar información del documento en Firestore
            await this.guardarDocumentoEnFirestore({
              clienteId,
              tipo: tipoArchivo,
              url: downloadURL,
              nombreOriginal: archivo.name,
              tamaño: archivo.size,
              mimeType: archivo.type,
              fechaSubida: new Date(),
              verificado: false
            });

            observer.next({
              progress: 100,
              snapshot: uploadTask.snapshot,
              downloadURL,
              completed: true
            });
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        }
      );
    });
  }

  /**
   * Subir múltiples archivos
   */
  subirMultiplesArchivos(
    archivos: { [key: string]: File }, 
    clienteId: string
  ): Observable<{ [key: string]: FileUploadProgress }> {
    
    const uploads: { [key: string]: Observable<FileUploadProgress> } = {};
    
    Object.keys(archivos).forEach(tipoArchivo => {
      uploads[tipoArchivo] = this.subirArchivo(archivos[tipoArchivo], clienteId, tipoArchivo);
    });

    return combineLatest(uploads).pipe(
      map(resultados => resultados)
    );
  }

  /**
   * Eliminar archivo de Storage
   */
  eliminarArchivo(url: string): Observable<boolean> {
    const storageRef = ref(this.storage, url);
    
    return from(deleteObject(storageRef)).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error al eliminar archivo:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener documentos de un cliente
   */
  obtenerDocumentosCliente(clienteId: string): Observable<DocumentoFirebase[]> {
    const consulta = query(
      collection(this.firestore, this.DOCUMENTOS_COLLECTION),
      where('clienteId', '==', clienteId),
      orderBy('fechaSubida', 'desc')
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaSubida: doc.data()?.['fechaSubida']?.toDate() || new Date()
        })) as DocumentoFirebase[];
      }),
      catchError(error => {
        console.error('Error al obtener documentos:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Guardar información del documento en Firestore
   */
  private async guardarDocumentoEnFirestore(documento: Omit<DocumentoFirebase, 'id'>): Promise<void> {
    try {
      const documentosRef = collection(this.firestore, this.DOCUMENTOS_COLLECTION);
      await addDoc(documentosRef, {
        ...documento,
        fechaSubida: serverTimestamp(),
        subidoPor: this.auth.currentUser?.uid || 'anonimo'
      });
    } catch (error) {
      console.error('Error al guardar documento en Firestore:', error);
      throw error;
    }
  }

  // ========================================
  // ESTADÍSTICAS Y REPORTING
  // ========================================

  /**
   * Cargar estadísticas generales
   */
  private async cargarEstadisticas(): Promise<void> {
    try {
      // Obtener estadísticas básicas
      const clientesSnapshot = await getDocs(
        query(collection(this.firestore, this.CLIENTES_COLLECTION), where('activo', '==', true))
      );

      const clientes = clientesSnapshot.docs.map(doc => doc.data() as Cliente);

      // Calcular estadísticas
      const estadisticas: EstadisticasClientes = {
        totalClientes: clientes.length,
        clientesPorTipo: {
          [TipoDeCliente.TITULAR]: clientes.filter(c => c.tipo === TipoDeCliente.TITULAR).length,
          [TipoDeCliente.FIADOR]: clientes.filter(c => c.tipo === TipoDeCliente.FIADOR).length
        },
        clientesPorDepartamento: {},
        clientesRecientes: 0,
        documentosPendientes: 0
      };

      // Agrupar por departamento
      clientes.forEach(cliente => {
        if (cliente.departamento) {
          estadisticas.clientesPorDepartamento[cliente.departamento] = 
            (estadisticas.clientesPorDepartamento[cliente.departamento] || 0) + 1;
        }
      });

      // Clientes de los últimos 30 días
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      
      estadisticas.clientesRecientes = clientes.filter(cliente => {
        const fechaCreacion = cliente.createdAt instanceof Date 
          ? cliente.createdAt 
          : new Date(cliente.createdAt);
        return fechaCreacion >= hace30Dias;
      }).length;

      this.estadisticasSubject.next(estadisticas);

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  /**
   * Actualizar estadísticas cuando ocurre un evento
   */
  private async actualizarEstadisticas(evento: string, data?: any): Promise<void> {
    try {
      const estadisticasRef = doc(this.firestore, this.ESTADISTICAS_COLLECTION, 'general');
      
      const actualizaciones: any = {
        ultimaActualizacion: serverTimestamp()
      };

      switch (evento) {
        case 'nuevo_cliente':
          actualizaciones.totalClientes = increment(1);
          if (data === TipoDeCliente.TITULAR) {
            actualizaciones.clientesTitulares = increment(1);
          } else {
            actualizaciones.clientesFiadores = increment(1);
          }
          break;
        
        case 'documento_subido':
          actualizaciones.documentosSubidos = increment(1);
          break;
      }

      await updateDoc(estadisticasRef, actualizaciones);
      
      // Recargar estadísticas
      await this.cargarEstadisticas();

    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
    }
  }

  // ========================================
  // UTILIDADES Y VALIDACIONES
  // ========================================

  /**
   * Validar disponibilidad de número de documento
   */
  validarDisponibilidadDocumento(tipoDocumento: string, numeroDocumento: string): Observable<boolean> {
    return this.buscarClientePorDocumento(tipoDocumento, numeroDocumento).pipe(
      map(response => response.data === null) // Disponible si no se encuentra
    );
  }

  /**
   * Obtener cliente actual del state
   */
  obtenerClienteActual(): Cliente | null {
    return this.clienteActualSubject.value;
  }

  /**
   * Limpiar estado
   */
  limpiarEstado(): void {
    this.clienteActualSubject.next(null);
    this.clientesSubject.next([]);
    this.cargandoSubject.next(false);
  }

  /**
   * Verificar conexión a Firebase
   */
  async verificarConexion(): Promise<boolean> {
    try {
      // Intentar leer una colección simple
      const testQuery = query(
        collection(this.firestore, this.CLIENTES_COLLECTION), 
        limit(1)
      );
      await getDocs(testQuery);
      return true;
    } catch (error) {
      console.error('Error de conexión a Firebase:', error);
      return false;
    }
  }

  // ========================================
  // CLEANUP Y MANTENIMIENTO
  // ========================================

  /**
   * Limpiar archivos huérfanos (sin cliente asociado)
   */
  async limpiarArchivosHuerfanos(): Promise<void> {
    // Esta función requeriría Cloud Functions para ser segura
    // Se implementaría en el backend
    console.warn('Limpieza de archivos debe ejecutarse desde Cloud Functions');
  }

  /**
   * Hacer backup de datos de cliente
   */
  async hacerBackupCliente(clienteId: string): Promise<any> {
    try {
      const cliente = await this.obtenerCliente(clienteId).toPromise();
      const documentos = await this.obtenerDocumentosCliente(clienteId).toPromise();
      
      return {
        cliente: cliente?.data,
        documentos,
        fechaBackup: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al hacer backup:', error);
      throw error;
    }
  }
}