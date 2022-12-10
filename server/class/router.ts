import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ClassCollection from './collection';
import * as userValidator from '../user/middleware';
import ClassModel from './model';
import UserCollection from '../user/collection';
import * as classValidator from '../class/middleware';

const router = express.Router();

/**
 * Get all classes
 *
 * @name GET /api/class/allclass
 *
 * @return {string} - The classes that exist
 */
router.get(
  '/allclass',
  [],
  async (req: Request, res: Response) => {
    const classes = await ClassModel.find({});
    res.status(200).json(classes);
  },
);

/**
 * Get the class given an Id
 *
 * @name GET /api/class/:classId
 *
 * @return {string} - The class specified by the Id
 */
 router.get(
  '/:classId?',
  [], 
async (req: Request, res: Response) => {
  // const response = await ClassModel.findOne({_id: req.params.classId});
  const response = await ClassCollection.findOneByclassId(req.params.classId);
  res.status(200).json(response);
},
);

/**
 * Get the class of a teacher
 *
 * @name GET /api/class/teacher/:teacherId
 *
 * @return {string} - The class that the teacher has
 * @throws {404} - If the teacherId is not valid
 */
router.get(
    '/teacher/:teacherId?',
    [classValidator.isUserExists], 
  async (req: Request, res: Response) => {
    // const user = await UserCollection.findOneByUserId(req.params.teacherId);
    // const userId = user._id;
    const response = await ClassCollection.findOneByTeacher(req.params.teacherId);
    res.status(200).json(response);
  },
);

/**
 * Get the class of a student
 *
 * @name GET /api/class/student/:studentId
 *
 * @return {string} - The class that the student has
 * @throws {404} - If the studentId is not valid
 */
router.get(
    '/student/:studentId?',
    [classValidator.isUserExists], 
  async (req: Request, res: Response) => {
    // const user = await UserCollection.findOneByUserId(req.params.teacherId);
    // const userId = user._id;
    const response = await ClassCollection.findOneByStudent(req.params.studentId);
    res.status(200).json(response);
  },
);

/**
 * Create a new class.
 *
 * @name POST /api/class
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not a teacher
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    classValidator.isValidTeacher,
    classValidator.isTeacherInOneClass
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    // const user = await UserCollection.findOneByUserId(userId);
    const newClass = await ClassCollection.addOne(userId);

    res.status(201).json({
      class: newClass,
      message: 'Your class was created successfully.'
    });
  }
);

/**
 * Delete a class
 *
 * @name DELETE /api/class/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the teacher of
 *                 the class
 * @throws {404} - If the classId is not valid
 */
router.delete(
  '/:classId?',
  [
    userValidator.isUserLoggedIn,
    classValidator.isValidTeacher,
    classValidator.isClassExists,
    classValidator.canEdit
  ],
  async (req: Request, res: Response) => {
    await ClassCollection.deleteOne(req.params.classId);
    res.status(200).json({message: 'Your class was deleted successfully.'});
  }
);

/**
 * Add a student to a class
 *
 * @name PATCH /api/class/add/:id
 *
 * @param {string} studentName - the name of the new student to be added
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in or not the teacher of the class, or the student is already in a class
 * @throws {404} - If the classId is not valid
 * @throws {400} - If the student does not exist
 */
router.patch(
  '/add/:classId?',
  [
    userValidator.isUserLoggedIn,
    classValidator.isValidTeacher,
    classValidator.isClassExists,
    classValidator.canEdit,
    classValidator.isStudentExists,
    // classValidator.isStudentInClass,
    classValidator.isInOneClass
  ],
  async (req: Request, res: Response) => {
    const currClass = await ClassCollection.addStudent(req.params.classId, req.body.studentName);
    res.status(201).json({
      class: currClass,
      message: 'You added a student to your class successfully.'
    });
  }
);

/**
 * Remove a student from a class
 *
 * @name PATCH /api/class/remove/:id
 *
 * @param {string} studentId - the ID of the new student to be removed
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in or not the teacher of the class
 * @throws {404} - If the classId is not valid
 * @throws {400} - If the student does not exist
 */
 router.patch(
    '/remove/:classId?',
    [
      userValidator.isUserLoggedIn,
      classValidator.isValidTeacher,
      classValidator.isClassExists,
      classValidator.canEdit,
      classValidator.isStudentIDExists
    ],
    async (req: Request, res: Response) => {
      const currClass = await ClassCollection.removeStudent(req.params.classId, req.body.studentId);
      // res.status(200).json({message: 'You removed a student from your class successfully.'});
      res.status(200).json({
        class: currClass,
        message: 'You removed a student from your class successfully.'
      });
    }
  );

export {router as classRouter};
