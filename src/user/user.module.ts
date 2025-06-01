import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserPersistenceModule } from './entities/entity-persistance.module';

@Module({
  imports: [UserPersistenceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserPersistenceModule],
})
export class UserModule {}
