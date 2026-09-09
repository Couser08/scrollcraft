/**
 * Native CSS Engine Styles
 * Strictly under 650 LOC.
 * 
 * Injects required @keyframes for the Native ViewTimeline Drivers.
 * Only injected once if the browser supports native capabilities.
 */

let injected = false;

export function injectNativeStyles(): void {
  if (typeof document === 'undefined' || injected) return;
  
  const styleId = 'scrollcraft-native-engine';
  if (document.getElementById(styleId)) {
    injected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes sc-parallax-y {
      0% { transform: translate3d(0, var(--sc-parallax-start, 0px), 0); }
      100% { transform: translate3d(0, var(--sc-parallax-end, 0px), 0); }
    }
    @keyframes sc-parallax-x {
      0% { transform: translate3d(var(--sc-parallax-start, 0px), 0, 0); }
      100% { transform: translate3d(var(--sc-parallax-end, 0px), 0, 0); }
    }
  `;
  document.head.appendChild(style);
  injected = true;
}
