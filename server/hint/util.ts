import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Hint, PopulatedHint} from './model';
import type {Competition} from '../competition/model';
import type {Assignment} from '../assignment/model';

type HintResponse = {
  _id: string;
  competition: Competition;
  pointsUntilReward: Number;
  numberOfHints: Number;
};

/**
 * Transform a raw Hint object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Hint>} hint - A hint object
 * @returns {HintResponse} - A hint object
 */
const constructHintResponse = (hint: HydratedDocument<Hint>): HintResponse => {
  const hintCopy: PopulatedHint = {
    ...hint.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...hintCopy,
    _id: hintCopy._id.toString(),
  };
};

export {
  constructHintResponse
};
