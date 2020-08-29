import { Schema } from 'mongoose';
import { MongoException } from '@app/core/exceptionHandling/mongo.exception';

export const RoleSchema = new Schema({
  rolename: { type: String, required: true, unique: true },
});

RoleSchema.post('save', (err, doc, next) => {
  if (err.name === 'MongoError') {
    next(
      new MongoException(err));
  } else {
    next(err);
  }
});