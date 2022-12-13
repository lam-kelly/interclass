import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for Class on the backend
export type Class = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  teacher: User;
  students: Types.Array<User>;
  totalPoints: number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ClassSchema = new Schema({
  teacher: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  students: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  totalPoints: {
    type: Number,
    required: true
  }
});

const ClassModel = model<Class>('Class', ClassSchema);
export default ClassModel;
