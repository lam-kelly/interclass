import type {HydratedDocument, Types} from 'mongoose';
import type {Assignment} from './model';
import AssignmentModel from './model';
import ProblemCollection from '../problem/collection';
import ClassCollection from '../class/collection';

/**
 * This file contains a class with functionality to interact with Assignments stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Assignment> is the output of the AssignmentModel() constructor,
 * and contains all the information in Assignment. https://mongoosejs.com/docs/typescript.html
 */
class AssignmentCollection {
  /**
   * Create a new assignment
   *
   * @return {Promise<HydratedDocument<Assignment>>} - The newly created Assignment
   */
  static async addOne(): Promise<HydratedDocument<Assignment>> {
    const assignment = new AssignmentModel({problems: [], totalPoints: 0});
    // let points = 0;
    // for (const prob of assignment.problems){
    //   const questObj = await ProblemCollection.findOneByProblemId(prob._id);
    //   points += questObj.pointValue; //points += 1;
    // }
    // assignment.totalPoints = points;
    await assignment.save(); // Saves Assignment to MongoDB
    return (await assignment.populate('problems')).populate('totalPoints');
  }

    /**
   * Add a problem to an assignment
   *
   * @param {string} questionId - The ID of a problem
   * @param {string} assignmentId - The ID of the assignment
   * @return {Promise<HydratedDocument<Assignment>>} - The newly created Assignment
   */
  static async addQuestion(assignmentId: string | Types.ObjectId, questionId: string | Types.ObjectId): Promise<HydratedDocument<Assignment>> {
    const assignment = await AssignmentModel.findOne({_id: assignmentId});
    const questObj = await ProblemCollection.findOneByProblemId(questionId);
    assignment.problems.push(questionId);
    assignment.totalPoints += questObj.pointValue;
    await assignment.save(); // Saves Assignment to MongoDB
    return (await assignment.populate('problems')).populate('totalPoints');
  }

  /**
   * Delete an Assignment from the collection.
   *
   * @param {string} assignmentId - The id of the Assignment to delete
   * @return {Promise<Boolean>} - true if the Assignment has been deleted, false otherwise
   */
  static async deleteOne(assignmentId: Types.ObjectId | string): Promise<boolean> {
    const assignment = await AssignmentModel.deleteOne({_id: assignmentId});
    return assignment !== null;
  }

  /**
   * Find a Assignment by assignmentId.
   *
   * @param {string} assignmentId - The id of the Assignment to find
   * @return {Promise<HydratedDocument<Assignment>> | Promise<null>} - The Assignment with the given Assignment ID, if any
   */
  static async findOneById(assignmentId: Types.ObjectId | string): Promise<HydratedDocument<Assignment>> {
    return (await (await AssignmentModel.findOne({_id: assignmentId})).populate('problems')).populate('totalPoints');
  }

  /**
   * Student completes an assignment.
   *
   * @param {string} assignmentId - The id of the Assignment that was completed
   * @param {string} studentId - The ID of the student that completed the assignment
   * @return {Promise<HydratedDocument<Assignment>>} - The updated Assignment
   */
  static async finishAssignment(assignmentId: Types.ObjectId | string, studentId: string): Promise<HydratedDocument<Assignment>> {
    const assignment = await AssignmentModel.findOne({_id: assignmentId});
    const assignmentPoints = assignment.totalPoints;
    // const student = await UserCollection.findOneByUserId(studentId);

    // const studentClass = await ClassCollection.findOneByStudent(studentId);
    // const questions = assignment.problems;
    // let correctAnswers = [];
    // for (const question of questions){
    //   correctAnswers.push(question.answer);
    // }
    // const studentAnswers: string[] = [];
    // correctAnswers.forEach((answer1, index) => {
    //   const answer2 = studentAnswers[index];
    //   const curQuestion = questions[index];
    //   if (answer1 == answer2){
    //     studentClass.totalPoints += curQuestion.pointValue;
    //   }
    // });
    
    const studentClass = await ClassCollection.findOneByStudent(studentId);
    studentClass.totalPoints += assignmentPoints;

    await assignment.save();
    return (await assignment.populate('problems')).populate('totalPoints');
  }

}

export default AssignmentCollection;
