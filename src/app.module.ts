import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './configs/db.config';
import { MongooseConfigService } from './configs/mongoose.config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SwaggerModule } from './swagger/swagger.module';
import { UserModule } from './user/user.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    infrastructureDatabaseModule,
    AuthModule,
    SwaggerModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
