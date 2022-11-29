import type {HydratedDocument, Types} from 'mongoose';
import type {Class} from './model';
import type {User} from '../user/model';
import ClassModel from './model';
import UserCollection from '../user/collection';

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
    return Class;
  }

  /**
   * Delete a Class from the collection.
   *
   * @param {string} classId - The classId of Class to delete
   * @return {Promise<Boolean>} - true if the Class has been deleted, false otherwise
   */
  static async deleteOne(classId: Types.ObjectId | string): Promise<boolean> {
    const Class = await ClassModel.deleteOne({_id: classId});
    return Class !== null;
  }

  /**
   * Find a Class by classId.
   *
   * @param {string} classId - The classId of the Class to find
   * @return {Promise<HydratedDocument<Class>> | Promise<null>} - The Class with the given Class ID, if any
   */
  static async findOneByclassId(classId: Types.ObjectId | string): Promise<HydratedDocument<Class>> {
    return ClassModel.findOne({_id: classId});
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
    const foundClass = await ClassModel.findOne({teacher: teacherId} );
    return foundClass;
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
    const foundClass = await ClassModel.findOne({students: studentId} );
    return foundClass;
  }

  /**
   * Add a student to a class. 
   *
   * @param {string} classId - The classId of the Class to update
   * @param {string} studentId - The ID of the student to be added 
   * @return {Promise<HydratedDocument<Class>>} - The updated Class
   */
  static async addStudent(classId: Types.ObjectId | string, studentId: string): Promise<HydratedDocument<Class>> {
    const Class = await ClassModel.findOne({_id: classId});
    const student = await UserCollection.findOneByUserId(studentId);
    Class.students.push(student);
    // Class.students.push(studentId);

    await Class.save();
    return Class;
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
    return Class;
  }

}

export default ClassCollection;
