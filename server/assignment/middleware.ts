import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import AssignmentCollection from '../assignment/collection';

/**
 * Checks if the assignment exists.
 */
const isAssignmentExists = async (req: Request, res: Response, next: NextFunction) => {
  const assignment = await AssignmentCollection.findOneById(req.params.assignmentId);
  if (!assignment) {
    res.status(404).json({
      error: 'Assignment does not exist.'
    });
    return;
  }
  next();
}

/**
 * Checks if the student exists.
 */
const isValidStudent = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (!user) {
    res.status(400).json({
      error: 'Not a valid student.'
    });
    return;
  } else if (user.role !== 'student') {
    res.status(403).json({
      error: 'Cannot submit an assignment if you are not a student.'
    });
    return;
  }
  next();
}

// /**
//  * Checks if the current user is a student
//  */
// const isValidStudent = async (req: Request, res: Response, next: NextFunction) => {
//   const user = await UserCollection.findOneByUserId(req.session.userId);
//   const userRole = user.role;
//   if (userRole !== 'student') {
//     res.status(403).json({
//       error: 'Cannot submit an assignment if you are not a student.'
//     });
//     return;
//   }
//   next();
// };


export {
  isAssignmentExists,
  isValidStudent
};
