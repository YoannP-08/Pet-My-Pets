# Donation Ads endpoints
File: `/routes/donationAd.js`
For every authenticated routes, the headers have to include :
```
x-auth-token: {token of the user}
```
Please refer to the file `models.md` to see the body requested for the *POST* and *PUT* endpoints

## GET all donations ads
|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/donationads`| |GET|Array|Public|

Return an array of objects with attributes :
* _id
* title
* user_id
* description
* zipCode
* photo
* animalType
* createdAt
* updatedAt



## GET one donation ad

|Route|Params|Request|Return|Access|
|:----|:-----|:---|:-----|:-----|
|`/api/donationads/:id`|donation_id|GET|Object|Public|

Return a "success" message and a data object with attributes :
* _id
* title
* user_id
* description
* zipCode
* photo
* animalType
* createdAt
* updatedAt
## POST a donation ad
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/donationads/`| |POST|Object|Private|Authenticated|

Return "New Donation Ad Created" as message and a data object containing : 
* _id
* title
* user_id
* description
* zipCode
* photo
* animalType    
* createdAt
* updatedAt

## MODIFY a donation ad
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/donationads/:id`|donation_id|PUT|Object|Private|Owner or Admin|

Return "Donation ads modified" as message and a data object containing :
* _id
* title
* user_id
* description
* zipCode
* photo
* animalType
* createdAt
* updatedAt

## DELETE a donation ad
|Route|Params|Request|Return|Access|Middleware|
|:----|:-----|:-----|:---|:-----|:---|
|`/api/donationads/:id`|donation_id|DELETE|Object|Private|Owner or Admin|

Return "Donation Ads Deleted" as message
