import { TaxType } from '@src/common/types/tax-type';

/**
 * Default tax type to fall back to if no tax type can be found
 * This does not return any tax amount
 */
export class DefaultTax implements TaxType {
  calculate(amountToTax: number): number {
    return 0;
  }
}
