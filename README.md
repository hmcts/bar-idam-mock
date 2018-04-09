# bar-idam-mock

This is a small application to mock idam's /details endpoint.
If the GET request has an Authorization header which contains the user email then it tries to give back a user deatil object
in the same format as idam would give it.
```
{
    "defaultService" : "BAR",
    "email" : "post.clerk@hmcts.net",
    "forename" : "Chris",
    "id" : 365750,
    "roles" : ["bar-post-clerk"],
    "surname" : "Spencer"
}
```
The users can be found in /resources/users.json and it should be in sync with the test users in bar-web.