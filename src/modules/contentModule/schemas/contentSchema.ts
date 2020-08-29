import { Schema } from 'mongoose';
import { MongoException } from '@app/core/exceptionHandling/mongo.exception';

export const DynamicContentSchema = new Schema({
  contentName: { type: String, required: true, unique: true },
  structure: {},
  validator: {},

});

DynamicContentSchema.post('save', (err, doc, next) => {
  if (err.name === 'MongoError') {
    next(
      new MongoException(err));
  } else {
    next(err);
  }
});
