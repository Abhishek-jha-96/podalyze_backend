import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { EntityHelper } from 'src/utils/entity-helper';
import { Schema as MongooseSchema } from 'mongoose';
import { UserSchemaClass } from 'src/user/entities/user.entity';
import { SentimentEnum, StatusEnum } from '../domain/task';

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
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProjectSchemaClass',
    required: true,
    index: true,
  })
  project: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: UserSchemaClass.name,
    required: true,
    index: true,
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

  @Prop({
    type: String,
    enum: SentimentEnum,
  })
  sentiment?: SentimentEnum;

  @Prop({
    type: Number,
  })
  watchTime?: number;

  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  metaData?: Record<string, any>;
}

export const TaskSchema = SchemaFactory.createForClass(TaskSchemaClass);
