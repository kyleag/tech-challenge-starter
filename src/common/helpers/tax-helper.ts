import { DefaultTax } from '../models/taxes/default-tax';
import { GermanyDefaultTax } from '../models/taxes/germany-default-tax';
import { TaxType } from '../types/tax-type';

interface TaxMap {
  [key: string]: () => TaxType;
}

/**
 * Factory method that instantiates the appropriate tax object for the given type
 * @param {string} type optional name of the type of tax to instantiate. defaults to 'default'
 * @returns {TaxType} instantiated tax type
 */
export const taxFactory = (type = 'default'): TaxType => {
  const taxMap: TaxMap = {
    germanyDefault: () => {
      return new GermanyDefaultTax();
    },
    default: () => {
      return new DefaultTax();
    },
  };

  // fall back to default if no tax of provided type can be created
  const typeToUse = taxMap[type as keyof TaxMap] ? type : 'default';
  return taxMap[typeToUse as keyof TaxMap]();
};
