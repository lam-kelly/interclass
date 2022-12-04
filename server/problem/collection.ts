import type {HydratedDocument, ObjectId, Types} from 'mongoose';
import mongoose from 'mongoose';
import ClassCollection from '../class/collection';
import UserCollection from 'server/user/collection';
import type {Problem} from './model';
import ProblemModel from './model';

class ProblemCollection {
    /**
     * Add a new problem
     *
     * @param {string} question - The username of the user
     * @param {string} answer - The password of the user
     * @param {string[]} answerChoices - The role of the user
     * @return {Promise<HydratedDocument<Problem>>} - The newly created user
     */
    static async addOne(question: string, answerChoices: string[], answer: string, pointValue: Number): Promise<HydratedDocument<Problem>> {
        const problem = new ProblemModel({
            question, 
            answer, 
            answerChoices, 
            solvers: [],
            workers: [],
            pointValue
        });
        await problem.save(); 
        return (await problem.populate('workers')).populate('solvers');
    }

    /**
     * Find a problem by problemId.
     *
     * @param {string} problemId - The problemId of the problem to find
     * @return {Promise<HydratedDocument<Problem>> | Promise<null>} - The user with the given username, if any
     */
    static async findOneByProblemId(problemId: Types.ObjectId | string): Promise<HydratedDocument<Problem>> {
        return ProblemModel.findOne({_id: problemId}).populate('workers').populate('solvers');
    }

    /**
     * Update the problem's details 
     *
     * @param {string} problemId - The problemId of the problem to update
     * @param {Object} problemDetails - An object with the problem's updated details
     * @return {Promise<HydratedDocument<Problem>>} - The updated user
     */
    static async updateOne(
        problemId: Types.ObjectId | string, 
        problemDetails: {
            newWorkerId?: string; 
            newSolverId?: string;
            answerChoices?: string[];
            answer?: string;
            question?: string;
            pointValue?: number;
        }
    ): Promise<HydratedDocument<Problem>> {
        const problem = await ProblemModel.findOne({_id: problemId});
        if (problemDetails.newWorkerId) {
            const newWorker = new mongoose.Types.ObjectId(problemDetails.newWorkerId)
            if (!problem.workers.includes(newWorker)) {
                // await ProblemModel.updateOne({_id: problemId}, {$push: {workers: problemDetails.newWorkerId}})
                problem.workers.push(newWorker)
            }
        }

        if (problemDetails.newSolverId) {
            const newSolver = new mongoose.Types.ObjectId(problemDetails.newSolverId)
            if (!problem.solvers.includes(newSolver)) {
                // await ProblemModel.updateOne({_id: problemId}, {$push: {solvers: problemDetails.newSolverId}})
                problem.solvers.push(newSolver)
                ClassCollection.addPoints(problemDetails.newSolverId, problem.pointValue)
            }
            // const solverId = problemDetails.newSolverId as ObjectId;
            // problem.solvers.push(problemDetails.newSolverId)
        }

        if (problemDetails.answerChoices) {
            // await ProblemModel.updateOne({_id: problemId}, {$set: {answerChoices: problemDetails.answerChoices}}) 
            problem.answerChoices = problemDetails.answerChoices;
        }

        if (problemDetails.answer) {
            problem.answer = problemDetails.answer;
        }

        if (problemDetails.question) {
            problem.question = problemDetails.question;
        }

        if (problemDetails.pointValue) {
            problem.pointValue = problemDetails.pointValue;
        }

        await problem.save();
        // need to do nested populate for array elements
        return await ProblemModel.findOne({id: problemId}).populate('workers').populate('solvers');
    }

    /**
     * Delete a problem from the collection.
     *
     * @param {string} problemId - The problemId of problem to delete
     * @return {Promise<Boolean>} - true if the problem has been deleted, false otherwise
     */
    static async deleteOne(problemId: Types.ObjectId | string): Promise<boolean> {
        const problem = await ProblemModel.deleteOne({_id: problemId});
        return problem !== null;
    }
}

export default ProblemCollection;
