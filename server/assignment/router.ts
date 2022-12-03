import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import AssignmentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as classValidator from '../class/middleware';
import AssignmentModel from './model';
import UserCollection from '../user/collection';
import * as assignmentValidator from './middleware';

const router = express.Router();

/**
 * Get all assignments
 *
 * @name GET /api/assignment/all
 *
 * @return {string} - The assignments that exist
 */
router.get(
  '/all',
  [],
  async (req: Request, res: Response) => {
    const assignments = await AssignmentModel.find({});
    res.status(200).json(assignments);
  },
);

/**
 * Get an assignment by its id
 *
 * @name GET /api/assignment/:id
 *
 * @return {string} - The assignment specified by the assignmentId
 * @throws {404} - If the assignment does not exist
 */
router.get(
    '/:assignmentId?',
    [assignmentValidator.isAssignmentExists],
  async (req: Request, res: Response) => {
    const response = await AssignmentCollection.findOneById(req.params.assignmentId);
    res.status(200).json(response);
  },
);

/**
 * Create a new assignment.
 *
 * @name POST /api/assignment
 *
 * @param {string} assignmentName - the name of the assignment to be added
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not a teacher
 */
 router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    classValidator.isValidTeacher
  ],
  async (req: Request, res: Response) => {
    const assignment = await AssignmentCollection.addOne(req.body.assignmentName);

    res.status(201).json({
      assignment: assignment,
      message: 'Your assignment was created successfully.'
    });
  }
);

/**
 * Update an assignment with a problem
 *
 * @name PATCH /api/assignment/:id
 *
 * @param {string} newProblem - the Id of the problem to be added
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not a teacher
 */
 router.patch(
  '/:assignmentId?',
  [
    userValidator.isUserLoggedIn,
    classValidator.isValidTeacher
  ],
  async (req: Request, res: Response) => {
    await AssignmentCollection.addQuestion(req.params.assignmentId, req.body.newProblem);

    res.status(201).json({message: 'Your assignment was updated successfully.'});
  }
);

// /**
//  * Create a new assignment.
//  *
//  * @name POST /api/assignment
//  *
//  * @param {string[]} questions - The Ids of questions on the assignment
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in or is not a teacher
//  */
// router.post(
//   '/',
//   [
//     userValidator.isUserLoggedIn,
//     classValidator.isValidTeacher
//   ],
//   async (req: Request, res: Response) => {
//     await AssignmentCollection.addOne(req.body.questions);

//     res.status(201).json({message: 'Your assignment was created successfully.'});
//   }
// );

/**
 * Delete an assignment
 *
 * @name DELETE /api/assignment/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the teacher who made the assignment
 * @throws {404} - If the assignmentId is not valid
 */
router.delete(
  '/:assignmentId?',
  [
    userValidator.isUserLoggedIn,
    assignmentValidator.isAssignmentExists,
    classValidator.isValidTeacher
  ],
  async (req: Request, res: Response) => {
    await AssignmentCollection.deleteOne(req.params.assignmentId);
    res.status(200).json({message: 'Your assignment was deleted successfully.'});
  }
);

// /**
//  * Submit an assignment
//  *
//  * @name POST /api/assignment/submit/:id
//  *
//  * @param {string[]} studentAnswers - the answers that the student submitted ??
//  * @return {string} - a success message
//  * @throws {403} - if the user is not logged in or not a student
//  * @throws {404} - If the assignmentId is not valid
//  * @throws {400} - If the student does not exist
//  */
// router.post(
//   '/submit/:assignmentId?',
//   [
//     userValidator.isUserLoggedIn,
//     assignmentValidator.isValidStudent,
//     assignmentValidator.isAssignmentExists
//   ],
//   async (req: Request, res: Response) => {
//     // req.body.studentAnswers ??
//     await AssignmentCollection.finishAssignment(req.params.assignmentId, req.session.userId);
//     res.status(200).json({message: 'You finished an assignment successfully.'});
//   }
// );

export {router as assignmentRouter};
