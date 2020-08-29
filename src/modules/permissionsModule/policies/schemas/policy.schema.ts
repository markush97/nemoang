import { Schema, Types } from 'mongoose';
import { SubPolicySchema } from './subPolicy.schema';
import { MongoException } from '@app/core/exceptionHandling/mongo.exception';

export const PolicySchema: Schema = new Schema({
  policyname: {
    type: String,
    required: 'Please enter a Policynamme',
    unique: true,
    index: true,
  },
  subPolicies: [SubPolicySchema],
  parent: {
    type: String,
  },
});

PolicySchema.post('save', (err, doc, next) => {
  if (err.name === 'MongoError') {
    next(new MongoException(err));
  } else {
    next(err);
  }
});