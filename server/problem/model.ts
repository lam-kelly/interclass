import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from '../user/model';

/**
 * This file defines the properties stored in a Problem
 * DO NOT implement operations here ---> use collection file
 */

export type Problem = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  question: string;
  answerChoices: string[];
  answer: string;
  solvers: Types.ObjectId[];
  workers: Types.ObjectId[];
  pointValue: Number;
};

export type PopulatedProblem = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    question: string;
    answerChoices: string[];
    answer: string;
    solvers: User[];
    workers: User[];
    pointValue: Number;
  };

const ProblemSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answerChoices: {
    type: [String],
    required: true
  },
  // will be one of the answer choices
  answer: {
    type: String,
    required: true
  },
  solvers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    required: true
  },
  workers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    required: true
  },
  pointValue: {
    type: Number,
    required: true
  }
});

const ProblemModel = model<Problem>('Problem', ProblemSchema);
export default ProblemModel;
