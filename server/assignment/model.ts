import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Problem} from '../problem/model';

// Type definition for Assignment on the backend
export type Assignment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  problems: Types.Array<Problem>; //Types.Array<string>; Types.ObjectId[];
  totalPoints: number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AssignmentSchema = new Schema({
  // problems: {
  //   // type: [String],
  //   // required: true
  //   type: [{
  //     type: Schema.Types.ObjectId,
  //     ref: 'Problem'
  //   }],
  //   required: true
  // },
  name: {
    type: String,
    required: true
  },
  problems: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Problem'
  },
  totalPoints: {
    type: Number,
    required: true
  }
});

const AssignmentModel = model<Assignment>('Assignment', AssignmentSchema);
export default AssignmentModel;
