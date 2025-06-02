import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { AuthProvidersEnum } from 'src/auth/config/auth-config.types';
import { EntityHelper } from 'src/utils/entity-helper';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityHelper {
  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  lastName: string | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
