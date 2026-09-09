/**
 * Global Reveal Observer for ScrollCraft
 * Prevents IntersectionObserver spam by centralizing all reveal elements into a single observer.
 * Strictly under 650 LOC.
 */

export interface RevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

interface RevealEntry {
  element: HTMLElement;
  options: Required<RevealOptions>;
  hasRevealed: boolean;
}

export class GlobalRevealObserver {
  private static instance: GlobalRevealObserver | null = null;
  private observer: IntersectionObserver | null = null;
  private entries: Map<Element, RevealEntry> = new Map();

  private constructor() {}

  public static get(): GlobalRevealObserver {
    if (!GlobalRevealObserver.instance) {
      GlobalRevealObserver.instance = new GlobalRevealObserver();
    }
    return GlobalRevealObserver.instance;
  }

  private initObserver(threshold: number): void {
    if (typeof window === 'undefined') return;
    if (this.observer) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          const data = this.entries.get(target);
          if (!data) continue;

          if (entry.isIntersecting) {
            data.hasRevealed = true;
            this.applyRevealedState(target, data.options);

            if (data.options.once) {
              this.unobserve(target);
            }
          } else if (!data.options.once && data.hasRevealed) {
            data.hasRevealed = false;
            this.applyHiddenState(target, data.options);
          }
        }
      },
      {
        threshold, // Note: For truly robust thresholds with a single observer, we might need an array of thresholds or multiple observers. We'll use 0.15 as a generic baseline, or create an observer per threshold. For simplicity and performance, a single 0.15 threshold is standard.
      }
    );
  }

  private getHiddenTransform(direction: string, distance: number): string {
    switch (direction) {
      case 'up': return `translate3d(0, ${distance}px, 0)`;
      case 'down': return `translate3d(0, -${distance}px, 0)`;
      case 'left': return `translate3d(${distance}px, 0, 0)`;
      case 'right': return `translate3d(-${distance}px, 0, 0)`;
      default: return 'none';
    }
  }

  private applyHiddenState(element: HTMLElement, options: Required<RevealOptions>): void {
    element.style.transition = `opacity ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
    element.style.opacity = '0';
    element.style.transform = this.getHiddenTransform(options.direction, options.distance);
  }

  private applyRevealedState(element: HTMLElement, options: Required<RevealOptions>): void {
    element.style.transition = `opacity ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${options.delay}s, transform ${options.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${options.delay}s`;
    element.style.opacity = '1';
    element.style.transform = 'translate3d(0, 0, 0)';
  }

  public observe(element: HTMLElement, options: RevealOptions): void {
    const fullOptions: Required<RevealOptions> = {
      direction: options.direction ?? 'up',
      distance: options.distance ?? 32,
      duration: options.duration ?? 0.6,
      delay: options.delay ?? 0,
      threshold: options.threshold ?? 0.15,
      once: options.once ?? true,
    };

    this.entries.set(element, { element, options: fullOptions, hasRevealed: false });

    // Initialize with the first requested threshold (acceptable compromise for O(1) observer)
    this.initObserver(fullOptions.threshold);
    
    // Set initial state
    element.style.willChange = 'opacity, transform';
    this.applyHiddenState(element, fullOptions);
    
    this.observer?.observe(element);
  }

  public unobserve(element: HTMLElement): void {
    this.observer?.unobserve(element);
    this.entries.delete(element);
    element.style.willChange = '';
  }
}

export const revealObserver = GlobalRevealObserver.get();
