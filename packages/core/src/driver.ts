/**
 * ScrollCraft Core Driver Interface
 * Strictly under 650 LOC.
 * 
 * Defines the Strategy Pattern for all Solvers.
 * A solver will instantiate a Native or JS driver based on capabilities.
 */

export interface DriverState {
  offset?: number;
  progress?: number;
  [key: string]: any;
}

export interface ScrollDriver {
  /**
   * Phase 1: Layout Read
   * For JS Fallback: Read bounding boxes.
   * For Native: Configure scroll-timeline.
   */
  measure(): void;

  /**
   * Phase 2: Compute
   * For JS Fallback: Compute new positions based on scrollY and velocity.
   * For Native: No-op (handled by CSS compositor).
   */
  update(scrollY: number, velocity?: number): DriverState;

  /**
   * Phase 3: Render
   * For JS Fallback: Apply transform via direct DOM mutation.
   * For Native: No-op.
   */
  render(): void;

  /**
   * Cleanup
   */
  destroy(): void;

  getState(): DriverState;
}
