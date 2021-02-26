# Comment endpoints
File: `/routes/comment.js`
For every authenticated routes, the headers have to include : 
```
x-auth-token: {token of the user}
```

Please refer to the file `models.md` to see the body requested for the *POST* and *PUT* endpoints

## GET all comments
|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/comments`| |GET|Array|Public|

Returns a "success" message and a data field containing an array of comment objects with those attributes : 
* _id
* comment
* user_id
* post_id
* createdAt
* updatedAt


## GET one comment 

|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/comments/:id`|comment_id|GET|Object|Public|

Returns a success : true and a data field containing a comment objects with those attributes :
* _id
* comment
* user_id
* post_id
* createdAt
* updatedAt

## POST a comment 
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/comments/`| |POST|Object|Private|Authenticated|


Returns a "Comment created successfully." message and a data field containing a comment objects with those attributes :
* _id
* comment
* user_id
* post_id
* createdAt
* updatedAt

## MODIFY a comment 
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/comments/:id`|comment_id|PUT|Object|Private|Owner or Admin|

Returns a success : true and a data field containing a comment objects with those attributes :
* _id
* comment
* user_id
* post_id
* createdAt
* updatedAt

## DELETE a comment
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/comments/:id`|comment_id|DELETE|Object|Private|Owner or Admin|

Return success: true, and a "The comment was deleted successfully!" message.
