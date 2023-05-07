import { Test, TestingModule } from '@nestjs/testing';
import { NestCasbinService } from './nest-casbin.service';
import { Provider } from '@nestjs/common';
import { CASBIN_ENFORCER } from './nest-casbin.constants';
import { newEnforcer } from 'casbin';
import * as path from 'path';
import { MongoAdapter } from 'casbin-mongodb-adapter';

describe('NestCasbinService', () => {
  let service: NestCasbinService;

  const casbinEnforcerProvider: Provider = {
    provide: CASBIN_ENFORCER,
    useFactory: async () => {
      const model = path.resolve(__dirname, '../../.tests/rbac_model.conf');
      const adapter = await MongoAdapter.newAdapter({
        uri: 'mongodb://tests:password@127.0.0.1:27017/?authSource=admin',
        collection: 'casbin',
        database: 'casbindb'
      });
      const e = await newEnforcer(model, adapter);
      await e.loadPolicy();
      return e;
    }
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [casbinEnforcerProvider, NestCasbinService],
      exports: [NestCasbinService]
    }).compile();

    service = module.get<NestCasbinService>(NestCasbinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
