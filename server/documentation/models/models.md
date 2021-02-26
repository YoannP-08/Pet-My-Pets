# MODELS LIST AND FIELDS

## MODEL USER
User informations 

|Field|Type|Required|Min|Max|
|:----|:-----|:-----|:-----|:-----|
|lastname|String|true|1|255|
|firstname|String|true|1|255|
|username|String|true|1|50|
|address|String|true|4|255|
|city|String|true|4|255|
|zipCode|String|true||255|
|email|String|true|4|255|
|isAdmin|Boolean|false|||

## MODEL KEEPER AD
Keeping of animals informations

|Field|Type|Required|Min|Max|
|:----|:-----|:-----|:-----|:-----|
|description|String|true|4|255|
|title|String|true|2|255|
|animalType|String|true|1|255|
|photo|Buffer|true (in front-end)|||
|user_id|user_id|true|||
|zipCode|String|true||10|
|start|String|true|||
|end|String|true|||

## MODEL DONATION AD
Animals donation

|Field|Type|Required|Min|Max|
|:----|:-----|:-----|:-----|:-----|
|description|String|true|4|255|
|title|String|true|2|255|
|animalType|String|true|1|255|
|photo|Buffer|true (in front-end)|||
|user_id|user_id|true|||
|zipCode|String|true||10|


## MODEL POST
Forum post 

|Field|Type|Required|Min|Max|
|:----|:-----|:-----|:-----|:-----|
|title|String|true|1|255|
|description|String|true|1|400|
|user_id|user_id|true|||

## MODEL COMMENT
Comment of a post in forum

|Field|Type|Required|Min|Max|
|:----|:-----|:-----|:-----|:-----|
|comment|String|true|1|255|
|post_id|post_id|true|||
|user_id|user_id|true|||

## MODEL REPORTS
Reports message for a post

|Field|Type|Required|Min|Max|
|:----|:-----|:-----|:-----|:-----|
|content|String|true|1|400|
|post_id|post_id|true|||
|user_id|user_id|true|||

## MODEL ACCESSHASH
To reset user password

|Field|Type|Required|Min|Max|
|:----|:-----|:-----|:-----|:-----|
|user_id|user_id|true|||








