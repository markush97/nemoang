import { hash as bcryptHash } from 'bcrypt';
import { Schema } from 'mongoose';
import { number } from 'joi';
import { AnimationFrameScheduler } from 'rxjs/internal/scheduler/AnimationFrameScheduler';
import {
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { MongoException } from '@app/core/exceptionHandling/mongo.exception';

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: { type: String, required: true, select: false },
    username: { type: String, required: true, unique: true },

    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
    roles: { type: Array, default: ['user'] },

    firstName: { type: String },
    lastName: { type: String },

    street: { type: String },
    city: { type: String },
    country: { type: String },
    number: { type: Number },
    stair: { type: Number },
    door: { type: Number },
    zip: { type: Number },

    active: { type: Boolean, default: true },

    refreshtoken: [
      {
        created: { type: Date, default: Date.now() },
        info: {
          userAgent: String,
          ip: { type: String, select: false },
          location: String
        },
        token: { type: String, required: true, select: false }
      },
    ],
    providers: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
    providerData: {},
    addtionalProviderData: {},
  },
  {
    // do not return certain fields when saving the document
    toObject: {
      transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
      },
    },
    toJSON: {
      transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// when saving the password field, hash it again
UserSchema.pre('save', async function() {
  const user = this;
  if (user.isModified('password')) {
    await bcryptHash(user.get('password'), 10).then(hash => {
      user.set('password', hash);
    });
  }
});

UserSchema.post('save', (err, doc, next) => {
  if (err.name === 'MongoError') {
    next(new MongoException(err));
  } else {
    next(err);
  }
});

UserSchema.pre('update', () => {
  this.update({}, { $set: { updated: Date.now() } });
});
