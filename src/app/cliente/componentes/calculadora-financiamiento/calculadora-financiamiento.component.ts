import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface OpcionFinanciamiento {
  plazo: number;
  quincenas: number;
  tasa: number;
  interesTotal: number;
  montoTotalPagar: number;
  sumaTotal: number;
  cuotaQuincenal: number;
  cuotaMensual: number;
  tea: number;
  recomendacion: string;
  popularidad: 'popular' | 'economico' | 'rapido';
}

interface DatosCalculados {
  precioMoto: number;
  adicionalFijo: number;
  precioTotal: number;
  inicialMinima: number;
  inicialFinal: number;
  montoFinanciar: number;
  montoAjustadoPorTope: boolean;
  sumaTotal: number;
}

@Component({
  selector: 'app-calculadora-financiamiento',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './calculadora-financiamiento.component.html',
  styleUrl: './calculadora-financiamiento.component.css'
})
export class CalculadoraFinanciamientoComponent implements OnInit {
  private router = inject(Router);

  readonly CONFIG = {
    ADICIONAL_FIJO: 890,
    INICIAL_MINIMA_PORCENTAJE: 0.20,
    MONTO_MAXIMO_FINANCIAR: 6000, // Nuevo límite máximo
    TASAS_INTERES: {
      16: 0.2626,
      20: 0.3263,
      24: 0.3919
    } as Record<number, number>,
    PLAZOS: [16, 20, 24],
    RECOMENDACIONES: {
      16: "⚡ Pago Rápido",
      20: "⭐ Recomendado", 
      24: "💰 Cuota Menor"
    } as Record<number, string>
  };

  precioMoto = signal<number>(4500);
  inicialPersonalizada = signal<number>(0);
  isCalculating = signal<boolean>(false);
  showResults = signal<boolean>(false);
  opcionSeleccionada = signal<number | null>(null);
  datosCalculados = signal<DatosCalculados | null>(null);
  opciones = signal<OpcionFinanciamiento[]>([]);
  sumaTotal = signal<number>(0);

  inicialMinimaCalculada = computed(() => {
    const precioTotal = this.precioMoto() + this.CONFIG.ADICIONAL_FIJO;
    const inicialMinimaPorcentaje = this.precioMoto() * this.CONFIG.INICIAL_MINIMA_PORCENTAJE;
    
    // Verificar si el monto a financiar excede el límite
    const montoAFinanciarConMinima = precioTotal - inicialMinimaPorcentaje;
    
    if (montoAFinanciarConMinima > this.CONFIG.MONTO_MAXIMO_FINANCIAR) {
      // Si excede, calcular la inicial mínima necesaria para que el financiamiento sea exactamente 6000
      return precioTotal - this.CONFIG.MONTO_MAXIMO_FINANCIAR;
    }
    
    return inicialMinimaPorcentaje;
  });

  ngOnInit() {
    this.actualizarInicialMinima();
  }

  actualizarInicialMinima() {}

  getHelpColor(): string {
    if (this.precioMoto() < 1000) return '#EF4444';
    
    const precioTotal = this.precioMoto() + this.CONFIG.ADICIONAL_FIJO;
    const inicialMinima = this.inicialMinimaCalculada();
    const montoAFinanciar = precioTotal - inicialMinima;
    
    if (montoAFinanciar >= this.CONFIG.MONTO_MAXIMO_FINANCIAR) {
      return '#F59E0B'; // Amarillo para advertencia
    }
    
    return '#10B981';
  }

  getHelpText(): string {
    if (this.precioMoto() < 1000) {
      return 'Ingresa un precio válido (mínimo S/ 1,000)';
    }

    const precioTotal = this.precioMoto() + this.CONFIG.ADICIONAL_FIJO;
    const inicialMinima = this.inicialMinimaCalculada();
    const montoAFinanciar = precioTotal - inicialMinima;
    
    if (montoAFinanciar >= this.CONFIG.MONTO_MAXIMO_FINANCIAR) {
      return `⚠️ Inicial ajustada: S/ ${inicialMinima.toFixed(2)} (Monto máximo a financiar: S/ 6,000)`;
    }
    
    return `Inicial mínima: S/ ${inicialMinima.toFixed(2)}`;
  }

  calcular() {
    if (this.precioMoto() < 1000) {
      alert('⚠️ El precio de la moto debe ser mayor a S/ 1,000');
      return;
    }

    this.isCalculating.set(true);

    setTimeout(() => {
      const adicionalFijo = this.CONFIG.ADICIONAL_FIJO;
      const precioTotal = this.precioMoto() + adicionalFijo;
      const inicialMinima = this.inicialMinimaCalculada();
      const inicialFinal = Math.max(inicialMinima, this.inicialPersonalizada());
      
      let montoFinanciar = precioTotal - inicialFinal;
      let montoAjustadoPorTope = false;
      
      // Limitar el monto a financiar al máximo permitido
      if (montoFinanciar > this.CONFIG.MONTO_MAXIMO_FINANCIAR) {
        montoFinanciar = this.CONFIG.MONTO_MAXIMO_FINANCIAR;
        montoAjustadoPorTope = true;
      }

      const datosCalc: DatosCalculados = {
        precioMoto: this.precioMoto(),
        adicionalFijo,
        precioTotal,
        inicialMinima,
        inicialFinal: precioTotal - montoFinanciar, // Recalcular inicial final si se ajustó
        montoFinanciar,
        montoAjustadoPorTope,
        sumaTotal: montoFinanciar + inicialFinal
      };

      this.datosCalculados.set(datosCalc);

      const opcionesCalc: OpcionFinanciamiento[] = this.CONFIG.PLAZOS.map(plazo => {
        const tasa = this.CONFIG.TASAS_INTERES[plazo];
        const interesTotal = montoFinanciar * tasa;
        const montoTotalPagar = montoFinanciar + interesTotal;
        const sumaTotal = montoTotalPagar + datosCalc.inicialFinal;
        const cuotaQuincenal = montoTotalPagar / plazo;
        const cuotaMensual = cuotaQuincenal * 2;
        
        const factorQuincenal = cuotaQuincenal / montoFinanciar;
        const tea = (Math.pow(factorQuincenal, 24) - 1) * 100;
        
        let popularidad: 'popular' | 'economico' | 'rapido' = 'popular';
        if (plazo === 16) popularidad = 'rapido';
        if (plazo === 24) popularidad = 'economico';
        
        return {
          plazo: plazo / 2,
          quincenas: plazo,
          tasa: tasa * 100,
          interesTotal,
          montoTotalPagar,sumaTotal,
          cuotaQuincenal,
          cuotaMensual,
          tea,
          recomendacion: this.CONFIG.RECOMENDACIONES[plazo],
          popularidad
        };
      });

      this.opciones.set(opcionesCalc);
      this.isCalculating.set(false);
      this.showResults.set(true);
    }, 1200);
  }

  seleccionarOpcion(plazo: number) {
    this.opcionSeleccionada.set(plazo);
  }

  nuevoCalculo() {
    // Resetear todos los valores a su estado inicial
    this.showResults.set(false);
    this.opcionSeleccionada.set(null);
    this.datosCalculados.set(null);
    this.opciones.set([]);
    this.inicialPersonalizada.set(0);
    this.isCalculating.set(false);
  }

  trackByPlazo(index: number, opcion: OpcionFinanciamiento): number {
    return opcion.quincenas;
  }

  irAformulario(){

    this.router.navigate(['quienes-somos/vendor/formulario-cliente']);
  }
  
}