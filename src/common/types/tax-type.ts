// Interface to enforce a contract to all tax types
export interface TaxType {
  calculate: (amountToTax: number) => number;
}
