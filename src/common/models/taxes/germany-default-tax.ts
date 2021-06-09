import { TaxType } from '@src/common/types/tax-type';

/**
 * Default tax type for Germany
 */
export class GermanyDefaultTax implements TaxType {
  calculate(amountToTax: number): number {
    // round to 2 decimal places and presever type as a number
    // instead of using `toFixed` that returns a string
    return Math.round(amountToTax * 0.3 * 100) / 100;
  }
}
