import _ from 'lodash';
const { isEmpty } = _;

/**
 * @typedef {Object} UserLoginResponse
 * @property {string} objectId - The objectId of the logged-in user.
 * @property {string} sessionToken - The sessionToken of the logged-in user.
 */

/**
 * Cloud function for user signup.
 * It accepts optional 'username' and 'password' parameters (default: 'admin').
 * It creates a new Parse User object and attempts to sign up the user.
 *
 * @returns {Parse.User}
 */
Parse.Cloud.define('signup', async ({ params }) => {
  // Setting the default credentials to admin:admin
  const { username = 'admin', password = 'admin' } = params;
  const user = new Parse.User();
  user.set({ username, password });
  return user.signUp();
});

/**
 * Cloud function for user login.
 * It accepts optional 'username' and 'password' parameters (default: 'admin').
 * It attempts to log in the user using the provided credentials.
 *
 * @returns {UserLoginResponse}
 */
Parse.Cloud.define('login', async ({ params }) => {
  const { username = 'admin', password = 'admin' } = params;
  const user = await Parse.User.logIn(username, password);
  return {
    objectId: user.id,
    sessionToken: user.getSessionToken(),
  };
});

/**
 * According to the documentation, the user object is often accessed from the request object, i.e:
 *
 * // Adding metadata and tags
 * Parse.Cloud.beforeSaveFile((request) => {
 *  const { file, user } = request;
 *  file.addMetadata('createdById', user.id);
 *  file.addTag('groupId', user.get('groupId'));
 * });
 *
 * So I assume that it's safe to do so although it seems risky.
 */

/**
 * Cloud function for user authentication.
 *
 * @returns {Promise<Parse.User>} A Promise that resolves with the authenticated user.
 * @throws {Parse.Error} Throws a Parse.Error with code `INVALID_SESSION_TOKEN` if authentication fails.
 */
Parse.Cloud.define('authenticate', async ({ user }) => {
  const isAuthenticated = !isEmpty(user);
  if (!isAuthenticated) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Unauthorized');
  return user;
});

Parse.Cloud.define('logout', async req => {
  return Parse.User.logOut();
});
