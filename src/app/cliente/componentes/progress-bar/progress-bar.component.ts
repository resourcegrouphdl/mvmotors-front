import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';

interface ProgressSegment {
  value: number;
  color: string;
  label?: string;
}

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {
  // ================================================================
  // INPUTS
  // ================================================================

  @Input({ required: true }) value: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() unit: string = '%';
  @Input() type: 'single' | 'multi' | 'stepped' = 'single';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() variant: 'default' | 'success' | 'warning' | 'error' | 'info' =
    'default';
  @Input() animated: boolean = false;
  @Input() striped: boolean = false;
  @Input() rounded: boolean = true;
  @Input() showLabel: boolean = false;
  @Input() showPercentage: boolean = false;
  @Input() showTextInside: boolean = false;
  @Input() label?: string;
  @Input() labelPosition: 'top' | 'bottom' = 'top';
  @Input() containerWidth: string = '100%';
  @Input() customColor?: string;
  @Input() backgroundColor?: string;

  // Multi-segment específico
  @Input() segments: ProgressSegment[] = [];
  @Input() showSegmentLabels: boolean = false;

  // Stepped específico
  @Input() steps: Array<{ label: string; completed: boolean }> = [];

  // Target y milestone
  @Input() showTarget: boolean = false;
  @Input() targetValue: number = 0;
  @Input() showMilestones: boolean = false;
  @Input() milestones: number[] = [];

  // Estados y info adicional
  @Input() hasError: boolean = false;
  @Input() errorMessage?: string;
  @Input() showInfo: boolean = false;
  @Input() additionalInfo?: string;

  // Configuración de animación
  @Input() animationDuration: number = 1000; // ms
  @Input() animationDelay: number = 0; // ms

  // ================================================================
  // SIGNALS Y STATE
  // ================================================================

  animatedValue = signal(0);
  private animationId?: number;

  // ================================================================
  // COMPUTED PROPERTIES
  // ================================================================

  displayValue = computed(() => {
    const percentage = Math.round(
      ((this.value - this.min) / (this.max - this.min)) * 100
    );
    return Math.min(Math.max(percentage, 0), 100);
  });

  height = computed(() => {
    const heights = {
      xs: 4,
      sm: 6,
      md: 8,
      lg: 12,
      xl: 16,
    };
    return heights[this.size];
  });

  containerClasses = computed(() => {
    const baseClasses = 'relative overflow-hidden bg-gray-200';
    const roundedClass = this.rounded ? 'rounded-full' : 'rounded-sm';
    const sizeClass = this.size === 'xl' ? 'shadow-inner' : '';

    return `${baseClasses} ${roundedClass} ${sizeClass}`;
  });

  barClasses = computed(() => {
    const baseClasses =
      'h-full transition-all duration-700 ease-out relative overflow-hidden';
    const colorClass = this.getColorClass();
    const stripedClass = this.striped ? 'striped-pattern' : '';
    const roundedClass = this.rounded ? 'rounded-full' : 'rounded-sm';

    return `${baseClasses} ${colorClass} ${stripedClass} ${roundedClass}`;
  });

  labelClasses = computed(() => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
      xl: 'text-base',
    };

    return `font-medium text-gray-700 ${sizeClasses[this.size]}`;
  });

  percentageClasses = computed(() => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
      xl: 'text-base',
    };

    const colorClass = this.getPercentageColorClass();

    return `font-bold ${sizeClasses[this.size]} ${colorClass}`;
  });

  // ================================================================
  // LIFECYCLE
  // ================================================================

  ngOnInit(): void {
    this.initializeAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  // ================================================================
  // ANIMATION METHODS
  // ================================================================

  private initializeAnimation(): void {
    if (this.animated) {
      // Delay inicial
      setTimeout(() => {
        this.animateToValue(this.displayValue());
      }, this.animationDelay);
    } else {
      this.animatedValue.set(this.displayValue());
    }
  }

  private animateToValue(targetValue: number): void {
    const startValue = this.animatedValue();
    const difference = targetValue - startValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);

      // Easing function (ease-out-cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + difference * easeProgress;

      this.animatedValue.set(Math.round(currentValue));

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  // ================================================================
  // STYLING METHODS
  // ================================================================

  private getColorClass(): string {
    if (this.customColor) {
      return `bg-[${this.customColor}]`;
    }

    const variants = {
      default: 'bg-gradient-to-r from-blue-500 to-blue-600',
      success: 'bg-gradient-to-r from-green-500 to-green-600',
      warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      error: 'bg-gradient-to-r from-red-500 to-red-600',
      info: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
    };

    // Color dinámico basado en el valor
    if (this.variant === 'default') {
      const percentage = this.displayValue();
      if (percentage >= 80)
        return 'bg-gradient-to-r from-green-500 to-green-600';
      if (percentage >= 60) return 'bg-gradient-to-r from-blue-500 to-blue-600';
      if (percentage >= 40)
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      if (percentage >= 20)
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      return 'bg-gradient-to-r from-red-500 to-red-600';
    }

    return variants[this.variant];
  }

  private getPercentageColorClass(): string {
    const percentage = this.displayValue();

    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    if (percentage >= 20) return 'text-orange-600';
    return 'text-red-600';
  }

  getSegmentClasses(segment: ProgressSegment): string {
    const baseClasses = 'transition-all duration-500 relative';
    return `${baseClasses} ${segment.color}`;
  }

  getStepCircleClasses(step: any, index: number): string {
    const baseClasses =
      'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300';

    if (step.completed) {
      return `${baseClasses} bg-green-500 text-white`;
    }

    const currentStepIndex = this.steps.findIndex((s) => !s.completed);
    const isActive = index === currentStepIndex;

    if (isActive) {
      return `${baseClasses} bg-blue-500 text-white ring-4 ring-blue-200`;
    }

    return `${baseClasses} bg-gray-200 text-gray-500`;
  }

  getStepLineClasses(step: any, index: number): string {
    const baseClasses = 'flex-1 h-0.5 mx-2 transition-all duration-300';
    const nextStep = this.steps[index + 1];

    if (step.completed && nextStep?.completed) {
      return `${baseClasses} bg-green-500`;
    }

    return `${baseClasses} bg-gray-200`;
  }

  trackBySegmentIndex(index: number, segment: ProgressSegment): number {
    return index;
  }

  trackByStepIndex(index: number, step: any): number {
    return index;
  }
  // ================================================================
  // PUBLIC METHODS
  // ================================================================

  updateValue(newValue: number, animate: boolean = true): void {
    this.value = Math.min(Math.max(newValue, this.min), this.max);

    if (animate && this.animated) {
      this.animateToValue(this.displayValue());
    } else {
      this.animatedValue.set(this.displayValue());
    }
  }

  increment(amount: number = 1): void {
    this.updateValue(this.value + amount);
  }

  decrement(amount: number = 1): void {
    this.updateValue(this.value - amount);
  }

  reset(): void {
    this.updateValue(this.min);
  }

  complete(): void {
    this.updateValue(this.max);
  }

  // ================================================================
  // UTILITY METHODS
  // ================================================================

  getPercentage(): number {
    return this.displayValue();
  }

  isComplete(): boolean {
    return this.value >= this.max;
  }

  isAtTarget(): boolean {
    return this.targetValue > 0 && this.value >= this.targetValue;
  }

  // Helper para Math en template
  Math = Math;
}
