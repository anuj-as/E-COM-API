// import bAuth from 'express-basic-auth';
import UserModel from '../features/user/user.model.js';

const basicAuthorizer = (req, res, next) => {
  //check if authorization header is empty 
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send("No authorization details found");
  }
  console.log(authHeader);


  //extract credentials [Basic dfasdffdafdasfdffad]
  const base64Credentials = authHeader.replace('Basic ', '');
  console.log(base64Credentials);

  //decode credentials
  const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf8');
  console.log(decodedCreds); //[username:password]
  const creds = decodedCreds.split(":");

  const user = UserModel.getAll().find((u) => u.email == creds[0] && u.password == creds[1]);
  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrect credentials")
  }
};
export default basicAuthorizer;


// const basicAuthorizer = (username, password) => {
//   // 1. Get users
//   const users = UserModel.getAll();
//   // 2. Compare email
//   const user = users.find((u) => bAuth.safeCompare(username, u.email));
//   if (user) {
//     // 3. Compare password and return
//     return bAuth.safeCompare(password, user.password);
//   } else {
//     // 4. Return error message
//     return false;
//   }
// };

// const authorizer = bAuth({
//   authorizer: basicAuthorizer,
//   challenge: true,
// });

// export default authorizer;
