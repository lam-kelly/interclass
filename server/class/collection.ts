import type {HydratedDocument, Types} from 'mongoose';
import type {Class} from './model';
import ClassModel from './model';
import UserCollection from '../user/collection';
import CompetitionCollection from '../competition/collection';
import HintCollection from '../hint/collection';

/**
 * This file contains a class with functionality to interact with Classs stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Class> is the output of the ClassModel() constructor,
 * and contains all the information in Class. https://mongoosejs.com/docs/typescript.html
 */
class ClassCollection {
  /**
   * Add a new Class
   *
   * @param {string} teacherId - The ID of the teacher who creates the class
   * @return {Promise<HydratedDocument<Class>>} - The newly created Class
   */
  static async addOne(teacherId: Types.ObjectId | string): Promise<HydratedDocument<Class>> {
    const Class = new ClassModel({teacher: teacherId, students: [], totalPoints: 0});
    await Class.save(); // Saves Class to MongoDB
    return (await (await Class.populate('teacher')).populate('students')).populate('totalPoints');
  }

  /**
   * Delete a Class from the collection.
   *
   * @param {string} classId - The classId of Class to delete
   * @return {Promise<Boolean>} - true if the Class has been deleted, false otherwise
   */
  static async deleteOne(classId: Types.ObjectId | string): Promise<boolean> {
    const Class = await ClassModel.deleteOne({_id: classId});
    const competitions = await CompetitionCollection.findAllByClassId(classId);
    for (const competition of competitions){
      await CompetitionCollection.updateOneRemoveClass(competition._id, classId);
    }
    return Class !== null;
  }

  /**
   * Find a Class by classId.
   *
   * @param {string} classId - The classId of the Class to find
   * @return {Promise<HydratedDocument<Class>> | Promise<null>} - The Class with the given Class ID, if any
   */
  static async findOneByclassId(classId: Types.ObjectId | string): Promise<HydratedDocument<Class>> {
    return await ClassModel.findOne({_id: classId}).populate('teacher').populate('students').populate('totalPoints');
  }

  /**
   * Find a Class by teacher
   *
   * @param {string} teacherId - The ID of the teacher
   * @return {Promise<HydratedDocument<Class>> | Promise<null>} - The Class with the given Class ID, if any
   */
  static async findOneByTeacher(teacherId: Types.ObjectId | string): Promise<HydratedDocument<Class>> {
    // const user = await UserCollection.findOneByUserId(teacherId);
    // return ClassModel.findOne({teacher: user._id});
    return await ClassModel.findOne({teacher: teacherId}).populate('teacher').populate('students').populate('totalPoints');
  }

   /**
   * Find a Class by student
   *
   * @param {string} studentId - The ID of the student
   * @return {Promise<HydratedDocument<Class>> | Promise<null>} - The Class with the given Class ID, if any
   */
  static async findOneByStudent(studentId: Types.ObjectId | string): Promise<HydratedDocument<Class>> {
    // const user = await UserCollection.findOneByUserId(studentId);
    // return ClassModel.findOne({students: user} );
    // return ClassModel.findOne({students: {$all: [studentId]}}); 
    return await ClassModel.findOne({students: studentId}).populate('teacher').populate('students').populate('totalPoints');
    // return (await (await foundClass.populate('teacher')).populate('students')).populate('totalPoints');
  }

  /**
   * Add a student to a class. 
   *
   * @param {string} classId - The classId of the Class to update
   * @param {string} studentName - The name of the student to be added 
   * @return {Promise<HydratedDocument<Class>>} - The updated Class
   */
  static async addStudent(classId: Types.ObjectId | string, studentName: string): Promise<HydratedDocument<Class>> {
    const Class = await ClassModel.findOne({_id: classId});
    const student = await UserCollection.findOneByUsername(studentName);
    Class.students.push(student);
    // Class.students.push(studentId);

    await Class.save();
    return (await (await Class.populate('teacher')).populate('students')).populate('totalPoints');

    // This is the code I have for adding a class to an array of classes
    // It makes mongo to the pushing istead
    // It's a little simplier than what you have so idk if you wanna change
    //
    // await CompetitionModel.updateOne({_id: competitionId}, {$push: {classes: classId}});
    // return await CompetitionModel.findOne({_id: competitionId})
    // .populate('creatorId')
    // .populate('classes')
    // .populate('assignments')
    // .populate({
    //   path : 'assignments',
    //   populate : {
    //     path : 'problems'
    //   }
    // });
  }

    /**
   * Add points to a class
   *
   * @param {string} studentId - The ID of the student in the class
   * @param {number} points - The number of points to add 
   * @return {Promise<HydratedDocument<Class>>} - The updated Class
   */
  static async addPoints(studentId: Types.ObjectId | string, points: number): Promise<HydratedDocument<Class>> {
    const Class = await ClassCollection.findOneByStudent(studentId);
    const oldPoints = Class.totalPoints;
    Class.totalPoints += points;
    await Class.save();
    const competition = await CompetitionCollection.findOneByUserId(studentId);
    const hint = await HintCollection.findOneByCompetitionId(competition._id);
    const pastMilestoneNum = Math.floor(oldPoints/hint.pointsUntilReward);
    const currMilestoneNum = Math.floor(Class.totalPoints/hint.pointsUntilReward);
    const diff = currMilestoneNum - pastMilestoneNum;
    if (diff) {
      Class.students.forEach(async (student) => {
        await UserCollection.updateOneHints(student._id, diff * hint.numberOfHints);
      });
    }
    return (await (await Class.populate('teacher')).populate('students')).populate('totalPoints');
  }

  /**
   * Remove a student from a class. 
   *
   * @param {string} classId - The classId of the Class to update
   * @param {string} studentId - The ID of the student to be removed
   * @return {Promise<HydratedDocument<Class>>} - The updated Class
   */
   static async removeStudent(classId: Types.ObjectId | string, studentId: string): Promise<HydratedDocument<Class>> {
    const Class = await ClassModel.findOne({_id: classId});
    // const student = await UserCollection.findOneByUserId(studentId);
    // const index = Class.students.indexOf(student);
    let index = -1;
    let count = 0;
    for (const currStud of Class.students){
      if (currStud._id.toString() == studentId){
        index = count;
        break; 
      }
      count++; 
    }
    // const index = Class.students.indexOf(student);
    if (index !== -1) {
        Class.students.splice(index, 1);
    }

    await Class.save();
    return (await (await Class.populate('teacher')).populate('students')).populate('totalPoints');

    // This is the code I have for removing class from an array of classes
    // It's a little simplier than what you have so idk if you wanna change
    //
    // await CompetitionModel.updateOne({_id: competitionId}, {$pull: {classes: classId}});
    // return await CompetitionModel.findOne({_id: competitionId})
    // .populate('creatorId')
    // .populate('classes')
    // .populate('assignments')
    // .populate({
    //   path : 'assignments',
    //   populate : {
    //     path : 'problems'
    //   }
    // });
  }

}

export default ClassCollection;
