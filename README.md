# Project Name

![Team Photo](Insert a Team Photo URL here)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

Hosted at [munch-api.onrender.com](https://munch-api.onrender.com)

TODO: short project description, some sample screenshots or mockups

## Architecture

TODO:  descriptions of code organization and tools and libraries used

## Setup

TODO: how to get the project dev environment up and running, npm install etc

## Deployment

TODO: how to deploy the project

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
Optional query params - user: (userId), following: (true), search_term: (search_term)
If user id is passed in paramater and following is true, then posts of the user's home page are returned (posts of users that the user is following). If user id is passed in without following, then the user's own posts are returned. search_term is used to search for posts. It cannot be combined with the other params.

getPost: GET http://munch-api.onrender.com/api/posts/:id

deletePost: DELETE http://munch-api.onrender.com/api/posts/:id

updatePost: PUT http://munch-api.onrender.com/api/posts/:id
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
