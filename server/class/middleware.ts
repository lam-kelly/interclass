import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import ClassCollection from '../class/collection';

/**
 * Checks if the user exists.
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const toCheck = req.params.teacherId ? req.params.teacherId : req.params.studentId;
  const validFormat = Types.ObjectId.isValid(toCheck);
  const user = validFormat ? await UserCollection.findOneByUserId(toCheck) : '';
  // const user = await UserCollection.findOneByUserId(req.params.teacherId);
  if (!user) {
    res.status(404).json({
      error: 'The user with the given Id does not exist.'
    });
    return;
  }
  next();
}

/**
 * Checks if the class exists.
 */
const isClassExists = async (req: Request, res: Response, next: NextFunction) => {
  const curClass = await ClassCollection.findOneByclassId(req.params.classId);
  if (!curClass) {
    res.status(404).json({
      error: 'Class does not exist.'
    });
    return;
  }
  next();
}

/**
 * Checks if the student is already in the class.
 */
const isStudentInClass = async (req: Request, res: Response, next: NextFunction) => {
  const curClass = await ClassCollection.findOneByclassId(req.params.classId);
  const student = await UserCollection.findOneByUsername(req.body.studentName);
  const studentId = student._id.toString();
  let index = -1;
  let count = 0;
  for (const currStud of curClass.students){
    if (currStud._id.toString() == studentId){
      index = count;
      break; 
    }
    count++; 
  }
  if (index !== -1) {
    res.status(403).json({
      error: 'Student is already part of the class.'
    });
    return;
  }
  next();
}

const isTeacherInOneClass = async (req: Request, res: Response, next: NextFunction) => {
  const class1 = await ClassCollection.findOneByTeacher(req.session.userId);
  if (class1) {
    res.status(403).json({
      error: 'A teacher can only create one class.'
    });
    return;
  }

  next();
};


const isInOneClass = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.body.studentName);
  const studentId = user._id;
  const class1 = await ClassCollection.findOneByStudent(studentId);
  if (class1) {
    res.status(403).json({
      error: 'A student can only be in one class at a time.'
    });
    return;
  }

  next();
};

/**
 * Checks if the student exists.
 */
const isStudentExists = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.body.studentName);
  if (!user || user.role !== 'student') {
    res.status(404).json({
      error: 'Not a valid student.'
    });
    return;
  }
  next();
}

/**
 * Checks if the student ID exists.
 */
const isStudentIDExists = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.body.studentId);
  if (!user || user.role !== 'student') {
    res.status(404).json({
      error: 'Not a valid student.'
    });
    return;
  }
  next();
}

/**
 * Checks if the current user is a teacher
 */
const isValidTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const userRole = user.role;
  if (userRole !== 'teacher') {
    res.status(403).json({
      error: 'Cannot edit or create a class if you are not a teacher.'
    });
    return;
  }
  next();
};

/**
 * Checks if the user has permission to modify a class
 */
const canEdit = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const userId = user._id;
  const currentClass = await ClassCollection.findOneByclassId(req.params.classId);
  const teacherId = currentClass.teacher._id;
  if (userId.toString() !== teacherId.toString()) {
    res.status(403).json({
      error: 'Cannot edit the class that you are not the teacher of.'
    });
    return;
  }
  next();
};


export {
  isValidTeacher,
  isUserExists,
  isClassExists,
  isStudentExists,
  isStudentIDExists,
  canEdit,
  isStudentInClass,
  isInOneClass,
  isTeacherInOneClass
};
