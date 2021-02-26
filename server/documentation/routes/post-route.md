# Posts endpoints
File: `/routes/post.js`
For every authenticated routes, the headers have to include :
```
x-auth-token: {token of the user}
```
Please refer to the file `models.md` to see the body requested for the *POST* and *PUT* endpoints

## GET all posts
|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/posts`| |GET|Array|Public|

Return an array of objects with fields : 
* _id
* title
* content
* user_id
* createdAt
* updatedAt
* user object with fields :
    * isAdmin
    * firstname
    * lastname
    * username
    * createdAt
    * updatedAt
* comment array with objects with fields :
    * _id
    * comment
    * user_id 
    * post_id
    * createdAt
    * updatedAT

## GET one post

|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/posts/:id`|post_id|GET|Object|Public|

Return an object with fields :
* _id
* title
* content
* user_id
* createdAt
* updatedAt
* user object with fields :
    * isAdmin
    * firstname
    * lastname
    * username
    * createdAt
    * updatedAt
* comment array with objects with fields :
    * _id
    * comment
    * user_id
    * post_id
    * createdAt
    * updatedAT

## POST a post
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/posts/`| |POST|Object|Private|Authenticated|

Return a "New post successfully created" message and a post object with fields :
* _id
* title
* content
* user_id
* createdAt
* updatedAt

## Modify a post
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/posts/:id`post_id|PATCH|Object|Private|Authenticated|

Return a "Post edited" message and a post object with fields :
* _id
* title
* content
* user_id
* createdAt
* updatedAt

## DELETE a post
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/posts/:id`|post_id|DELETE|Object|Private|Owner or Admin|

Return a "Post was successfully deleted" message
