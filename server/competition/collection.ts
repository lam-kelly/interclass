import type { HydratedDocument, Types } from 'mongoose';
import ClassCollection from '../class/collection';
import UserCollection from '../user/collection';
import type { Competition } from './model';
import CompetitionModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class CompetitionCollection {
  /**
   * Add a new competition
   *
   * @param {string} name - The name of the competition
   * @param {string} creatorId - The userId of the creator of the competition
   * @return {Promise<HydratedDocument<Competition>>} - The newly created user
   */
  static async addOne(name: string, creatorId: string): Promise<HydratedDocument<Competition>> {
    const dateJoined = new Date();

    const competition = new CompetitionModel({ name, creatorId, dateJoined });
    await competition.save(); // Saves user to MongoDB
    return (await (await (await competition
      .populate('creatorId'))
      .populate('classes'))
      .populate('assignments')
      ).populate({
        path : 'assignments',
        populate : {
          path : 'problems'
        }
      });
  }

  /**
   * Find a competition by user with userId.
   *
   * @param {string} userId - The userId of the user in the competition to find
   * @return {Promise<HydratedDocument<Competition>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Competition>> {
    const user = await UserCollection.findOneByUserId(userId);
    if (user.role === 'teacher') {
      const classs = await ClassCollection.findOneByTeacher(userId);
      return await CompetitionModel.findOne({ classes: classs, dateEnded: undefined })
      .populate('creatorId')
      .populate('classes')
      .populate('assignments')
      .populate({
        path : 'assignments',
        populate : {
          path : 'problems'
        }
      });
    }
    else {
      const classs = await ClassCollection.findOneByStudent(userId);
      return await CompetitionModel.findOne({ classes: classs, dateEnded: undefined })
      .populate('creatorId')
      .populate('classes')
      .populate('assignments')
      .populate({
        path : 'assignments',
        populate : {
          path : 'problems'
        }
      });
    }
  }


  /**
   * Add a class to a competition
   *
   * @param {string} competitionId - The ID of the competition to update
   * @param {string} classId - The ID of the class to add
   * @return {Promise<HydratedDocument<Competition>>} - The updated competition
   */
  static async updateOneAddClass(competitionId: Types.ObjectId | string, classId: Types.ObjectId | string): Promise<HydratedDocument<Competition>> {
    await CompetitionModel.updateOne({_id: competitionId}, {$push: {classes: classId}});
    return await CompetitionModel.findOne({_id: competitionId})
    .populate('creatorId')
    .populate('classes')
    .populate('assignments')
    .populate({
      path : 'assignments',
      populate : {
        path : 'problems'
      }
    });
  }

  /**
   * Remove a class from a competition
   *
   * @param {string} competitionId - The ID of the competition to update
   * @param {string} classId - The ID of the class to remove
   * @return {Promise<HydratedDocument<Competition>>} - The updated competition
   */
   static async updateOneRemoveClass(competitionId: Types.ObjectId | string, classId: Types.ObjectId | string): Promise<HydratedDocument<Competition>> {
    await CompetitionModel.updateOne({_id: competitionId}, {$pull: {classes: classId}});
    return await CompetitionModel.findOne({_id: competitionId})
    .populate('creatorId')
    .populate('classes')
    .populate('assignments')
    .populate({
      path : 'assignments',
      populate : {
        path : 'problems'
      }
    });
  }

  /**
   * Add an assignment to a competition
   *
   * @param {string} competitionId - The ID of the competition to update
   * @param {string} assignmentId - The ID of the assignment to add
   * @return {Promise<HydratedDocument<Competition>>} - The updated competition
   */
   static async updateOneAddAssignment(competitionId: Types.ObjectId | string, assignmentId: Types.ObjectId | string): Promise<HydratedDocument<Competition>> {
    await CompetitionModel.updateOne({_id: competitionId}, {$push: {assignments: assignmentId}});
    return await CompetitionModel.findOne({_id: competitionId})
    .populate('creatorId')
    .populate('classes')
    .populate('assignments')
    .populate({
      path : 'assignments',
      populate : {
        path : 'problems'
      }
    });
  }

  /**
   * Remove an assignment from a competition
   *
   * @param {string} competitionId - The ID of the competition to update
   * @param {string} assignmentId - The ID of the assignment to remove
   * @return {Promise<HydratedDocument<Competition>>} - The updated competition
   */
   static async updateOneRemoveAssignment(competitionId: Types.ObjectId | string, assignmentId: Types.ObjectId | string): Promise<HydratedDocument<Competition>> {
    await CompetitionModel.updateOne({_id: competitionId}, {$pull: {assignments: assignmentId}});
    return await CompetitionModel.findOne({_id: competitionId})
    .populate('creatorId')
    .populate('classes')
    .populate('assignments')
    .populate({
      path : 'assignments',
      populate : {
        path : 'problems'
      }
    });
  }

  /**
   * Update competition end date
   *
   * @param {string} competitionId - The userId of the user to update
   * @return {Promise<HydratedDocument<Competition>>} - The updated user
   */
   static async updateOneCompetitionEndDate(competitionId: Types.ObjectId | string): Promise<HydratedDocument<Competition>> {
    const competition = await CompetitionModel.findOne({ _id: competitionId });
    competition.dateEnded = new Date();

    await competition.save();
    return (await (await (await competition
      .populate('creatorId'))
      .populate('classes'))
      .populate('assignments'))
      .populate({
        path : 'assignments',
        populate : {
          path : 'problems'
        }
      });
  }

  /**
   * Delete a competition from the collection.
   *
   * @param {string} competitionId - The competitionId of competition to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(competitionId: Types.ObjectId | string): Promise<boolean> {
    const competition = await CompetitionModel.deleteOne({ _id: competitionId });
    return competition !== null;
  }
}

export default CompetitionCollection;
