import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ApplicationError } from "../../error-Handler/applicationError.js";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model('Like', likeSchema)

export class LikeRepository {

  async likeProduct(userId, productId) {
    try {
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(productId),
        types: 'Product'
      });
      await newLike.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong!!", 500);
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(produccategoryIdtId),
        types: 'Category'
      });
      await newLike.save();
    } catch (err) {
      throw new ApplicationError("Something went wrong!!", 500);
    }
  }

  async getLikes(type, id) {
    return await LikeModel.find({
      likeable: new ObjectId(id),
      types: type
    }).populate('user').populate({ path: 'likeable', model: type })
  }
}