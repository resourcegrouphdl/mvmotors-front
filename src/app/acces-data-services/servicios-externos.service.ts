import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError, timeout } from 'rxjs';

export interface ReniecResponse {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiciosExternosService {
  
  
 
  urlConsulta: string = 'https://apiperu.dev/api/dni/';
  bearerToken: string = '51c7045d6829dbabc1b75546f4644cfee4e0dc75e8a6636e62852af9ae2911aa';
  
  // Cache simple para evitar consultas duplicadas
  private cache = new Map<string, { data: ReniecResponse, timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
  constructor(private http: HttpClient) {}
  
  consultarDNI(dni: string): Observable<ReniecResponse> {
    // Validar formato de DNI
    if (!this.validarDNI(dni)) {
      return throwError(() => new Error('DNI debe tener 8 dígitos numéricos'));
    }

    // Verificar cache
    const cached = this.cache.get(dni);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return new Observable(observer => {
        observer.next(cached.data);
        observer.complete();
      });
    }

    // Configurar headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.bearerToken}`,
      'Accept': 'application/json'
    });

    // Cuerpo de la petición
    const body = {
      dni: dni
    };

    return this.http.post<any>(this.urlConsulta, body, { headers })
      .pipe(
        timeout(10000), // 10 segundos de timeout
        retry(2), // Reintentar 2 veces en caso de fallo
        map(response => {
          // Mapear la respuesta al formato esperado
          const reniecData: ReniecResponse = {
            nombres: response.data?.nombres || '',
            apellidoPaterno: response.data?.apellido_paterno || '',
            apellidoMaterno: response.data?.apellido_materno || '',
            fechaNacimiento: response.data?.fechaNacimiento,
            estado: response.success ? 'ACTIVO' : 'INACTIVO'
          };

          // Guardar en cache
          this.cache.set(dni, {
            data: reniecData,
            timestamp: Date.now()
          });

          return reniecData;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  /**
   * Valida que el DNI tenga el formato correcto
   */
  private validarDNI(dni: string): boolean {
    const dniRegex = /^[0-9]{8}$/;
    return dniRegex.test(dni);
  }

  /**
   * Verifica si el cache aún es válido
   */
  private isCacheValid(timestamp: number): boolean {
    return (Date.now() - timestamp) < this.CACHE_DURATION;
  }

  /**
   * Maneja los errores de la petición HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'DNI inválido o solicitud mal formada';
          break;
        case 401:
          errorMessage = 'Token de autorización inválido';
          break;
        case 404:
          errorMessage = 'DNI no encontrado en la base de datos';
          break;
        case 429:
          errorMessage = 'Demasiadas consultas. Intente más tarde';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }

    console.error('Error en consulta RENIEC:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Limpia el cache manualmente
   */
  limpiarCache(): void {
    this.cache.clear();
  }

  /**
   * Obtiene el tamaño actual del cache
   */
  obtenerTamañoCache(): number {
    return this.cache.size;
  }
    
}

