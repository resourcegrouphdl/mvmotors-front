import { inject, Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';
import { forkJoin, from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  /**
   * Constructor de StorageService
   * Inyecta FirebaseStorage para manejar operaciones de almacenamiento
   * @param storage FirebaseStorage inyectado
   */

  constructor(private storage:Storage) { }

  /**
   * Sube múltiples archivos a Firebase Storage
   * @param archivos Array de archivos a subir
   * @param carpeta Carpeta donde guardar los archivos (opcional)
   * @returns Observable con array de URLs
   */
  subirArchivos(archivos: File[], carpeta: string = 'documentos'): Observable<string[]> {
    if (!archivos || archivos.length === 0) {
      return from(Promise.resolve([]));
    }

    // Crear array de observables para subir cada archivo
    const uploadPromises = archivos.map(archivo => this.subirArchivo(archivo, carpeta));
    
    // Ejecutar todas las subidas en paralelo
    return forkJoin(uploadPromises);
  }

  /**
   * Sube un archivo individual a Firebase Storage
   * @param archivo Archivo a subir
   * @param carpeta Carpeta donde guardar
   * @returns Observable con la URL del archivo
   */
  private subirArchivo(archivo: File, carpeta: string): Observable<string> {
    // Generar nombre único para el archivo
    const nombreUnico = this.generarNombreUnico(archivo.name);
    const rutaArchivo = `${carpeta}/${nombreUnico}`;
    
    // Crear referencia al archivo en Firebase Storage
    const archivoRef = ref(this.storage, rutaArchivo);
    
    // Subir archivo y obtener URL
    return from(uploadBytes(archivoRef, archivo)).pipe(
      switchMap(() => getDownloadURL(archivoRef))
    );
  }

  /**
   * Elimina archivos de Firebase Storage usando sus URLs
   * @param urls Array de URLs a eliminar
   * @returns Observable que completa cuando todos los archivos se eliminan
   */
  eliminarArchivos(urls: string[]): Observable<void[]> {
    if (!urls || urls.length === 0) {
      return from(Promise.resolve([]));
    }

    const deletePromises = urls.map(url => this.eliminarArchivoPorUrl(url));
    return forkJoin(deletePromises);
  }

  /**
   * Elimina un archivo individual por su URL
   * @param url URL del archivo a eliminar
   * @returns Observable void
   */
  private eliminarArchivoPorUrl(url: string): Observable<void> {
    try {
      // Crear referencia desde la URL
      const archivoRef = ref(this.storage, url);
      return from(deleteObject(archivoRef));
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      return from(Promise.resolve());
    }
  }

  /**
   * Genera un nombre único para el archivo
   * @param nombreOriginal Nombre original del archivo
   * @returns Nombre único
   */
  private generarNombreUnico(nombreOriginal: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const extension = nombreOriginal.substring(nombreOriginal.lastIndexOf('.'));
    const nombreSinExt = nombreOriginal.substring(0, nombreOriginal.lastIndexOf('.'));
    
    // Limpiar nombre del archivo (remover caracteres especiales)
    const nombreLimpio = nombreSinExt.replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${nombreLimpio}_${timestamp}_${random}${extension}`;
  }

  /**
   * Obtiene información de progreso de subida (para barra de progreso)
   * @param archivo Archivo a subir
   * @param carpeta Carpeta destino
   * @returns Observable con progreso y URL final
   */
  subirConProgreso(archivo: File, carpeta: string = 'documentos'): Observable<{progreso?: number, url?: string, estado: 'progreso' | 'completado' | 'error'}> {
    const nombreUnico = this.generarNombreUnico(archivo.name);
    const rutaArchivo = `${carpeta}/${nombreUnico}`;
    const archivoRef = ref(this.storage, rutaArchivo);

    return new Observable(observer => {
      uploadBytes(archivoRef, archivo)
        .then(() => {
          // Archivo subido exitosamente, obtener URL
          return getDownloadURL(archivoRef);
        })
        .then(url => {
          observer.next({ url, estado: 'completado' });
          observer.complete();
        })
        .catch(error => {
          observer.next({ estado: 'error' });
          observer.error(error);
        });
    });
  }
}
