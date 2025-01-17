// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import CartController from './cart.controller.js';

// 2. Initialize Express router.
const cartRouter = express.Router();

const cartController = new CartController();

// cartRouter.delete('/:id', cartController.delete);
// cartRouter.post('/', cartController.add);
// cartRouter.get('/', cartController.get);

cartRouter.delete('/:id', (req, res) => {
  cartController.delete(req, res);
});
cartRouter.post('/', (req, res) => {
  cartController.add(req, res);
});
cartRouter.get('/', (req, res) => {
  cartController.get(req, res);
});


export default cartRouter;