import _ from 'lodash';
const { isEmpty } = _;

/**
 * These cloud function demonstrate minimal error handling, allowing the Parse framework to handle errors.
 * If the client is also using Parse, it will receive Parse-specific error codes for easier interpretation.
 * To conceal specific error details from the client, you could either handle errors with try-catch blocks
 * inside the cloud function or implement a catch error middleware to capture and process errors based on their codes.
 *
 * Use a better way validation params (i.e. DTO validation through class-validator package maybe)
 *
 * When treating cloud functions as controllers, it's beneficial to maintain their cleanliness and conciseness.
 * One approach is to establish a service layer, organized into a dedicated service folder, with individual services
 * for each model. These services handle all queries and data manipulation tasks (services -> model logic), promoting
 * reusability, testability, and scalability.
 * Additionally, consider breaking down complex logic into smaller, modular functions. Place these utility functions
 * in a 'utils' folder, making them readily available for reuse across various resources.
 */

/**
 * Parse Server has some default properties that I can't exclude using the framework; thus, I don't include
 * them in my types, as they are taken for granted.
 */

/**
 * I would normally have a class representing the Landmark interface. I would use that class everywhere
 * as a source of truth (for better coding practices).
 *
 * @typedef {[number, number]} NumberTuple
 *
 * @typedef {Object} Landmark
 * @property {string} title - The title of the landmark.
 * @property {string} description - The description of the landmark.
 * @property {string} photo_thumb - The photo-thumb of the landmark.
 * @property {string} order - The order of the landmark.
 * @property {string} url - The url of the landmark.
 * @property {string} short_info - Some info for the landmark.
 * @property {string} photo - The photo of the landmark.
 * @property {NumberTuple} location - The location of the landmark. (probably lat & long)
 */

/**
 * Represents a landmark object partially for query usage.
 * @typedef {Object} PartialLandmark
 * @property {Landmark['title']} title
 * @property {Landmark['short_info']} short_info
 * @property {Landmark['photo_thumb']} photo_thumb
 * @property {Landmark['photo']} photo
 */

/**
 * Cloud function for creating a new landmark.
 *
 * @param {Landmark} req.params - The request parameters containing the data for the new landmark.
 * @returns {Promise<Landmark>} A Promise that resolves with the newly created landmark object.
 */
Parse.Cloud.define('createLandmark', req => {
  const Landmark = Parse.Object.extend('Landmark');
  const landmark = new Landmark();
  const incomingLandmark = req.params;
  return landmark.save(incomingLandmark);
});

/**
 * Cloud function for fetching landmarks.
 *
 * @param {object} params - The request parameters.
 * @param {string} params.objectId - The objectId of the landmark to fetch (optional).
 * @returns {Promise<Landmark|Array<LandmarkWithoutDescription>>} A Promise that resolves with either a single landmark object or an array of landmark objects.
 * @throws {Parse.Error} Throws a Parse.Error with code `MISSING_OBJECT_ID` if an invalid objectId is provided.
 * @throws {Parse.Error} Throws a Parse.Error with code `INVALID_KEY_NAME` if the request parameters are invalid.
 */
Parse.Cloud.define('fetchLandmarks', ({ params }) => {
  const Landmark = Parse.Object.extend('Landmark');
  const query = new Parse.Query(Landmark);
  const shouldFindMany = isEmpty(params);
  const shouldFindOne = Object.keys(params).length === 1 && 'objectId' in params;

  if (shouldFindOne) {
    const { objectId } = params;
    // Invalid objectId
    if (typeof objectId !== 'string') return Parse.Error.MISSING_OBJECT_ID, 'Invalid object id';
    // Find one
    return query.get(objectId);
  } else if (shouldFindMany) {
    // Find many
    query.ascending('order');
    // Default columns (createdAt, updatedAt etc) can not be excluded
    query.select('title', 'short_info', 'photo_thumb', 'photo');
    return query.find();
  } else {
    // Bad request
    throw new Parse.Error(Parse.Error.INVALID_KEY_NAME, 'Invalid params');
  }
});

/**
 * A protected Cloud function for saving a landmark.
 *
 * @param {Landmark} params - Landmark object to be saved including objectId.
 * @returns {Promise<Parse.Landmark>} A Promise that resolves with the saved landmark object.
 * @throws {Parse.Error} Throws a Parse.Error with code `INVALID_SESSION_TOKEN` if the user is not authenticated.
 */
Parse.Cloud.define('saveLandmark', async ({ params, user }) => {
  const sessionToken = user ? user.getSessionToken() : undefined;
  const Landmark = Parse.Object.extend('Landmark');
  const query = new Parse.Query(Landmark);
  const landmark = await query.get(params.objectId);
  return landmark.save(params, { sessionToken });
});
