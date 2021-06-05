import { Injectable } from '@nestjs/common';
import { BaseModel } from '@src/common/models/base.model';

// parent class for all services that gets its data from a local typescript file
@Injectable()
export default abstract class FileSourceDatabaseService<Raw extends BaseModel> {
  constructor(protected records: Raw[]) {}

  getAll(): Raw[] {
    return [...this.records] as Raw[];
  }
  getById(id: number): Raw {
    const match = this.records.find((record) => record.id === id);
    if (!match) {
      throw new Error(`Record of ID ${id} cannot be found.`);
    }
    return match;
  }
}
