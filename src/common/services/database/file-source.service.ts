import { Injectable } from '@nestjs/common';
import { BaseModel } from '@src/common/models/base.model';

// parent class for all services that gets its data from a local typescript file
@Injectable()
export default abstract class FileSourceDatabaseService<Raw extends BaseModel> {
  constructor(protected records: Raw[]) {}

  /**
   * Gets all of the raw objects from the source data based on the given filter
   * @param { Partial<{ [key in keyof Raw]: any } } filters optional filters. must be a valid raw model field
   * @returns {Raw[]} resulting list of raw model data
   */
  getAll(filters: Partial<{ [key in keyof Raw]: any }> = {}): Raw[] {
    const results = [...this.records] as Raw[];
    if (Object.keys(filters).length <= 0) {
      return results;
    }

    // filter results based on the provided criteria
    // for now, we will just check for direct equality, function
    // @TODO - add support for arrays
    return results.filter((result) => {
      return Object.keys(filters).every((field) => {
        const filter = filters[field as keyof Raw];
        if (typeof filter === 'undefined') {
          // if for some reason a filter criteria is provided but it has no value,
          // treat it as positive
          return true;
        }
        const value = result[field as keyof Raw];

        // add support for filtering with a callback function
        if (typeof filter === 'function') {
          return filter(value);
        }
        return value === filter;
      });
    });
  }

  /**
   * Gets a raw model by id
   * @param {number} id id of the raw model to retrieve
   * @returns {Raw} resulting model
   */
  getById(id: number): Raw {
    const match = this.records.find((record) => record.id === id);
    if (!match) {
      throw new Error(`Record of ID ${id} cannot be found.`);
    }
    return match;
  }
}
