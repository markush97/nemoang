import { Schema } from 'mongoose';
import { MongoException } from '@app/core/exceptionHandling/mongo.exception';

export const LinkSchema = new Schema({
  label: { type: String, required: true },
  permission: { type: String },
  link: { type: String },
  parameter: [{type: String, default: ''}],
  menu: { type: String, required: true },
  subMenu: [{}],
});

LinkSchema.post('save', (err, doc, next) => {
  if (err.name === 'MongoError') {
    next(new MongoException(err));
  } else {
    next(err);
  }
});
