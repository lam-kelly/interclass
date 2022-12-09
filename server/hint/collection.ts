import type { HydratedDocument, Types } from 'mongoose';
import ClassCollection from '../class/collection';
import UserCollection from '../user/collection';
import type { Hint } from './model';
import HintModel from './model';

class HintCollection {
  /**
   * Add a new hint
   *
   * @param {string} competitionId - The id of the competition
   * @param {string} pointsUntilReward - The number of points until a student is rewarded
   * @param {string} numberOfHints - The number of hints to award
   * @return {Promise<HydratedDocument<Hint>>} - The newly created user
   */
  static async addOne(competitionId: Types.ObjectId | string, pointsUntilReward: Number, numberOfHints: Number): Promise<HydratedDocument<Hint>> {
    const hint = new HintModel({ competition: competitionId, pointsUntilReward, numberOfHints });
    await hint.save(); // Saves user to MongoDB
    return await hint.populate('competition');
  }

  /**
   * Find hint by hintId
   *
   * @param {string} hintId - The classId of the competition to find
   * @return {Promise<HydratedDocument<Hint>> | Promise<null>} - The hint with hintId
   */
   static async findOneByHintId(hintId: Types.ObjectId | string): Promise<HydratedDocument<Hint>> {
    return await HintModel.findOne({ _id: hintId }).populate('competition');
  }

  /**
   * Find a hint by competitionId
   *
   * @param {string} competitionId - The competitionId of the competition to find
   * @return {Promise<HydratedDocument<Hint>> | Promise<null>} - The user with the given username, if any
   */
   static async findOneByCompetitionId(competitionId: Types.ObjectId | string): Promise<HydratedDocument<Hint>> {
    return await HintModel.findOne({ competition: competitionId }).populate('competition');
  }

  /**
   * Update a hint
   *
   * @param {string} hintId - The hintId of the competition
   * @param {string} competitionId - The id of the competition
   * @param {string} pointsUntilReward - The number of points until a student is rewarded
   * @param {string} numberOfHints - The number of hints to award
   * @return {Promise<HydratedDocument<Hint>>} - The updated competition
   */
  static async updateOne(hintId: Types.ObjectId | string, competitionId: Types.ObjectId | string, pointsUntilReward: Number, numberOfHints: Number): Promise<HydratedDocument<Hint>> {
    await HintModel.updateOne({_id: hintId}, { competition: competitionId, pointsUntilReward, numberOfHints });
    return await HintModel.findOne({_id: hintId}).populate('competition');
  }

  /**
   * Delete a hint from the collection
   *
   * @param {string} hintId - The id of the hint to delete
   * @return {Promise<Boolean>} - true if the hint has been deleted, false otherwise
   */
  static async deleteOne(hintId: Types.ObjectId | string): Promise<boolean> {
    const hint = await HintModel.deleteOne({ _id: hintId });
    return hint !== null;
  }
}

export default HintCollection;
