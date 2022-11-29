import type {Request, Response} from 'express';
import express from 'express';
import ProblemCollection from './collection';
// import * as problemValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the signed in user
 * TODO: may need better route and documentation
 * (so students don't accidentally delete this when copying over)
 *
 * @name GET /api/probem/:problemId?
 *
 * @return - the Problem with the specified problemId
 */
router.get(
  '/:problemId?',
  [],
  async (req: Request, res: Response) => {
    const problem = await ProblemCollection.findOneByProblemId(req.params.problemId);
    res.status(200).json({
      message: 'Your problem was retrieved successfully.',
      problem: problem ? util.constructProblemResponse(problem) : null
    });
  }
);

/**
 * Create a new problem for an assignment
 *
 * @name POST /api/problem
 *
 * @param {string} question - The problem statement
 * @param {string[]} answerChoices - The answer choices
 * @param {string} answer - The answer to the problem statement (should be one of the answer choices)
 * @param {Number} pointValue - The amount of points the problem is worth
 * @return {ProblemResponse} - An object with problem's details
 *
 */
router.post(
  '/',
  [
    // userValidator.isUserLoggedOut,
    // userValidator.isValidUsername,
    // userValidator.isValidPassword,
    // userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const problem = await ProblemCollection.addOne(
        req.body.question, 
        req.body.answerChoices, 
        req.body.answer,
        req.body.pointValue
    );
    res.status(201).json({
      message: 'You have successfully created your problem',
      problem: util.constructProblemResponse(problem)
    });
  }
);

/**
 * Delete a problem
 *
 * @name DELETE /api/problem/:problemId?
 *
 * @return - None
 *
 */
router.delete(
  '/:problemId?',
  [
    // userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    await ProblemCollection.deleteOne(req.params.problemId);
    res.status(200).json({
      message: 'You have successfully deleted this problem.'
    });
  }
);

/**
 * Update the details of a problem
 *
 * @name PATCH /api/problem/:problemId?
 *
 * @param {string} problemId - The id of the Problem being udpated
 * @param {string} newWorkerId - A new user that attempted a problem
 * @param {string} newSolverId - A new user that solved a problem
 * @param {[string]} answerChoices - Updated answer choices
 * @param {string} answer - Updated answer to problem
 * @param {string} question - Updated question of the problem
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.patch(
  '/:problemId?',
  [
    // userValidator.isUserLoggedIn,
    // userValidator.isValidUsername,
    // userValidator.isUsernameNotAlreadyInUse,
    // userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const problem = await ProblemCollection.updateOne(req.params.problemId, req.body);
    res.status(200).json({
      message: 'Your successfully updated the problem.',
      problem: util.constructProblemResponse(problem)
    });
  }
);

export {router as problemRouter};
