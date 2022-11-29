import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Class} from '../class/model';
import type {Assignment} from '../assignment/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Competition on the backend
export type Competition = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  creatorId: Types.ObjectId;
  classes: Class[];
  assignments: Assignment[];
  dateStarted: Date;
  dateEnded: Date;
};

export type PopulatedCompetition = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  creatorId: User;
  classes: Class[];
  assignments: Assignment[];
  dateStarted: Date;
  dateEnded: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
const CompetitionSchema = new Schema({
  name: {
    type: String,
    required: true,
    ref: 'User'
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  classes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Class'
    }],
    required: true
  },
  assignments: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Assignment'
    }],
    required: true
  },
  dateJoined: {
    type: Date,
    required: true
  },
  dateEnded: {
    type: Date,
    default: undefined
  }
});

const CompetitionModel = model<Competition>('Competition', CompetitionSchema);
export default CompetitionModel;
