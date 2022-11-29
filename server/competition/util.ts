import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Competition, PopulatedCompetition} from './model';
import type {Class} from '../class/model';
import type {Assignment} from '../assignment/model';

type CompetitionResponse = {
  _id: string;
  name: string;
  creatorName: string;
  classes: Class[];
  assignments: Assignment[];
  dateStarted: string;
  dateEnded: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Competition object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Competition>} competition - A competition object
 * @returns {CompetitionResponse} - The competition object without the password
 */
const constructCompetitionResponse = (competition: HydratedDocument<Competition>): CompetitionResponse => {
  const competitionCopy: PopulatedCompetition = {
    ...competition.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...competitionCopy,
    _id: competitionCopy._id.toString(),
    creatorName: competitionCopy.creatorId.username,
    dateStarted: formatDate(competition.dateStarted),
    dateEnded: competition.dateEnded ? formatDate(competition.dateEnded) : undefined
  };
};

export {
  constructCompetitionResponse
};
