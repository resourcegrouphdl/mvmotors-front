import { inject, Injectable } from '@angular/core';
import { MotocicletaProduct } from '../domain/models/Imotocicleta';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, catchError, map, Observable, of, tap, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  // Variables para almacenar datos
  private producto: MotocicletaProduct | null = null;
  private _firestore = inject(Firestore);
  
  // Caché mejorado con BehaviorSubject
  private motocicletasCache$ = new BehaviorSubject<MotocicletaProduct[] | null>(null);
  private productosDestacadosCache$ = new BehaviorSubject<MotocicletaProduct[] | null>(null);
  
  private _collectionRef = collection(this._firestore, 'motocicleta-producto');
  
  // Observable público para suscripciones reactivas
  public motocicletas$ = this.motocicletasCache$.asObservable();
  public productosDestacados$ = this.productosDestacadosCache$.asObservable();

  constructor() {}

  /**
   * Obtiene todos los productos con caché inteligente
   */
  getAllProducts(): Observable<MotocicletaProduct[]> {
    // Si ya hay datos en caché, los devuelve
    if (this.motocicletasCache$.value) {
      return of(this.motocicletasCache$.value);
    }

    return collectionData(this._collectionRef, { idField: 'id' }).pipe(
      map((data: any[]) => data.map((doc) => doc as MotocicletaProduct)),
      tap((motocicletas) => {
        this.motocicletasCache$.next(motocicletas as MotocicletaProduct[]);
        // Actualizar también el caché de destacados
        this.actualizarProductosDestacados(motocicletas as MotocicletaProduct[]);
      }),
      shareReplay(1), // Compartir la misma respuesta entre múltiples suscriptores
      catchError((error) => {
        console.error('Error al cargar los productos', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene solo los productos destacados
   */
  getProductosDestacados(): Observable<MotocicletaProduct[]> {
    // Si hay caché de destacados, lo devuelve
    if (this.productosDestacadosCache$.value) {
      return of(this.productosDestacadosCache$.value);
    }

    // Si no hay caché de destacados pero sí de todos los productos
    if (this.motocicletasCache$.value) {
      const destacados = this.filtrarDestacados(this.motocicletasCache$.value);
      this.productosDestacadosCache$.next(destacados);
      return of(destacados);
    }

    // Si no hay ningún caché, cargar todo y filtrar
    return this.getAllProducts().pipe(
      map((productos) => this.filtrarDestacados(productos))
    );
  }

  /**
   * Filtra productos destacados considerando que Firebase devuelve strings
   */
  private filtrarDestacados(productos: MotocicletaProduct[]): MotocicletaProduct[] {
    return productos.filter((producto) => {
      const destacado = producto.destacado?.toString().toLowerCase();
      return destacado === 'true' || 
             destacado === '1' || 
             destacado === 'si' || 
             destacado === 'yes';
    });
  }

  /**
   * Actualiza el caché de productos destacados
   */
  private actualizarProductosDestacados(productos: MotocicletaProduct[]): void {
    const destacados = this.filtrarDestacados(productos);
    this.productosDestacadosCache$.next(destacados);
  }

  /**
   * Fuerza la recarga de datos desde Firebase
   */
  recargarProductos(): Observable<MotocicletaProduct[]> {
    // Limpiar caché
    this.motocicletasCache$.next(null);
    this.productosDestacadosCache$.next(null);
    
    return collectionData(this._collectionRef, { idField: 'id' }).pipe(
      map((data: any[]) => data.map((doc) => doc as MotocicletaProduct)),
      tap((motocicletas) => {
        this.motocicletasCache$.next(motocicletas as MotocicletaProduct[]);
        this.actualizarProductosDestacados(motocicletas as MotocicletaProduct[]);
      }),
      catchError((error) => {
        console.error('Error al recargar los productos', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un producto por ID desde el caché o Firebase
   */
  getProductoPorId(id: string): Observable<MotocicletaProduct | null> {
    // Buscar primero en caché
    const cache = this.motocicletasCache$.value;
    if (cache) {
      const producto = cache.find(p => p.id === id);
      if (producto) {
        return of(producto);
      }
    }

    // Si no está en caché, buscarlo en Firebase
    const docRef = doc(this._firestore, 'motocicleta-producto', id);
    return new Observable(observer => {
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          const producto = { id: docSnap.id, ...docSnap.data() } as MotocicletaProduct;
          observer.next(producto);
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch(error => {
        console.error('Error al obtener producto por ID:', error);
        observer.error(error);
      });
    });
  }

  /**
   * Busca productos por categoría
   */
  getProductosPorCategoria(categoria: string): Observable<MotocicletaProduct[]> {
    return this.getAllProducts().pipe(
      map(productos => productos.filter(p => 
        p.categoria?.toLowerCase() === categoria.toLowerCase()
      ))
    );
  }

  /**
   * Busca productos por marca
   */
  getProductosPorMarca(marca: string): Observable<MotocicletaProduct[]> {
    return this.getAllProducts().pipe(
      map(productos => productos.filter(p => 
        p.marca?.toLowerCase() === marca.toLowerCase()
      ))
    );
  }

  // === MÉTODOS PARA PRODUCTO SELECCIONADO ===
  
  /**
   * Establece el producto seleccionado
   */
  setProducto(producto: MotocicletaProduct): void {
    this.producto = producto;
  }

  /**
   * Obtiene el producto seleccionado
   */
  getProducto(): MotocicletaProduct | null {
    return this.producto;
  }

  /**
   * Limpia el producto seleccionado
   */
  clearProducto(): void {
    this.producto = null;
  }

  // === MÉTODOS PARA OBTENER DATOS SÍNCRONOS (desde caché) ===
  
  /**
   * Obtiene todos los productos desde el caché (síncrono)
   */
  getTodosLosProductosSync(): MotocicletaProduct[] {
    return this.motocicletasCache$.value || [];
  }

  /**
   * Obtiene productos destacados desde el caché (síncrono)
   */
  getProductosDestacadosSync(): MotocicletaProduct[] {
    return this.productosDestacadosCache$.value || [];
  }

  /**
   * Verifica si hay datos en caché
   */
  tieneDatosEnCache(): boolean {
    return this.motocicletasCache$.value !== null;
  }

  /**
   * Obtiene el número total de productos
   */
  getTotalProductos(): number {
    return this.motocicletasCache$.value?.length || 0;
  }

  /**
   * Obtiene el número de productos destacados
   */
  getTotalProductosDestacados(): number {
    return this.productosDestacadosCache$.value?.length || 0;
  }

  // === MÉTODOS CRUD (si los necesitas) ===
  
  /**
   * Agrega un nuevo producto
   */
  async addProducto(producto: Omit<MotocicletaProduct, 'id'>): Promise<void> {
    try {
      await addDoc(this._collectionRef, producto);
      // Recargar caché después de agregar
      this.recargarProductos().subscribe();
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }

  /**
   * Actualiza un producto existente
   */
  async updateProducto(id: string, producto: Partial<MotocicletaProduct>): Promise<void> {
    try {
      const docRef = doc(this._firestore, 'motocicleta-producto', id);
      await updateDoc(docRef, producto);
      // Recargar caché después de actualizar
      this.recargarProductos().subscribe();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  /**
   * Elimina un producto
   */
  async deleteProducto(id: string): Promise<void> {
    try {
      const docRef = doc(this._firestore, 'motocicleta-producto', id);
      await deleteDoc(docRef);
      // Recargar caché después de eliminar
      this.recargarProductos().subscribe();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }
}