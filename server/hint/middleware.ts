import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CompetitionCollection from '../competition/collection';
import HintCollection from './collection';

const isValidHint = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.hintId);
  const hint = validFormat ? await HintCollection.findOneByHintId(req.params.hintId) : undefined;
  if (!hint) {
    res.status(404).json({
      error: 'Invalid hint ID.'
    });
    return;
  }

  next();
};

const isValidCompetition = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.competitionId);
  const competition = validFormat ? await CompetitionCollection.findOneByCompetitionId(req.body.competitionId) : undefined;
  if (!competition) {
    res.status(404).json({
      error: 'Invalid competition ID.'
    });
    return;
  }

  if (competition.dateEnded) {
    res.status(403).json({
      error: 'This competition has ended'
    });
    return;
  }

  next();
};

const competitionHasHintAlready = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.competitionId);
  const competition = validFormat ? await CompetitionCollection.findOneByCompetitionId(req.body.competitionId) : undefined;
  if (!competition) {
    res.status(404).json({
      error: 'Invalid competition ID.'
    });
    return;
  }

  const hint = await HintCollection.findOneByCompetitionId(competition._id);
  if (hint) {
    res.status(403).json({
      error: 'This competition already has a hint'
    });
    return;
  }

  next();
};

const isValidPointsUntilReward = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.pointsUntilReward < 0 || !Number.isInteger(Number(req.body.pointsUntilReward))) {
    res.status(400).json({
      error: 'Number of points until reward should be a positive integer'
    });
    return;
  }

  next();
};

const isValidNumberOfHints = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.numberOfHints < 0 || !Number.isInteger(Number(req.body.numberOfHints))) {
    res.status(400).json({
      error: 'Number of hints should be a positive integer'
    });
    return;
  }

  next();
};

const isValidTeacherOfCompetition = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByCompetitionId(req.body.competitionId);
  const teachers = competition.classes.map(c => c.teacher._id.toString());
  if (!teachers.includes(req.session.userId)) {
    res.status(403).json({
      error: 'You are not a valid teacher in this competition'
    });
    return;
  }

  next();
};

export {
  isValidHint,
  isValidCompetition,
  competitionHasHintAlready,
  isValidPointsUntilReward,
  isValidNumberOfHints,
  isValidTeacherOfCompetition,
};
