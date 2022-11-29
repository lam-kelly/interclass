import type {HydratedDocument} from 'mongoose';
import type {PopulatedProblem, Problem} from './model';

type ProblemResponse = {
  _id: string; // MongoDB assigns each object this ID on creation
  question: string;
  answerChoices: string[];
  answer: string;
  solvers: string[];
  workers: string[];
  pointValue: Number;
};

/**
 * Transform a raw Problem object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Problem>} problem - A user object
 * @returns {ProblemResponse} - The user object without the password
 */
const constructProblemResponse = (problem: HydratedDocument<Problem>): ProblemResponse => {
  const problemCopy: PopulatedProblem = {
    ...problem.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...problemCopy,
    solvers: problemCopy.solvers.map(solver => solver ? solver.username.toString() : "error"),
    workers: problemCopy.workers.map(worker => worker ? worker.username.toString() : "error"),
    _id: problemCopy._id.toString(),
  };
};

export {
  constructProblemResponse
};
