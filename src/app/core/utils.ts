import { AbstractControl, FormArray } from "@angular/forms";

export class Utils {

  /**
   * Returns the CSS "rgba" (Red, Green, Blue, Alpha) color value from the percentage given.
   * 
   * The percentage provided is sanitized into the range of 0.0 to 1.0 with a negative 25%
   * (- 0.25) bias applied, whic will make the color full Red from 0.0 - 0.25. The lowest percentage
   * will return Red, moving towards Yellow and finally Green as the percentage increases.
   * The provided alpha channel value is sanitized into the range of 0.0 and 1.0 and defaults to
   * 1.0 (fully opaque).
   * 
   * @param percent a percentage as a decimal, ideally between 0.0 and 1.0
   * @param alpha the alpha channel (opacity) value to use, 0.0 to 1.0 
   * @returns a CSS "rgba" color expression between Red (0.0) to Yellow (0.5) and Green (1.0)
   */
  public static percentAsColor(percent: number, alpha: number = 1.0): string {
    let pct = Math.min(Math.max(percent - 0.25, 0.0), 1.0);
    let r = pct > 0.5 ? 1 - (2 * (pct - 0.50))  : 1.0;
    let g = pct > 0.5 ? 1.0 : (2 * pct);
    let b = 0.0;
    let a = Math.min(Math.max(alpha, 0.0), 1.0);

    return `rgba(${Utils.byteValue(r)},${Utils.byteValue(g)},${Utils.byteValue(b)},${a})`
  }

  /**
   * Returns the byte (8-bit) value for the given percentage.
   * 
   * The provided percentage is sanitized into the range 0.0 to 1.0 and then converted to an 8-bit
   * value in the range of 0 to 255.
   * 
   * @param percent a percentage as a decimal, ideally between 0.0 and 1.0
   * @returns the 8-bit equivalent value of the percentage, in the range o 0 to 255
   */
  public static byteValue(percent: number): number {
    return Math.round(Math.min(Math.max(percent, 0.0), 1.0) * 255);
  }

  public static range(size: number, startAt: number = 0): number[] {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  public static progressOf(formArray: FormArray, controlName: string, goalFunction: (name: string) => number): number {
    let controlProgress = 0;
    for (let control of formArray.controls) {
      controlProgress += parseFloat(control.get(controlName)?.getRawValue() || 0);
    }
    return goalFunction(controlName) > 0 ? (controlProgress / goalFunction(controlName)) * 100.0 : 0;
  }

  public static isInteger(value?: string | number): boolean {
    return value ? !Number.isNaN(parseInt(String(value))) : false;
  }
}
