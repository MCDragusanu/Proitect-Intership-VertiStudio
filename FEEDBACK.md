**Database Optimisations**
   
   ## Introduction
    For the database i tried to keep it as simple as possible, with simple cahcing and no advanced systems, although i tried some paralellization for the generating of new coins, each coin would be generated at the same time, but the performance gains weren't that impressing.

## Possible future improvements
    As a general improvement i would certainlly attemt to do a batch generation / in chuncks of the computation of bitslows

## Pagination
    - Every request related to fetching transactions or coins is paginated to make sure it won't take too much time to process.
    - Added a safeLimit to make sure the amount of data is capped and require to much processing power.

## BitSlow Caching
    - I created a new table in the database which maps every computed bitslow value to the coin via the coinId or the individual bits
    - Whenever a bitslow is required it is looked up in the table. If it exists it is retrieved, if not computed and inserted into the table

## User Information
    - The user information is divided between 2 tables `user_profiles` and `user_credentials`. The first table contains public information about the user (name , country , adress) while the second one contain security related info like a hashed password , email and refresh token that is used for auth and authorization

**Authentification & Registration & Authorization**

## Use of JWT Tokens
    - I decided to use a JWT token approach, using a temporary and short living access token that would be stored on the client in session storage , while the refresh token would be only use to valdiate and refresh old tokens
## Authorization
    - Requests that are not linked to any particular user,
    like querring coins , transactions do not require any authorization.
    - All the request that are linked to the user , obtain private info of the user, or performing actions like logging out, bjuying generating coins, do require an access token to be validated.
    - The validation consists of checking if the client is accessing it's own information and not another user's data. It checks if the access token is valid, if it is not expired and the userUid is matched by the refreshToken and url parameter.
## Error handling
    - the flows for registering , loggingIn , buying , generating coins, etc have robust error handling, having a callback that renders a toast with the appropriate messsage (if the user is not logged in, if the session is expired etc)
     
