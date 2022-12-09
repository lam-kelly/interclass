import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Competition } from '../competition/model';

// Type definition for Hint on the backend
export type Hint = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  competition: Types.ObjectId;
  pointsUntilReward: number;
  numberOfHints: number;
};

export type PopulatedHint = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  competition: Competition;
  pointsUntilReward: number;
  numberOfHints: number;
};

// Mongoose schema definition for interfacing with a MongoDB table
const HintSchema = new Schema({
  competition: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Competition'
  },
  pointsUntilReward: {
    type: Number,
    required: true
  },
  numberOfHints: {
    type: Number,
    required: true
  },
});

const HintModel = model<Hint>('Hint', HintSchema);
export default HintModel;
