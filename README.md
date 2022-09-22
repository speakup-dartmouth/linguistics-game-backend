<<<<<<< HEAD
# 🗣 Linguistics Games Backend

[Project Description]

## Designs
[Screenshot description]

[Link to the project Figma](https://apple.com)

[2-4 screenshots from the app]

## Architecture
### Tech Stack 🥞
The app is built using React-Native

[Description of any notable added services]

[Link to other repos that comprise the project (optional)](https://github.com/)

#### Packages 📦
* [List of notable packages with links]

### Style
[Describe notable code style conventions]

We are using [CS52's React-Native ESLint Configuration](https://gist.github.com/timofei7/c8df5cc69f44127afb48f5d1dffb6c84)

### Setup

1. Add the file `.env` in the root directory
2. Set `AUTH_SECRET` to any string
3. Set `MONGODB_URI` to `mongodb://localhost:27017/<project-name>`

### Additional notes

You may need to update `node` in order to install all the packages. This can be easily done [here](https://nodejs.org/en/)

### Data Models
[Brief escription of typical data models.]

[Detailed description should be moved to the repo's Wiki page]

### File Structure

```
├──[Top Level]/                  # root directory
|  └──[File]                     # brief description of file
|  └──[Folder1]/                 # brief description of folder 
|  └──[Folder2]/                 # brief description of folder
[etc...]
```

For more detailed documentation on our file structure and specific functions in the code, feel free to check the project files themselves.

## Deployment 🚀
[Where is the app deployed? i.e. Expo, Surge, TestFlight etc.]

[What are the steps to re-deploy the project with any new changes?]

[How does one get access to the deployed project?]

## Authors
* name 'year, role

## Acknowledgments 🤝
We would like to thank ... for their help and dedication to this project.

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)
=======
# Project Name

![Team Photo](Insert a Team Photo URL here)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

Hosted at [munch-api.onrender.com](https://munch-api.onrender.com)

## Architecture

Express + Mongo backend

## Setup

Add .env file with
AUTH_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, API_KEY
npm install
npm start

## Deployment

Deployed on Render with Mongo


## API Endpoints
signin: POST http://munch-api.onrender.com/api/signin
Body: {"email": email,"password": password}

signup: POST http://munch-api.onrender.com/api/signup
Body: {"email": email,"password": password}

getUsers: GET http://munch-api.onrender.com/api/users
Optional query param - search_term: (search_term)
Returns searched for users, searches through usernames

getUser: GET http://munch-api.onrender.com/api/users/:id

updateUser: PUT http://munch-api.onrender.com/api/users/:id
Body: {fields}

deleteUser: DELETE http://munch-api.onrender.com/api/users/:id

createPost: POST http://munch-api.onrender.com/api/posts
Body: {fields}

getPosts: GET http://munch-api.onrender.com/api/posts
Optional query params - user: (userId), search_term: (search_term), home: (all, unviewed) discovery: (hot, recommended)
If user id is passed with home query, then posts of the user's home page are returned (posts of users that the user is following). If user id is passed in without home, then the user's own posts are returned. If user id is passed in with discovery, if discovery equals hot, then the most like posts are returned. If discovery equals recommended, the posts that are recommended for the user are returned. If user id is passed in with home, then if home equals all, then all posts are returned from users that the user follows. If home equals unviewed, then only unviewed posts are returned. search_term is used to search for posts. It cannot be combined with the other params.

getPost: GET http://munch-api.onrender.com/api/posts/:id

deletePost: DELETE http://munch-api.onrender.com/api/posts/:id

updatePost: PUT http://munch-api.onrender.com/api/posts/:id
Optional query param: update_type
As of now, update_type can either be dislike or like. Must use this if user likes a post.
Body: {fields}

getCollections: GET http://munch-api.onrender.com/api/posts/:id/collections
Required query param - collection_type
To sort savedPosts by date, set collection_type = date, to sort savedPosts by difficulty, set collection_type = difficulty, to search through savedPosts, set collection_type = search. To search, must also include search_term query.

## Authors

- Isabella Hochschild '25
- Gregory Macharia '22
- Henry Kim '23
- Samuel Wang '23
- Rehoboth Okorie '23
- Jordan Jones '24

## Acknowledgments
>>>>>>> dde66d1ed6d51b5323e18d8715ef40e28e012b1c
