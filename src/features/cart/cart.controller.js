import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;
      // CartModel.add(productID, userID, quantity);
      await this.cartRepository.add(productID, userID, quantity);
      res.status(201).send("Cart is updated");
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      // const items = CartModel.get(userID);
      const items = await this.cartRepository.get(userID);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async delete(req, res) {
    const userID = req.userID;
    const cartItemID = req.params.id;
    const isDeleted = await this.cartRepository.delete(cartItemID, userID);
    if (!isDeleted) {
      return res.status(404).send("Item is not found");
    }
    return res.status(200).send('Cart item is removed');

  }
}