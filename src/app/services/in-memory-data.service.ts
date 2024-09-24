import { InMemoryDbService } from 'angular-in-memory-web-api';
import schemaData from './schemas.json';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const schemas = schemaData.map((schema) => ({
      typeName: schema.title,
      schema: schema,
    }));
    const typeNames = schemas.map((schema) => schema.typeName);
    return { typeNames, schemas };
  }
}
