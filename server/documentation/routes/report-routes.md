# Reports endpoints
File: `/routes/reports.js`
For every authenticated routes, the headers have to include :
```
x-auth-token: {token of the user}
```
Please refer to the file `models.md` to see the body requested for the *POST* and *PUT* endpoints

## GET all reports
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:---|:-----|:-----|:---|
|`/api/reports`| |GET|Array|Private|Admin|

Return an array of objects with fields : 
* _id
* user_id
* post_id
* content
* createdAt
* updatedAt
* user object with fields : 
    * isAdmin
    * lastname
    * firstname
    * username
    * createdAt
    * updatedAt
* post object with fields : 
    * _id
    * title
    * content 
    * user_id
    * createdAt
    * updatedAt
## GET one report
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:---|:-----|:-----|:---|
|`/api/reports/:id`|report_id|GET|Object|Private|Admin|

Return an object with fields :
* _id
* user_id
* post_id
* content
* createdAt
* updatedAt
* user object with fields :
    * isAdmin
    * lastname
    * firstname
    * username
    * createdAt
    * updatedAt
* post object with fields :
    * _id
    * title
    * content
    * user_id
    * createdAt
    * updatedAt

## POST a report
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/reports/`| |POST|Object|Private|Authenticated|

Return a "New report successfully created" message and a report object with fields : 
* _id
* user_id
* post_id 
* content
* createdAt
* updatedAt

## DELETE a report
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/reports/:id`|report_id|DELETE|Object|Private|Admin|

Return a "Report was successfully deleted" message
