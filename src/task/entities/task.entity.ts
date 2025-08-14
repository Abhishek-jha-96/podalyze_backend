import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { EntityHelper } from 'src/utils/entity-helper';
import { Schema as MongooseSchema } from 'mongoose';
import { UserSchemaClass } from 'src/user/entities/user.entity';
import { ProjectSchemaClass } from 'src/project/entities/project.entity';
import { StatusEnum } from '../domain/task';

export type TaskSchemaDocument = HydratedDocument<TaskSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TaskSchemaClass extends EntityHelper {
  @Prop({
    type: MongooseSchema,
    ref: ProjectSchemaClass.name,
    required: true,
  })
  project: Types.ObjectId;

  @Prop({
    type: MongooseSchema,
    ref: UserSchemaClass.name,
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(TaskSchemaClass);
