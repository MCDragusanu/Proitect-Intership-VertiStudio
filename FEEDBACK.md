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

## Future Improvements
    -the handling of tokens on client side is a little bit rushed :) to say the least. I would definetly refactor everything ,use axios to autaomatically wrap the requests with the token instead of manually doing that everywhere.


**What was the most Challengin part?**
 -The most challenging bug, took me 3 hours (from 1 at night till 4 in the morning)to find it out. I used simple JOIN instead of a LEFT join on the query for the transaction. Nothing was working and it scared me quite a lot. 
 - The most challenging part i would say was the amount of features it needed, i had to spend a lot of time inspecting the queries and tables to make sure everything worked fine. The UI required a lot of polishing in terms of proper error handling and logic. The majority of time i spent making sure the UI reacts to events

**Which aspects i enjoyed the most**
- The best part was at then end when i wrapped everything up, the ui looked so nice (for me), seeing everything working as expected and without unexpected surprises

- I really enjoyed designing the structure of the application, i like to build stuff from scracth. i really put the time in writting the backend, to abstract the database implementation, the logic for registartion and the field validation and also having quite considerable freedom was great

-I also learned quite a few things about working with React and bun, now i feel more confident in my coding skills with react, this project was the most dificult and complex i ever did with this framework, so i was quite happy at the end that i was able to put everything together

-Also I had to use Claude with designing the pages, i don't master that well CSS and tailwind and I was very impressed how well Claude designs webpages. I admit that i used these tools a lot, 95% of the time i used them to handle the tailwind classes but a lot of fine tuning and refinement was necessary to make sure they looked nice

**Suggestions of improvements**

Maybe having the task of creating the whole transaction / crypto coin form scratch, to have to think about the way it works, how does the computation works, maybe like creating a block chain / smart contracts with certain design constraints/ requirements. I never had to work with such things and i think this way would be a great oportunity to learn.


