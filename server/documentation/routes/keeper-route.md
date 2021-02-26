# Keeper Ads endpoints
File: `/routes/keeperAd.js`
For every authenticated routes, the headers have to include :
```
x-auth-token: {token of the user}
```
Please refer to the file `models.md` to see the body requested for the *POST* and *PUT* endpoints

## GET all keeper ads
|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/keeperads`| |GET|Array|Public|

Return "Success" as message and a data array of objects with fields : 
* _id
* title
* user_id
* description
* zipCode
* photo
* animalType
* start
* end
* createdAt
* updatedAt


## GET one keeper ad

|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/keeperads/:id`|keeper_id|GET|Object|Public|

Return "Success" as message and a data object with fields :
* _id
* title
* user_id
* description
* zipCode
* photo
* animalType
* start
* end
* createdAt
* updatedAt


## POST a keeper ad
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/keeperads/`| |POST|Object|Private|Authenticated|

Return "New Keeper Ad Created" as message and a data object containing :
* _id
* title
* user_id
* description
* zipCode
* photo
* end
* start
* animalType
* createdAt
* updatedAt

## MODIFY a keeper ad
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/keeperads/:id`|keeper_id|PUT|Object|Private|Owner or Admin|

Return "Keeper Ad modified" as message and a data object containing :
* _id
* title
* user_id
* description
* zipCode
* photo
* end
* start
* animalType
* createdAt
* updatedAt

## DELETE a keeper ad
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/keeperads/:id`|keeper_id|DELETE|Object|Private|Owner or Admin|

Return "Donation Ads Deleted" as message
