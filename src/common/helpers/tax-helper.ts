import { DefaultTax } from '../models/taxes/default-tax';
import { GermanyDefaultTax } from '../models/taxes/germany-default-tax';
import { TaxType } from '../types/tax-type';

interface TaxMap {
  [key: string]: () => TaxType;
}

/**
 * Factory method that instantiates the appropriate tax object for the given type
 * @param {string} type name of the type of tax to instantiate
 * @returns {TaxType} instantiated tax type
 */
export const taxFactory = (type: string): TaxType => {
  const taxMap: TaxMap = {
    germanyDefault: () => {
      return new GermanyDefaultTax();
    },
  };
  return taxMap[type as keyof TaxMap]
    ? taxMap[type as keyof TaxMap]()
    : new DefaultTax(); // fall back to default if no tax of provided type can be created
};
