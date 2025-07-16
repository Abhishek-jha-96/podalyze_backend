import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { UserSchema, UserSchemaClass } from './user.entity';
import { UsersDocumentRepository } from './repository/repository';
import {
  ProjectSchema,
  ProjectSchemaClass,
} from 'src/project/entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
      { name: ProjectSchemaClass.name, schema: ProjectSchema },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersDocumentRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserPersistenceModule {}
