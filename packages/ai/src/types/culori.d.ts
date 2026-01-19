/**
 * Type declarations for culori
 */

declare module 'culori' {
  export interface Oklch {
    mode: 'oklch';
    l: number;
    c: number;
    h: number;
    alpha?: number;
  }

  export interface Rgb {
    mode: 'rgb';
    r: number;
    g: number;
    b: number;
    alpha?: number;
  }

  export type Color = Oklch | Rgb | string;

  export function oklch(color: Color | string): Oklch | undefined;
  export function rgb(color: Color | string): Rgb | undefined;
  export function formatHex(color: Color): string | undefined;
  export function formatCss(color: Color): string;
  export function parse(color: string): Color | undefined;
  export function interpolate(colors: Color[], mode?: string): (t: number) => Color;
  export function wcagContrast(color1: Color, color2: Color): number;
}
