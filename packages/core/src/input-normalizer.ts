/**
 * ScrollCraft Hardware Input Normalizer & OS Auto-Detector
 * Strictly under 650 LOC.
 *
 * Distinguishes between stepped notched mouse wheels (prevalent on Windows)
 * and subpixel continuous precision trackpads (prevalent on macOS).
 * Recommends optimal physics multipliers to ensure consistent native feel.
 */

export type OperatingSystem = 'windows' | 'mac' | 'linux' | 'other';
export type InputDeviceType = 'discrete-wheel' | 'precision-touchpad' | 'unknown';

export class InputNormalizer {
  private static instance: InputNormalizer | null = null;
  private os: OperatingSystem = 'other';
  private detectedDevice: InputDeviceType = 'unknown';

  private constructor() {
    this.os = this.detectOperatingSystem();
  }

  public static get(): InputNormalizer {
    if (!InputNormalizer.instance) {
      InputNormalizer.instance = new InputNormalizer();
    }
    return InputNormalizer.instance;
  }

  private detectOperatingSystem(): OperatingSystem {
    if (typeof navigator === 'undefined') return 'other';

    try {
      // Modern userAgentData API
      const platform = (navigator as any).userAgentData?.platform?.toLowerCase() ?? '';
      if (platform.includes('win')) return 'windows';
      if (platform.includes('mac')) return 'mac';
      if (platform.includes('linux')) return 'linux';

      // Fallback: userAgent or platform string
      const raw = `${navigator.platform || ''} ${navigator.userAgent || ''}`.toLowerCase();
      if (raw.includes('win')) return 'windows';
      if (raw.includes('mac') || raw.includes('iphone') || raw.includes('ipad')) return 'mac';
      if (raw.includes('linux')) return 'linux';

      return 'other';
    } catch {
      return 'other';
    }
  }

  public getOS(): OperatingSystem {
    return this.os;
  }

  public getDeviceType(): InputDeviceType {
    return this.detectedDevice;
  }

  /**
   * Evaluates a wheel event to classify discrete stepped wheel vs precision trackpad.
   */
  public analyzeWheelEvent(e: WheelEvent): InputDeviceType {
    // DOM_DELTA_LINE (deltaMode === 1) is a definitive indicator of stepped wheel
    if (e.deltaMode === 1) {
      this.detectedDevice = 'discrete-wheel';
      return 'discrete-wheel';
    }

    // High integer delta steps (e.g. 100, 120, 240) indicate notched wheel
    const absY = Math.abs(e.deltaY);
    if (absY >= 100 && Number.isInteger(e.deltaY) && absY % 10 === 0) {
      this.detectedDevice = 'discrete-wheel';
      return 'discrete-wheel';
    }

    // Fractional or small pixel deltas indicate continuous trackpad
    if (absY > 0 && (!Number.isInteger(e.deltaY) || absY < 40)) {
      this.detectedDevice = 'precision-touchpad';
      return 'precision-touchpad';
    }

    return this.detectedDevice;
  }

  /**
   * Returns recommended wheelMultiplier based on OS and detected input hardware.
   */
  public getRecommendedMultiplier(): number {
    // If stepped wheel detected or Windows default
    if (this.detectedDevice === 'discrete-wheel' || (this.detectedDevice === 'unknown' && this.os === 'windows')) {
      return 1.18;
    }
    if (this.os === 'linux') {
      return 1.1;
    }
    return 1.0;
  }

  /**
   * Resets internal classification. Intended for testing environments.
   */
  public reset(mockOS?: OperatingSystem): void {
    this.os = mockOS ?? this.detectOperatingSystem();
    this.detectedDevice = 'unknown';
  }
}

export const inputNormalizer = /* @__PURE__ */ InputNormalizer.get();
