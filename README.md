# Express Parse Server with Rate Limiting

This is an example Express application that adds the Parse Server module to expose Parse-compatible API routes. Additionally, it includes rate limiting for failed login attempts using the `express-rate-limit` middleware.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Routes](#api-routes)
- [Cloud Functions](#cloud-functions)

## Installation

1. Clone this repository.

2. Install the required npm packages.

3. Set up your environment variables by creating a .env file and configuring the following:

   - `DB_URI` or `MONGODB_URI`: MongoDB connection URI
   - `CLOUD_CODE_MAIN`: Path to your cloud code file (default: './cloud/main.js')
   - `APP_ID`: Your Parse application ID
   - `MASTER_KEY`: Your Parse master key
   - `SERVER_URL`: Your server URL (default: 'http://localhost:1337/parse')
   - `PARSE_MOUNT`: Mount path for Parse API (default: '/parse')
   - `SERVER_PORT`: Port number for your server (default: 1337)

4. Start the application.

## Usage

This Express application serves as a Parse Server with added rate limiting for failed login attempts. You can use it as a starting point for building your Parse-based application.

## Configuration

### Rate Limiting for Failed Login Attempts

The application includes rate limiting for failed login attempts. It limits the number of login attempts to 5 within a 15-minute window for each IP address. If a user exceeds the limit, they will receive a "Too many login attempts" message.

You can adjust the rate limiting settings in the `rateLimitOptions` object in the code.

## API Routes

- `/parse`: This route is the base URL for Parse Server API requests. You can access various Parse features through this route.

- `/parse/functions/login`: Rate limiting is applied to this route for failed login attempts. Successful logins are not rate-limited.

- `/test`: A test page is available at this path of your server URL (`/test`). This is for testing purposes and should be removed before launching your app.

## Cloud Functions

The application includes several cloud functions that interact with Parse objects. These functions can be used for various tasks, such as user signup, login, authentication, and managing landmarks.

- `signup`: A cloud function for user signup. It accepts optional 'username' and 'password' parameters and creates a new Parse User object.

- `login`: A cloud function for user login. It accepts optional 'username' and 'password' parameters and attempts to log in the user.

- `authenticate`: A cloud function for user authentication. It verifies if the user is authenticated and throws an error if not.

- `logout`: A cloud function for user logout.

- `createLandmark`: A cloud function for creating a new landmark object.

- `fetchLandmarks`: A cloud function for fetching landmarks. It can fetch a single landmark by ID or multiple landmarks.

- `saveLandmark`: A protected cloud function for saving a landmark. It requires user authentication and can be used to update landmark data.

Feel free to modify and expand these cloud functions to suit your application's needs.
