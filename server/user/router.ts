import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import ClassCollection from '../class/collection';

const router = express.Router();

/**
 * Get the signed in user
 * TODO: may need better route and documentation
 * (so students don't accidentally delete this when copying over)
 *
 * @name GET /api/users/session
 *
 * @return - currently logged in user, or null if not logged in
 */
router.get(
  '/session',
  [],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    res.status(200).json({
      message: 'Your session info was found successfully.',
      user: user ? util.constructUserResponse(user) : null
    });
  }
);

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @param {string} role - user's role (student or teacher)
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username, req.body.password, req.body.role);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PATCH /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.patch(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's hint number
 *
 * @name PATCH /api/users/hints
 *
 * @param {string} hints - Number of hints to add
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If hint is not a positive integer
 */
router.patch(
  '/hints',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOneHints(userId, Number(req.body.hints));
    res.status(200).json({
      message: 'Your hints were updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    if (user.role === 'teacher') {
      const classs = await ClassCollection.findOneByTeacher(userId);
      if (classs) {
        await ClassCollection.deleteOne(classs._id);
      }
    }
    else {
      const classs = await ClassCollection.findOneByStudent(userId);
      if (classs) {
        await ClassCollection.removeStudent(classs._id, userId);
      }
    }
    await UserCollection.deleteOne(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * Get the requested user
 *
 * @name GET /api/users/:username?
 *
 * @return - user if user with username was found, null otherwise
 */
 router.get(
  '/:username?',
  async (req: Request, res: Response) => {
    if (!req.params.username) {
      res.status(400).json({
        error: 'Provided username must be nonempty.'
      });
      return;
    }

    const user = await UserCollection.findOneByUsername(req.params.username);
    const response = user ? util.constructUserResponse(user) : null;
    res.status(200).json(response);
  }
);

export {router as userRouter};
