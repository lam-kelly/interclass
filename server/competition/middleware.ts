import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import CompetitionCollection from '../competition/collection';
import ClassCollection from '../class/collection';
import AssignmentCollection from '../assignment/collection';

const isTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (user.role !== 'teacher') {
    res.status(403).json({
      error: 'You are not a teacher'
    });
    return;
  }

  next();
};

const isNotInCompetition = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByUserId(req.session.userId);
  if (competition) {
    res.status(403).json({
      error: 'You can only be in one competition at a time'
    });
    return;
  }

  next();
};

const isValidCompetition = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.competitionId);
  const competition = validFormat ? await CompetitionCollection.findOneByCompetitionId(req.params.competitionId) : undefined;
  if (!competition) {
    res.status(404).json({
      error: 'Invalid competition ID.'
    });
    return;
  }

  next();
};

const isValidClassAndTeacherOfClass = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.classId);
  const classs = validFormat ? await ClassCollection.findOneByclassId(req.body.classId) : undefined;
  if (!classs) {
    res.status(404).json({
      error: 'Invalid class ID'
    });
    return;
  }

  if (classs.teacher._id.toString() !== req.session.userId) {
    res.status(403).json({
      error: 'You are not the teacher of this class'
    });
    return;
  }

  next();
};

const isValidClassJoin = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByCompetitionId(req.params.competitionId);
  if (!competition.dateEnded && competition.classes.map(c => c._id.toString()).includes(req.body.classId)) {
    res.status(400).json({
      error: 'Your class is already part of this competition'
    });
    return;
  }
  next();
};

const isValidClassLeave = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByCompetitionId(req.params.competitionId);
  if (!competition.classes.map(c => c._id.toString()).includes(req.body.classId)) {
    res.status(400).json({
      error: 'Your class is not part of this competition'
    });
    return;
  }

  next();
};

const isValidAssignment = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.assignmentId);
  const assignment = validFormat ? await AssignmentCollection.findOneById(req.body.assignmentId) : undefined;
  if (!assignment) {
    res.status(404).json({
      error: 'Assignment with this ID does not exist'
    });
    return;
  }

  next();
};

const isValidTeacherOfCompetition = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByCompetitionId(req.params.competitionId);
  const teachers = competition.classes.map(c => c.teacher._id.toString());
  if (!teachers.includes(req.session.userId)) {
    res.status(400).json({
      error: 'You are not a valid teacher in this competition'
    });
    return;
  }

  next();
};

const isValidAddAssignment = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByCompetitionId(req.params.competitionId);
  if (!competition.dateEnded && competition.assignments.map(a => a._id.toString()).includes(req.body.assignmentId)) {
    res.status(400).json({
      error: 'Your assignment is already part of this competition'
    });
    return;
  }

  next();
};

const isValidRemoveAssignment = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByCompetitionId(req.params.competitionId);
  if (!competition.assignments.map(a => a._id.toString()).includes(req.body.assignmentId)) {
    res.status(400).json({
      error: 'Your assignment is not part of this competition'
    });
    return;
  }

  next();
};

const isValidCompetitionName = (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};
  if (!name) {
    res.status(400).json({
      error: 'Provide a Competition name'
    });
    return;
  }
  else if(!name.trim()) {
    res.status(400).json({
      error: 'Competition name must be at least one character long'
    });
    return;
  }

  next();
};

const teacherHasClass = async (req: Request, res: Response, next: NextFunction) => {
  const classs = await ClassCollection.findOneByTeacher(req.session.userId);
  if (!classs) {
    res.status(403).json({
      error: 'You do not have a class'
    });
    return;
  }

  next();
};

const isCompetitionEnded = async (req: Request, res: Response, next: NextFunction) => {
  const competition = await CompetitionCollection.findOneByCompetitionId(req.params.competitionId);
  if (competition.dateEnded) {
    res.status(403).json({
      error: 'This competition has ended'
    });
    return;
  }

  next();
};

export {
  isTeacher,
  isNotInCompetition,
  isValidCompetition,
  isValidClassAndTeacherOfClass,
  isValidClassJoin,
  isValidClassLeave,
  isValidAssignment,
  isValidAddAssignment,
  isValidRemoveAssignment,
  isValidTeacherOfCompetition,
  isValidCompetitionName,
  teacherHasClass,
  isCompetitionEnded
};
