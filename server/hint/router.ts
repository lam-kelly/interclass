import type {Request, Response} from 'express';
import express from 'express';
import {Types} from 'mongoose';
import HintCollection from './collection';
import * as hintValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get hint by hintId
 *
 * @name GET /api/hint/:hintId
 *
 * @param {string} hintId - The id of the hint
 * @return {HintResponse} - The competition or null
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the hintId is not a validFormat
 */
router.get(
  '/:hintId',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const validFormat = Types.ObjectId.isValid(req.params.hintId);
    if (!validFormat) {
      res.status(404).json({
        error: 'Invalid hint ID format.'
      });
      return;
    }
    const hint = await HintCollection.findOneByHintId(req.params.hintId);
    const response = hint ? util.constructHintResponse(hint) : null;
    res.status(200).json(response);
  }
);

/**
 * Get the competition by competitionId
 *
 * @name GET /api/hint?competition=competitionId
 *
 * @param {string} competitionId - The id of the hint
 * @return {HintResponse} - The competition or null
 * @throws {403} - If the user is not logged in
 * @throws {400} - If competitionId not provided
 */
 router.get(
    '/',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
      const validFormat = Types.ObjectId.isValid(req.query.competition as string);
      if (!validFormat) {
        res.status(404).json({
          error: 'Invalid competition ID format.'
        });
        return;
      }
      const hint = await HintCollection.findOneByCompetitionId(req.query.competition as string);
      const response = hint ? util.constructHintResponse(hint) : null;
      res.status(200).json(response);
    }
  );

/**
 * Create a hint
 *
 * @name POST /api/hint
 *
 * @param {string} competitionId - The id of the competition
 * @param {string} pointsUntilReward - The number of points until a student is rewarded
 * @param {string} numberOfHints - The number of hints to award
 * @return {HintResponse} - The created competition
 * @throws {403} - If the user is not logged in
 * @throws {404} - If competitionId is not valid
 * @throws {403} - If competition has ended
 * @throws {403} - If competition already has a hint setting
 * @throws {400} - If pointsUntilReward is not a positive integer
 * @throws {400} - If numberOfHints is not a positive integer
 * @throws {403} - If user is not a teacher of the competition
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    hintValidator.isValidCompetition,
    hintValidator.competitionHasHintAlready,
    hintValidator.isValidPointsUntilReward,
    hintValidator.isValidNumberOfHints,
    hintValidator.isValidTeacherOfCompetition
  ],
  async (req: Request, res: Response) => {
    const hint = await HintCollection.addOne(req.body.competitionId, req.body.pointsUntilReward, req.body.numberOfHints);
    res.status(201).json({
      message: `Your hint setting was created successfully.`,
      hint: util.constructHintResponse(hint)
    });
  }
);

/**
 * Update a hint
 *
 * @name PATCH /api/hint/:hintId
 *
 * @param {string} hintId - The id of the hint
 * @param {string} competitionId - The id of the competition
 * @param {string} pointsUntilReward - The number of points until a student is rewarded
 * @param {string} numberOfHints - The number of hints to award
 * @return {HintResponse} - The updated competition
 * @throws {403} - If the user is not logged in
 * @throws {400} - If hintId is not valid
 * @throws {400} - If competitionId is not valid
 * @throws {403} - If competition has ended
 * @throws {403} - If competition already has a hint setting
 * @throws {400} - If pointsUntilReward is not a postive integer
 * @throws {400} - If numberOfHints is not a positive integer
 * @throws {403} - If user is not a teacher of the competition
 */
router.patch(
  '/:hintId',
  [
    userValidator.isUserLoggedIn,
    hintValidator.isValidHint,
    hintValidator.isValidCompetition,
    hintValidator.isValidPointsUntilReward,
    hintValidator.isValidNumberOfHints,
    hintValidator.isValidTeacherOfCompetition
  ],
  async (req: Request, res: Response) => {
    const hint = await HintCollection.updateOne(req.params.hintId, req.body.competitionId, req.body.pointsUntilReward, req.body.numberOfHints);
    res.status(200).json({
      message: 'Your hint was updated successfully.',
      hint: util.constructHintResponse(hint)
    });
  }
);

/**
 * Delete a hint.
 *
 * @name DELETE /api/hint/:hintId
 *
 * @param {string} hintId - The id of the hint
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If hintId is invalid
 * @throws {403} - If the user is not a teacher in the competition
 */
router.delete(
  '/:hintId',
  [
    userValidator.isUserLoggedIn,
    hintValidator.isValidHint,
    hintValidator.isValidTeacherOfCompetition
  ],
  async (req: Request, res: Response) => {
    await HintCollection.deleteOne(req.params.hintId);
    res.status(200).json({
      message: 'Your hint has been deleted successfully.'
    });
  }
);

export {router as hintRouter};
