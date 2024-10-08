# 🗣 Linguistics Games Backend

Linguistics Games, a.k.a. Speak Up, is an innovative gameified mobile app that invites users to play via voice-controlled mechanisms. They can choose a stance to respond to a variety of questions, as well as upvote and downvote other users' posts. With the user's consent, these voice samples are anonymized aggregated and together to form large-scale datasets, with whole new magnitudes of `N > 10,000`. The aim of this app is to empower every researcher with larger and more comprehensive datasets for richer hypotheses, and in particular cutting-edge sociolinguistic analysis. Ultimately, the impact of this app can stretch far beyond linguistics. Other fields like economics, sociology, anthropology all experience the same challenge of small sample sizes. This technique can inspire similar approaches in these other fields, and usher in a new era of computational research.

## Designs

[See project Figma](https://www.figma.com/file/rA2O0gfeSZ6mFjTjsPulWP/Linguistics-Games-22F)

## Architecture
### Tech Stack 🥞
The app is built using Express, MongoDB, and Node.

[Frontend Repo](https://github.com/dali-lab/linguistics-games-frontend)
### File Structure

```
├──[Top Level]/                  # root directory
|  └──[.env]                     # contains AUTH_SECRET, API_KEY, MONGODB_URI, AWS credentials
|  └──[src]/                     # source directory
|     └──[common]/               # hosts modules used in other packages
|     └──[controllers]/          # hosts question, answer, user, and info controllers
|     └──[models]/               # hosts question, answer, and user models
|     └──[services]/             # hosts passport and s3 services
|     └──[router.js]             # set up routes, calling controllers from `controllers` directory
|     └──[server.js]             # initialize app and start server
```

For more detailed documentation on our file structure and specific functions in the code, feel free to check the project files themselves.

## Setup

1. Create a `.env` file in the root directory
2. In the `.env` file, set `AUTH_SECRET` to any string, 
3. Set `MONGODB_URI` to `mongodb://localhost:27017/<project-name>` for local dev OR to the deployed mongodb uri link,
4. And add the `API_KEY`, which can also be any string (though it needs to match the value assigned on the frontend).
5. Add AWS credentials corresponding to the fields in the `.env.example` file.

### Local Mongo Installation 
To run MongoDB locally on a Mac (after installing [Homebrew](https://brew.sh/)):
1. `brew tap mongodb/brew && brew install mongodb-community` to install mongo.
2. `brew services start mongodb-community` to start the background process.
3. `brew services stop mongodb-community` to terminate the background process.

### Starting the local server 
1. After cloning the repo, `cd` into the repo directory
2. `npm install`
3. `npm run dev` (`npm run start`)

This will start a local server connecting to the database at localhost:9090.

### Additional notes

You may need to install or update `node` in order to install all the packages. This can be easily done [here](https://nodejs.org/en/)

## Data Models

### Question
```
- title*: String
- description: String
- photoUrl: String
- options: [String]
- areas: [String]
```
### Answer
```
- question*: QuestionId
- recordingURL*: link to S3 URL hosting recording
- user*: UserId
- upvotes: [UserId]
- downvotes: [UserId]
- stance: String (one of the question's `options`)
```

### User
```
- email*: String
- username*: String
- bio: String
- password*: String (hashed)
- gender: String, enum ['male', 'female', 'nonbinary', 'other']
- birthday: Date
- interests: [String] - maps to question categories
- researchConsent: Boolean (defaults to false)
- score: Number (to be used in leaderboard)
- demographicAttributes: Map of Strings - e.g. {'location':'New Hampshire', 'languagesSpoken':5}
```

### Suggestion
```
- prompt*: String
- stances*: [{color: String, stance: String}]
- dateSubmitted*: Date
- icon*: String
- status: String
- question: QuestionId
- user*: UserId
```

## Deployment 🚀

Deployed on Render, [https://linguistics-games.onrender.com/](https://linguistics-games.onrender.com/)

See Notion Handoff Document for credentials. The Render application is currently configured to auto-build a new version whenever commits are pushed to the `main` branch of this repository.

## Authors
- Isabella Hochschild '25, Dev Mentor
- Tyler Vergho '23, Dev
- Edited by Gwen Wattenmaker '23, Dev

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)