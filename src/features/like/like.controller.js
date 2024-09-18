import { LikeRepository } from "./like.repository.js";

export default class LikeController {

  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userID;
      if (type != 'Product' && type != 'Category') {
        res.status(400).send("Invalid type")
      }
      if (type == 'Product') {
        this.likeRepository.likeProduct(userId, id)
      } else {
        this.likeRepository.likeCategory(userId, id)
      }
      return res.status(200).send("Like");
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, id);
      res.status(200).send(likes);
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went wrong");
    }
  }
}