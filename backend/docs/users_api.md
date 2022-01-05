# Users Api

## Signin
**URL** : `/users/signin`   
**METHOD** : `POST`   
**PARAMS**   
```json
"username": ""
"password": ""
```
#### Success Response   
**CODE** : `200`   
**RESPONSE BODY**   
```json
{
    "message": "Success",
    "tokens": {
        "refresh_token": "token",
        "auth_token": "token"
    },
    "data": {
        "full_name": "$ taha dostifam",
        "username": "tahadostifam",
        "bio": null,
        "last_seen": null
    }
}

```
#### User Not Found
**CODE** : `401`   
**BODY**   
```json
{
    "message": "Username or password is incorrect"
}
```

<!-- -------------------------------- -->

## Signup
**URL** : `/users/signup`   
**METHOD** : `POST`   
**PARAMS**   
```json
"full_name": ""
"username": ""
"password": ""
```
#### Success Response   
**CODE** : `201`   
**RESPONSE BODY**   
```json
{
    "message": "User created successfully",
    "tokens": {
        "refresh_token": "token",
        "auth_token": "token"
    }
}
```