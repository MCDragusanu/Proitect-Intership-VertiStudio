

//Base class for all JWT-related errors
class JWTError extends Error{
    constructor(message : string){
        super(message)
    }
}

//Exception thrown when token is expired
class JWTExpired extends JWTError{
    constructor(message : string){
        super(message)
    }
}

//Exception Thrown when the token is corrupted
class JWTInvalid extends JWTError{
    constructor(message : string){
        super(message)
    }
}

//Interface to standardise the token payload
interface TokenPayLoad{
    userUid : string,
    userRole : string,
}

//interface designated to handle all the token based actions
abstract class JWTService{

    //Method to generate a new Access token
    abstract issueAccessToken(payload  : TokenPayLoad) : Promise<String>

    //Method to generate new Refresh Token
    abstract issueRefreshToken(payload : TokenPayLoad) : Promise<String>

    //Returns the active duration in seconds of a Access Token
    abstract getAccessTokenDurationInSeconds() : Number

    //Returns the active Duration in seconds of a Refresh Token
    abstract getRefreshTokenDurationInSeconds() : Number

    //Processes the token and returns the embedded data
    //Throws JWTInvalid if the token is corrupted
    //Throws JWTExpired if the token is expired
    abstract extractPayloadFromAccessToken(token : string) : Promise<TokenPayLoad | JWTError>


    //Processes the token and returns the embedded data
    //Throws JWTInvalid if the token is corrupted
    //Throws JWTExpired if the token is expired
    abstract extractPayloadFromRefreshToken(token : string) : Promise<TokenPayLoad | JWTError>
}

export {JWTError , JWTExpired , JWTInvalid , JWTService , TokenPayLoad}