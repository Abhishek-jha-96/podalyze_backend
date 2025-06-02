import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { DatabaseConfig } from './database-config.types';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const db = this.configService.get<DatabaseConfig>('database');

    let uri = db.url;

    if (!uri) {
      const auth =
        db.username && db.password ? `${db.username}:${db.password}@` : '';
      const host = db.host ?? 'localhost';
      const port = db.port ?? 27017;
      const name = db.name ?? 'nest';
      uri = `mongodb://${auth}${host}:${port}/${name}?authSource=admin`;
    }
    Logger.log(uri);

    const sslOptions = db.sslEnabled
      ? {
          ssl: true,
          sslValidate: db.rejectUnauthorized,
          sslCA: db.ca ? [Buffer.from(db.ca, 'base64')] : undefined,
          sslKey: db.key ? Buffer.from(db.key, 'base64') : undefined,
          sslCert: db.cert ? Buffer.from(db.cert, 'base64') : undefined,
        }
      : {};

    return {
      uri,
      ...sslOptions,
      maxPoolSize: db.maxConnections,
    };
  }
}
