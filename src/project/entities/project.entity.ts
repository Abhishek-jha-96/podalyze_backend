import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  now,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { EntityHelper } from 'src/utils/entity-helper';
import { UserSchemaClass } from 'src/user/entities/user.entity';

export type ProjectSchemaDocument = HydratedDocument<ProjectSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ProjectSchemaClass extends EntityHelper {
  @Prop({
    type: String,
    unique: true,
  })
  title: string;

  @Prop({
    type: MongooseSchema,
    ref: UserSchemaClass.name,
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop()
  url: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectSchemaClass);
