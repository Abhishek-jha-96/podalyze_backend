import { Types } from 'mongoose';

export function toObjectId(id: string): Types.ObjectId | null {
  if (!id || !Types.ObjectId.isValid(id)) {
    return null;
  }

  const objectId = new Types.ObjectId(id);
  if (objectId.toString() !== id) {
    return null;
  }

  return objectId;
}
