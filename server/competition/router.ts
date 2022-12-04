import type {Request, Response} from 'express';
import express from 'express';
import CompetitionCollection from './collection';
import AssignmentCollection from '../assignment/collection';
import * as competitionValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';
import ClassCollection from '../class/collection';

const router = express.Router();

/**
 * Get the competition that logged in user is in
 *
 * @name GET /api/competition
 *
 * @return {CompetitionResponse} - The competition or null
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.findOneByUserId(req.session.userId as string);
    const response = competition ? util.constructCompetitionResponse(competition) : null;
    res.status(200).json(response);
  }
);

/**
 * Create a competition
 *
 * @name POST /api/competition
 *
 * @param {string} name - name of the competition
 * @return {CompetitionResponse} - The created competition
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is not a teacher
 * @throws {403} - If user/teacher is currently in a competition
 * @throws {400} - If the name is empty or a stream of empty spaces
 * @throws {403} - If teacher does not have a class
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    competitionValidator.isValidCompetitionName,
    competitionValidator.isTeacher,
    competitionValidator.isNotInCompetition,
    competitionValidator.teacherHasClass,
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.addOne(req.body.name, req.session.userId);
    const classs = await ClassCollection.findOneByTeacher(req.session.userId);
    const updatedCompetition = await CompetitionCollection.updateOneAddClass(competition._id, classs._id);
    res.status(201).json({
      message: `Your competition was created successfully.`,
      competition: util.constructCompetitionResponse(updatedCompetition)
    });
  }
);

/**
 * Add a class to a competition
 *
 * @name PATCH /api/competition/:competitionId/join
 *
 * @param {string} competitionId - The id of the competition to join
 * @param {string} classId - The id of the class to join the competition
 * @return {CompetitionResponse} - The updated competition
 * @throws {403} - If user is not logged in
 * @throws {404} - If competitionsId is invalid
 * @throws {404} - If classId is invalid
 * @throws {403} - If the user is not the teacher of the class
 * @throws {400} - If the class is already in the competition
 */
router.patch(
  '/:competitionId/join',
  [
    userValidator.isUserLoggedIn,
    competitionValidator.isValidCompetition,
    competitionValidator.isCompetitionEnded,
    competitionValidator.isValidClassAndTeacherOfClass,
    competitionValidator.isValidClassJoin,
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.updateOneAddClass(req.params.competitionId, req.body.classId);
    res.status(200).json({
      message: 'Your class has joined the competition successfully.',
      competition: util.constructCompetitionResponse(competition)
    });
  }
);

/**
 * Remove a class from a competition
 *
 * @name PATCH /api/competition/:competitionId/leave
 *
 * @param {string} competitionId - The id of the competition to join
 * @param {string} classId - The id of the class to join the competition
 * @return {CompetitionResponse} - The updated competition
 * @throws {403} - If user is not logged in
 * @throws {404} - If competitionsId is invalid
 * @throws {400} - If classId is invalid
 * @throws {403} - If the user is not the teacher of the class
 * @throws {400} - If the class is not already in the competition
 */
 router.patch(
  '/:competitionId/leave',
  [
    userValidator.isUserLoggedIn,
    competitionValidator.isValidCompetition,
    competitionValidator.isCompetitionEnded,
    competitionValidator.isValidClassAndTeacherOfClass,
    competitionValidator.isValidClassLeave,
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.updateOneRemoveClass(req.params.competitionId, req.body.classId);
    if (!competition.classes.length) {
      await CompetitionCollection.deleteOne(competition._id);
    }
    res.status(200).json({
      message: 'Your class has left the competition successfully.',
      competition: util.constructCompetitionResponse(competition)
    });
  }
);

/**
 * Add an assignment to a competition
 *
 * @name PATCH /api/competition/:competitionId/addAssignment
 *
 * @param {string} competitionId - The id of the competition to join
 * @param {string} assignmentId - The id of the assignment to add to a competition
 * @return {CompetitionResponse} - The updated competition
 * @throws {403} - If user is not logged in
 * @throws {404} - If competitionsId is invalid
 * @throws {404} - If assignmentId is invalid
 * @throws {403} - If the assignment is already in the competition
 */
 router.patch(
  '/:competitionId/addAssignment',
  [
    userValidator.isUserLoggedIn,
    competitionValidator.isValidCompetition,
    competitionValidator.isCompetitionEnded,
    competitionValidator.isValidTeacherOfCompetition,
    competitionValidator.isValidAssignment,
    competitionValidator.isValidAddAssignment
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.updateOneAddAssignment(req.params.competitionId, req.body.assignmentId);
    res.status(200).json({
      message: 'You have successfully added the assignment to the competition.',
      competition: util.constructCompetitionResponse(competition)
    });
  }
);

/**
 * Remove an assignment from a competition
 *
 * @name PATCH /api/competition/:competitionId/removeAssignment
 *
 * @param {string} competitionId - The id of the competition to join
 * @param {string} assignmentId - The id of the assignment to remove from the competition
 * @return {CompetitionResponse} - The updated competition
 * @throws {403} - If user is not logged in
 * @throws {404} - If competitionsId is invalid
 * @throws {400} - If classId is invalid
 * @throws {403} - If the user is not a teacher in the competition
 */
 router.patch(
  '/:competitionId/removeAssignment',
  [
    userValidator.isUserLoggedIn,
    competitionValidator.isValidCompetition,
    competitionValidator.isCompetitionEnded,
    competitionValidator.isValidTeacherOfCompetition,
    competitionValidator.isValidAssignment,
    competitionValidator.isValidRemoveAssignment,
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.updateOneRemoveAssignment(req.params.competitionId, req.body.assignmentId);
    res.status(200).json({
      message: 'You have deleted the assignment from the competition succesfully.',
      competition: util.constructCompetitionResponse(competition)
    });
  }
);

/**
 * End a competition
 *
 * @name PATCH /api/competition/:competitionId/end
 *
 * @param {string} competitionId - The id of the competition to end
 * @return {CompetitionResponse} - The updated competition
 * @throws {403} - If user is not logged in
 * @throws {404} - If competitionsId is invalid
 * @throws {403} - If the user is not a teacher in the competition
 */
 router.patch(
  '/:competitionId/end',
  [
    userValidator.isUserLoggedIn,
    competitionValidator.isValidCompetition,
    competitionValidator.isCompetitionEnded,
    competitionValidator.isValidTeacherOfCompetition
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.updateOneCompetitionEndDate(req.params.competitionId);
    res.status(200).json({
      message: 'Your competition was successfully ended.',
      competition: util.constructCompetitionResponse(competition)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/competition/:competitionId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is not a teacher in the competition
 */
router.delete(
  '/:competitionId',
  [
    userValidator.isUserLoggedIn,
    competitionValidator.isValidCompetition,
    competitionValidator.isValidTeacherOfCompetition
  ],
  async (req: Request, res: Response) => {
    const competition = await CompetitionCollection.findOneByCompetitionId(req.params.competitionId);
    for (const assignment of competition.assignments) {
      await AssignmentCollection.deleteOne(assignment._id);
    }
    await CompetitionCollection.deleteOne(req.params.competitionId);
    res.status(200).json({
      message: 'Your competition has been deleted successfully.'
    });
  }
);

export {router as competitionRouter};
