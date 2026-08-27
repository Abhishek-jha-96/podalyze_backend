import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  now,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { EntityHelper } from 'src/utils/entity-helper';
import { UserSchemaClass } from 'src/user/entities/user.entity';
import { TaskSchemaClass } from 'src/task/entities/task.entity';

export type ProjectSchemaDocument = HydratedDocument<ProjectSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
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
    type: MongooseSchema.Types.ObjectId,
    ref: UserSchemaClass.name,
    required: true,
    index: true,
  })
  createdBy: Types.ObjectId;

  @Prop()
  url: string;

  @Prop()
  hostPopularity: number;

  @Prop()
  guestPopularity: number;

  @Prop()
  numberOfAds: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  /** Populated via virtual — not stored on the project document */
  tasks?: TaskSchemaClass[];
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectSchemaClass);

ProjectSchema.virtual('tasks', {
  ref: TaskSchemaClass.name,
  localField: '_id',
  foreignField: 'project',
  justOne: false,
});
