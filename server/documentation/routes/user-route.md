# Users endpoints
File: `/routes/user.js`
For every authenticated routes, the headers have to include :
```
x-auth-token: {token of the user}
```
Please refer to the file `models.md` to see the body requested for the *POST* and *PUT* endpoints

## GET all users
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:---|:-----|:-----|:---|
|`/api/users`| |GET|Array|Private|Admin|

Return an array of users, with fields :
* _id
* isAdmin
* lastname
* firstname
* username
* email
* address
* city
* zipCode
* createdAt
* updatedAt


## GET one user

|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:---|:-----|:-----|:---|
|`/api/users/:id`|user_id|GET|Object|Private|Owner or Admin|

Return a user object with fields :
* _id
* isAdmin
* lastname
* firstname
* username
* email
* address
* city
* zipCode
* createdAt
* updatedAt
* keepers (array, aggregation of his keeper ads)
* donationads (array, aggregation of his donation ads)

## GET user info when connected 

|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:---|:-----|:-----|:---|
|`/api/users/auth/info`|user_id|GET|Object|Private|Auth|

Return a user object with fields :
* _id
* isAdmin
* lastname
* firstname
* username
* email
* address
* city
* zipCode
* createdAt
* updatedAt

## POST a user
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/users/signup`| |POST|Object|Private|Authenticated|

Return an object with a token field, and a user object with fields :
* _id
* isAdmin
* lastname
* firstname
* username
* email
* address
* city
* zipCode

## LOGIN user
|Route|Params|Request|Return|Access|
|:----|:-----|:-----|:---|:-----|
|`/api/users/signin`|  |POST|Object|Public|

Return an object with a token field, and a user object with fields :
* _id
* isAdmin
* lastname
* firstname
* username
* email
* address
* city
* zipCode
    

## MODIFY a user
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/users/:id`|user_id|PATCH|Object|Private|Owner or Admin|
Return an object with a 'user edited' message, and a user object with fields :
* _id
* isAdmin
* lastname 
* firstname
* username
* email
* address
* city
* zipCode
* createdAt
* updatedAt


## DELETE a user
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/users/:id`|user_id|DELETE|Object|Private|Owner or Admin|

Return a 'User was successfully deleted' message.

## Send a hash by mail to user to reset password
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/users/reset-password`|NO|POST|email|Object|Public|

Send a hash by mail to the user email (with mail/mailer.js)

## Reset a password
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/users/reset-password/confirmation`|hash|PATCH|nothing|Public|

If hash is valid then user password is changed.

