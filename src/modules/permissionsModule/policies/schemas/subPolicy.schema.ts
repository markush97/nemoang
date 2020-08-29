import { Schema, Types } from 'mongoose';

export const SubPolicySchema: Schema = new Schema({
  policyname: {
    type: String,
    required: 'Please enter a SubPolicyname',
  },
  resource: {
    type: String,
    required: 'Please enter a resource',
  },
  method: {
    type: String,
    required: 'Please enter a method',
  },
  roles: [
    {
      type: String,
    },
  ],
  users: [
    {
      type: String,
    },
  ],
});
