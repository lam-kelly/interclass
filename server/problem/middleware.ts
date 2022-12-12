import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import CompetitionCollection from '../competition/collection';
import ProblemCollection from './collection';

/**
 * Checks if a problem with problemId in req.params exists
 */
const isProblemExists = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.problemId) {
        res.status(400).json({
            error: 'Provided problem Id must be nonempty.'
        });
        return;
    }

    const validFormat = Types.ObjectId.isValid(req.params.problemId);
    const problem = validFormat ? await ProblemCollection.findOneByProblemId(req.params.problemId) : '';
    if (!problem) {
        res.status(404).json({
            error: `Problem with problem Id ${req.params.problemId} does not exist.`
        });
        return;
    }

    next();
};

/**
 * Checks if a problem is valid:
 * - question, answer, answer choices are all non-empty
 * - answer is among the answer choices
 */
const isValidProblem = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.question || !req.body.question.trim()) {
        console.log('here')
        res.status(400).json({
            error: 'Problem question must be at least one character long.'
        });
        return;
    }

    if (!req.body.pointValue.toString() || !req.body.pointValue.toString().trim()) {
        res.status(400).json({
            error: 'Point value must be non empty.'
        });
        return;
    }
    else {
        if (req.body.pointValue <= 0) {
            res.status(400).json({
                error: 'Point value must be a positive integer.'
            });
            return;
        }
    }

    let answerAmongAnswerChoices = false;
    const previousAnswerChoices = new Set();
    for (const answerChoice of req.body.answerChoices) {
        if (!answerChoice || !answerChoice.trim()) {
            res.status(400).json({
                error: 'Answer choice must be at least one character long.'
            });
            return;
        }

        // checking for duplicate answer choices
        if (previousAnswerChoices.has(answerChoice)) {
            res.status(400).json({
                error: 'Cannot have duplicate answer choices.'
            });
            return;
        }

        if (req.body.answer === answerChoice) {
            answerAmongAnswerChoices = true;
        }

        previousAnswerChoices.add(answerChoice)
    }

    if (!answerAmongAnswerChoices) {
        res.status(403).json({
            error: 'Answer has to match one of the provided answer choices.'
        });
        return;
    }

    next();
};

/**
 * Checks if a user with userId as newSolverId or newWorkerId in req.body exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.body.newWorkerId && !req.body.newSolverId) {
        res.status(400).json({
            error: 'Provided worker or solver cannot both be empty.'
        });
        return;
    }

    // if (!req.body.newWorkerId) {
    //   res.status(400).json({
    //     error: 'Provided Id of attempter must be nonempty.'
    //   });
    //   return;
    // }
    if (req.body.newWorkerId) {
        const validFormat = Types.ObjectId.isValid(req.body.newWorkerId);
        const user = validFormat ? await UserCollection.findOneByUserId(req.body.newWorkerId as string) : '';
        if (!user) {
            res.status(404).json({
                error: `A user with Id ${req.body.newWorkerId as string} does not exist.`
            });
            return;
        }
    }

    // if (!req.body.newSolverId) {
    //     res.status(400).json({
    //         error: 'Provided Id of solver must be nonempty.'
    //     });
    //     return;
    // }
    if (req.body.newSolverId) {
        const validFormat = Types.ObjectId.isValid(req.body.newSolverId);
        const user = validFormat ? await UserCollection.findOneByUserId(req.body.newSolverId as string) : '';
        if (!user) {
            res.status(404).json({
                error: `A user with Id ${req.body.newSolverId as string} does not exist.`
            });
            return;
        }
    }

    next();
};

const isValidTeacherOfCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (user.role !== 'teacher') {
        res.status(400).json({
            error: 'You are not a teacher'
        });
        return;
    }
    const competition = await CompetitionCollection.findOneByUserId(req.session.userId);
    if (!competition) {
        res.status(400).json({
            error: 'You are not in a competition'
        });
        return;
    }
    const teachers = competition.classes.map(c => c.teacher._id.toString());
    if (!teachers.includes(req.session.userId)) {
        res.status(400).json({
            error: 'You are not a valid teacher in a competition'
        });
        return;
    }

    next();
};

export {
    isProblemExists,
    isValidProblem,
    isUserExists,
    isValidTeacherOfCompetition
};
