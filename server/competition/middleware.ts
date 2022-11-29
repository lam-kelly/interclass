import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';

const isValidCompetitionCreator = async (req: Request, res: Response, next: NextFunction) => {
  next();
};

const isValidTeacherOfClass = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidCompetition = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidClass = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidClassJoin = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidClassLeave = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidAssignment = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidAddAssignment = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidRemoveAssignment = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

const isValidTeacherOfCompetition = async (req: Request, res: Response, next: NextFunction) => {

  next();
};

export {
  isValidCompetitionCreator,
  isValidTeacherOfClass,
  isValidCompetition,
  isValidClass,
  isValidClassJoin,
  isValidClassLeave,
  isValidAssignment,
  isValidAddAssignment,
  isValidRemoveAssignment,
  isValidTeacherOfCompetition,
};
