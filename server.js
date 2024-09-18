import "./env.js";
import express from 'express';
import swagger from 'swagger-ui-express';

import cors from 'cors';
import productRouter from './src/features/product/product.routes.js';
// import bodyParser from 'body-parser';
import userRouter from './src/features/user/user.routes.js';
import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cart/cart.routes.js';
// import apiDocs from './swagger.json' assert {type: 'json'};
import apiDocs from './swagger3.json' assert {type: 'json'};
import loggerMiddlware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-Handler/applicationError.js';
import { connectToMongoDB } from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.routes.js";

const server = express();

// CORS policy configuration
// var corsOptions = {
//   origin: "http://localhost:5500"
// }
// server.use(cors(corsOptions));

// server.use((req, res, next)=>{
//   res.header('Access-Control-Allow-Origin','http://localhost:5500');
//   res.header('Access-Control-Allow-Headers','*');
//   res.header('Access-Control-Allow-Methods','*');
//   // return ok for preflight request.
//   if(req.method=="OPTIONS"){
//     return res.sendStatus(200);
//   }
//   next();
// })



// server.use(bodyParser.json);

server.use(express.json());
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use(loggerMiddlware);

// server.use("/api/products", basicAuthorizer, productRouter);
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/users", userRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/likes", jwtAuth, likeRouter);


//default req handler
server.get('/', (req, res) => {
  res.send("Welcome to E-commerce APIS");
})

//Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  res.status(500).send("Oops! Something went wrong... Please try again later!");//server error 500
})

//Middleware to handle all 404 req
server.use((req, res) => {
  res.status(404).send("API not found");
})

server.listen(8080, () => {
  console.log("Server is running at 8080")
  // connectToMongoDB();
  connectUsingMongoose();
});