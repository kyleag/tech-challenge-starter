import { Injectable } from '@nestjs/common';

// parent class for all services that gets its data from a local typescript file
@Injectable()
export default abstract class FileSourceDatabaseService<Model> {
  constructor(private records: any[]) {}

  getAll(): Model[] {
    return this.records as Model[];
  }
}
