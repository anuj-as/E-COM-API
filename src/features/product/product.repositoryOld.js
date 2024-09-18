import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-Handler/applicationError.js";

class ProductRepository {

  constructor() {
    this.collection = "products"
  }

  async add(newProduct) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with databse", 500);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find().toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong!!", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new ApplicationError("Something went wrong!!", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) }
      }
      if (maxPrice) {
        filterExpression.price = { ...filterExpression.price, $lte: parseFloat(maxPrice) }
      }
      if (category) {
        filterExpression.category = category;
      }
      return await collection.find(filterExpression).project({ name: 1, price: 1, _id: 0, ratings: { $slice: 1 } }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database!!", 500);
    }
  }

  async rate(userID, productID, rating) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      // const product = await collection.findOne({ _id: new ObjectId(productID) });
      // const userRating = product?.ratings?.find(r => r.userID == userID);
      // if (userRating) {
      //   await collection.updateOne(
      //     { _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID) },
      //     {
      //       $set: {
      //         "ratings.$.rating": rating
      //       }
      //     }
      //   )
      // } else {
      //   await collection.updateOne(
      //     { _id: new ObjectId(productID) },
      //     { $push: { ratings: { userID: new ObjectId(userID), rating } } }
      //   )
      // }

      //remove existing entry //atomic operation
      await collection.updateOne(
        { _id: new ObjectId(productID) },
        { $pull: { ratings: { userID: new ObjectId(userID) } } }
      )
      await collection.updateOne(
        { _id: new ObjectId(productID) },
        { $push: { ratings: { userID: new ObjectId(userID), rating } } }
      )
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database!!", 500);
    }
  }
  
  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db.collection(this.collection).aggregate([
        {
          //stage1 get average price per category
          $group: {
            _id: "$category",
            averagePrice: { $avg: "$price" }
          }
        }
      ]).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database!!", 500);
    }
  }
}
export default ProductRepository;