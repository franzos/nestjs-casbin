<h1 align="center">
NestJs Casbin Mongodb
</h1>
  
<p align="center">
  NestJS module for Casbin. Supports all adapters
</p>
    <p align="center">
</p>

### Installation

```bash
# https://npm.pantherx.org/-/web/detail/nestjs-casbin
$ pnpm install https://github.com/franzos/nestjs-casbin.git
```

### Setup module

```typescript
import { Module } from '@nestjs/common';
import { NestCasbinModule } from 'nestjs-casbin';
import { join } from 'path';
import { MongoAdapter } from 'casbin-mongodb-adapter';

const adapter = (async () => await MongoAdapter.newAdapter({
        uri: 'mongodb://localhost:27017',
        collection: 'casbin',
        database: 'casbindb',
}));


@Module({
  imports: [
    NestCasbinModule.register({
      adapter,
      casbinModelPath: join(__dirname, './rbac_model.conf')
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

```typescript
import { Module, Injectable } from '@nestjs/common';
import { MongoAdapter } from 'casbin-mongodb-adapter';
import { NestCasbinModuleOptions, NestCasbinOptionsFactory, NestCasbinModule } from 'nestjs-casbin';
import { join } from 'path';

@Injectable()
export class CasbinConfigService implements NestCasbinOptionsFactory {
  async createCasbinOptions(connectionName?: string): Promise<NestCasbinModuleOptions> | NestCasbinModuleOptions {
    
    const adapter = await MongoAdapter.newAdapter({
       uri: 'mongodb://localhost:27017',
       collection: 'casbin',
       database: 'casbindb',
    });

    return {
      adapter,
      casbinModelPath: join(__dirname, './rbac_model.conf')
    };
  }
}

@Module({
  imports: [
    NestCasbinModule.registerAsync({
      useClass: CasbinConfigService
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Pre 2.0.0 which supports only mongodb adapter
### Installation

```bash
# https://npm.pantherx.org/-/web/detail/nestjs-casbin
$ pnpm install nestjs-casbin
```

### Setup module

```typescript
import { Module } from '@nestjs/common';
import { NestCasbinModule } from 'nestjs-casbin-mongodb';
import { join } from 'path';

@Module({
  imports: [
    NestCasbinModule.forRoot({
      uri: 'mongo://localhost:27017',
      casbinModelPath: join(__dirname, './rbac_model.conf'),
      collectionName: 'roles',
      databaseName: 'my-db-name',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Tests

Start mongodb with docker-compose and run tests:

```bash
docker-compose up
pnpm run test
```

## License

  This project is [MIT licensed](LICENSE).
