import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      // const user =  await UserModel.signUp(name, email, password, type);

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res) {
    // const result = UserModel.signIn(req.body.email, req.body.password);
    // if (!result) {
    //   return res.status(400).send('Incorrect Credentials');
    // } else {
    //   // return res.send("Login is successfull.");
    //   // 1. Create token.
    //   const token = jwt.sign({ userID: result.id, email: result.email },
    //     'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz',//online keygenrator
    //     { expiresIn: '1h' }
    //   );

    //   // 2. Send token.
    //   return res.status(200).send(token);
    // }
    try {
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send('Incorrect Credentials');
      } else {
        //compare password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // 1. Create token.
          // const token = jwt.sign({ userID: result.id, email: result.email },
          const token = jwt.sign({ userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          // 2. Send token.
          return res.status(200).send(token);
        } else {
          return res.status(400).send('Incorrect Credentials');
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const userID = req.userID;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is reset")
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }


}
