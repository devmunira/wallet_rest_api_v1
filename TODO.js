// TODO: Authorization
// TODO: Data 
// This is the Authentication Middleware process


/***
* 2. if have access token have, then check (is it valid) (expiredTime check) if yes then allow to proccess request
* 3. if can't find access token then return 401 response
*/



const authenticate = async (req,res,next) => {

    const headers = req.headers['authorization'];


}




// This is the next route ('/refresh') where a user triger when middleware
// send 401 request this is call only from client not on server


/***
* 1. decode access token for user info
* 2. get user refresh token from db
* 3. check refresh token is valid (expiredTime check)
* 4. if yes then generate new access token and refresh token and delete or revoked old refresh token
* 5. send new access token as a response
* 6. if refresh token also invalid then send 401 response , in this case client must be
* login again to generate new acess and refesh token
*/
